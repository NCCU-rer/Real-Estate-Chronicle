"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";

// ... 介面定義保持不變 ...
interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { data: EventItem[]; startPeriod: string; endPeriod: string; quarterWidth: number; citiesOrder: string[]; mainCityName?: string; }
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // ✨ 新增：分類篩選狀態
  const [filterCategory, setFilterCategory] = useState<string>("全部");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 判斷邏輯
  const hasCompare = citiesOrder.length > 1;
  // ✨ 新增：判斷是否為「僅選全國」模式 (主城市是 nation 且沒有比較城市)
  const isNationOnly = citiesOrder[0] === 'nation' && !hasCompare;

  // ✨ 動態決定 Grid 的欄位設定
  const gridClass = "grid-cols-[1fr_80px_1fr]";

  // ✨ 提取所有不重複的類別
  const allCategories = useMemo(() => {
    const cats = new Set<string>(["全部"]);
    data.forEach(item => {
      if (item.category) {
        // 有些 category可能是陣列或逗號分隔，這裡簡化處理
        if (Array.isArray(item.category)) {
          item.category.forEach(c => cats.add(c));
        } else {
          cats.add(item.category);
        }
      }
    });
    return Array.from(cats);
  }, [data]);

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
      // ✨ 篩選邏輯
      if (filterCategory !== "全部") {
        const eventCats = Array.isArray(event.category) ? event.category : [event.category];
        if (!eventCats.includes(filterCategory)) return;
      }

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
    // 過濾掉完全沒有事件的季度，避免版面太空 (可選)
    return Object.values(groups).filter(g => 
      g.nationalEvents.length > 0 || g.mainCityEvents.length > 0 || g.compareEvents.length > 0
    ).sort((a, b) => {
       if (a.year !== b.year) return a.year - b.year;
       return a.quarter.localeCompare(b.quarter);
    });
  }, [data, startPeriod, endPeriod, citiesOrder, filterCategory]); // 加入 filterCategory 依賴

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
          group/card relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
          ${isOpen 
            ? "bg-white shadow-lg ring-1 ring-black/5 z-10" 
            : "bg-white/80 hover:bg-white border-transparent hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5"
          }
        `}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cityColor }}></div>

        <div className="p-4 pl-5">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className={`text-sm font-bold leading-snug transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700 group-hover/card:text-slate-900'}`}>
              {event.title}
            </h3>
            {!isMain && !isNational && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {event.cityName}
              </span>
            )}
          </div>
          
          {event.category && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                 event.category.includes('政策') 
                   ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                   : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {Array.isArray(event.category) ? event.category[0] : event.category}
              </span>
            </div>
          )}

          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
             <div className="overflow-hidden">
                <div 
                  className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 mt-2"
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
      
      {/* 1. 表頭 + 現代化篩選 Tabs */}
      <div className="sticky top-0 z-40 pt-6 pb-4 -mx-4 px-4 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">
        
        {/* Filter Bar - Modern Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
           {allCategories.map(cat => (
             <button
               key={cat}
               onClick={() => setFilterCategory(cat)}
               className={`
                 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 border
                 ${filterCategory === cat 
                   ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                   : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                 }
               `}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className={`
          hidden md:grid gap-6 text-xs font-bold uppercase tracking-wider text-slate-500
          ${gridClass}
        `}>
          {/* 左欄標題 */}
          <div className="flex items-center gap-2 pl-1 border-b-2 border-slate-100 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            全國焦點
          </div>
          
          {/* 中欄標題 */}
          <div className="flex items-center justify-center border-b-2 border-slate-100 pb-2 text-slate-300 font-black">
            TIMELINE
          </div>
          
          {/* 右側標題區 (巢狀 Grid) */}
          <div className={`grid ${hasCompare ? 'grid-cols-2 gap-3' : ''} border-b-2 border-slate-100 pb-2`}>
            {!isNationOnly && (
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: citiesOrder[0] === 'nation' ? '#333333' : getCityColor(citiesOrder[0]) }}></span>
                {mainCityName} 
              </div>
            )}
            {hasCompare && (
              <div className="flex items-center gap-2 text-slate-500 pl-4 border-l border-slate-200 border-dashed">
                {citiesOrder.slice(1).map(id => (
                  <div key={id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCityColor(id) }}></span>
                    {getCityName(id)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. 內容 */}
      <div className="relative mt-4 pb-32">
        <div className="space-y-8">
          {groupedData.map((group, index) => (
            <div 
              key={`${group.year}_${group.quarter}`} 
              className={`
                relative md:grid gap-6 group/row
                ${gridClass}
              `}
            >
              
              {/* 左：全國 */}
              <div className="flex flex-col gap-3">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* 中：時間 */}
              <div className="relative flex justify-center h-full pt-1">
                {/* 垂直的軸線 */}
                <div 
                  className="absolute w-px bg-slate-200 hidden md:block"
                  style={{
                    top: index === 0 ? '0' : '-2rem',
                    bottom: '0',
                    left: '50%'
                  }}
                />
                
                <div className="sticky top-32 z-20 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-400 block -mb-0.5">{group.year}</span>
                  <span className="text-xs font-black text-slate-700">{group.quarter}</span>
                </div>
              </div>

              {/* 右：主城市與比較城市 (巢狀 Grid) */}
              <div className={`grid ${hasCompare ? 'grid-cols-2 gap-6' : ''}`}>
                {/* 主城市 (僅在非全國模式下顯示) */}
                {!isNationOnly && (
                  <div className="flex flex-col gap-3">
                    {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
                  </div>
                )}

                {/* 比較城市 (僅在有比較時顯示) */}
                {hasCompare && (
                  <div className="flex flex-col gap-3 relative">
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