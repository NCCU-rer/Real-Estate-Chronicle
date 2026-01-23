"use client";

import { useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";

// ... 介面定義保持不變 ...
interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { data: EventItem[]; startPeriod: string; endPeriod: string; quarterWidth: number; citiesOrder: string[]; mainCityName?: string; }
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {

  // 判斷邏輯
  const hasCompare = citiesOrder.length > 1;
  // ✨ 新增：判斷是否為「僅選全國」模式 (主城市是 nation 且沒有比較城市)
  const isNationOnly = citiesOrder[0] === 'nation' && !hasCompare;

  // ✨ 動態決定 Grid 的欄位設定
  // 1. 有比較城市 -> 4欄 (全國 | 時間 | 主城市 | 比較城市)
  // 2. 僅全國模式 -> 2欄 (全國 | 時間) -> 這裡我們讓時間軸靠右，事件靠左
  // 3. 一般模式   -> 3欄 (全國 | 時間 | 主城市)
  // ✨ 使用固定的三欄式佈局，確保時間軸永遠在中間
  const gridClass = "grid-cols-[1fr_80px_1fr]";

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
    const isNational = type === 'nat';
    const isMain = type === 'main';
    const cityColor = event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color;

    return (
      <div 
        key={uniqueId}
        className={`
          group/card relative rounded-xl border transition-all duration-300 overflow-hidden
          bg-white/60 hover:bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5
        `}
        style={{ borderLeft: `4px solid ${cityColor}` }}
      >
        <div className="p-2.5">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-sm font-bold leading-snug transition-colors text-slate-600 group-hover/card:text-slate-800">
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
          {event.description && (
            <div className="mt-3 pt-3 border-t border-slate-100">
               <div className="overflow-hidden">
                  <div 
                    className="text-xs text-slate-600 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: event.description || "" }} 
                  />
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
      
      {/* 1. 表頭 */}
      <div className="sticky top-0 z-40 pt-4 pb-2 -mx-4 px-4 backdrop-blur-md bg-gray-50/80 border-b border-slate-200/50">
        <div className={`
          hidden md:grid gap-4 text-xs font-bold uppercase tracking-wider text-slate-400
          ${gridClass}
        `}>
          <div className="flex items-center justify-center bg-slate-200/50 py-1.5 rounded text-slate-500">
            全國
          </div>
          <div className="flex items-center justify-center">時間軸</div>
          
          {/* 右側標題區 (巢狀 Grid) */}
          <div className={`grid ${hasCompare ? 'grid-cols-2 gap-3' : ''}`}>
            {!isNationOnly && (
              <div 
                className="flex items-center justify-center py-1.5 rounded text-white shadow-sm"
                style={{ backgroundColor: citiesOrder[0] === 'nation' ? '#333333' : getCityColor(citiesOrder[0]) }}
              >
                {mainCityName} 
              </div>
            )}
            {hasCompare && (
              <div className="flex items-center justify-center bg-white border border-slate-200 border-dashed text-slate-500 py-1.5 rounded px-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {citiesOrder.slice(1).map(id => getCityName(id)).join(" / ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. 內容 */}
      <div className="relative mt-6 pb-32">
        <div className="space-y-4">
          {groupedData.map((group, index) => (
            <div 
              key={`${group.year}_${group.quarter}`} 
              className={`
                relative md:grid gap-4 group/row
                ${gridClass}
              `}
            >
              
              {/* 左：全國 */}
              <div className="flex flex-col gap-2">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* 中：時間 */}
              <div className="relative flex justify-center h-full pt-1">
                {/* 垂直的軸線，透過 style 向上延伸以填補間隙 */}
                <div 
                  className="absolute w-px bg-slate-200 hidden md:block"
                  style={{
                    top: index === 0 ? '0' : '-1rem', // space-y-4 is 1rem
                    bottom: '0',
                  }}
                />
                
                <div className="sticky top-28 z-20 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-slate-100 shadow-sm text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block -mb-1">{group.year}</span>
                  <span className="text-sm font-black text-slate-700">{group.quarter}</span>
                </div>
              </div>

              {/* 右：主城市與比較城市 (巢狀 Grid) */}
              <div className={`grid ${hasCompare ? 'grid-cols-2 gap-4' : ''}`}>
                {/* 主城市 (僅在非全國模式下顯示) */}
                {!isNationOnly && (
                  <div className="flex flex-col gap-2">
                    {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
                  </div>
                )}

                {/* 比較城市 (僅在有比較時顯示) */}
                {hasCompare && (
                  <div className="flex flex-col gap-2 relative">
                    <div className="absolute inset-y-0 -left-3 w-px border-l border-dashed border-slate-200 hidden md:block"></div>
                    {group.compareEvents.map((event, idx) => renderEventCard(event, idx, 'comp'))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}