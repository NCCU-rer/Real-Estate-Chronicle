"use client";

import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import InfoModal from "@/components/InfoModal"; // ✨ 1. 引入彈窗組件
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue, RawEvent } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName } from "@/config/cityColors";
import { Info } from "lucide-react"; // ✨ 2. 引入 Info 圖示

export default function Home() {
  // === 1. 狀態管理 (State) ===
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("taipei");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 資料模式狀態
  const [dataType, setDataType] = useState<'price' | 'index'>('price');

  // ✨ 3. 新增彈窗開關狀態
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
  // 使用雙重轉型解決型別問題
  const allEvents = useMemo(() => {
    const flatData = Object.values(rawData).flat();
    return processEvents(flatData as unknown as RawEvent[]);
  }, []);

  const chartCities = [mainCity, ...compareCities]; 
  
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    return allEvents.filter(event => {
      // 防呆：確保 event.year 和 event.quarter 存在
      if (!event.year || !event.quarter) return false;

      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      
      // 寬鬆的城市篩選邏輯
      const isCityMatch = 
        event.isNational ||          
        !event.city ||               
        event.city === 'nation' ||   
        event.city === 'oldLabel' || 
        chartCities.includes(event.city); 

      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);

  // === 4. 畫面渲染 (Render) ===
  return (
    <main className="h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      
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
        dataType={dataType}
        setDataType={setDataType}
      />

      {/* 2. 右側主要內容區 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 shadow-sm z-30">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded">☰</button>
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">目前顯示：</span>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(mainCity) }}></span>
                      {getDisplayName(mainCity)}
                   </span>
                   {compareCities.map(id => (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2">
                         <span className="text-[10px] text-slate-300 font-extrabold italic">VS</span>
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getDisplayColor(id) }}></span>
                         {getCityName(id)}
                      </span>
                   ))}
                </div>
             </div>
           </div>

           {/* ✨ 4. 右側說明按鈕 */}
           <button 
             onClick={() => setIsInfoOpen(true)}
             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all duration-200"
             title="網站說明"
           >
             <Info className="w-5 h-5" />
           </button>
        </header>

        {/* List Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 scroll-smooth transition-all duration-300 ${isChartOpen ? 'pb-75' : 'pb-20'}`}>
           <div className="pt-8">
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

        {/* 3. 底部圖表組件 */}
        <DashboardChart 
          isChartOpen={isChartOpen}
          setIsChartOpen={setIsChartOpen}
          selectedCities={chartCities}
          startPeriod={startPeriod}
          endPeriod={endPeriod}
          dataType={dataType}
        />

        {/* ✨ 5. 渲染彈窗組件 */}
        <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        
      </div>
    </main>
  );
}