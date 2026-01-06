"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
// ✨ 匯入統一設定
import { CITIES_CONFIG, NATIONAL_CONFIG, getCityColor } from "@/config/cityColors";

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
  mainCityName?: string;
}

interface GroupedQuarter {
  year: number;
  quarter: string;
  nationalEvents: EventItem[];
  mainCityEvents: EventItem[];
  compareEvents: EventItem[];
}

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const groupedData = useMemo(() => {
    // ... (這段分組邏輯保持不變，直接複製原本的即可)
    const groups: Record<string, GroupedQuarter> = {};
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    const mainCityId = citiesOrder[0];

    for (let y = 2013; y <= 2025; y++) {
      for (let q = 1; q <= 4; q++) {
        const currentVal = y * 10 + q;
        if (currentVal >= startVal && currentVal <= endVal) {
           const qKey = `${y}_Q${q}`;
           groups[qKey] = { year: y, quarter: `Q${q}`, nationalEvents: [], mainCityEvents: [], compareEvents: [] };
        }
      }
    }
    data.forEach(event => {
      const key = `${event.year}_${event.quarter}`;
      if (groups[key]) {
        if (event.isNational) groups[key].nationalEvents.push(event);
        else if (event.city === mainCityId) groups[key].mainCityEvents.push(event);
        else groups[key].compareEvents.push(event);
      }
    });
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
    
    // ✨ 取得該事件對應城市的顏色
    const cityColor = event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color;

    return (
      <div 
        key={uniqueId}
        // ✨ 在這裡設定動態樣式：邊框顏色與陰影顏色
        style={{ 
          borderLeftColor: cityColor,
          // 如果展開，給它一個淡淡的該色背景
          backgroundColor: isOpen ? '#ffffff' : (isMain || isNational ? '#ffffff' : '#f8fafc'),
          // 加上邊框寬度
          borderLeftWidth: '4px',
        }}
        className={`
          rounded-lg p-3 shadow-sm transition-all duration-300 relative mb-3 last:mb-0 w-full border border-slate-100
          ${isOpen ? "shadow-md ring-1" : "hover:shadow-md"}
        `}
      >
        <div className="cursor-pointer" onClick={() => event.description && toggleExpand(uniqueId)}>
          <div className="flex justify-between items-start gap-2 mb-1">
             <h3 
               className="text-sm font-bold leading-snug"
               // ✨ 標題在展開時變色，收合時如果不是主欄位則變灰
               style={{ color: isOpen ? cityColor : (isMain || isNational ? '#1e293b' : '#475569') }}
             >
               {event.title}
             </h3>
             
             {/* 標籤：使用該城市顏色，並加上透明度當背景 */}
             {!isMain && !isNational && (
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded font-bold opacity-80 whitespace-nowrap"
                  style={{ 
                    color: cityColor, 
                    backgroundColor: `${cityColor}20`, // 20% 透明度
                    borderColor: `${cityColor}40`,
                    borderWidth: '1px'
                  }}
                >
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
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpand(uniqueId); }} 
              className="text-[10px] font-medium flex items-center gap-1 transition-colors mt-2 hover:underline"
              style={{ color: cityColor }} // 按鈕也跟著變色
            >
              收合
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative pb-10 w-full max-w-7xl mx-auto px-2">
      {/* 頂部標題列 */}
      <div className="hidden md:grid grid-cols-[1fr_60px_1fr_1fr] gap-6 mb-6 text-sm font-bold text-slate-500 border-b border-slate-200 pb-2 sticky top-0 bg-gray-50/95 backdrop-blur z-30 pt-4">
        <div className="text-center bg-slate-200/50 py-1 rounded">全國事件</div>
        <div className="text-center text-xs text-slate-300 flex items-center justify-center">時間</div>
        {/* ✨ 主城市標題區塊，背景色也可以動態化 */}
        <div className="text-center py-1 rounded text-white" style={{ backgroundColor: getCityColor(citiesOrder[0]) }}>
          {mainCityName || "主要城市"}
        </div>
        <div className="text-center bg-orange-100/50 text-orange-700 py-1 rounded">比較城市</div>
      </div>

      {/* ... (下方的 Grid 結構保持不變，直接複製原本的即可，renderEventCard 已經改好了) ... */}
      <div className="relative">
        <div className="space-y-4 relative z-10">
          {groupedData.map((group) => (
            <div key={`${group.year}_${group.quarter}`} className="relative md:grid md:grid-cols-[1fr_60px_1fr_1fr] md:gap-6 w-full group min-h-[80px]">
              <div className="flex flex-col gap-2">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>
              <div className="relative flex justify-center h-full">
                 <div className="absolute top-0 bottom-0 w-0.5 bg-slate-200 -z-10 group-last:bottom-auto group-last:h-1/2"></div>
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
              <div className="flex flex-col gap-2">
                {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
              </div>
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