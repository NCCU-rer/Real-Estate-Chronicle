"use client";

import React, { useMemo } from "react";
import DashboardChart from "@/components/DashboardChart";
import EventList from "@/components/EventList";
import { ExportConfig } from "@/components/ExportModal";
import { getCityName } from "@/config/cityColors";
import { processEvents } from "@/utils/eventHelper";
import { rawData } from "@/data/sourceData";

interface ReportCanvasProps {
  config: ExportConfig;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export default function ReportCanvas({ config, canvasRef }: ReportCanvasProps) {
  // 根據匯出設定重新計算事件
  const exportEvents = useMemo(() => {
    const all = processEvents(Object.values(rawData).flat());
    const cities = [config.mainCity, ...config.compareCities];
    
    return all.filter(event => {
      const isTimeMatch = true; // 時間過濾已在 EventList 內部處理
      const isTypeMatch = (event.isNational && config.includeNationalEvents) || 
                          (!event.isNational && config.includeCityEvents && cities.includes(event.city));
      return isTimeMatch && isTypeMatch;
    });
  }, [config]);

  const citiesOrder = [config.mainCity, ...config.compareCities];

  return (
    <div className="fixed left-[-9999px] top-0 pointer-events-none">
      <div 
        ref={canvasRef}
        className="w-[1200px] bg-slate-50 p-12 flex flex-col gap-8"
        style={{ height: "auto", minHeight: "800px" }}
      >
        {/* Report Header */}
        <div className="flex items-center justify-between border-b-2 border-orange-600 pb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800">不動產大事紀報告</h1>
            <p className="text-slate-500 font-bold mt-2">
              觀察期間：{config.start.replace("_", " ")} → {config.end.replace("_", " ")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-orange-600 uppercase tracking-widest">Market Intelligence Report</p>
            <p className="text-xs text-slate-400 mt-1">產出時間：{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-10">
          
          {/* Chart Section */}
          {config.includeChart && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                房價中位數趨勢分析
              </h2>
              <div className="h-[400px] w-full">
                <DashboardChart 
                  selectedCities={citiesOrder}
                  startPeriod={config.start}
                  endPeriod={config.end}
                />
              </div>
            </div>
          )}

          {/* Events Section */}
          {(config.includeNationalEvents || config.includeCityEvents) && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                關鍵大事紀回顧
              </h2>
              {/* 注意：在匯出模式下，我們需要 EventList 不要捲動，而是撐開高度 */}
              <div className="w-full">
                <EventList 
                  data={exportEvents}
                  startPeriod={config.start}
                  endPeriod={config.end}
                  citiesOrder={citiesOrder}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>數據來源：政大不動產研究中心、永慶房產集團</span>
          <span>© Real Estate Record Intelligence System</span>
        </div>
      </div>
    </div>
  );
}
