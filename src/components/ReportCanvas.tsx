"use client";

import React, { useMemo } from "react";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import { ExportConfig } from "@/components/ExportModal";
import { NATIONAL_CONFIG, getCityColor } from "@/config/cityColors";
import { processEvents } from "@/utils/eventHelper";
import { rawData } from "@/data/sourceData";

interface ReportCanvasProps {
  config: ExportConfig;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

// 分頁標頭與腳標組件，確保每張圖都有
const PageFrame = ({ children, pageNum, totalPages, config }: { children: React.ReactNode, pageNum: number, totalPages: number, config: ExportConfig }) => (
  <div className="report-page w-[1200px] h-[900px] bg-slate-50 p-10 flex flex-col gap-6 relative overflow-hidden mb-10 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[40px]">
    {/* Header */}
    <div className="flex items-center justify-between border-b-2 border-orange-600 pb-4">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">不動產大事紀研究報告</h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Official Report</span>
          <p className="text-slate-500 font-bold text-xs">
            觀察期間：{config.start.replace("_", " ")} → {config.end.replace("_", " ")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-slate-700">不動產研究中心</p>
        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Market Intelligence Division</p>
      </div>
    </div>

    {/* Content Area */}
    <div className="flex-1 min-h-0 overflow-hidden">
      {children}
    </div>

    {/* Footer */}
    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© Real Estate Record Intelligence</span>
        <div className="h-3 w-px bg-slate-200"></div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">產出時間：{new Date().toLocaleDateString()}</span>
      </div>
      <div className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-lg shadow-slate-200">
        PAGE {pageNum} / {totalPages}
      </div>
    </div>
  </div>
);

export default function ReportCanvas({ config, canvasRef }: ReportCanvasProps) {
  // 取得所有事件
  const allEvents = useMemo(() => {
    const all = processEvents(Object.values(rawData).flat());
    const cities = [config.mainCity, ...config.compareCities];
    return all.filter(event => {
      const isTypeMatch = (event.isNational && config.includeNationalEvents) || 
                          (!event.isNational && config.includeCityEvents && cities.includes(event.city));
      return isTypeMatch;
    });
  }, [config]);

  // 1. 拆分內容為「頁面數據塊」
  const pages = useMemo(() => {
    const result = [];
    let currentEvents = [...allEvents];

    // 第一頁：趨勢圖 + 前幾個事件 (如果包含圖的話)
    if (config.includeChart) {
      result.push({
        type: 'chart_and_events',
        events: currentEvents.splice(0, 4) // 第一頁放圖，只能容納約 4 個事件
      });
    }

    // 後續頁面：純事件 (每頁約 8 個事件較安全，不擁擠)
    while (currentEvents.length > 0) {
      result.push({
        type: 'events_only',
        events: currentEvents.splice(0, 8)
      });
    }

    // 如果完全沒選圖也沒選事件，至少留一個空頁 (標題頁)
    if (result.length === 0) result.push({ type: 'empty', events: [] });

    return result;
  }, [allEvents, config.includeChart]);

  const citiesOrder = [config.mainCity, ...config.compareCities];

  return (
    <div className="fixed left-[-9999px] top-0 pointer-events-none">
      <div ref={canvasRef} className="flex flex-col bg-slate-200 p-10">
        {pages.map((page, index) => (
          <div key={index} className="capture-page">
            <PageFrame 
              pageNum={index + 1} 
              totalPages={pages.length} 
              config={config}
            >
              {page.type === 'chart_and_events' && (
                <div className="flex flex-col gap-6 h-full">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                      房價中位數趨勢分析
                    </h2>
                    <div className="flex-1 w-full min-h-[350px]">
                      <DashboardChart 
                        selectedCities={citiesOrder}
                        startPeriod={config.start}
                        endPeriod={config.end}
                      />
                    </div>
                  </div>
                  {page.events.length > 0 && (
                    <div className="h-[280px] overflow-hidden">
                      <EventList data={page.events} startPeriod={config.start} endPeriod={config.end} citiesOrder={citiesOrder} />
                    </div>
                  )}
                </div>
              )}

              {page.type === 'events_only' && (
                <div className="flex flex-col gap-4 h-full">
                  <h2 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                    關鍵大事紀回顧 (續)
                  </h2>
                  <div className="flex-1 overflow-hidden px-4">
                    <EventList data={page.events} startPeriod={config.start} endPeriod={config.end} citiesOrder={citiesOrder} />
                  </div>
                </div>
              )}

              {page.type === 'empty' && (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold italic">
                  報告內容生成中...
                </div>
              )}
            </PageFrame>
          </div>
        ))}
      </div>
    </div>
  );
}
