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
  CircleDot,
  Circle,
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
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-60
        bg-white border-r border-slate-200 
        flex flex-col shadow-xl transition-all duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarCollapsed ? "w-20" : "w-72"} 
      `}>
        
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-500 hover:text-blue-600 hover:scale-110 z-50 transition-all shadow-md"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div 
          onClick={expandSidebar}
          className={`
            flex items-center shrink-0 relative overflow-hidden group transition-all duration-300
            ${isSidebarCollapsed ? "p-4 justify-center cursor-pointer hover:bg-slate-50" : "p-6 justify-between"}
          `}
        >
          <div className="relative z-10 flex items-center gap-3 w-full">
             <div className={`
               p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 shrink-0 flex items-center justify-center text-white
               ${isSidebarCollapsed ? "mx-auto" : ""}
             `}>
               <ScrollText className="w-5 h-5" />
             </div>
             
             <div className={`transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"}`}>
               <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">不動產大事紀</h1>
               <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Market Intelligence</p>
             </div>
          </div>
          
          <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="md:hidden text-slate-400 hover:text-slate-600 transition-colors absolute right-4 top-6">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`
          flex-1 overflow-y-auto custom-scrollbar space-y-8 overflow-x-hidden
          ${isSidebarCollapsed ? "px-2 py-6 flex flex-col items-center" : "p-6"}
        `}>

          {/* 1. 時間區間 */}
          <div className="relative group/section w-full">
            {isSidebarCollapsed ? (
              <div 
                onClick={expandSidebar}
                className="flex justify-center items-center w-10 h-10 mx-auto rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 cursor-pointer transition-all" 
                title="點擊展開設定時間"
              >
                <History className="w-5 h-5" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-blue-500" />
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    時間範圍
                  </label>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">起</span>
                    <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium pl-8 pr-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white">
                      {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-center -my-1 z-10">
                    <div className="bg-white p-0.5 rounded-full border border-slate-100 shadow-sm">
                      <ArrowRight className="w-3 h-3 rotate-90 text-slate-300" />
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">迄</span>
                    <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium pl-8 pr-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white">
                      {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`h-px bg-slate-100 w-full ${isSidebarCollapsed ? 'my-2' : ''}`} />

                    {/* 2. 主要城市 */}          <div className="relative group/section w-full">

                       {isSidebarCollapsed ? (

                        <div 

                          onClick={expandSidebar}

                          className="flex justify-center items-center w-10 h-10 mx-auto rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 cursor-pointer transition-all" 

                          title="點擊展開設定城市"

                        >

                          <Compass className="w-5 h-5" />

                        </div>

                       ) : (

                         <>

                          <div className="flex items-center gap-2 mb-4">

                            <Compass className="w-4 h-4 text-blue-500" />

                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">

                              主要檢視城市

                            </label>

                          </div>

                          <div className="space-y-1.5">

                            <button 

                              onClick={() => handleMainCityChange("nation")}

                              className={`

                                w-full p-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-between rounded-xl border

                                ${mainCity === "nation" 

                                  ? 'bg-slate-50 border-slate-900 text-slate-900 shadow-sm' 

                                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'

                                }

                              `}

                            >

                              <span className="flex items-center gap-3">

                                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${mainCity === "nation" ? "border-blue-600" : "border-slate-200"}`}>

                                    {mainCity === "nation" && <div className="w-2 h-2 rounded-full bg-blue-600 animate-in zoom-in duration-200"></div>}

                                 </div>

                                 全國平均

                              </span>

                            </button>

                            

                            <div className="grid grid-cols-2 gap-2">

                              {CITIES_CONFIG.map((c) => (

                                <button 

                                  key={c.id} 

                                  onClick={() => handleMainCityChange(c.id)} 

                                  className={`

                                    p-2.5 text-xs font-medium transition-all duration-200 rounded-xl border flex items-center gap-2.5

                                    ${mainCity === c.id 

                                      ? 'bg-slate-50 border-slate-900 text-slate-900 shadow-sm' 

                                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'

                                    }

                                  `}

                                >

                                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${mainCity === c.id ? "border-blue-600" : "border-slate-200"}`}>

                                    {mainCity === c.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-in zoom-in duration-200"></div>}

                                  </div>

                                  {c.label}

                                </button>

                              ))}

                            </div>

                          </div>

                         </>

                       )}

                    </div>

          <div className={`h-px bg-slate-100 w-full ${isSidebarCollapsed ? 'my-2' : ''}`} />

          {/* 3. 加入比對 */}
          <div className="relative group/section w-full">
            {isSidebarCollapsed ? (
              <div 
                onClick={expandSidebar}
                className="flex justify-center items-center w-10 h-10 mx-auto rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 cursor-pointer transition-all" 
                title="點擊展開設定比對"
              >
                <Layers className="w-5 h-5" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-2">
                     <Layers className="w-4 h-4 text-blue-500" />
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                       加入對照
                     </label>
                   </div>
                   {compareCities.length > 0 && (
                     <button onClick={handleCancelCompare} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors font-medium">
                       清除全部
                     </button>
                   )}
                </div>
                
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Plus className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    onChange={handleCompareSelect}
                    defaultValue="default"
                    disabled={compareCities.length >= 3}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium pl-9 pr-2 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="default" disabled>
                      {compareCities.length >= 3 ? "已達上限 (3個)" : "新增對照城市..."}
                    </option>
                    {CITIES_CONFIG.filter(c => c.id !== mainCity && !compareCities.includes(c.id)).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 min-h-7.5">
                   {compareCities.length === 0 && (
                     <span className="text-[10px] text-slate-300 italic pl-1">無對照項目</span>
                   )}
                   
                   {compareCities.map(cityId => {
                     const cityConfig = CITIES_CONFIG.find(c => c.id === cityId);
                     if (!cityConfig) return null;
                     
                     return (
                       <div key={cityId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700 group animate-in fade-in zoom-in duration-200">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cityConfig.color }}></span>
                         {cityConfig.label}
                         <button 
                           onClick={() => toggleCompare(cityId)}
                           className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     );
                   })}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`
          bg-slate-50 text-[10px] text-slate-400 border-t border-slate-200 text-center transition-all duration-300
          ${isSidebarCollapsed ? "p-2 opacity-0" : "p-4 opacity-100"}
        `}>
          資料來源：政大不動產研究中心、永慶房產集團
        </div>
      </aside>
    </>
  );
}