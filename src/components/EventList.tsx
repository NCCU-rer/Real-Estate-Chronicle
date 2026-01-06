"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";

const CITY_STYLES: Record<string, string> = {
  taipei: "bg-[#247533]/10 text-[#247533] border-[#247533]/20",
  newTaipei: "bg-[#297270]/10 text-[#297270] border-[#297270]/20",
  taoyuan: "bg-[#8ab07c]/10 text-[#6a905c] border-[#8ab07c]/20",
  hsinchu: "bg-[#2998d8]/10 text-[#2998d8] border-[#2998d8]/20",
  taichung: "bg-[#e7c66b]/10 text-[#b7963b] border-[#e7c66b]/20",
  tainan: "bg-[#f3a361]/10 text-[#d38341] border-[#f3a361]/20",
  kaohsiung: "bg-[#e66d50]/10 text-[#e66d50] border-[#e66d50]/20",
  oldLabel: "bg-slate-100 text-slate-500 border-slate-200",
};

interface EventItem {
  year: number;
  quarter: string;
  title: string;
  description?: string;
  city?: string;
  cityName?: string;
  category?: string;
  isNational?: boolean;
}

interface EventListProps {
  data: EventItem[];
  startPeriod: string;
  endPeriod: string;
  quarterWidth: number;
  citiesOrder: string[]; 
  mainCityName?: string; // ✨ 新增：傳入主城市名稱
}

