"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { TrendingUp } from "lucide-react";

// Dynamically import PriceChart with SSR turned off
const PriceChart = dynamic(() => import('@/components/PriceChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-sm text-slate-400">圖表載入中...</p>
    </div>
  ),
});

interface DashboardChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
}

export default function DashboardChart({
  selectedCities,
  startPeriod,
  endPeriod,
}: DashboardChartProps) {
  
  const chartTitle = '房價中位數走勢圖';

  return (
    <div className="w-full h-full bg-white border-t border-slate-200 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
      {/* Chart Title Bar */}
      <div className="shrink-0 h-10 border-b border-slate-100 flex items-center px-4 gap-2">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-bold text-slate-700">{chartTitle}</h3>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full p-2">
        <PriceChart 
          selectedCities={selectedCities} 
          startPeriod={startPeriod} 
          endPeriod={endPeriod} 
          isSmallMode={false} // isSmallMode is kept for brush visibility, but chart is not resizable.
        />
      </div>
    </div>
  );
}
