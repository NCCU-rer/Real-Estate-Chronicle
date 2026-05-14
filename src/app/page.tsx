"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import InfoTooltip from "@/components/InfoTooltip";
import Footer from "@/components/layout/Footer";
import ExportModal from "@/components/ExportModal";
import ReportCanvas from "@/components/ReportCanvas";
import ExportLoadingOverlay from "@/components/ExportLoadingOverlay";
import { useDashboardExport } from "@/hooks/useDashboardExport";
import { rawData } from "@/data/sourceData";
import { rawPriceData } from "@/data/priceData";
import { processEvents, getQuarterValue, getAvailableQuarters } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName, NATIONAL_CONFIG } from "@/config/cityColors";
import { decodeDashboardUrl, encodeDashboardUrl } from "@/utils/urlHelper";
import SplashWrapper from "@/components/SplashWrapper";
import UserTour from "@/components/Guide/UserTour";

export default function Home() {
  // === 0. 資料預處理 (Data Preparation) ===
  const quarterOptions = useMemo(() => {
    const priceQuarters = getAvailableQuarters(rawPriceData);
    const eventQuarters = getAvailableQuarters(rawData);
    const merged = Array.from(new Set([...priceQuarters, ...eventQuarters]));
    return merged.sort((a, b) => getQuarterValue(a) - getQuarterValue(b));
  }, []);
  
  const lastQuarter = quarterOptions.length > 0 ? quarterOptions[quarterOptions.length - 1] : "2025_Q4";

  // === 1. 狀態管理 (State) ===
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState(lastQuarter);
  const [mainCity, setMainCity] = useState("nation");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    if (params.end) {
      setEndPeriod(params.end);
    } else if (lastQuarter) {
      setEndPeriod(lastQuarter);
    }
    
    if (params.main) setMainCity(params.main);
    if (params.compare) setCompareCities(params.compare);
  }, [lastQuarter]);


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
        end: endPeriod || lastQuarter, 
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
    <SplashWrapper>
      <UserTour />
      <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <main className="flex-1 flex overflow-hidden">
        
        {/* 1. 側邊欄組件 */}
        <DashboardSidebar 
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          startPeriod={startPeriod}
          setStartPeriod={(v) => { setStartPeriod(v); updateUrl(v, endPeriod, mainCity, compareCities); }}
          endPeriod={endPeriod}
          setEndPeriod={(v) => { setEndPeriod(v); updateUrl(startPeriod, v, mainCity, compareCities); }}
          mainCity={mainCity}
          handleMainCityChange={(v) => { handleMainCityChange(v); updateUrl(startPeriod, endPeriod, v, compareCities.filter(c => c !== v)); }}
          compareCities={compareCities}
          toggleCompare={(v) => { toggleCompare(v); }}
          handleCancelCompare={handleCancelCompare}
          onDownload={openExportModal}
          onShare={handleShare}
          onInfoOpen={() => setIsInfoOpen(true)}
          quarterOptions={quarterOptions}
        />

        {/* 2. 右側主要內容區 */}
        <div className="flex-1 flex flex-col min-w-0 relative bg-slate-50 overflow-hidden">
          
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 py-4 shadow-sm z-30 animate-in fade-in delay-150 duration-500">
             <div className="flex items-center gap-4">
               <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded">☰</button>
               <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap">目前顯示：</span>
                  <div className="flex items-center gap-2">
                     <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(mainCity) }}></div>
                        主要：{getDisplayName(mainCity)}
                     </span>
                     {compareCities.map(id => (
                        <span key={id} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                           <span className="text-[10px] text-slate-300 font-extrabold italic">VS</span>
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(id) }}></div>
                           對照：{getCityName(id)}
                        </span>
                     ))}
                  </div>
               </div>
             </div>
          </header>

          {/* List Content: Takes up 60% of the space */}
          <div className="tour-event-timeline h-[60%] bg-slate-50/50 z-10 overflow-hidden">
            <EventList 
              data={currentViewEvents} 
              startPeriod={startPeriod} 
              endPeriod={endPeriod} 
              citiesOrder={chartCities} 
            />
          </div>

          {/* 底部圖表組件 */}
          <div className="tour-price-chart h-[40%] shrink-0 z-20">
            <DashboardChart 
              selectedCities={chartCities}
              startPeriod={startPeriod}
              endPeriod={endPeriod}
            />
          </div>
        </div>
      </main>
      <Footer />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={closeExportModal}
        defaultStart={startPeriod}
        defaultEnd={endPeriod}
        defaultMain={mainCity}
        defaultCompare={compareCities}
        onGenerate={handleGenerate}
        quarterOptions={quarterOptions}
      />

      {exportConfig && <ReportCanvas config={exportConfig} canvasRef={reportRef} />}
      <InfoTooltip isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <ExportLoadingOverlay isVisible={isGenerating} progress={exportProgress} />
      </div>
    </SplashWrapper>
  );
}
