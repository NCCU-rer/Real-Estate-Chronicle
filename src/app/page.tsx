"use client";

import { useState, useMemo } from "react";
// Navbar 在新版面中已整合進側邊欄與 Header，這裡可以先移除引用，或是保留但不使用
// import Navbar from "@/components/Navbar"; 
import EventList from "@/components/EventList";
import PriceChart from "@/components/PriceChart";
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue, generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName } from "@/config/cityColors";

const QUARTER_OPTIONS = generateQuarterOptions();

export default function Home() {
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("taipei");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 邏輯處理 ---
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

  // --- 資料處理 ---
  const allEvents = useMemo(() => processEvents(Object.values(rawData).flat()), []);
  const chartCities = [mainCity, ...compareCities]; 
  
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    return allEvents.filter(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      const isCityMatch = event.city && (chartCities.includes(event.city) || event.city === "oldLabel");
      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);

  // --- 畫面渲染 (新版儀表板 Layout) ---
  return (
    <main className="h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      
      {/* === 側邊欄 (改為深色系專業風格) === */}
      {/* 遮罩層 (Mobile用) */}
      {isSettingsOpen && <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden" onClick={() => setIsSettingsOpen(false)}/>}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-[60] w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* 側邊欄 Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide">不動產大事紀</h1>
            <p className="text-xs text-slate-500 mt-1">Market Intelligence</p>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="md:hidden text-white">✕</button>
        </div>

        {/* 側邊欄 捲動區 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 1. 時間區間 */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Analysis Period</label>
            <div className="space-y-3">
              <div className="group bg-slate-800 rounded-lg p-2 border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="block text-[10px] text-slate-500 mb-0.5 ml-1">START</span>
                <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none font-medium cursor-pointer">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q} className="bg-slate-800">{q.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="group bg-slate-800 rounded-lg p-2 border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <span className="block text-[10px] text-slate-500 mb-0.5 ml-1">END</span>
                <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-transparent text-white text-sm outline-none font-medium cursor-pointer">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q} className="bg-slate-800">{q.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 2. 主要城市 */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Focus City</label>
            <div className="grid grid-cols-2 gap-2">
              {CITIES_CONFIG.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleMainCityChange(c.id)} 
                  className={`
                    p-2 rounded-md text-xs font-bold transition-all duration-200 border
                    ${mainCity === c.id 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 比對城市 */}
          <div>
            <div className="flex justify-between items-center mb-4">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compare With</label>
               {compareCities.length > 0 && (
                 <button onClick={handleCancelCompare} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">RESET</button>
               )}
            </div>
            <div className="space-y-1">
               {CITIES_CONFIG.filter(c => c.id !== mainCity).map(c => (
                  <label key={c.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 cursor-pointer group transition-colors">
                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${compareCities.includes(c.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-transparent'}`}>
                       {compareCities.includes(c.id) && <span className="text-white text-[10px]">✓</span>}
                     </div>
                     <input type="checkbox" checked={compareCities.includes(c.id)} onChange={() => toggleCompare(c.id)} className="hidden" />
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                        <span className="text-sm text-slate-400 group-hover:text-white font-medium">{c.label}</span>
                     </div>
                  </label>
               ))}
            </div>
          </div>

        </div>
        
        {/* 側邊欄 Footer */}
        <div className="p-4 bg-slate-950 text-[10px] text-slate-600 border-t border-slate-800 text-center">
          Data Source: Internal DB v1.2
        </div>
      </aside>

      {/* === 右側主要內容 === */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* 頂部狀態列 (Header) */}
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 shadow-sm z-30">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded">☰</button>
             
             {/* 麵包屑顯示目前狀態 */}
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">VIEWING:</span>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CITIES_CONFIG.find(c => c.id === mainCity)?.color }}></span>
                      {getCityName(mainCity)}
                   </span>
                   {compareCities.length > 0 && <span className="text-slate-300 font-bold text-xs">VS</span>}
                   {compareCities.map(id => (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm">
                         {getCityName(id)}
                      </span>
                   ))}
                </div>
             </div>
           </div>
        </header>

        {/* 中間滾動區 (Event List) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 pb-[220px] scroll-smooth">
           <div className="pt-8">
              <EventList 
                data={currentViewEvents} 
                startPeriod={startPeriod} 
                endPeriod={endPeriod} 
                quarterWidth={0} 
                citiesOrder={chartCities} 
                mainCityName={getCityName(mainCity)}
              />
           </div>
        </div>

        {/* 底部浮動圖表區 (Glassmorphism + Shadow) */}
        <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 transition-transform duration-300">
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-50 flex items-center gap-2 group">
              <span>Price Trend</span>
              <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
           </div>
           <div className="h-full w-full p-4 pb-6">
              <PriceChart 
                 selectedCities={chartCities} 
                 startPeriod={startPeriod} 
                 endPeriod={endPeriod} 
              />
           </div>
        </div>

      </div>
    </main>
  );
}