"use client";

import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG } from "@/config/cityColors"; 
import { 
  ScrollText, 
  History, 
  Compass, 
  Layers, 
  X, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const QUARTER_OPTIONS = generateQuarterOptions();

interface SidebarProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  startPeriod: string;
  setStartPeriod: (v: string) => void;
  endPeriod: string;
  setEndPeriod: (v: string) => void;
  mainCity: string;
  handleMainCityChange: (cityId: string) => void;
  compareCities: string[];
  toggleCompare: (cityId: string) => void;
  handleCancelCompare: () => void;
}

export default function DashboardSidebar({
  isSettingsOpen,
  setIsSettingsOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  startPeriod,
  setStartPeriod,
  endPeriod,
  setEndPeriod,
  mainCity,
  handleMainCityChange,
  compareCities,
  toggleCompare,
  handleCancelCompare,
}: SidebarProps) {

  const handleCompareSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && val !== "default") {
      toggleCompare(val);
      e.target.value = "default";
    }
  };

  const expandSidebar = () => {
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
  };

  return (
    <>
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Floating Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 pointer-events-none md:pointer-events-auto
        flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) h-full
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarCollapsed ? "w-24" : "w-80"} 
        p-4 relative
      `}>
        
        {/* Toggle Button - Moved OUTSIDE the overflow-hidden aside */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute -right-0 top-10 w-8 h-8 bg-white border border-blue-100 rounded-full items-center justify-center text-blue-400 hover:text-blue-600 hover:scale-110 hover:shadow-lg z-[60] transition-all duration-200 cursor-pointer pointer-events-auto"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* The actual "Card" */}
        <aside className={`
          pointer-events-auto h-full w-full
          bg-white/60 backdrop-blur-xl
          rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]
          border border-white/50
          flex flex-col overflow-hidden relative
          transition-all duration-300
        `}>

          {/* Header Area */}
          <div 
            onClick={expandSidebar}
            className={`
              flex items-center shrink-0 relative overflow-hidden group transition-all duration-300
              ${isSidebarCollapsed ? "p-4 pt-6 justify-center cursor-pointer hover:bg-white/40" : "p-6 justify-between"}
            `}
          >
            <div className={`relative z-10 flex items-center gap-3 w-full transition-all duration-500 ${isSidebarCollapsed ? "flex-col gap-1" : ""}`}>
               <div className={`
                 p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/20 shrink-0 flex items-center justify-center text-white
                 transition-transform duration-300 group-hover:scale-105
               `}>
                 <ScrollText className="w-5 h-5" />
               </div>
               
               <div className={`transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 flex-1"}`}>
                 <h1 className="font-bold text-lg text-neutral-800 tracking-tight leading-none">不動產大事紀</h1>
                 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Market Intelligence</p>
               </div>
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="md:hidden text-neutral-400 hover:text-neutral-600 transition-colors absolute right-4 top-6">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className={`
            flex-1 overflow-y-auto custom-scrollbar space-y-6 overflow-x-hidden
            ${isSidebarCollapsed ? "px-2 py-4 flex flex-col items-center" : "px-5 py-2"}
          `}>

            {/* Section: Time Range */}
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-10" : "w-full"}`}>
              {isSidebarCollapsed ? (
                <div 
                  onClick={expandSidebar}
                  className="w-10 h-10 rounded-xl bg-white/50 border border-white flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:shadow-sm cursor-pointer transition-all" 
                  title="時間範圍"
                >
                  <History className="w-5 h-5" />
                </div>
              ) : (
                <div className="bg-white/40 rounded-2xl p-4 border border-white/60 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <History className="w-3.5 h-3.5" />
                    </div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      時間範圍
                    </label>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-300 uppercase">FROM</span>
                      <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-white/50 border border-blue-100/50 text-neutral-700 text-sm font-bold pl-10 pr-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all appearance-none cursor-pointer hover:bg-white">
                        {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                      </select>
                    </div>
                    
                    <div className="flex justify-center -my-2 z-10 opacity-50">
                      <div className="bg-white p-0.5 rounded-full border border-neutral-100 shadow-sm">
                        <ArrowRight className="w-2.5 h-2.5 rotate-90 text-neutral-300" />
                      </div>
                    </div>

                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-300 uppercase">TO</span>
                      <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-white/50 border border-blue-100/50 text-neutral-700 text-sm font-bold pl-10 pr-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all appearance-none cursor-pointer hover:bg-white">
                        {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Main City */}
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-10" : "w-full"}`}>
               {isSidebarCollapsed ? (
                <div 
                  onClick={expandSidebar}
                  className="w-10 h-10 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:shadow-sm cursor-pointer transition-all" 
                  title="主要城市"
                >
                  <Compass className="w-5 h-5" />
                </div>
               ) : (
                 <div className="bg-white/40 rounded-3xl p-4 border border-white/60 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      主要檢視
                    </label>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => handleMainCityChange("nation")}
                      className={`
                        w-full p-3 text-sm font-medium transition-all duration-300 flex items-center justify-between rounded-full border relative overflow-hidden group
                        ${mainCity === "nation" 
                          ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 border-transparent text-white shadow-md shadow-neutral-500/20' 
                          : 'bg-white/60 border-transparent text-neutral-500 hover:bg-white hover:shadow-sm hover:text-neutral-700'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3 relative z-10">
                         {mainCity === "nation" && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                         全國平均
                      </span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {CITIES_CONFIG.map((c) => (
                        <button 
                          key={c.id} 
                          onClick={() => handleMainCityChange(c.id)} 
                          className={`
                            p-2.5 text-xs font-bold transition-all duration-300 rounded-full border flex items-center gap-2 relative overflow-hidden
                            ${mainCity === c.id 
                              ? 'bg-blue-600 border-transparent text-white shadow-md shadow-blue-600/20' 
                              : 'bg-white/60 border-transparent text-neutral-500 hover:bg-white hover:shadow-sm hover:text-neutral-800'
                            }
                          `}
                        >
                          {mainCity === c.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in duration-300"></div>}
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                 </div>
               )}
            </div>

            {/* Section: Compare */}
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-10" : "w-full"}`}>
              {isSidebarCollapsed ? (
                <div 
                  onClick={expandSidebar}
                  className="w-10 h-10 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:shadow-sm cursor-pointer transition-all" 
                  title="加入對照"
                >
                  <Layers className="w-5 h-5" />
                </div>
              ) : (
                <div className="bg-white/40 rounded-3xl p-4 border border-white/60 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
                         <Layers className="w-3.5 h-3.5" />
                       </div>
                       <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                         對照城市
                       </label>
                     </div>
                     {compareCities.length > 0 && (
                       <button onClick={handleCancelCompare} className="text-[10px] px-2 py-0.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-bold">
                         清除
                       </button>
                     )}
                  </div>
                  
                  <div className="relative mb-3 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Plus className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <select 
                      onChange={handleCompareSelect}
                      defaultValue="default"
                      disabled={compareCities.length >= 3}
                      className="w-full bg-white/50 border border-blue-100/50 text-neutral-600 text-xs font-bold pl-9 pr-2 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all appearance-none cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="default" disabled>
                        {compareCities.length >= 3 ? "已達上限 (3個)" : "點擊新增..."}
                      </option>
                      {CITIES_CONFIG.filter(c => c.id !== mainCity && !compareCities.includes(c.id)).map(c => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-2">
                     {compareCities.length === 0 && (
                       <div className="w-full text-center py-2 border border-dashed border-neutral-200 rounded-lg">
                         <span className="text-[10px] text-neutral-300 italic">尚未選擇對照城市</span>
                       </div>
                     )}
                     
                     {compareCities.map(cityId => {
                       const cityConfig = CITIES_CONFIG.find(c => c.id === cityId);
                       if (!cityConfig) return null;
                       
                       return (
                         <div key={cityId} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-100 shadow-sm text-xs font-bold text-neutral-700 group animate-in fade-in zoom-in duration-200 hover:shadow-md transition-all">
                           <span className="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: cityConfig.color }}></span>
                           {cityConfig.label}
                           <button 
                             onClick={() => toggleCompare(cityId)}
                             className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-500 transition-colors"
                           >
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       );
                     })}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Info */}
          <div className={`
            bg-white/30 backdrop-blur-md text-[10px] text-neutral-400 border-t border-white/50 text-center transition-all duration-300
            ${isSidebarCollapsed ? "p-2 opacity-0 h-0 overflow-hidden" : "p-4 opacity-100"}
          `}>
            資料來源：政大不動產研究中心、永慶房產集團
          </div>

        </aside>
      </div>
    </>
  );
}