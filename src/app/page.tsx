"use client";

import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import EventList from "@/components/EventList";
import InfoTooltip from '@/components/InfoTooltip'; // 匯入組件
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName } from "@/config/cityColors";

export default function Home() {
  // === 1. 狀態管理 (State) ===
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("taipei");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleCancelCompare = () => {
    setCompareCities([]);
  };

  const getDisplayName = (id: string) => {
    if (id === "nation") return "全國";
    return getCityName(id);
  };
  
  const getDisplayColor = (id: string) => {
    if (id === "nation") return "#333333";
    const city = CITIES_CONFIG.find(c => c.id === id);
    return city ? city.color : "#333333";
  };

  // === 3. 資料計算 (Computation) ===
  const allEvents = useMemo(() => processEvents(Object.values(rawData).flat()), []);
  const chartCities = useMemo(() => [mainCity, ...compareCities], [mainCity, compareCities]);
  
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return allEvents.filter(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      const isCityMatch = event.city === "oldLabel" || chartCities.includes(event.city);
      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);

  // === 4. 畫面渲染 (Render) ===
  return (
    <main className="h-full w-full flex bg-[#f4f1ea] font-serif">
      
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
      />

      {/* 2. 右側主要內容區 */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header - Status Bar Style */}
        <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 shrink-0 flex items-center justify-between px-6 z-30 sticky top-0 transition-all">
           <div className="flex items-center gap-4 w-full">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">☰</button>
             
             <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
                {/* 主要城市：純文字 + 色點 */}
                <div className="flex items-center gap-2 shrink-0">
                   <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: getDisplayColor(mainCity) }}></span>
                   <span className="text-sm font-bold text-slate-800">{getDisplayName(mainCity)}</span>
                </div>

                {/* 分隔線 (僅當有比較城市時顯示) */}
                {compareCities.length > 0 && (
                  <div className="h-4 w-px bg-slate-300 mx-1 shrink-0"></div>
                )}

                {/* 對照城市：淡化處理 */}
                <div className="flex items-center gap-4 shrink-0">
                   {compareCities.map(id => (
                      <div key={id} className="flex items-center gap-2 group">
                         <span className="text-xs font-medium text-slate-400 italic">vs</span>
                         <span className="w-2 h-2 rounded-full ring-1 ring-slate-200" style={{ backgroundColor: getDisplayColor(id) }}></span>
                         <span className="text-sm font-medium text-slate-600">{getCityName(id)}</span>
                      </div>
                   ))}
                </div>
             </div>
           </div>
        </header>

        {/* List Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-50 scroll-smooth transition-all duration-300 pb-24 relative z-10 px-4`}>
           <div className="pt-8 max-w-5xl mx-auto min-h-full">
              <EventList 
                data={currentViewEvents} 
                startPeriod={startPeriod} 
                endPeriod={endPeriod} 
                quarterWidth={0} 
                citiesOrder={chartCities} 
                mainCityName={getDisplayName(mainCity)}
              />
           </div>
        </div>
        
      </div>

      <InfoTooltip />
    </main>
  );
}