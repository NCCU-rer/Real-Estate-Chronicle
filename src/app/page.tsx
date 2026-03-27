"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import InfoTooltip from "@/components/InfoTooltip";
import ExportModal from "@/components/ExportModal";
import ReportCanvas from "@/components/ReportCanvas";
import ExportLoadingOverlay from "@/components/ExportLoadingOverlay";
import { useDashboardExport } from "@/hooks/useDashboardExport";
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName, NATIONAL_CONFIG } from "@/config/cityColors";
import { decodeDashboardUrl, encodeDashboardUrl } from "@/utils/urlHelper";

export default function Home() {
  // === 1. 狀態管理 (State) ===
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("nation");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  
  // 匯出功能
  const reportRef = useRef<HTMLDivElement>(null);
  const { 
    isExportOpen, 
    isGenerating, 
    exportProgress,
    exportConfig,
    openExportModal, 
    closeExportModal, 
    handleGenerate 
  } = useDashboardExport(reportRef);

  // === 2. 初始化與 URL 同步 (Initialization) ===
  useEffect(() => {
    const params = decodeDashboardUrl();
    if (params.start) setStartPeriod(params.start);
    if (params.end) setEndPeriod(params.end);
    if (params.main) setMainCity(params.main);
    if (params.compare) setCompareCities(params.compare);
  }, []);

  // 當使用者點擊「確定更新資料」時，在 DashboardSidebar 呼叫全域更新時也會觸發此處邏輯
  const updateUrl = (start: string, end: string, main: string, compare: string[]) => {
    const newUrl = encodeDashboardUrl({ start, end, main, compare });
    window.history.replaceState({}, '', newUrl);
  };

  // === 3. 業務邏輯 (Handlers) ===
  const handleMainCityChange = (cityId: string) => {
    setMainCity(cityId);
    setCompareCities(prev => prev.filter(c => c !== cityId));
  };
  
  const toggleCompare = (cityId: string) => {
    if (cityId === mainCity) return;
    setCompareCities(prev => {
      const next = prev.includes(cityId) ? prev.filter(id => id !== cityId) : [...prev, cityId].slice(0, 3);
      return next;
    });
  };

  const handleCancelCompare = () => setCompareCities([]);

  const handleShare = () => {
    try {
      const shareUrl = encodeDashboardUrl({ 
        start: startPeriod || "2013_Q1", 
        end: endPeriod || "2025_Q4", 
        main: mainCity || "nation", 
        compare: compareCities || [] 
      });
      
      if (!shareUrl) return;

      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("分享連結已複製到剪貼簿！");
      }).catch(err => {
        console.error("複製失敗", err);
        alert("複製連結失敗，請手動複製網址列");
      });
    } catch (err) {
      console.error("分享功能錯誤:", err);
    }
  };

  const getDisplayName = (id: string) => {
    if (id === "nation") return "全國";
    return getCityName(id);
  };
  
  const getDisplayColor = (id: string) => {
    if (id === "nation") return NATIONAL_CONFIG.color;
    const city = CITIES_CONFIG.find(c => c.id === id);
    return city ? city.color : "#333333";
  };

  // === 4. 資料計算 (Computation) ===
  const allEvents = useMemo(() => processEvents(Object.values(rawData).flat()), []);
  const chartCities = useMemo(() => [mainCity, ...compareCities], [mainCity, compareCities]);
  
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    const nationalEvents = allEvents.filter(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      return event.isNational && chartCities.includes('nation') && isTimeMatch;
    });

    const cityEvents = allEvents.filter(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      return !event.isNational && chartCities.includes(event.city) && isTimeMatch;
    });

    const eventSet = new Set([...nationalEvents, ...cityEvents]);
    return Array.from(eventSet);

  }, [chartCities, startPeriod, endPeriod, allEvents]);

  // === 5. 畫面渲染 (Render) ===
  return (
    <main className="h-full w-full flex bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. 側邊欄組件 */}
      <DashboardSidebar 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        startPeriod={startPeriod}
        setStartPeriod={(v) => { setStartPeriod(v); updateUrl(v, endPeriod, mainCity, compareCities); }}
        endPeriod={endPeriod}
        setEndPeriod={(v) => { setEndPeriod(v); updateUrl(startPeriod, v, mainCity, compareCities); }}
        mainCity={mainCity}
        handleMainCityChange={(v) => { handleMainCityChange(v); updateUrl(startPeriod, endPeriod, v, compareCities.filter(c => c !== v)); }}
        compareCities={compareCities}
        toggleCompare={(v) => { toggleCompare(v); /* 這裡的同步較複雜，DashboardSidebar 內部的 handleApply 會一次性處理 */ }}
        handleCancelCompare={handleCancelCompare}
        onDownload={openExportModal}
        onShare={handleShare}
        onInfoOpen={() => setIsInfoOpen(true)}
      />

      {/* 2. 右側主要內容區 */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-slate-50 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 shadow-sm z-30">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded">☰</button>
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">目前顯示：</span>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(mainCity) }}></div>
                      {getDisplayName(mainCity)}
                   </span>
                   {compareCities.map(id => (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                         <span className="text-[10px] text-slate-300 font-extrabold italic">VS</span>
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(id) }}></div>
                         {getCityName(id)}
                      </span>
                   ))}
                </div>
             </div>
           </div>
        </header>

        {/* List Content: Takes up 60% of the space */}
        <div className="h-[60%] bg-slate-50/50 z-10 overflow-hidden">
          <EventList 
            data={currentViewEvents} 
            startPeriod={startPeriod} 
            endPeriod={endPeriod} 
            citiesOrder={chartCities} 
          />
        </div>

        {/* 底部圖表組件 */}
        <div className="h-[40%] shrink-0 z-20">
          <DashboardChart 
            selectedCities={chartCities}
            startPeriod={startPeriod}
            endPeriod={endPeriod}
          />
        </div>
      </div>

      <ExportModal 
        isOpen={isExportOpen}
        onClose={closeExportModal}
        defaultStart={startPeriod}
        defaultEnd={endPeriod}
        defaultMain={mainCity}
        defaultCompare={compareCities}
        onGenerate={handleGenerate}
      />

      {exportConfig && <ReportCanvas config={exportConfig} canvasRef={reportRef} />}
      <InfoTooltip isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <ExportLoadingOverlay isVisible={isGenerating} progress={exportProgress} />
    </main>
  );
}
