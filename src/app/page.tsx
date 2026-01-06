"use client";

import { useState, useMemo } from "react";
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
    // 如果切換主要城市，把該城市從比較列表中移除（避免重複）
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

  // 輔助函式：取得顯示名稱 (處理 "nation" 的情況)
  const getDisplayName = (id: string) => {
    if (id === "nation") return "全國";
    return getCityName(id);
  };
  
  // 輔助函式：取得顏色 (處理 "nation" 的情況)
  const getDisplayColor = (id: string) => {
    if (id === "nation") return "#333333"; // 深灰色代表全國
    const city = CITIES_CONFIG.find(c => c.id === id);
    return city ? city.color : "#333333";
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
      
      // ✨ 修正邏輯：如果主要城市是 "nation"，則顯示全國事件(oldLabel)
      // 雖然 EventList 有分欄，但這裡是用來篩選「要不要丟進去 render」
      // 基本上保持寬鬆，讓 EventList 自己去分組
      const isCityMatch = 
        event.city === "oldLabel" || // 永遠顯示全國事件
        chartCities.includes(event.city);

      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);

  return (
    <main className="h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      
      {/* 側邊欄 (設定區) */}
      {isSettingsOpen && <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden" onClick={() => setIsSettingsOpen(false)}/>}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-60 w-72 
        bg-white border-r border-slate-200 
        flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h1 className="font-bold text-lg tracking-wide">不動產大事紀</h1>
            <p className="text-xs text-slate-400 mt-1">Real Estate Chronicle</p>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="md:hidden text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* 時間區間 */}
          <div>
            <label className="text-xs font-bold text-black uppercase tracking-wider mb-4 block">時間區間 </label>
            <div className="space-y-3">
              <div className="group bg-white rounded-lg p-2 border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <span className="block text-[10px] text-slate-400 mb-0.5 ml-1 font-bold">起 </span>
                <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-transparent text-slate-700 text-sm outline-none font-bold cursor-pointer hover:text-blue-600">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="group bg-white rounded-lg p-2 border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <span className="block text-[10px] text-slate-400 mb-0.5 ml-1 font-bold">迄</span>
                <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-transparent text-slate-700 text-sm outline-none font-bold cursor-pointer hover:text-blue-600">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 主要城市 */}
          <div>
            <label className="text-xs font-bold text-black uppercase tracking-wider mb-4 block">主要城市 </label>
            <div className="grid grid-cols-2 gap-2">
              {/* ✨ 新增：全國按鈕 */}
              <button 
                onClick={() => handleMainCityChange("nation")}
                className={`
                  col-span-2 p-2 rounded-md text-xs font-bold transition-all duration-200 border shadow-sm flex items-center justify-center gap-2
                  ${mainCity === "nation" 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }
                `}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                全國均價 
              </button>

              {CITIES_CONFIG.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleMainCityChange(c.id)} 
                  className={`
                    p-2 rounded-md text-xs font-bold transition-all duration-200 border shadow-sm
                    ${mainCity === c.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600'
                    }
                  `}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 加入比對 */}
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="text-xs font-bold text-black uppercase tracking-wider">加入比對</label>
               {compareCities.length > 0 && (
                 <button onClick={handleCancelCompare} className="text-[10px] text-red-500 hover:text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded transition-colors">清除重選</button>
               )}
            </div>
            
            <p className="text-[10px] text-black mb-3 opacity-80 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
              最多可選擇 3 個城市
            </p>

            <div className="space-y-1">
               {CITIES_CONFIG.filter(c => c.id !== mainCity).map(c => {
                  const isChecked = compareCities.includes(c.id);
                  const isDisabled = !isChecked && compareCities.length >= 3;
                  
                  return (
                    <label 
                      key={c.id} 
                      className={`
                        flex items-center gap-3 p-2 rounded-md border border-transparent transition-colors
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer hover:border-slate-100'}
                      `}
                    >
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                         {isChecked && <span className="text-white text-[10px]">✓</span>}
                       </div>
                       <input 
                         type="checkbox" 
                         checked={isChecked} 
                         onChange={() => !isDisabled && toggleCompare(c.id)} 
                         disabled={isDisabled}
                         className="hidden" 
                       />
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                          <span className="text-sm text-slate-600 font-medium">{c.label}</span>
                       </div>
                    </label>
                  );
               })}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-[10px] text-slate-400 border-t border-slate-200 text-center">
          資料來源：政大不動產研究中心
        </div>
      </aside>

      {/* 右側內容 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 shadow-sm z-30">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded">☰</button>
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">目前顯示：</span>
                <div className="flex items-center gap-2">
                   {/* ✨ 使用 getDisplayName 和 getDisplayColor 來支援 "全國" */}
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
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 pb-75 scroll-smooth">
           <div className="pt-8">
              <EventList 
                data={currentViewEvents} 
                startPeriod={startPeriod} 
                endPeriod={endPeriod} 
                quarterWidth={0} 
                citiesOrder={chartCities} 
                // ✨ 傳入正確的顯示名稱
                mainCityName={getDisplayName(mainCity)}
              />
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-70 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40">
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-default flex items-center gap-2">
              <span>房價中位數走勢圖</span>
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