"use client";

import React, { useState } from "react";
import { X, Download, Calendar, MapPin, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors";
import { generateQuarterOptions } from "@/utils/eventHelper";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStart: string;
  defaultEnd: string;
  defaultMain: string;
  defaultCompare: string[];
  onGenerate: (config: ExportConfig) => void;
  quarterOptions?: string[];
}

export interface ExportConfig {
  start: string;
  end: string;
  mainCity: string;
  compareCities: string[];
  includeChart: boolean;
  includeNationalEvents: boolean;
  includeCityEvents: boolean;
  format: 'pdf' | 'jpg';
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  defaultStart, 
  defaultEnd, 
  defaultMain, 
  defaultCompare,
  onGenerate,
  quarterOptions = []
}: ExportModalProps) {
  const effectiveQuarters = quarterOptions.length > 0 
    ? quarterOptions 
    : generateQuarterOptions();

  const [config, setConfig] = useState<ExportConfig>({
    start: defaultStart,
    end: defaultEnd,
    mainCity: defaultMain,
    compareCities: defaultCompare,
    includeChart: true,
    includeNationalEvents: true,
    includeCityEvents: true,
    format: 'pdf',
  });

  if (!isOpen) return null;

  const toggleCity = (id: string) => {
    if (id === config.mainCity) return;
    setConfig(prev => ({
      ...prev,
      compareCities: prev.compareCities.includes(id)
        ? prev.compareCities.filter(c => c !== id)
        : [...prev.compareCities, id].slice(0, 3)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#2D2D24] px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <Download size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">匯出數據報告</h2>
              <p className="text-white/70 text-xs mt-0.5">自定義您想要下載的內容與區間</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* 1. 時間區間 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar size={18} className="text-[#B7791F]" />
              <h3 className="font-bold">設定匯出時間</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">起始季度</label>
                <select 
                  value={config.start} 
                  onChange={e => setConfig(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#FFD152]/20"
                >
                  {effectiveQuarters.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">結束季度</label>
                <select 
                  value={config.end} 
                  onChange={e => setConfig(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#FFD152]/20"
                >
                  {effectiveQuarters.map(q => <option key={q} value={q}>{q.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* 2. 內容勾選 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800">
              <FileText size={18} className="text-[#B7791F]" />
              <h3 className="font-bold">選擇匯出內容與格式</h3>
            </div>
            
            {/* 格式切換 */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
              <button 
                onClick={() => setConfig(prev => ({ ...prev, format: 'pdf' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${config.format === 'pdf' ? 'bg-white text-[#B7791F] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                PDF 報告 (單一檔案)
              </button>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, format: 'jpg' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${config.format === 'jpg' ? 'bg-white text-[#B7791F] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                JPEG 圖片 (打包下載)
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'includeChart', label: '房價趨勢圖', desc: '包含趨勢線與數據' },
                { id: 'includeNationalEvents', label: '全國大事紀', desc: '重大政策與環境' },
                { id: 'includeCityEvents', label: '城市大事紀', desc: '地方區域動態' }
              ].map(item => (
                <label key={item.id} className={`
                  flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${config[item.id as keyof ExportConfig]
                    ? 'border-[#B7791F] bg-[#B7791F]/10 shadow-sm' 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'}
                `}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={config[item.id as keyof ExportConfig] as boolean}
                    onChange={() => setConfig(prev => ({ ...prev, [item.id]: !prev[item.id as keyof ExportConfig] }))}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${config[item.id as keyof ExportConfig] ? 'text-[#B7791F]' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                    {config[item.id as keyof ExportConfig] && <CheckCircle2 size={14} className="text-[#B7791F]" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                </label>
              ))}
            </div>
          </section>

          {/* 3. 縣市範圍 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <MapPin size={18} className="text-[#B7791F]" />
                <h3 className="font-bold">選取比較縣市</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{config.compareCities.length}/3 已選取</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className={`
                p-2 rounded-lg border text-center transition-all cursor-not-allowed bg-slate-800 text-white
              `}>
                <span className="text-xs font-bold">主: {CITIES_CONFIG.find(c => c.id === config.mainCity)?.label || '全國'}</span>
              </div>
              {[ { id: 'nation', label: '全國', color: NATIONAL_CONFIG.color }, ...CITIES_CONFIG ]
                .filter(c => c.id !== config.mainCity)
                .map(city => {
                  const active = config.compareCities.includes(city.id);
                  return (
                    <button 
                      key={city.id}
                      onClick={() => toggleCity(city.id)}
                      className={`
                        p-2 rounded-lg border text-xs font-bold transition-all
                        ${active ? 'border-[#B7791F] bg-[#B7791F]/10 text-[#B7791F]' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}
                      `}
                    >
                      {city.label}
                    </button>
                  );
                })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 flex items-center justify-end gap-4 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            取消
          </button>
          <button 
            onClick={() => onGenerate(config)}
            className="flex items-center gap-2 bg-[#2D2D24] hover:bg-black/80 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-black/20 transition-all active:scale-95"
          >
            開始生成報告
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
