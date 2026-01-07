"use client";

import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG } from "@/config/cityColors"; 
import { 
  Building2, 
  Calendar, 
  MapPin, 
  GitCompare, 
  X, 
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Plus,
  DollarSign,
  TrendingUp,
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
  dataType: 'price' | 'index';
  setDataType: (v: 'price' | 'index') => void;
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
  dataType,
  setDataType,
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
        flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarCollapsed ? "w-20" : "w-72"} 
      `}>
        {/* 👆 上面 z-[60] 已改為 z-60 */}
        
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center shadow-lg text-slate-500 hover:text-blue-600 hover:scale-110 z-50 transition-all hover:shadow-xl"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div 
          onClick={expandSidebar}
          className={`
            bg-slate-900 text-white flex items-center shrink-0 relative overflow-hidden group transition-all duration-300
            ${isSidebarCollapsed ? "p-4 justify-center cursor-pointer hover:bg-slate-800" : "p-6 justify-between"}
          `}
        >
          {!isSidebarCollapsed && (
            <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />
          )}
          
          <div className="relative z-10 flex items-center gap-3">
            <div className={`
              p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50 shrink-0 flex items-center justify-center
              ${isSidebarCollapsed ? "mx-auto" : ""}
            `}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            
            <div className={`transition-opacity duration-200 ${isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
              <h1 className="font-bold text-lg tracking-wide whitespace-nowrap">不動產大事紀</h1>
              <p className="text-[10px] text-slate-400 pl-1 tracking-wider uppercase whitespace-nowrap">Market Intelligence</p>
            </div>
          </div>
          
          <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="md:hidden text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`
          flex-1 overflow-y-auto custom-scrollbar space-y-8 overflow-x-hidden
          ${isSidebarCollapsed ? "px-2 py-6 flex flex-col items-center" : "p-6"}
        `}>
          
          {/* 資料模式切換 */}
          <div className="relative group/section w-full">
            {isSidebarCollapsed ? (
              <div 
                onClick={() => setDataType(dataType === 'price' ? 'index' : 'price')}
                className={`
                  flex justify-center items-center w-12 h-12 mx-auto rounded-xl cursor-pointer transition-all shadow-sm mb-2
                  ${dataType === 'price' ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}
                `}
                title={dataType === 'price' ? "目前：房價中位數" : "目前：房價指數"}
              >
                {dataType === 'price' ? <DollarSign className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
              </div>
            ) : (
              <>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 whitespace-nowrap">
                   {dataType === 'price' ? <DollarSign className="w-4 h-4 text-emerald-600" /> : <TrendingUp className="w-4 h-4 text-violet-600" />}
                   資料模式
                </label>
                <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setDataType('price')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all duration-200 ${
                      dataType === 'price' 
                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    房價中位數
                  </button>
                  <button
                    onClick={() => setDataType('index')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all duration-200 ${
                      dataType === 'index' 
                        ? 'bg-white text-violet-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    房價指數
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={`h-px bg-slate-100 w-full ${isSidebarCollapsed ? 'my-2' : ''}`} />

          {/* 1. 時間區間 */}
          <div className="relative group/section w-full">
            {isSidebarCollapsed ? (
              <div 
                onClick={expandSidebar}
                className="flex justify-center items-center w-12 h-12 mx-auto rounded-xl hover:bg-slate-100 cursor-pointer transition-colors" 
                title="點擊展開設定時間"
              >
                <Calendar className="w-6 h-6 text-slate-400 group-hover/section:text-blue-600 transition-colors" />
              </div>
            ) : (
              <>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  時間區間
                </label>
                
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-[10px] font-bold text-slate-400 group-focus-within:text-blue-500 transition-colors">START</span>
                    </div>
                    <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-12 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                      {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-center -my-1 z-10">
                    <div className="bg-white p-1 rounded-full border border-slate-100 shadow-sm text-slate-300">
                      <ArrowRight className="w-3 h-3 rotate-90" />
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <span className="text-[10px] font-bold text-slate-400 group-focus-within:text-blue-500 transition-colors">END</span>
                    </div>
                    <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                      {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`h-px bg-slate-100 w-full ${isSidebarCollapsed ? 'my-2' : ''}`} />

          {/* 2. 主要城市 */}
          <div className="relative group/section w-full">
             {isSidebarCollapsed ? (
              <div 
                onClick={expandSidebar}
                className="flex justify-center items-center w-12 h-12 mx-auto rounded-xl hover:bg-slate-100 cursor-pointer transition-colors" 
                title="點擊展開設定城市"
              >
                <MapPin className="w-6 h-6 text-slate-400 group-hover/section:text-blue-600 transition-colors" />
              </div>
             ) : (
               <>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 whitespace-nowrap">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  主要城市
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleMainCityChange("nation")}
                    className={`
                      col-span-2 p-2 rounded-lg text-xs font-bold transition-all duration-200 border shadow-sm flex items-center justify-center gap-2 group
                      ${mainCity === "nation" 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md ring-2 ring-slate-800/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }
                    `}
                  >
                    {mainCity === "nation" ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3 opacity-30" />}
                    全國均價 
                  </button>
                  {CITIES_CONFIG.map((c) => (
                    <button 
                      key={c.id} 
                      onClick={() => handleMainCityChange(c.id)} 
                      className={`
                        p-2 rounded-lg text-xs font-bold transition-all duration-200 border shadow-sm flex items-center justify-center gap-1.5
                        ${mainCity === c.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'
                        }
                      `}
                    >
                      {c.label}
                    </button>
                  ))}
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
                className="flex justify-center items-center w-12 h-12 mx-auto rounded-xl hover:bg-slate-100 cursor-pointer transition-colors" 
                title="點擊展開設定比對"
              >
                <GitCompare className="w-6 h-6 text-slate-400 group-hover/section:text-blue-600 transition-colors" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                   <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider whitespace-nowrap">
                     <GitCompare className="w-4 h-4 text-blue-600" />
                     加入比對
                   </label>
                   {compareCities.length > 0 && (
                     <button onClick={handleCancelCompare} className="text-[10px] text-red-500 hover:text-red-600 font-bold hover:underline transition-all">
                       清除
                     </button>
                   )}
                </div>
                
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <select 
                    onChange={handleCompareSelect}
                    defaultValue="default"
                    disabled={compareCities.length >= 3}
                    className="w-full bg-white border border-slate-200 text-slate-600 text-xs rounded-lg pl-9 pr-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="default" disabled>
                      {compareCities.length >= 3 ? "已達上限 (最多3個)" : "點擊新增對照城市..."}
                    </option>
                    {CITIES_CONFIG.filter(c => c.id !== mainCity && !compareCities.includes(c.id)).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 min-h-7.5">
                {/* 👆 上面 min-h-[30px] 已改為 min-h-7.5 */}
                   {compareCities.length === 0 && (
                     <span className="text-[10px] text-slate-400 italic pl-1">尚無比對項目</span>
                   )}
                   
                   {compareCities.map(cityId => {
                     const cityConfig = CITIES_CONFIG.find(c => c.id === cityId);
                     if (!cityConfig) return null;
                     
                     return (
                       <span key={cityId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 group animate-in fade-in zoom-in duration-200">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cityConfig.color }}></span>
                         {cityConfig.label}
                         <button 
                           onClick={() => toggleCompare(cityId)}
                           className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </span>
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
          ${isSidebarCollapsed ? "p-2" : "p-4"}
        `}>
          {isSidebarCollapsed ? "@RER" : "資料來源：政大不動產研究中心、永慶房產集團"}
        </div>
      </aside>
    </>
  );
}