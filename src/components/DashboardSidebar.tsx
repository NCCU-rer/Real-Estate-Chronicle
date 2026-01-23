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
  dataType: 'price' | 'index';
  setDataType: (v: 'price' | 'index') => void;
}

const InfoCard = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <div className="flex items-start gap-4">
      <div className="bg-slate-100 rounded-lg p-2 text-blue-600">{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="mt-5">{children}</div>
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

  const mainCityLabel = mainCity === 'nation' ? '全國均價' : CITIES_CONFIG.find(c => c.id === mainCity)?.label;

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
          className="hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center shadow-lg text-slate-500 hover:text-blue-600 hover:scale-110 z-50 transition-all hover:shadow-xl"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div 
          className={`
            bg-slate-900 text-white flex items-center shrink-0 relative overflow-hidden group transition-all duration-300 p-6 justify-between
          `}
        >
          {!isSidebarCollapsed && (
            <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />
          )}
          
          <div className="relative z-10 flex items-center gap-3">
            <div className={`p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50 shrink-0 flex items-center justify-center`}>
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
          flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden transition-all duration-300
          ${isSidebarCollapsed ? "space-y-3 p-3" : "space-y-4 p-6"}
        `}>
          {isSidebarCollapsed ? (
             <>
                <div onClick={expandSidebar} title="資料與指標" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100"><TrendingUp /></div>
                <div onClick={expandSidebar} title="時間區間" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100"><Calendar /></div>
                <div onClick={expandSidebar} title="城市設定" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100"><MapPin /></div>
                <div onClick={expandSidebar} title="輸出與分享" className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-500 cursor-pointer hover:bg-slate-100"><Download /></div>
             </>
          ) : (
             <>
              <InfoCard title="資料與指標" description="選擇圖表與時間軸呈現的數據類型" icon={<TrendingUp />}>
                <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button onClick={() => setDataType('price')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all duration-200 ${dataType === 'price' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}>
                    <DollarSign className="w-3.5 h-3.5" />房價中位數
                  </button>
                  <button onClick={() => setDataType('index')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all duration-200 ${dataType === 'index' ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}>
                    <TrendingUp className="w-3.5 h-3.5" />永慶房價指數
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">目前：<span className="font-bold text-slate-600">{dataType === 'price' ? '房價中位數 (萬/坪)' : '永慶房價指數'}</span></p>
              </InfoCard>

              <InfoCard title="時間區間" description="設定您想觀察的事件與房價時間範圍" icon={<Calendar />}>
                <div className="flex items-center gap-2">
                  <select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer hover:bg-white">
                    {QUARTER_OPTIONS.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                  </select>
                </div>
              </InfoCard>

              <InfoCard title="城市設定" description="選擇主要觀察城市，並加入最多3個城市比較" icon={<MapPin />}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">主要城市</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={() => handleMainCityChange("nation")} className={`col-span-2 p-2 rounded-lg text-xs font-bold transition-all duration-200 border shadow-sm flex items-center justify-center gap-2 group ${mainCity === "nation" ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                           {mainCity === "nation" ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3 opacity-30" />}全國均價
                        </button>
                        {CITIES_CONFIG.map(c => (<button key={c.id} onClick={() => handleMainCityChange(c.id)} className={`p-2 rounded-lg text-xs font-bold transition-all duration-200 border shadow-sm ${mainCity === c.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'}`}>{c.label}</button>))}
                    </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500">比較城市</label>
                     <div className="relative mt-2 mb-3">
                       <select onChange={handleCompareSelect} defaultValue="default" disabled={compareCities.length >= 3} className="w-full bg-white border border-slate-200 text-slate-600 text-xs rounded-lg pl-3 pr-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                         <option value="default" disabled>{compareCities.length >= 3 ? "已達上限 (最多3個)" : "點擊新增對照城市..."}</option>
                         {CITIES_CONFIG.filter(c => c.id !== mainCity && !compareCities.includes(c.id)).map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}
                       </select>
                     </div>
                     <div className="flex flex-wrap gap-2 min-h-7.5">
                       {compareCities.map(cityId => {
                         const cityConfig = CITIES_CONFIG.find(c => c.id === cityId);
                         if (!cityConfig) return null;
                         return (
                           <span key={cityId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 group animate-in fade-in zoom-in duration-200">
                             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cityConfig.color }}></span>
                             {cityConfig.label}
                             <button onClick={() => toggleCompare(cityId)} className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                           </span>
                         );
                       })}
                     </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="輸出與分享" description="下載圖表或分享您的觀察結果" icon={<Download />}>
                  <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">
                          <Download size={14} /> 下載圖表
                      </button>
                       <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">
                          <Share2 size={14} /> 分享連結
                      </button>
                       <button className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 text-xs font-bold transition-colors">
                          <RotateCcw size={14} /> 重設全部
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