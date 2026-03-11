"use client";

import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors"; 
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
  Download,
  Share2,
  RotateCcw,
} from "lucide-react";
import React from "react";

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

const InfoCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div className="flex items-start gap-3">
      {/* <div className="bg-slate-100 rounded-lg p-2 text-slate-600">{icon}</div> */}
      <div>
        <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

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
  // ✨ 新增：局部狀態，直到按下「確定更新」才同步回全域
  const [tempStart, setTempStart] = React.useState(startPeriod);
  const [tempEnd, setTempEnd] = React.useState(endPeriod);
  const [tempMain, setTempMain] = React.useState(mainCity);
  const [tempCompare, setTempCompare] = React.useState(compareCities);

  // 當外部 props 改變時（例如點擊重設），同步局部狀態
  React.useEffect(() => {
    setTempStart(startPeriod);
    setTempEnd(endPeriod);
    setTempMain(mainCity);
    setTempCompare(compareCities);
  }, [startPeriod, endPeriod, mainCity, compareCities]);

  const handleApply = () => {
    setStartPeriod(tempStart);
    setEndPeriod(tempEnd);
    handleMainCityChange(tempMain);
    // 這裡需要一次性更新 compareCities
    // 由於原本的 toggleCompare 是基於舊 state，我們直接呼叫全域更新
    // 為了簡單起見，我們直接在 handleApply 裡處理全域同步
    compareCities.forEach(c => { if(!tempCompare.includes(c)) toggleCompare(c); });
    tempCompare.forEach(c => { if(!compareCities.includes(c)) toggleCompare(c); });
    
    // 關閉手機版選單
    setIsSettingsOpen(false);
  };

  const hasChanges = tempStart !== startPeriod || 
                     tempEnd !== endPeriod || 
                     tempMain !== mainCity || 
                     JSON.stringify(tempCompare) !== JSON.stringify(compareCities);

  const localToggleCompare = (cityId: string) => {
    setTempCompare(prev => {
      if (prev.includes(cityId)) return prev.filter(id => id !== cityId);
      if (prev.length >= 3) return prev;
      return [...prev, cityId];
    });
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
        bg-slate-50 
        flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        ${isSettingsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarCollapsed ? "w-20" : "w-80"} 
      `}>
        
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center shadow-lg text-slate-500 hover:text-slate-700 hover:scale-110 z-50 transition-all hover:shadow-xl"
        >
          {isSidebarCollapsed ? '>>' : '<<'}
        </button>

        <div 
          className={`
            bg-slate-800 text-white flex items-center shrink-0 relative overflow-hidden group transition-all duration-300 p-6 justify-between
          `}
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className={`transition-opacity duration-200 ${isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
              <h1 className="font-bold text-lg tracking-wide whitespace-nowrap">不動產大事紀</h1>
              <p className="text-[10px] text-slate-400 pl-1 tracking-wider uppercase whitespace-nowrap">Market Intelligence</p>
            </div>
          </div>
          
          <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="md:hidden text-white/70 hover:text-white transition-colors">
            關閉
          </button>
        </div>

        <div className={`
          flex-1 overflow-hidden transition-all duration-300
          ${isSidebarCollapsed ? "p-3 space-y-3" : "p-3 space-y-3"}
        `}>
          {isSidebarCollapsed ? (
             <>
                <div onClick={expandSidebar} title="時間區間" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">時間</div>
                <div onClick={expandSidebar} title="城市選取" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">城市</div>
                <div onClick={expandSidebar} title="輸出與分享" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">分享</div>
             </>
          ) : (
             <>
              {/* 1. 時間區間 - 緊湊單行 */}
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">觀察區間</span>
                </div>
                <div className="flex items-center gap-2">
                  <select value={tempStart} onChange={(e) => setTempStart(e.target.value)} className="flex-1 bg-slate-50 border-none text-slate-700 text-[11px] rounded-lg px-2 py-1.5 font-bold outline-none cursor-pointer hover:bg-slate-100">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <select value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} className="flex-1 bg-slate-50 border-none text-slate-700 text-[11px] rounded-lg px-2 py-1.5 font-bold outline-none cursor-pointer hover:bg-slate-100">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>

              {/* 2. 城市選取 - 緊湊網格 */}
              <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">城市選取</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">{tempCompare.length} / 3 選中</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5">
                  {[ { id: 'nation', label: '全國', color: NATIONAL_CONFIG.color }, ...CITIES_CONFIG ].map(city => {
                    const isMain = tempMain === city.id;
                    const isComparing = tempCompare.includes(city.id);
                    
                    return (
                      <div key={city.id} className={`
                        relative flex items-center p-1 rounded-lg border transition-all cursor-pointer group
                        ${isMain ? 'bg-slate-800 border-slate-800 text-white z-10' : 'bg-slate-50/50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'}
                        ${isComparing ? 'ring-2 ring-orange-500/30 bg-orange-50 border-orange-200 shadow-sm' : ''}
                      `} onClick={() => setTempMain(city.id)}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mr-1.5 ml-0.5 shadow-sm" style={{ backgroundColor: city.color }}></div>
                        <span className="text-[11px] font-bold truncate flex-1">{city.label}</span>
                        
                        {!isMain && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); localToggleCompare(city.id); }}
                            className={`
                              flex items-center justify-center px-1 py-0.5 rounded-md border transition-all
                              ${isComparing 
                                ? 'bg-orange-500 border-orange-500 text-white shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-300 group-hover:text-orange-400 group-hover:border-orange-200'}
                            `}
                            title={isComparing ? "移除對照" : "加入比對"}
                          >
                            <span className="text-[9px] font-black italic tracking-tighter">VS</span>
                          </button>
                        )}
                        {isMain && (
                           <div className="px-1 py-0.5 rounded-md bg-white/20 text-white text-[9px] font-black italic tracking-tighter mr-0.5">
                             MAIN
                           </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <p className="text-[9px] text-slate-400 mt-2.5 text-center italic">
                  💡 點名稱設為 <span className="text-slate-600 font-bold">主要</span> • 點 VS 啟動 <span className="text-orange-500 font-bold">比對</span>
                </p>
              </div>

              {/* 3. 功能選單 - 圖標化 */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-slate-100 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> 下載圖表
                </button>
                <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-slate-100 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> 分享連結
                </button>
              </div>
             </>
          )}
        </div>
        
        {/* ✨ 新增：底部固定確定按鈕區 */}
        {!isSidebarCollapsed && (
          <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleApply}
              disabled={!hasChanges}
              className={`
                w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                ${hasChanges 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
              `}
            >
              <RotateCcw className={`w-4 h-4 ${hasChanges ? 'animate-spin-slow' : ''}`} />
              確定更新資料
            </button>
            {hasChanges && (
              <p className="text-[10px] text-orange-500 text-center mt-2 animate-pulse">設定已變更，請點擊更新</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={`
          bg-white text-[10px] text-slate-400 border-t border-slate-200 text-center transition-all duration-300
          ${isSidebarCollapsed ? "p-2" : "p-4"}
        `}>
          {isSidebarCollapsed ? "@RER" : "資料來源：政大不動產研究中心、永慶房產集團"}
        </div>
      </aside>
    </>
  );
}