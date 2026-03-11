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
          flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden transition-all duration-300
          ${isSidebarCollapsed ? "space-y-3 p-3" : "space-y-3 p-4"}
        `}>
          {isSidebarCollapsed ? (
             <>
                <div onClick={expandSidebar} title="時間區間" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">時間</div>
                <div onClick={expandSidebar} title="城市設定" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">城市</div>
                <div onClick={expandSidebar} title="輸出與分享" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100">分享</div>
             </>
          ) : (
             <>
              <InfoCard title="時間區間" description="設定您想觀察的事件與房價時間範圍">
                <div className="flex items-center gap-2">
                  <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                </div>
              </InfoCard>

              <InfoCard title="城市選取" description="點擊名稱設為主要，點擊 ＋ 號加入對照 (最多3個)">
                <div className="space-y-2">
                  {/* 全國選項 */}
                  <div className={`
                    flex items-center justify-between p-2 rounded-lg border transition-all
                    ${mainCity === 'nation' ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                    ${compareCities.includes('nation') ? 'ring-2 ring-orange-500/20 border-orange-200 bg-orange-50/30' : ''}
                  `}>
                    <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => handleMainCityChange('nation')}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: NATIONAL_CONFIG.color }}></div>
                      <span className="text-xs font-bold">全國均價</span>
                    </div>

                    {mainCity !== 'nation' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleCompare('nation'); }}
                        className={`
                          ml-1 p-1 rounded-md transition-all
                          ${compareCities.includes('nation') ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}
                        `}
                        title={compareCities.includes('nation') ? "移除對照" : "加入對照"}
                      >
                        {compareCities.includes('nation') ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* 城市網格 */}
                  <div className="grid grid-cols-2 gap-2">
                    {CITIES_CONFIG.map(city => {
                      const isMain = mainCity === city.id;
                      const isComparing = compareCities.includes(city.id);
                      
                      return (
                        <div key={city.id} className={`
                          relative flex items-center justify-between p-2 rounded-lg border transition-all group
                          ${isMain ? 'bg-slate-700 border-slate-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                          ${isComparing ? 'ring-2 ring-orange-500/20 border-orange-200 bg-orange-50/30' : ''}
                        `}>
                          <div className="flex items-center gap-2 flex-1 cursor-pointer overflow-hidden" onClick={() => handleMainCityChange(city.id)}>
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: city.color }}></div>
                            <span className="text-xs font-bold truncate">{city.label}</span>
                          </div>
                          
                          {!isMain && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleCompare(city.id); }}
                              className={`
                                ml-1 p-1 rounded-md transition-all
                                ${isComparing ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}
                              `}
                              title={isComparing ? "移除對照" : "加入對照"}
                            >
                              {isComparing ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {compareCities.length > 0 && (
                    <div className="pt-2 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-400">目前對照：{compareCities.length} / 3</span>
                       <button onClick={handleCancelCompare} className="text-[10px] font-bold text-orange-500 hover:text-orange-600 underline underline-offset-2">清除全部對照</button>
                    </div>
                  )}
                </div>
              </InfoCard>

              <InfoCard title="輸出與分享" description="下載圖表或分享您的觀察結果">
                  <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">
                          下載圖表
                      </button>
                       <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">
                          分享連結
                      </button>
                       <button className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 text-xs font-bold transition-colors">
                          重設全部
                      </button>
                  </div>
              </InfoCard>
             </>
          )}
        </div>
        
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