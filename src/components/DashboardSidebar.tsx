"use client";

import { generateQuarterOptions } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors"; 
import Image from "next/image";
import { 
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
  HelpCircle,
} from "lucide-react";
import React from "react";

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
  onDownload: () => void;
  onShare: () => void;
  onInfoOpen: () => void;
}

const InfoCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div className="flex items-start gap-3">
      <div>
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

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
  onDownload,
  onShare,
  onInfoOpen,
}: SidebarProps) {
  // 局部狀態，直到按下「確定更新」才同步回全域
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
    // 更新對照城市
    compareCities.forEach(c => { if(!tempCompare.includes(c)) toggleCompare(c); });
    tempCompare.forEach(c => { if(!compareCities.includes(c)) toggleCompare(c); });
    
    // 關閉手機版選單
    setIsSettingsOpen(false);
  };

  const handleReset = () => {
    setTempStart("2013_Q1");
    setTempEnd("2025_Q4");
    setTempMain("nation");
    setTempCompare([]);
    
    // 立即同步回全域 (可選，這裡選擇點擊重設後仍需點擊確定，或直接同步)
    // 為了體驗一致性，重設後也需要按「確定更新」才生效
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
        bg-white
        flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out border-r border-slate-200
        w-80 animate-in fade-in slide-in-from-left-8 duration-500
      `}>
        
        <div 
          className="bg-white flex flex-col shrink-0 relative p-6 border-b border-slate-100"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="shrink-0 bg-[#FFD152]/5 p-1.5 rounded-xl">
               <Image 
                 src="/logo_transparent.svg" 
                 alt="Logo" 
                 width={38} 
                 height={38} 
                 className="object-contain"
               />
            </div>
            <div className="opacity-100">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl tracking-tight text-[#FFD152]">不動產大事紀</h1>
                <button 
                  onClick={onInfoOpen}
                  className="p-1 hover:bg-[#FFD152]/10 rounded-full transition-colors group/info"
                >
                  <HelpCircle className="w-4 h-4 text-slate-300 group-hover/text-[#FFD152]" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5 uppercase">Real Estate Timeline</p>
            </div>
          </div>
          
          <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="md:hidden absolute top-6 right-6 text-slate-400 hover:text-[#FFD152] transition-colors font-bold text-xs">
            關閉
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 p-4 space-y-4">
             <>
              {/* 1. 時間區間 - 單行 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-[#FFD152] rounded-full"></div>
                  <span className="text-base font-black text-slate-800 tracking-tight">觀察區間設定</span>
                </div>
                <div className="flex items-center gap-2">
                  <select value={tempStart} onChange={(e) => setTempStart(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-xl px-3 py-3 font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                  <select value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-xl px-3 py-3 font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>

              {/* 2. 城市選取 - 網格 */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#FFD152] rounded-full"></div>
                    <span className="text-base font-black text-slate-800 tracking-tight uppercase">城市觀察選取</span>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500">{tempCompare.length} / 3 對照中</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[ { id: 'nation', label: '全國', color: NATIONAL_CONFIG.color }, ...CITIES_CONFIG ].map(city => {
                    const isMain = tempMain === city.id;
                    const isComparing = tempCompare.includes(city.id);
                    
                    return (
                      <div key={city.id} className={`
                        relative flex items-center p-2.5 rounded-xl transition-all cursor-pointer group
                        ${isMain ? 'z-10 shadow-md bg-white border-2 border-[#FFD152] text-slate-800' : 'border bg-white border-slate-100 text-slate-600 hover:border-[#FFD152]/30 hover:bg-slate-50'}
                        ${isComparing && !isMain ? 'ring-2 ring-[#FFD152]/20' : ''}
                      `}
                      onClick={() => setTempMain(city.id)}>
                        {/* 主要城市指示條 */}
                        {isMain && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#FFD152] rounded-r-full"></div>}
                        
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 mr-2.5 ml-0.5" style={{ backgroundColor: city.color }}></div>
                        <span className={`text-sm truncate flex-1 ${isMain ? 'font-black text-slate-900' : 'font-bold'}`}>{city.label}</span>
                        
                        {!isMain && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); localToggleCompare(city.id); }}
                            className={`
                              flex items-center justify-center px-2 py-1.5 rounded-lg border transition-all
                              ${isComparing 
                                ? 'bg-[#FFD152] border-[#FFD152] text-slate-800 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-300 group-hover:text-[#FFD152] group-hover:border-[#FFD152]/30'}
                            `}
                          >
                            <span className="text-[10px] font-black">比</span>
                          </button>
                        )}
                        {isMain && (
                           <div className="px-2 py-1 rounded-md bg-[#FFD152] text-slate-800 text-[10px] font-black tracking-tighter shadow-sm shadow-[#FFD152]/20">
                             主要
                           </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <p className="text-xs text-slate-400 mt-4 text-center italic font-medium">
                  💡 點選名稱設為 <span className="text-slate-600 font-bold underline decoration-slate-300">主要</span> • 點選「比」開啟 <span className="text-[#FFD152] font-bold underline decoration-[#FFD152]/20">比較分析</span>
                </p>
              </div>

              {/* 3. 功能選單 - 圖標化 */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button 
                  onClick={onDownload}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white border border-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> 下載圖表
                </button>
                <button 
                  onClick={onShare}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white border border-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" /> 分享連結
                </button>
              </div>
             </>
        </div>
        
        {/* 底部固定確定按鈕區 */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] space-y-2">
          <button 
            onClick={handleReset}
            className="w-full py-2 rounded-lg font-bold text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重設所有設定
          </button>
          
          <button 
            onClick={handleApply}
            disabled={!hasChanges}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2
              ${hasChanges 
                ? 'bg-[#FFD152] text-slate-800 shadow-lg shadow-[#FFD152]/20 hover:brightness-95 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            <CheckCircle2 className={`w-6 h-6 ${hasChanges ? 'animate-pulse' : ''}`} />
            確定更新資料
          </button>
          {hasChanges && (
            <p className="text-sm text-[#FFD152] text-center mt-2 animate-pulse font-bold">設定已變更，請點擊更新</p>
          )}
        </div>

      </aside>
    </>
  );
}
