"use client";

import dynamic from 'next/dynamic';
import { TrendingUp, ChevronUp } from "lucide-react";

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
  isChartOpen: boolean;
  setIsChartOpen: (isOpen: boolean) => void;
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
  dataType?: 'price' | 'index';
}

export default function DashboardChart({
  isChartOpen,
  setIsChartOpen,
  selectedCities,
  startPeriod,
  endPeriod,
  dataType = 'price',
}: DashboardChartProps) {
  
  const chartTitle = dataType === 'price' ? '房價中位數走勢圖' : '政大永慶房價指數';

  return (
    <div 
      onClick={() => setIsChartOpen(!isChartOpen)}
      className={`
        absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isChartOpen ? 'h-[300px] md:h-[400px]' : 'h-12'}
        cursor-pointer
      `}
    >
      <div 
        className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <div className="bg-white border border-slate-200 rounded-full pl-4 pr-3 py-1.5 shadow-md text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 transition-all">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          <span>{chartTitle}</span>
          <div className={`bg-slate-100 rounded-full p-0.5 transition-transform duration-300 ${isChartOpen ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronUp className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      </div>

      <div className={`
        h-full w-full p-4 pb-6 transition-all duration-300 delay-100
        ${isChartOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        <PriceChart 
          selectedCities={selectedCities} 
          startPeriod={startPeriod} 
          endPeriod={endPeriod} 
          dataType={dataType}
        />
      </div>
    </div>
  );
}