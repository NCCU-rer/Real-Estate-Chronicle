"use client";

import React, { useMemo } from "react";
import DashboardChart from "@/components/DashboardChart";
import { ExportConfig } from "@/components/ExportModal";
import { NATIONAL_CONFIG, getCityColor, getCityName } from "@/config/cityColors";
import { processEvents, getQuarterValue } from "@/utils/eventHelper";
import { rawData } from "@/data/sourceData";
import { Pin, GitCompare } from "lucide-react";

interface ReportCanvasProps {
  config: ExportConfig;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

const StaticEventCard = ({ event, isMain }: { event: any, isMain: boolean }) => {
  const cityColor = event.isNational ? NATIONAL_CONFIG.color : (event.city ? getCityColor(event.city) : NATIONAL_CONFIG.color);
  return (
    <div className={`relative bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-4 overflow-hidden w-full`}>
      <div className={`absolute top-0 bottom-0 w-1.5 ${isMain ? 'left-0' : 'right-0'}`} style={{ backgroundColor: cityColor }}></div>
      <div className="flex flex-col gap-2">
        <div className={`flex items-center gap-2 ${isMain ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: cityColor }}>
            {event.cityName || '全國'} • {event.quarter}
          </span>
        </div>
        <p className={`text-sm font-bold text-slate-800 leading-snug ${isMain ? 'text-left' : 'text-right'}`}>{event.title}</p>
        {event.description && (
          <div 
            className={`text-[11px] text-slate-500 leading-relaxed font-medium ${isMain ? 'text-left' : 'text-right'}`} 
            dangerouslySetInnerHTML={{ __html: event.description }} 
          />
        )}
      </div>
    </div>
  );
};

// PageFrame 現在不設固定高度，讓內容自然撐開
const PageFrame = ({ children, pageNum, totalPages, config, title }: { children: React.ReactNode, pageNum: number, totalPages: number, config: ExportConfig, title?: string }) => (
  <div className="report-page w-300 min-h-225 bg-slate-50 p-14 flex flex-col relative overflow-hidden mb-10 border border-slate-200 shadow-2xl rounded-[40px]">
    <div className="flex items-center justify-between border-b-2 border-[#FFD152] pb-6 mb-8 shrink-0">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">政大不動產大事紀研究報告</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="bg-[#FFD152] text-slate-800 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Official Report</span>
          <p className="text-slate-500 font-bold text-xs">觀察期間：{config.start.replace("_", " ")} → {config.end.replace("_", " ")}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-700">政治大學不動產研究中心</p>
        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Market Intelligence Division</p>
      </div>
    </div>

    <div className="flex-1 flex flex-col min-h-0">
      {title && (
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 shrink-0">
          <span className="w-2 h-7 bg-[#FFD152] rounded-full"></span>
          {title}
        </h2>
      )}
      {children}
    </div>

    <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
      <span>© Real Estate Record Intelligence System</span>
      <div className="bg-slate-800 text-white px-6 py-2 rounded-full text-xs font-black">
        PAGE {pageNum} / {totalPages}
      </div>
    </div>
  </div>
);

export default function ReportCanvas({ config, canvasRef }: ReportCanvasProps) {
  const citiesOrder = [config.mainCity, ...config.compareCities];

  const pages = useMemo(() => {
    const all = processEvents(Object.values(rawData).flat());
    const startVal = getQuarterValue(config.start);
    const endVal = getQuarterValue(config.end);
    
    const results = [];
    if (config.includeChart) results.push({ type: 'chart', title: "房價中位數趨勢分析" });

    // 按年份分組所有事件
    const startYear = Number(config.start.split('_')[0]);
    const endYear = Number(config.end.split('_')[0]);

    for (let y = startYear; y <= endYear; y++) {
      const yearEvents = all.filter(e => e.year === y);
      const main = yearEvents.filter(e => (e.city === config.mainCity) || (e.isNational && config.mainCity === 'nation'));
      const compare = yearEvents.filter(e => (config.compareCities.includes(e.city || '')) || (e.isNational && config.compareCities.includes('nation')));

      if (main.length > 0 || compare.length > 0) {
        // 合併該年份的所有季度數據
        const quartersData = ["Q1", "Q2", "Q3", "Q4"].map(q => ({
          label: q,
          main: main.filter(e => e.quarter === q),
          compare: compare.filter(e => e.quarter === q)
        })).filter(q => q.main.length > 0 || q.compare.length > 0);

        results.push({ type: 'year', year: y, quarters: quartersData });
      }
    }

    return results;
  }, [config]);

  return (
    <div className="fixed -left-2499.75 top-0 pointer-events-none">
      <div ref={canvasRef} className="flex flex-col bg-slate-300 p-10">
        {pages.map((page: any, index: number) => (
          <PageFrame key={index} pageNum={index + 1} totalPages={pages.length} config={config} 
            title={page.type === 'chart' ? "房價中位數趨勢分析" : `${page.year} 年度大事紀對照`}
          >
            {page.type === 'chart' && (
              <div className="h-137.5 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col gap-8">
                <div className="flex-1">
                  <DashboardChart selectedCities={citiesOrder} startPeriod={config.start} endPeriod={config.end} />
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-wrap justify-center gap-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: getCityColor(config.mainCity) }}></div>
                    <span className="text-sm font-black text-slate-700">{getCityName(config.mainCity)} (主)</span>
                  </div>
                  {config.compareCities.map(id => (
                    <div key={id} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: id === 'nation' ? NATIONAL_CONFIG.color : getCityColor(id) }}></div>
                      <span className="text-sm font-bold text-slate-500">{id === 'nation' ? '全國' : getCityName(id)} (比)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {page.type === 'year' && (
              <div className="flex flex-col gap-10">
                {page.quarters.map((qData: any, i: number) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-800 text-white px-4 py-1.5 rounded-xl text-xs font-black tracking-[0.2em]">{qData.label}</span>
                      <div className="h-px flex-1 bg-slate-200"></div>
                    </div>
                    <div className="flex gap-10">
                      <div className="flex-1 flex flex-col gap-4">
                        {qData.main.map((ev: any, idx: number) => <StaticEventCard key={idx} event={ev} isMain={true} />)}
                        {qData.main.length === 0 && <div className="p-6 rounded-3xl border border-dashed border-slate-200 text-center text-[10px] text-slate-300 italic">無主要觀察紀錄</div>}
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        {qData.compare.map((ev: any, idx: number) => <StaticEventCard key={idx} event={ev} isMain={false} />)}
                        {qData.compare.length === 0 && <div className="p-6 rounded-3xl border border-dashed border-slate-200 text-center text-[10px] text-slate-300 italic">無對照紀錄</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PageFrame>
        ))}
      </div>
    </div>
  );
}
