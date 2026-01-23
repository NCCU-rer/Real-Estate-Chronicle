"use client";

import { useMemo, useRef } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }
interface EventListProps { data: EventItem[]; startPeriod: string; endPeriod: string; quarterWidth: number; citiesOrder: string[]; mainCityName?: string; }
interface GroupedQuarter { year: number; quarter: string; nationalEvents: EventItem[]; mainCityEvents: EventItem[]; compareEvents: EventItem[]; }

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasCompare = citiesOrder.length > 1;

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
    const cityColor = event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color;

    return (
      <div 
        key={uniqueId}
        className={`w-full group/card relative rounded-xl border transition-all duration-300 overflow-hidden bg-white/80 hover:bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md`}
        style={{ borderLeft: `4px solid ${cityColor}` }}
      >
        <div className="p-2.5">
          {event.category && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
                 event.category === '政策' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {event.category}
              </span>
            </div>
          )}
          {event.description && (
            <div className="overflow-hidden">
              <div 
                className="text-xs text-slate-600 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: event.description || "" }} 
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const cityEventsTitle = hasCompare ? `${mainCityName} / ${citiesOrder.slice(1).map(getCityName).join(' / ')}` : mainCityName;

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 relative">
      {/* Arrow Buttons */}
       <button 
           onClick={() => handleScroll('left')}
           className="absolute top-1/2 left-2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-md border border-slate-100 text-slate-600 hover:text-slate-900 transition-all"
       >
           <ChevronLeft size={20} />
       </button>
       <button 
           onClick={() => handleScroll('right')}
           className="absolute top-1/2 right-2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-md border border-slate-100 text-slate-600 hover:text-slate-900 transition-all"
       >
           <ChevronRight size={20} />
       </button>

      {/* Main Content */}
      <div 
        ref={scrollRef}
        className="w-full h-full flex-1 overflow-auto custom-scrollbar"
      >
        <div className="flex flex-nowrap relative px-4">
            {groupedData.map((group) => (
                <div key={`${group.year}_${group.quarter}`} className="relative flex-shrink-0 w-80 px-4">
                   {/* Timeline Marker */}
                   <div className="flex items-center gap-4 my-4">
                       <div className="flex-1 h-px bg-slate-300"></div>
                       <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-14 rounded-lg bg-white/50 border border-slate-200 shadow-sm text-center">
                         <span className="text-sm font-extrabold text-slate-500 block">{group.year}</span>
                         <span className="text-lg font-black text-slate-800">{group.quarter}</span>
                       </div>
                       <div className="flex-1 h-px bg-slate-300"></div>
                   </div>

                   {/* Event Cards Container */}
                   <div className="space-y-4">
                        {/* Top section for National Events */}
                        <div className="space-y-3">
                            <h3 className="text-center font-bold text-slate-500">全國</h3>
                            {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
                        </div>
                       
                       <hr className="border-slate-300/70 border-dashed"/>

                        {/* Bottom section for City Events */}
                        <div className="space-y-3">
                           <h3 className="text-center font-bold text-slate-500">{cityEventsTitle}</h3>
                           {group.mainCityEvents.map((event, idx) => renderEventCard(event, idx, 'main'))}
                           {group.compareEvents.map((event, idx) => renderEventCard(event, idx, 'comp'))}
                        </div>
                   </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}