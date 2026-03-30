"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { getQuarterValue } from "@/utils/eventHelper";
import { NATIONAL_CONFIG, getCityColor } from "@/config/cityColors";
import { Pin, GitCompare, Info, X, ChevronRight } from "lucide-react";
import Modal from "@/components/Modal";

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
  citiesOrder: string[]; // [mainCityId, ...compareCitiesIds]
  quarterWidth?: string; // 保留選配屬性
}

// --- SUB-COMPONENTS ---

const EventCard = ({ event, isMain, onClick }: { event: EventItem, isMain: boolean, onClick: () => void }) => {
  const cityColor = event.isNational ? NATIONAL_CONFIG.color : (event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color);
  const isPolicy = event.category === '政策';
  
  const categoryStyle = isPolicy 
    ? 'bg-rose-50 text-rose-600 border-rose-100' 
    : 'bg-emerald-50 text-emerald-600 border-emerald-100';

  return (
    <div 
      onClick={onClick}
      className={`w-full group/card relative rounded-xl border transition-all duration-300 bg-white shadow-sm hover:shadow-md border-slate-200 hover:border-[#FFD152] overflow-hidden cursor-pointer active:scale-[0.99]`}
    >
      {/* 側邊色條 */}
      <div className={`absolute top-0 bottom-0 w-1 ${isMain ? 'left-0' : 'right-0'}`} style={{ backgroundColor: cityColor }}></div>
      
      <div className="p-3">
        <div className={`flex items-start justify-between gap-2 mb-1.5 ${isMain ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex flex-col ${isMain ? 'items-start' : 'items-end'}`}>
            <span className="text-[10px] font-black tracking-wider uppercase mb-0.5" style={{ color: cityColor }}>
              {event.cityName || '全國'}
            </span>
            <p className={`font-bold text-sm text-slate-800 leading-snug ${isMain ? 'text-left' : 'text-right'}`}>{event.title}</p>
          </div>
          {event.category && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border ${categoryStyle} shrink-0`}>
              {event.category}
            </span>
          )}
        </div>
        
        {event.description && (
          <div 
            className={`text-xs text-slate-500 leading-relaxed font-medium ${isMain ? 'text-left' : 'text-right'}`}
            dangerouslySetInnerHTML={{ __html: event.description }} 
          />
        )}
        
        {/* 點擊提示 */}
        <div className={`mt-2.5 flex items-center gap-0.5 text-[10px] font-bold text-slate-300 group-hover/card:text-[#FFD152] transition-colors duration-300 ${isMain ? 'justify-start' : 'justify-end'}`}>
          <span>點擊查看詳情</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function EventList({ data, startPeriod, endPeriod, citiesOrder }: EventListProps) {
  const scrollRefMain = useRef<HTMLDivElement>(null);
  const scrollRefCompare = useRef<HTMLDivElement>(null);
  
  // 追蹤當前被點擊的事件，若有值則顯示彈窗
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const mainCityId = citiesOrder[0];
  const compareCityIds = citiesOrder.slice(1);

  // 1. 分類事件：主要 vs 比較
  const sortedData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    const main: Record<number, EventItem[]> = {};
    const compare: Record<number, EventItem[]> = {};

    data.forEach(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      if (eventTimeVal < startVal || eventTimeVal > endVal) return;

      // 判斷該事件歸屬：如果是主要城市的事件，或全國事件且全國被選為主要
      const isMainEvent = (event.city === mainCityId) || (event.isNational && mainCityId === 'nation');
      // 判斷是否屬於對照組：如果是對照城市的事件，或全國事件且全國被選為對照
      const isCompareEvent = (compareCityIds.includes(event.city || '')) || (event.isNational && compareCityIds.includes('nation'));

      if (isMainEvent) {
        if (!main[event.year]) main[event.year] = [];
        main[event.year].push(event);
      }
      
      if (isCompareEvent) {
        if (!compare[event.year]) compare[event.year] = [];
        compare[event.year].push(event);
      }
    });

    const formatGroup = (group: Record<number, EventItem[]>) => {
      return Object.entries(group)
        .map(([year, events]) => ({
          year: Number(year),
          events: events.sort((a, b) => a.quarter.localeCompare(b.quarter))
        }))
        .sort((a, b) => a.year - b.year);
    };

    return {
      mainGroups: formatGroup(main),
      compareGroups: formatGroup(compare)
    };
  }, [data, startPeriod, endPeriod, mainCityId, compareCityIds]);

  // 當資料更新時回到頂端
  useEffect(() => {
    if (scrollRefMain.current) scrollRefMain.current.scrollTop = 0;
    if (scrollRefCompare.current) scrollRefCompare.current.scrollTop = 0;
  }, [data]);

  return (
    <div className="w-full h-full flex bg-slate-50 relative divide-x divide-slate-200 animate-in fade-in slide-in-from-left-8 delay-200 duration-700">
      
      {/* 1. 左側：主要觀察 (Primary) */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Pin size={18} className="fill-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wider">主要觀察</h2>
              <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Primary View</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            {mainCityId === 'nation' ? '全國均價' : (data.find(e => e.city === mainCityId)?.cityName || '已選取')}
          </span>
        </div>

        <div ref={scrollRefMain} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 scroll-smooth">
          {sortedData.mainGroups.length > 0 ? sortedData.mainGroups.map(group => (
            <div key={group.year} className="relative">
              <div className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 py-2 mb-4 border-b border-slate-200">
                <span className="text-lg font-black text-slate-400 tracking-widest">{group.year}</span>
              </div>
              <div className="space-y-4">
                {group.events.map((ev, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-xs font-bold text-slate-400 w-8 pt-4 shrink-0">{ev.quarter}</span>
                    <EventCard event={ev} isMain={true} onClick={() => setSelectedEvent(ev)} />
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
              <Info size={40} strokeWidth={1} />
              <p className="text-sm font-bold">此區間尚無重大事件紀錄</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. 右側：對照比較 (Comparison) */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD152] p-1.5 rounded-lg shadow-sm shadow-[#FFD152]/30">
              <GitCompare size={18} className="text-slate-800" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 tracking-wider">對照比較</h2>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Comparison</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {compareCityIds.length > 0 ? compareCityIds.map(id => (
              <span key={id} className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: id === 'nation' ? NATIONAL_CONFIG.color : getCityColor(id) }}></span>
            )) : <span className="text-[10px] font-bold text-slate-400 italic">尚未加入對照</span>}
          </div>
        </div>

        <div ref={scrollRefCompare} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 scroll-smooth bg-white/30">
          {sortedData.compareGroups.length > 0 ? sortedData.compareGroups.map(group => (
            <div key={group.year} className="relative">
              <div className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 py-2 mb-4 border-b border-slate-200 text-right">
                <span className="text-lg font-black text-slate-400 tracking-widest">{group.year}</span>
              </div>
              <div className="space-y-4">
                {group.events.map((ev, i) => (
                  <div key={i} className="flex flex-row-reverse gap-4">
                    <span className="text-xs font-bold text-slate-400 w-8 pt-4 shrink-0 text-right">{ev.quarter}</span>
                    <EventCard event={ev} isMain={false} onClick={() => setSelectedEvent(ev)} />
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
              <GitCompare size={40} strokeWidth={1} />
              <p className="text-sm font-bold">點擊左側城市的「比」來加入對照事件</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. 事件詳情彈窗 (Modal) */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        zIndex={9000}
        className="max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {selectedEvent && (
          <>
            {/* 彈窗 Header */}
            <div 
              className="px-6 py-5 flex items-start justify-between border-b border-slate-100"
              style={{ 
                backgroundColor: selectedEvent.isNational ? NATIONAL_CONFIG.color + '10' : (selectedEvent.city ? getCityColor(selectedEvent.city) + '10' : NATIONAL_CONFIG.color + '10'),
                borderTopWidth: '4px',
                borderTopColor: selectedEvent.isNational ? NATIONAL_CONFIG.color : (selectedEvent.city ? getCityColor(selectedEvent.city) : NATIONAL_CONFIG.color)
              }}
            >
              <div className="flex flex-col gap-1.5 pr-4">
                <span className="text-xs font-black tracking-widest uppercase opacity-80" style={{ color: selectedEvent.isNational ? NATIONAL_CONFIG.color : (selectedEvent.city ? getCityColor(selectedEvent.city) : NATIONAL_CONFIG.color) }}>
                  {selectedEvent.cityName || '全國'} • {selectedEvent.year} {selectedEvent.quarter}
                </span>
                <h3 className="font-black text-xl text-slate-800 leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors shrink-0 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 彈窗 Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
               {selectedEvent.category && (
                  <div className="mb-5">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-black border inline-block ${selectedEvent.category === '政策' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {selectedEvent.category}
                    </span>
                  </div>
                )}
              <div 
                className="text-base text-slate-600 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: selectedEvent.description || '暫無詳細說明' }} 
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
