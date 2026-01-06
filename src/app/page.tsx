"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import PriceChart from "@/components/PriceChart";
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue, generateQuarterOptions } from "@/utils/eventHelper";

const CITIES = [
  { id: "taipei", label: "台北市" },
  { id: "newTaipei", label: "新北市" },
  { id: "taoyuan", label: "桃園市" },
  { id: "hsinchu", label: "新竹縣市" },
  { id: "taichung", label: "台中市" },
  { id: "tainan", label: "台南市" },
  { id: "kaohsiung", label: "高雄市" },
];

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

  // --- 資料處理 ---
  const allEvents = useMemo(() => processEvents(Object.values(rawData).flat()), []);
  
  // 整合主城市與比對城市
  const chartCities = [mainCity, ...compareCities]; 
  
  // ✨ 關鍵修正：定義 currentViewEvents (這就是您原本缺少的變數)
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    return allEvents.filter(event => {
      // 1. 時間篩選
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      
      // 2. 城市篩選：顯示「全國」 + 「主城市」 + 「比對城市」
      const isCityMatch = event.city && (chartCities.includes(event.city) || event.city === "oldLabel");

      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);


  return (
    <main className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* === 側邊欄 (設定區) === */}
        {isSettingsOpen && <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setIsSettingsOpen(false)}/>}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl transition-transform duration-300 ${isSettingsOpen ? "translate-x-0" : "-translate-x-full"}`}>
           <div className="p-6 h-full flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">顯示設定</h2>
                 <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
              </div>
              
              <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-400 mb-3 uppercase">時間區間</label>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-slate-500 w-6">起</span>
                     <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none">
                        {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                     </select>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-slate-500 w-6">迄</span>
                     <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none">
                        {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                     </select>
                   </div>
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-400 mb-3 uppercase">主要城市</label>
                 <div className="grid grid-cols-2 gap-2">
                    {CITIES.map(c => (
                       <button key={c.id} onClick={() => handleMainCityChange(c.id)} className={`p-2 rounded text-sm font-bold transition-colors ${mainCity === c.id ? 'bg-blue-600 text-white shadow' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                          {c.label}
                       </button>
                    ))}
                 </div>
              </div>
              <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-400 mb-3 uppercase">加入比對</label>
                 <div className="space-y-2">
                    {CITIES.filter(c => c.id !== mainCity).map(c => (
                       <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-slate-100 transition-colors">
                          <input type="checkbox" checked={compareCities.includes(c.id)} onChange={() => toggleCompare(c.id)} className="rounded text-orange-500 focus:ring-orange-500"/>
                          <span className="text-slate-700 font-medium">{c.label}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* === 主要內容區 === */}
        <div className="flex-1 bg-gray-50 flex flex-col h-full w-full relative">
          
          {/* 1. 頂部導覽列 */}
          <div className="bg-white border-b border-slate-200 shadow-sm z-30 shrink-0 px-4 py-3 flex items-center justify-between sticky top-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 font-bold transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg>
                設定與篩選
              </button>
              
              {/* 顯示目前比對的城市 */}
              <div className="flex gap-2 text-sm">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  {CITIES.find(c => c.id === mainCity)?.label} (主)
                </span>
                {compareCities.map(id => (
                  <span key={id} className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                     {CITIES.find(c => c.id === id)?.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. 事件列表 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 relative pb-[200px]"> 
            <EventList 
              data={currentViewEvents} 
              startPeriod={startPeriod} 
              endPeriod={endPeriod} 
              quarterWidth={0} 
              citiesOrder={chartCities} 
              mainCityName={CITIES.find(c => c.id === mainCity)?.label}
              
            />
          </div>

          {/* 3. 底部圖表 */}
          <div className="h-[25vh] min-h-[180px] bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-3 py-0.5 shadow-sm text-[10px] text-slate-400 font-bold uppercase tracking-wider cursor-default">
               Price Trend
             </div>
             <div className="h-full w-full p-2 pb-4">
                <PriceChart 
                   selectedCities={chartCities} 
                   startPeriod={startPeriod} 
                   endPeriod={endPeriod} 
                />
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}