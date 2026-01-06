"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG, getCityColor } from "@/config/cityColors";

// ... (介面定義保持不變，略過以節省篇幅，請保留原本的 interface) ...
// 為了完整性，這裡簡略列出介面，實際檔案請保留你原本的
interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { data: EventItem[]; startPeriod: string; endPeriod: string; quarterWidth: number; citiesOrder: string[]; mainCityName?: string; }
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ... (useMemo 資料處理邏輯完全不用動，保留原本的) ...
  const groupedData = useMemo(() => {
    // 請保留原本的邏輯程式碼
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

  // === ✨ 這裡開始是視覺大改造 ===
  const renderEventCard = (event: EventItem, index: number, type: 'nat' | 'main' | 'comp') => {
    const uniqueId = `${event.year}_${event.quarter}_${type}_${index}`;
    const isOpen = expandedId === uniqueId;
    const isNational = type === 'nat';
    const isMain = type === 'main';
    const cityColor = event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color;

    return (
      <div 
        key={uniqueId}
        onClick={() => event.description && toggleExpand(uniqueId)}
        className={`
          group/card relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
          ${isOpen 
            ? "bg-white shadow-lg ring-1 ring-slate-200 scale-[1.02] z-10" 
            : "bg-white/60 hover:bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
          }
        `}
        style={{ borderLeft: `4px solid ${cityColor}` }}
      >
        <div className="p-3">
          {/* Header */}
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className={`text-sm font-bold leading-snug transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-600 group-hover/card:text-slate-800'}`}>
              {event.title}
            </h3>
            {/* 標籤小藥丸 */}
            {!isMain && !isNational && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {event.cityName}
              </span>
            )}
          </div>

          {/* Tag */}
          {event.category && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
                 event.category === '政策' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {event.category}
              </span>
            </div>
          )}

          {/* 展開後的內容 */}
          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'}`}>
             <div className="overflow-hidden">
                <div 
  className="text-xs text-slate-600 leading-relaxed font-medium"
  dangerouslySetInnerHTML={{ __html: event.description || "" }}
/>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-1400px mx-auto px-4 sm:px-6">
      
      {/* 1. 專業感的表格標題 (Sticky Header + Glassmorphism) */}
      <div className="sticky top-0 z-40 pt-4 pb-2 -mx-4 px-4 backdrop-blur-md bg-gray-50/80 border-b border-slate-200/50">
        <div className="hidden md:grid grid-cols-[1fr_80px_1fr_1fr] gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center justify-center bg-slate-200/50 py-1.5 rounded text-slate-500">
            全國/宏觀
          </div>
          <div className="flex items-center justify-center">時間軸</div>
          <div 
            className="flex items-center justify-center py-1.5 rounded text-white shadow-sm"
            style={{ backgroundColor: getCityColor(citiesOrder[0]) }}
          >
            {mainCityName} (主)
          </div>
          <div className="flex items-center justify-center bg-white border border-slate-200 border-dashed text-slate-500 py-1.5 rounded">
            比較城市
          </div>
        </div>
      </div>

      {/* 2. 時間軸內容區 */}
      <div className="relative mt-6 pb-32">
        {/* 中央貫穿線 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px be-linear-to-b from-slate-200 via-slate-300 to-transparent hidden md:block" />

        <div className="space-y-8">
          {groupedData.map((group) => (
            <div key={`${group.year}_${group.quarter}`} className="relative md:grid md:grid-cols-[1fr_80px_1fr_1fr] md:gap-6 group/row">
              
              {/* 左：全國 */}
              <div className="flex flex-col gap-3">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* 中：時間球 (Time Badge) */}
              <div className="relative flex justify-center h-full pt-1">
                <div className="sticky top-28 z-20 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white border-4 border-slate-100 shadow-sm text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block -mb-1">{group.year}</span>
                  <span className="text-sm font-black text-slate-700">{group.quarter}</span>
                </div>
              </div>

              {/* 右：主城市 */}
              <div className="flex flex-col gap-3">
                {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
              </div>

              {/* 最右：比較城市 (加上虛線背景區隔) */}
              <div className="flex flex-col gap-3 relative">
                <div className="absolute inset-y-0 -left-3 w-px border-l border-dashed border-slate-200 hidden md:block"></div>
                {group.compareEvents.map((event, idx) => renderEventCard(event, idx, 'comp'))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}