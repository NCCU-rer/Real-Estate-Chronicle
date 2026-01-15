"use client";

import { useState, useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";
import { Activity, ArrowRight } from "lucide-react";

interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { 
  data: EventItem[]; 
  startPeriod: string; 
  endPeriod: string; 
  quarterWidth: number; 
  citiesOrder: string[]; 
  mainCityName?: string;
  onAnalyze: (event: EventItem) => void;
}
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName, onAnalyze }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("全部");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const hasCompare = citiesOrder.length > 1;
  const isNationOnly = citiesOrder[0] === 'nation' && !hasCompare;
  const gridClass = "grid-cols-[1fr_80px_1fr]";

  const allCategories = useMemo(() => {
    const cats = new Set<string>(["全部"]);
    data.forEach(item => {
      if (item.category) {
        if (Array.isArray(item.category)) {
          item.category.forEach(c => cats.add(c));
        } else {
          cats.add(item.category);
        }
      }
    });
    return Array.from(cats);
  }, [data]);

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
    return Object.values(groups).filter(g => 
      g.nationalEvents.length > 0 || g.mainCityEvents.length > 0 || g.compareEvents.length > 0
    ).sort((a, b) => {
       if (a.year !== b.year) return a.year - b.year;
       return a.quarter.localeCompare(b.quarter);
    });
  }, [data, startPeriod, endPeriod, citiesOrder, filterCategory]);

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
          group/card relative rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden
          ${isOpen 
            ? "bg-white/90 shadow-xl border-white/60 ring-1 ring-blue-100 z-10 scale-[1.01] backdrop-blur-xl" 
            : "bg-white/60 backdrop-blur-md border-white/40 hover:bg-white/80 hover:border-white/60 hover:shadow-lg hover:-translate-y-1"
          }
        `}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: cityColor }}></div>

        <div className="p-5 pl-7">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div>
               <div className="flex items-center gap-2 mb-1.5">
                  {event.category && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-white/50 text-neutral-500 border border-neutral-100/50">
                      {Array.isArray(event.category) ? event.category[0] : event.category}
                    </span>
                  )}
                  {!isMain && !isNational && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50/50 text-blue-600 border border-blue-100/50">
                      {event.cityName}
                    </span>
                  )}
               </div>
               <h3 className={`text-sm font-bold leading-snug transition-colors ${isOpen ? 'text-neutral-900' : 'text-neutral-700 group-hover/card:text-neutral-900'}`}>
                 {event.title}
               </h3>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100/50">
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 font-medium">
                   {event.year} {event.quarter}
                </span>
             </div>
             
             {isOpen && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAnalyze(event); }}
                className="text-[10px] flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
              >
                <Activity className="w-3.5 h-3.5" />
                查看期間房價
              </button>
            )}
          </div>

          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
             <div className="overflow-hidden">
                <div className="pt-4">
                   <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100/50">
                      <div 
                        className="text-xs text-neutral-600 leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{ __html: event.description || "" }} 
                      />
                   </div>
                </div>
             </div>
          </div>
          
          {!isOpen && (
            <div className="flex justify-center mt-2 group-hover:translate-y-0.5 transition-transform duration-300">
               <ArrowRight className="w-4 h-4 text-neutral-300 rotate-90" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
      
      {/* Sticky Header - Floating Pill Style */}
      <div className="sticky top-4 z-40 mb-8">
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-900/5 rounded-[32px] p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
             {allCategories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setFilterCategory(cat)}
                 className={`
                   text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 border
                   ${filterCategory === cat 
                     ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-600/20 scale-105" 
                     : "bg-white/60 text-neutral-500 border-transparent hover:bg-white hover:text-neutral-800 hover:shadow-sm"
                   }
                 `}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className={`
            hidden md:grid gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400
            ${gridClass}
          `}>
            <div className="flex items-center gap-3 pl-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              全國焦點
            </div>
            
            <div className="flex items-center justify-center text-blue-300">
              TIMELINE
            </div>
            
            <div className={`grid ${hasCompare ? 'grid-cols-2 gap-3' : ''}`}>
              {!isNationOnly && (
                <div className="flex items-center gap-3 font-black text-neutral-700">
                  <span className="w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm" style={{ backgroundColor: citiesOrder[0] === 'nation' ? '#525252' : getCityColor(citiesOrder[0]) }}></span>
                  {mainCityName} 
                </div>
              )}
              {hasCompare && (
                <div className="flex items-center gap-3 text-neutral-500 pl-4 border-l border-neutral-200/50 border-dashed">
                  {citiesOrder.slice(1).map(id => (
                    <div key={id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: getCityColor(id) }}></span>
                      {getCityName(id)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
              
              <div className="flex flex-col gap-3">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              <div className="relative flex justify-center h-full pt-1">
                <div 
                  className="absolute w-px bg-neutral-300/30 hidden md:block"
                  style={{
                    top: index === 0 ? '0' : '-2rem',
                    bottom: '0',
                    left: '50%'
                  }}
                />
                
                <div className="sticky top-32 z-20 flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-md text-center">
                  <span className="text-[10px] font-bold text-neutral-400 block -mb-0.5">{group.year}</span>
                  <span className="text-xs font-black text-neutral-700">{group.quarter}</span>
                </div>
              </div>

              <div className={`grid ${hasCompare ? 'grid-cols-2 gap-6' : ''}`}>
                {!isNationOnly && (
                  <div className="flex flex-col gap-3">
                    {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
                  </div>
                )}

                {hasCompare && (
                  <div className="flex flex-col gap-3 relative">
                    <div className="absolute inset-y-0 -left-3 w-px border-l border-dashed border-neutral-300/30 hidden md:block"></div>
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