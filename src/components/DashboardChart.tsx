"use client";

import PriceChart from "@/components/PriceChart";

interface DashboardChartProps {
  isChartOpen: boolean;
  setIsChartOpen: (isOpen: boolean) => void;
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
}

export default function DashboardChart({
  isChartOpen,
  setIsChartOpen,
  selectedCities,
  startPeriod,
  endPeriod,
}: DashboardChartProps) {
  return (
    <div 
      className={`
        absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 
        transition-all duration-300 ease-in-out
        ${isChartOpen ? 'h-70' : 'h-12'}
      `}
    >
      {/* 開關按鈕 (標題列) */}
      <div 
        onClick={() => setIsChartOpen(!isChartOpen)}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-50 flex items-center gap-2 group hover:scale-105 transition-transform"
      >
        <span>房價中位數走勢圖</span>
        <span className={`transition-transform duration-300 ${isChartOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </div>

      {/* 圖表內容區 */}
      <div className={`
        h-full w-full p-4 pb-6 transition-opacity duration-200
        ${isChartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <PriceChart 
          selectedCities={selectedCities} 
          startPeriod={startPeriod} 
          endPeriod={endPeriod} 
        />
      </div>
    </div>
  );
}