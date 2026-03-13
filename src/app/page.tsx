"use client";

import { useState, useMemo, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import InfoTooltip from '@/components/InfoTooltip'; 
import ExportModal from "@/components/ExportModal";
import ReportCanvas from "@/components/ReportCanvas";
import { useDashboardExport } from "@/hooks/useDashboardExport";
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName, NATIONAL_CONFIG } from "@/config/cityColors";

export default function Home() {
  // === 1. 狀態管理 (State) ===
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("nation");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 匯出功能 Ref 與 Hook
  const reportRef = useRef<HTMLDivElement>(null);
  const { 
    isExportOpen, 
    isGenerating, 
    exportConfig, 
    openExportModal, 
    closeExportModal, 
    handleGenerate 
  } = useDashboardExport(reportRef);

  // === 2. 業務邏輯 (Handlers) ===
  const handleMainCityChange = (cityId: string) => {
    setMainCity(cityId);
    setCompareCities(prev => prev.filter(c => c !== cityId));
  };
  
  const toggleCompare = (cityId: string) => {
    if (cityId === mainCity) return;
    setCompareCities(prev => {
      if (prev.includes(cityId)) return prev.filter(id => id !== cityId);
      if (prev.length >= 3) return prev;
      return [...prev, cityId];
    });
  };

  const handleCancelCompare = () => setCompareCities([]);

  const getDisplayName = (id: string) => {
    if (id === "nation") return "全國";
    return getCityName(id);
  };
  
  const getDisplayColor = (id: string) => {
    if (id === "nation") return NATIONAL_CONFIG.color;
    const city = CITIES_CONFIG.find(c => c.id === id);
    return city ? city.color : "#333333";
  };

  // === 3. 資料計算 (Computation) ===
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

  // === 4. 畫面渲染 (Render) ===
  return (
    <main className="h-full w-full flex bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. 側邊欄組件 */}
      <DashboardSidebar 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        startPeriod={startPeriod}
        setStartPeriod={setStartPeriod}
        endPeriod={endPeriod}
        setEndPeriod={setEndPeriod}
        mainCity={mainCity}
        handleMainCityChange={handleMainCityChange}
        compareCities={compareCities}
        toggleCompare={toggleCompare}
        handleCancelCompare={handleCancelCompare}
        onDownload={openExportModal}
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
           
           {isGenerating && (
             <div className="flex items-center gap-2 text-orange-600 animate-pulse">
               <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
               <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Generating High-Res Report...</span>
             </div>
           )}
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

      {/* 匯出設定彈窗 */}
      <ExportModal 
        isOpen={isExportOpen}
        onClose={closeExportModal}
        defaultStart={startPeriod}
        defaultEnd={endPeriod}
        defaultMain={mainCity}
        defaultCompare={compareCities}
        onGenerate={handleGenerate}
      />

      {/* 隱形的報告畫布 (專門用於捕捉截圖) */}
      {exportConfig && (
        <ReportCanvas config={exportConfig} canvasRef={reportRef} />
      )}

      <InfoTooltip />
    </main>
  );
}
