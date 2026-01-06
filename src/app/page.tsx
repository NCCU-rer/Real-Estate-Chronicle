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
const YEARS = Array.from({ length: 13 }, (_, i) => 2013 + i);

export default function Home() {
  // --- 1. 狀態管理 ---
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("taipei");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [activeEventTab, setActiveEventTab] = useState("taipei");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 2. 邏輯處理 ---
  const handleMainCityChange = (cityId: string) => {
    setMainCity(cityId);
    setCompareCities(prev => prev.filter(c => c !== cityId));
    setActiveEventTab(cityId); 
  };

  const toggleCompare = (cityId: string) => {
    if (cityId === mainCity) return;
    setCompareCities(prev => {
      if (prev.includes(cityId)) {
        const newList = prev.filter(id => id !== cityId);
        if (activeEventTab === cityId) setActiveEventTab(mainCity);
        return newList;
      }
      if (prev.length >= 3) {
        alert("為保持圖表清晰，建議最多比對 3 個縣市！");
        return prev;
      }
      return [...prev, cityId];
    });
  };

  const handleQuickYear = (year: number | "ALL") => {
    if (year === "ALL") {
      setStartPeriod("2013_Q1");
      setEndPeriod("2025_Q4");
    } else {
      setStartPeriod(`${year}_Q1`);
      setEndPeriod(`${year}_Q4`);
    }
  };

  // --- 3. 資料處理 ---
  const allEvents = useMemo(() => {
    const list = Object.values(rawData).flat(); 
    return processEvents(list);
  }, []);

  const getCityEvents = (cityId: string, includeNational: boolean = false) => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return allEvents.filter(event => {
      const isCityMatch = event.city?.toLowerCase() === cityId.toLowerCase();
      const isNationalMatch = includeNational && event.city === "oldLabel";
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      return isTimeMatch && (isCityMatch || isNationalMatch);
    });
  };

  const getCityName = (id: string) => CITIES.find(c => c.id === id)?.label || id;

  const currentTabEvents = useMemo(() => {
    const isMain = activeEventTab === mainCity;
    return getCityEvents(activeEventTab, isMain);
  }, [activeEventTab, mainCity, startPeriod, endPeriod, allEvents]);

  const chartCities = [mainCity, ...compareCities];
  const visibleTabs = [mainCity, ...compareCities];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex relative">
        
        {/* === 1. 側邊欄 (設定區) - 保持不變 === */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setIsSettingsOpen(false)}/>
        )}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSettingsOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">儀表板設定</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* 設定內容省略，保持原本邏輯即可 */}
             <div className="mb-8">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">主要觀察城市</label>
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((city) => (
                  <button key={city.id} onClick={() => handleMainCityChange(city.id)} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all text-center ${mainCity === city.id ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>{city.label}</button>
                ))}
              </div>
            </div>
            <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">時間區間</label>
              <div className="space-y-3">
                <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded px-3 py-2 outline-none">{QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}</select>
                <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded px-3 py-2 outline-none">{QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}</select>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-700 p-1 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg></span>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">加入比對 (最多3個)</label>
              </div>
              <div className="flex flex-col gap-2">
                {CITIES.map((city) => {
                  if (city.id === mainCity) return null;
                  const isSelected = compareCities.includes(city.id);
                  return (
                    <label key={city.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${isSelected ? "bg-orange-50 border-orange-200" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleCompare(city.id)} />
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300'}`}>{isSelected && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .207 1.012l-7.5 13a.75.75 0 0 1-1.297 0l-4.5-7.794a.75.75 0 0 1 1.297-.75l3.851 6.67 6.93-12.012a.75.75 0 0 1 1.012-.207Z" clipRule="evenodd" /></svg>}</div>
                      <span className={`text-sm ${isSelected ? 'text-orange-700 font-bold' : 'text-slate-600'}`}>{city.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === 2. 主要內容區 (變更為 上下結構) === */}
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col h-[calc(100vh-64px)] w-full relative">
          
          {/* 浮動工具列按鈕 (放在左上角) */}
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 bg-slate-800/90 backdrop-blur text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
              <span className="font-bold text-sm hidden md:inline">設定與篩選</span>
            </button>
          </div>

          {/* === 上半部：大事紀 (橫向捲動) === */}
          {/* 這裡設定高度佔 55%，讓事件區塊大一點 */}
          <div className="h-[55%] w-full bg-white border-b border-slate-200 flex flex-col shadow-sm z-10">
            
            {/* Header: 分頁籤 & 年份快篩 */}
            <div className="pt-3 px-16 border-b border-slate-100 bg-white z-20 shrink-0 flex justify-between items-end">
               <div className="flex gap-2 overflow-x-auto custom-scrollbar -mb-[1px]">
                  {visibleTabs.map(cityId => {
                     const isActive = activeEventTab === cityId;
                     const isMain = cityId === mainCity;
                     return (
                       <button key={cityId} onClick={() => setActiveEventTab(cityId)} className={`pb-2 pt-2 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${isActive ? (isMain ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg" : "border-orange-500 text-orange-700 bg-orange-50/50 rounded-t-lg") : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg"}`}>
                          {getCityName(cityId)}{isMain && " (主)"}
                       </button>
                     );
                  })}
               </div>
               
               <div className="mb-2 flex items-center gap-2">
                 <span className="text-xs text-slate-400">年份快篩:</span>
                 <div className="flex gap-1 overflow-x-auto custom-scrollbar max-w-[300px] md:max-w-[500px]">
                    <button onClick={() => handleQuickYear("ALL")} className={`px-2 py-0.5 text-[10px] rounded-full whitespace-nowrap border ${startPeriod === "2013_Q1" && endPeriod === "2025_Q4" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200"}`}>全部</button>
                    {YEARS.map(year => {
                      const isSelected = startPeriod === `${year}_Q1` && endPeriod === `${year}_Q4`;
                      return <button key={year} onClick={() => handleQuickYear(year)} className={`px-2 py-0.5 text-[10px] rounded-full border ${isSelected ? "bg-blue-100 text-blue-700 border-blue-200 font-bold" : "bg-white text-slate-500 border-slate-200"}`}>{year}</button>;
                    })}
                 </div>
               </div>
            </div>

            {/* Content: 橫向事件列表 */}
            <div className="flex-1 w-full overflow-hidden relative bg-slate-50/30">
               <EventList data={currentTabEvents} />
            </div>
          </div>

          {/* === 下半部：房價圖表 (填滿剩餘空間) === */}
          <div className="flex-1 w-full p-4 relative min-h-0 bg-white">
            <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm text-xs">
              <span className="text-slate-500 mr-2">圖表顯示:</span>
              <span className="font-bold text-slate-700">{getCityName(mainCity)}</span>
              {compareCities.length > 0 && <span className="text-orange-600 ml-1">vs {compareCities.map(id => getCityName(id)).join(", ")}</span>}
            </div>
            <PriceChart selectedCities={chartCities} startPeriod={startPeriod} endPeriod={endPeriod} />
          </div>

        </div>
      </div>
    </main>
  );
}
