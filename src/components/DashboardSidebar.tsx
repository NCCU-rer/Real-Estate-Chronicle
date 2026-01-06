"use client";

// ✨ 修正 1: 正確的 import 路徑
import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG } from "@/config/cityColors"; 

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
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h1 className="font-bold text-lg tracking-wide">不動產大事紀</h1>
            <p className="text-xs text-slate-400 mt-1">Market Intelligence</p>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="md:hidden text-white">✕</button>
        </div>

        {/* 捲動內容區 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 時間區間 */}
          <div>
            <label className="text-xs font-bold text-black uppercase tracking-wider mb-4 block">時間區間</label>
            <div className="space-y-3">
              <div className="group bg-white rounded-lg p-2 border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <span className="block text-[10px] text-slate-400 mb-0.5 ml-1 font-bold">起</span>
                <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-transparent text-slate-700 text-sm outline-none font-bold cursor-pointer hover:text-blue-600">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="group bg-white rounded-lg p-2 border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <span className="block text-[10px] text-slate-400 mb-0.5 ml-1 font-bold">迄</span>
                <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-transparent text-slate-700 text-sm outline-none font-bold cursor-pointer hover:text-blue-600">
                  {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 主要城市 */}
          <div>
            <label className="text-xs font-bold text-black uppercase tracking-wider mb-4 block">主要城市</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleMainCityChange("nation")}
                className={`
                  col-span-2 p-2 rounded-md text-xs font-bold transition-all duration-200 border shadow-sm flex items-center justify-center gap-2
                  ${mainCity === "nation" 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }
                `}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                全國均價 
              </button>
              {CITIES_CONFIG.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => handleMainCityChange(c.id)} 
                  className={`
                    p-2 rounded-md text-xs font-bold transition-all duration-200 border shadow-sm
                    ${mainCity === c.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600'
                    }
                  `}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 加入比對 */}
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="text-xs font-bold text-black uppercase tracking-wider">加入比對</label>
               {compareCities.length > 0 && (
                 <button onClick={handleCancelCompare} className="text-[10px] text-red-500 hover:text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded transition-colors">清除重選</button>
               )}
            </div>
            <p className="text-[10px] text-black mb-3 opacity-80 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
              最多可選擇 3 個城市
            </p>
            <div className="space-y-1">
               {CITIES_CONFIG.filter((c) => c.id !== mainCity).map((c) => {
                  const isChecked = compareCities.includes(c.id);
                  const isDisabled = !isChecked && compareCities.length >= 3;
                  return (
                    <label key={c.id} className={`flex items-center gap-3 p-2 rounded-md border border-transparent transition-colors ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer hover:border-slate-100'}`}>
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                         {isChecked && <span className="text-white text-[10px]">✓</span>}
                       </div>
                       <input type="checkbox" checked={isChecked} onChange={() => !isDisabled && toggleCompare(c.id)} disabled={isDisabled} className="hidden" />
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                          <span className="text-sm text-slate-600 font-medium">{c.label}</span>
                       </div>
                    </label>
                  );
               })}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-[10px] text-slate-400 border-t border-slate-200 text-center">
          資料來源：政大不動產研究中心
        </div>
      </aside>
    </>
  );
}