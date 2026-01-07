"use client";

import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG } from "@/config/cityColors"; 
// ✨ 引入漂亮的圖標
import { 
  Building2, 
  Calendar, 
  MapPin, 
  GitCompare, 
  X, 
  ArrowRight,
  CheckCircle2,
  Circle
} from "lucide-react";

const QUARTER_OPTIONS = generateQuarterOptions();

interface SidebarProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
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
  return (
    <>
       {/* 遮罩層 (Mobile用) */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-60 w-72 
        bg-white border-r border-slate-200 
        flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0 relative overflow-hidden group">
          {/* 背景裝飾圖標 (淡淡的) */}
          <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-lg tracking-wide">不動產大事紀</h1>
            </div>
            <p className="text-[10px] text-slate-400 pl-1 tracking-wider uppercase">Real Estate Chronicle </p>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="md:hidden text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 捲動內容區 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 1. 時間區間 */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              <Calendar className="w-4 h-4 text-blue-600" />
              時間區間
            </label>
            
            <div className="flex flex-col gap-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 group-focus-within:text-blue-500 transition-colors">開始</span>
                </div>
                <select 
                  value={startPeriod} 
                  onChange={(e) => setStartPeriod(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-12 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white"
                >
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
                   <span className="text-[10px] font-bold text-slate-400 group-focus-within:text-blue-500 transition-colors">結束</span>
                </div>
                <select 
                  value={endPeriod} 
                  onChange={(e) => setEndPeriod(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white"
                >
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 2. 主要城市 */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
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
          </div>

          {/* 3. 加入比對 */}
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                 <GitCompare className="w-4 h-4 text-blue-600" />
                 加入比對
               </label>
               {compareCities.length > 0 && (
                 <button onClick={handleCancelCompare} className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-600 font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-all">
                   <X className="w-3 h-3" />
                   清除
                 </button>
               )}
            </div>
            <p className="text-[10px] text-slate-400 mb-3 pl-6 flex items-center gap-1">
              最多可選擇 3 個城市
            </p>
            <div className="space-y-1 pl-1">
               {CITIES_CONFIG.filter((c) => c.id !== mainCity).map((c) => {
                  const isChecked = compareCities.includes(c.id);
                  const isDisabled = !isChecked && compareCities.length >= 3;
                  return (
                    <label key={c.id} className={`flex items-center gap-3 p-2 rounded-lg border border-transparent transition-all ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer hover:border-slate-100 active:bg-slate-100'}`}>
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-blue-500 border-blue-500 shadow-sm' : 'border-slate-300 bg-white'}`}>
                         {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <input type="checkbox" checked={isChecked} onChange={() => !isDisabled && toggleCompare(c.id)} disabled={isDisabled} className="hidden" />
                       <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: c.color }}></span>
                          <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>{c.label}</span>
                       </div>
                    </label>
                  );
               })}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-[10px] text-slate-400 border-t border-slate-200 text-center">
          資料來源：政大不動產研究中心 v1.2
        </div>
      </aside>
    </>
  );
}