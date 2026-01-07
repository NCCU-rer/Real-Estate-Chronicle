"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";

// ... 介面定義保持不變 ...
interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { data: EventItem[]; startPeriod: string; endPeriod: string; quarterWidth: number; citiesOrder: string[]; mainCityName?: string; }
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 判斷邏輯
  const hasCompare = citiesOrder.length > 1;
  // ✨ 新增：判斷是否為「僅選全國」模式 (主城市是 nation 且沒有比較城市)
  const isNationOnly = citiesOrder[0] === 'nation' && !hasCompare;

  // ✨ 動態決定 Grid 的欄位設定
  // 1. 有比較城市 -> 4欄 (全國 | 時間 | 主城市 | 比較城市)
  // 2. 僅全國模式 -> 2欄 (全國 | 時間) -> 這裡我們讓時間軸靠右，事件靠左
  // 3. 一般模式   -> 3欄 (全國 | 時間 | 主城市)
  const gridClass = hasCompare 
    ? "grid-cols-[1fr_80px_1fr_1fr]" 
    : isNationOnly 
      ? "grid-cols-[1fr_80px]" // 全國模式：只剩兩欄
      : "grid-cols-[1fr_80px_1fr]";

  // ... useMemo 資料處理邏輯保持不變 ...
  const groupedData = useMemo(() => {
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
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className={`text-sm font-bold leading-snug transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-600 group-hover/card:text-slate-800'}`}>
              {event.title}
            </h3>
            {!isMain && !isNational && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {event.cityName}
              </span>
            )}
          </div>
          {event.category && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
                 event.category === '政策' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {event.category}
              </span>
            </div>
          )}
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
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
      
      {/* 1. 表頭 */}
      <div className="sticky top-0 z-40 pt-4 pb-2 -mx-4 px-4 backdrop-blur-md bg-gray-50/80 border-b border-slate-200/50">
        <div className={`
          hidden md:grid gap-6 text-xs font-bold uppercase tracking-wider text-slate-400
          ${gridClass} {/* ✨ 使用動態 Grid */}
        `}>
          <div className="flex items-center justify-center bg-slate-200/50 py-1.5 rounded text-slate-500">
            全國/宏觀
          </div>
          <div className="flex items-center justify-center">時間軸</div>
          
          {/* ✨ 如果不是「僅全國模式」，才顯示主城市標題 */}
          {!isNationOnly && (
            <div 
              className="flex items-center justify-center py-1.5 rounded text-white shadow-sm"
              style={{ backgroundColor: citiesOrder[0] === 'nation' ? '#333333' : getCityColor(citiesOrder[0]) }}
            >
              {mainCityName} 
            </div>
          )}

          {/* 比較城市標題 (有比較時才顯示) */}
          <div className="flex items-center justify-center bg-white border border-slate-200 border-dashed text-slate-500 py-1.5 rounded px-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
              {/* 取出 citiesOrder 中第 2 個以後的 ID (就是比較城市)，轉成名稱並用 " / " 連接 */}
              {citiesOrder.slice(1).map(id => getCityName(id)).join(" / ")}
            </div>
        </div>
      </div>

      {/* 2. 內容 */}
      <div className="relative mt-6 pb-32">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-slate-200 via-slate-300 to-transparent hidden md:block" />

        <div className="space-y-8">
          {groupedData.map((group) => (
            <div 
              key={`${group.year}_${group.quarter}`} 
              className={`
                relative md:grid gap-6 group/row
                ${gridClass} {/* ✨ 使用動態 Grid */}
              `}
            >
              
              {/* 左：全國 */}
              <div className="flex flex-col gap-3">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* 中：時間 */}
              <div className="relative flex justify-center h-full pt-1">
                <div className="sticky top-28 z-20 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white border-4 border-slate-100 shadow-sm text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block -mb-1">{group.year}</span>
                  <span className="text-sm font-black text-slate-700">{group.quarter}</span>
                </div>
              </div>

              {/* 右：主城市 (✨ 僅在非全國模式下顯示) */}
              {!isNationOnly && (
                <div className="flex flex-col gap-3">
                  {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
                </div>
              )}

              {/* 最右：比較城市 (僅在有比較時顯示) */}
              {hasCompare && (
                <div className="flex flex-col gap-3 relative">
                  <div className="absolute inset-y-0 -left-3 w-px border-l border-dashed border-slate-200 hidden md:block"></div>
                  {group.compareEvents.map((event, idx) => renderEventCard(event, idx, 'comp'))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}