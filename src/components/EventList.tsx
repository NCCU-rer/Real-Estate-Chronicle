"use client";

import { useMemo } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";
import { Landmark } from "lucide-react";

// --- TYPE DEFINITIONS ---
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
  citiesOrder: string[];
  mainCityName?: string;
}

// --- SUB-COMPONENTS ---

const EventCard = ({ event }: { event: EventItem }) => {
  const cityColor = event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color;
  const categoryStyle = event.category === '政策' 
    ? 'bg-rose-100 text-rose-700 border-rose-200' 
    : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  // Add margin-left for city events to make space for the vertical name
  const cardMargin = !event.isNational ? "ml-6" : "";

  return (
    <div className={`w-full group/card relative rounded-lg border transition-all duration-200 bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:scale-[1.02] hover:z-10 ${cardMargin}`}>
      {/* Vertical City Name for non-national events */}
      {!event.isNational && (
        <div 
          className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-bottom-left"
          style={{ color: cityColor }}
        >
          <span className="text-xs font-bold whitespace-nowrap tracking-wider">
            {event.cityName}
          </span>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="font-bold text-sm text-slate-800 leading-tight">{event.title}</p>
          {event.category && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap border ${categoryStyle}`}>
              {event.category}
            </span>
          )}
        </div>
        {event.description && (
          <div 
            className="text-xs text-slate-600 leading-relaxed font-medium prose-p:my-1 prose-ul:my-1"
            dangerouslySetInnerHTML={{ __html: event.description }} 
          />
        )}
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function EventList({ data, startPeriod, endPeriod, citiesOrder, mainCityName }: EventListProps) {
  const hasCompare = citiesOrder.length > 1;

  // 1. Separate and group national events by year
  const nationalEventsByYear = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    const groups: Record<number, EventItem[]> = {};

    data.forEach(event => {
      if (!event.isNational) return;
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      if (eventTimeVal >= startVal && eventTimeVal <= endVal) {
        if (!groups[event.year]) {
          groups[event.year] = [];
        }
        groups[event.year].push(event);
      }
    });

    return Object.entries(groups)
      .map(([year, events]) => ({
        year: Number(year),
        events: events.sort((a,b) => a.quarter.localeCompare(b.quarter)),
      }))
      .sort((a, b) => a.year - b.year);
  }, [data, startPeriod, endPeriod]);


  // 2. Group city events by year and quarter
  const cityEventsByYear = useMemo(() => {
    const mainCityId = citiesOrder[0];
    const yearGroups: Record<number, Record<string, EventItem[]>> = {};
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);

    data.forEach(event => {
      if (event.isNational) return;
      
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      if (eventTimeVal < startVal || eventTimeVal > endVal) return;

      if (!yearGroups[event.year]) {
        yearGroups[event.year] = {};
      }
      if (!yearGroups[event.year][event.quarter]) {
        yearGroups[event.year][event.quarter] = [];
      }
      yearGroups[event.year][event.quarter].push(event);
    });

    return Object.entries(yearGroups)
      .map(([year, quarters]) => ({
        year: Number(year),
        quarters: Object.entries(quarters)
          .map(([quarter, events]) => {
            events.sort((a, b) => {
              if (a.city === mainCityId && b.city !== mainCityId) return -1;
              if (a.city !== mainCityId && b.city === mainCityId) return 1;
              const indexA = a.city ? citiesOrder.indexOf(a.city) : 999;
              const indexB = b.city ? citiesOrder.indexOf(b.city) : 999;
              return indexA - indexB;
            });
            return { quarter, events };
          })
          .sort((a, b) => a.quarter.localeCompare(b.quarter)),
      }))
      .sort((a, b) => a.year - b.year);
  }, [data, startPeriod, endPeriod, citiesOrder]);



  return (
    <div className="w-full h-full flex gap-x-12 px-8 bg-slate-100 relative isolate">

      {/* --- LEFT COLUMN: National Timeline --- */}
      <aside className="w-72 shrink-0 h-full sticky top-0 py-6">
        <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
              <Landmark className="text-slate-400" size={20}/>
              全國事件
            </h2>
        </div>
        <div className="h-[calc(100%-68px)] overflow-y-auto custom-scrollbar pr-4">
          <div className="relative pl-6">
            {/* The vertical line */}
            <div className="absolute left-[29px] top-3 bottom-3 w-0.5 bg-slate-200 rounded-full"></div>
            
            {nationalEventsByYear.map(yearGroup => (
              <div key={yearGroup.year} className="relative mb-6">
                <div className="flex items-center gap-4 sticky top-0 bg-slate-100 py-1 z-10">
                   <div className="z-10 w-4 h-4 rounded-full bg-slate-400 ring-4 ring-slate-100"></div>
                   <h3 className="font-bold text-slate-600 text-lg">{yearGroup.year}</h3>
                </div>
                <div className="pt-2 pl-2 space-y-4">
                  {yearGroup.events.map((event, idx) => (
                    <div key={idx} className="relative">
                       <div className="absolute left-[5px] top-4 w-2 h-2 rounded-full bg-slate-300 ring-2 ring-slate-100"></div>
                       <div className="pl-8">
                         <EventCard event={event} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* --- RIGHT COLUMN: City Timelines --- */}
      <main className="flex-1 min-w-0 py-6 flex flex-col">
         <div className="text-center mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-800">城市事件</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mr-4 pr-8">
            <div className="relative pl-3">
                {/* The vertical line */}
                <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-200 rounded-full"></div>

                {cityEventsByYear.map((yearGroup) => (
                <div key={yearGroup.year} className="relative mb-8">
                    {/* Year Marker */}
                    <div className="flex items-center gap-4 sticky top-0 bg-slate-100 py-2 z-10">
                        <div className="z-10 w-4 h-4 rounded-full bg-slate-400 ring-4 ring-slate-100"></div>
                        <h3 className="font-bold text-slate-600 text-xl">{yearGroup.year}</h3>
                    </div>

                    {/* Quarters */}
                    <div className="pt-2 pl-10 space-y-6">
                    {yearGroup.quarters.map((qGroup) => (
                        <div key={qGroup.quarter} className="relative">
                            {/* Quarter Marker */}
                            <div className="absolute -left-5 top-5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-slate-100"></div>
                            <div className="flex gap-4 items-start">
                               <p className="text-sm font-bold text-slate-500 w-8 text-right">{qGroup.quarter}</p>
                               <div className="flex-1 space-y-3">
                                {qGroup.events.length > 0 
                                    ? qGroup.events.map((event, idx) => ( <EventCard key={idx} event={event} /> ))
                                    : ( <div className="h-10"></div> )
                                }
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}