// ✨ 修改分組結構，分成三類
interface GroupedQuarter {
  year: number;
  quarter: string;
  nationalEvents: EventItem[];
  mainCityEvents: EventItem[];    // 主城市
  compareEvents: EventItem[];     // 比較城市
}

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedQuarter> = {};
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    const mainCityId = citiesOrder[0]; // 第一個是主城市

    // 1. 建立骨架
    for (let y = 2013; y <= 2025; y++) {
      for (let q = 1; q <= 4; q++) {
        const currentVal = y * 10 + q;
        if (currentVal >= startVal && currentVal <= endVal) {
           const qKey = `${y}_Q${q}`;
           groups[qKey] = { 
             year: y, 
             quarter: `Q${q}`, 
             nationalEvents: [], 
             mainCityEvents: [],
             compareEvents: [] 
           };
        }
      }
    }

    // 2. 填入並分類資料
    data.forEach(event => {
      const key = `${event.year}_${event.quarter}`;
      if (groups[key]) {
        if (event.isNational) {
          groups[key].nationalEvents.push(event);
        } else if (event.city === mainCityId) {
          // 如果是主城市
          groups[key].mainCityEvents.push(event);
        } else {
          // 其他都是比較城市
          groups[key].compareEvents.push(event);
        }
      }
    });

    // 3. 排序比較城市的事件 (依照 citiesOrder)
    Object.values(groups).forEach(group => {
      group.compareEvents.sort((a, b) => {
        const indexA = a.city ? citiesOrder.indexOf(a.city) : 999;
        const indexB = b.city ? citiesOrder.indexOf(b.city) : 999;
        return indexA - indexB;
      });
    });

    return Object.values(groups).sort((a, b) => {
       if (a.year !== b.year) return a.year - b.year;
       return a.quarter.localeCompare(b.quarter);
    });
  }, [data, startPeriod, endPeriod, citiesOrder]);

  const renderEventCard = (event: EventItem, index: number, type: 'nat' | 'main' | 'comp') => {
    const uniqueId = `${event.year}_${event.quarter}_${type}_${index}`;
    const isOpen = expandedId === uniqueId;
    const isNational = type === 'nat';
    const isMain = type === 'main';
    const cityStyle = (event.city && CITY_STYLES[event.city]) ? CITY_STYLES[event.city] : CITY_STYLES['oldLabel'];

    return (
      <div 
        key={uniqueId}
        className={`
          border rounded-lg p-3 shadow-sm transition-all duration-300 relative mb-3 last:mb-0 w-full
          ${isOpen 
            ? "bg-slate-50 border-blue-200 shadow-md ring-1 ring-blue-100 z-20" 
            : (isMain || isNational ? "bg-white" : "bg-slate-50/60") + " border-slate-100 hover:shadow-md hover:bg-white"
          }
          /* 根據欄位不同，加上不同顏色的邊條 */
          ${isNational ? "border-l-4 border-l-slate-400" : ""}
          ${isMain ? "border-l-4 border-l-blue-600" : ""}
          ${!isNational && !isMain ? "border-l-4 border-l-orange-400" : ""}
        `}
      >
        <div className="cursor-pointer" onClick={() => event.description && toggleExpand(uniqueId)}>
          <div className="flex justify-between items-start gap-2 mb-1">
             <h3 className={`text-sm font-bold leading-snug ${isOpen ? "text-blue-700" : (isMain || isNational ? "text-slate-800" : "text-slate-600")}`}>
               {event.title}
             </h3>
             {/* 只有比較城市顯示標籤，主城市和全國不顯示以保持乾淨 */}
             {!isMain && !isNational && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cityStyle} font-bold opacity-80 whitespace-nowrap`}>
                   {event.cityName}
                </span>
             )}
          </div>
          <div className="flex flex-wrap gap-2 mb-1">
             {event.category && (
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded">#{event.category}</span>
             )}
          </div>
        </div>

        {event.description && isOpen && (
          <div className="mt-2 pt-2 border-t border-slate-200 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="prose prose-sm text-slate-600 max-w-none leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: event.description }} />
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(uniqueId); }} className="text-[10px] font-medium flex items-center gap-1 transition-colors mt-2 text-slate-400 hover:text-blue-600">收合</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative pb-10 w-full max-w-7xl mx-auto px-2">
      
      {/* 頂部標題列 (對應三欄) */}
      <div className="hidden md:grid grid-cols-[1fr_60px_1fr_1fr] gap-6 mb-6 text-sm font-bold text-slate-500 border-b border-slate-200 pb-2 sticky top-0 bg-gray-50/95 backdrop-blur z-30 pt-4">
        <div className="text-center bg-slate-200/50 py-1 rounded">全國事件</div>
        <div className="text-center text-xs text-slate-300 flex items-center justify-center">時間</div>
        <div className="text-center bg-blue-100/50 text-blue-700 py-1 rounded">
          {mainCityName || "主要城市"}
        </div>
        <div className="text-center bg-orange-100/50 text-orange-700 py-1 rounded">比較城市</div>
      </div>

      <div className="relative">
        {/* 時間軸線 (穿過第二欄中心) */}
        {/* 計算方式：第一欄(1fr) + 一半的第二欄(30px) + gap */}
        {/* 這裡用絕對定位比較難抓，我們直接畫在每個 row 的 grid 裡 */}

        <div className="space-y-4 relative z-10">
          {groupedData.map((group) => (
            <div key={`${group.year}_${group.quarter}`} className="relative md:grid md:grid-cols-[1fr_60px_1fr_1fr] md:gap-6 w-full group min-h-[80px]">
              
              {/* === 第一欄：全國事件 === */}
              <div className="flex flex-col gap-2">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* === 第二欄：時間軸點 === */}
              <div className="relative flex justify-center h-full">
                 {/* 垂直連線 (背景) */}
                 <div className="absolute top-0 bottom-0 w-0.5 bg-slate-200 -z-10 group-last:bottom-auto group-last:h-1/2"></div>
                 
                 {/* 圓點 */}
                 <div className={`
                    sticky top-20 w-10 h-10 rounded-full flex flex-col items-center justify-center text-[9px] font-bold shadow-sm border-2 bg-white z-10 shrink-0
                    ${(group.nationalEvents.length || group.mainCityEvents.length || group.compareEvents.length) 
                        ? "border-slate-400 text-slate-700" 
                        : "border-slate-200 text-slate-300 scale-90 opacity-60"
                    }
                 `}>
                   <span className="leading-none">{group.year}</span>
                   <span className="leading-none opacity-80">{group.quarter}</span>
                 </div>
              </div>

              {/* === 第三欄：主城市事件 === */}
              <div className="flex flex-col gap-2">
                {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
              </div>

              {/* === 第四欄：比較城市事件 === */}
              {/* 加上左邊框線區隔 */}
              <div className="flex flex-col gap-2 md:border-l md:border-dashed md:border-slate-200 md:pl-6">
                {group.compareEvents.map((event, idx) => renderEventCard(event, idx, 'comp'))}
              </div>

            </div>
          ))}
        </div>
      </div>
      <div className="h-40"></div>
    </div>
  );
}