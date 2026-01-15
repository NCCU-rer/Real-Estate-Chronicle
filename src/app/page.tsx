"use client";

import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import EventList from "@/components/EventList";
import InfoTooltip from '@/components/InfoTooltip'; 
import ImpactModal from '@/components/ImpactModal';
import { rawData } from "@/data/sourceData";
import { processEvents, getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, getCityName } from "@/config/cityColors";

interface EventItem { year: number; quarter: string; title: string; description?: string; city?: string; cityName?: string; category?: string; isNational?: boolean; }

export default function Home() {
  const [startPeriod, setStartPeriod] = useState("2013_Q1");
  const [endPeriod, setEndPeriod] = useState("2025_Q4");
  const [mainCity, setMainCity] = useState("taipei");
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [analyzingEvent, setAnalyzeEvent] = useState<EventItem | null>(null);

  const handleMainCityChange = (cityId: string) => {
    setMainCity(cityId);
    setCompareCities(prev => prev.filter(c => c !== cityId));
  };
  
  const toggleCompare = (cityId: string) => {
    if (cityId === mainCity) return;
    setCompareCities(prev => {
      if (prev.includes(cityId)) return prev.filter(id => id !== cityId);
      if (prev.length >= 3) return prev;
      return [...prev, cityId];
    });
  };

  const handleCancelCompare = () => {
    setCompareCities([]);
  };

  const getDisplayName = (id: string) => {
    if (id === "nation") return "全國";
    return getCityName(id);
  };
  
  const getDisplayColor = (id: string) => {
    if (id === "nation") return "#525252"; // neutral-600
    const city = CITIES_CONFIG.find(c => c.id === id);
    return city ? city.color : "#525252";
  };

  const allEvents = useMemo(() => processEvents(Object.values(rawData).flat()), []);
  const chartCities = useMemo(() => [mainCity, ...compareCities], [mainCity, compareCities]);
  
  const currentViewEvents = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return allEvents.filter(event => {
      const eventTimeVal = getQuarterValue(`${event.year}_${event.quarter}`);
      const isTimeMatch = eventTimeVal >= startVal && eventTimeVal <= endVal;
      const isCityMatch = event.city === "oldLabel" || chartCities.includes(event.city);
      return isTimeMatch && isCityMatch;
    });
  }, [chartCities, startPeriod, endPeriod, allEvents]);

  return (
    <main className="h-full w-full flex bg-transparent font-sans relative">
      
      <DashboardSidebar 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        startPeriod={startPeriod}
        setStartPeriod={setStartPeriod}
        endPeriod={endPeriod}
        setEndPeriod={setEndPeriod}
        mainCity={mainCity}
        handleMainCityChange={handleMainCityChange}
        compareCities={compareCities}
        toggleCompare={toggleCompare}
        handleCancelCompare={handleCancelCompare}
      />

      <div className="flex-1 flex flex-col h-full relative p-4 pl-0">
        <header className="h-16 bg-white/60 backdrop-blur-xl border border-white/50 shrink-0 flex items-center justify-between px-6 z-30 sticky top-0 transition-all rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
           <div className="flex items-center gap-4 w-full">
             <button onClick={() => setIsSettingsOpen(true)} className="md:hidden p-2 text-neutral-500 hover:bg-white/60 rounded-full transition-colors">☰</button>
             
             <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2.5 shrink-0 bg-white/40 px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
                   <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: getDisplayColor(mainCity) }}></span>
                   <span className="text-sm font-bold text-neutral-900">{getDisplayName(mainCity)}</span>
                </div>

                {compareCities.length > 0 && (
                  <div className="h-4 w-px bg-neutral-300/30 mx-1 shrink-0"></div>
                )}

                <div className="flex items-center gap-3 shrink-0">
                   {compareCities.map(id => (
                      <div key={id} className="flex items-center gap-2.5 bg-white/30 px-3 py-1.5 rounded-full border border-white/40 group hover:bg-white/50 transition-all cursor-default">
                         <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">VS</span>
                         <span className="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: getDisplayColor(id) }}></span>
                         <span className="text-sm font-bold text-neutral-600">{getCityName(id)}</span>
                      </div>
                   ))}
                </div>
             </div>
           </div>
        </header>

        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-transparent scroll-smooth transition-all duration-300 pb-24 relative z-10 px-4`}>
           <div className="pt-8 max-w-5xl mx-auto min-h-full">
              <EventList 
                data={currentViewEvents} 
                startPeriod={startPeriod} 
                endPeriod={endPeriod} 
                quarterWidth={0} 
                citiesOrder={chartCities} 
                mainCityName={getDisplayName(mainCity)}
                onAnalyze={setAnalyzeEvent}
              />
           </div>
        </div>
      </div>

      <InfoTooltip />
      
      <ImpactModal 
        isOpen={!!analyzingEvent} 
        onClose={() => setAnalyzeEvent(null)} 
        event={analyzingEvent}
        mainCity={mainCity}
      />
    </main>
  );
}