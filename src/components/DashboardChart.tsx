"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronUp, ChevronsUp, ChevronsDown } from "lucide-react";

// Dynamically import PriceChart with SSR turned off
const PriceChart = dynamic(() => import('@/components/PriceChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-sm text-neutral-400">圖表載入中...</p>
    </div>
  ),
});

interface DashboardChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
  dataType?: 'price' | 'index';
  onVisibilityChange: (isVisible: boolean) => void;
  // 新增：通知父層尺寸改變，以便調整 Padding
  onSizeChange?: (size: DrawerSize) => void;
}

type DrawerSize = 'closed' | 'small' | 'large';

export default function DashboardChart({
  selectedCities,
  startPeriod,
  endPeriod,
  dataType = 'price',
  onVisibilityChange,
  onSizeChange,
}: DashboardChartProps) {
  
  const chartTitle = dataType === 'price' ? '房價中位數走勢圖' : '政大永慶房價指數';
  const [drawerSize, setDrawerSize] = useState<DrawerSize>('large');
  const [lastOpenSize, setLastOpenSize] = useState<DrawerSize>('large');

  const handleToggle = () => {
    setDrawerSize(prevSize => {
      if (prevSize === 'closed') {
        return lastOpenSize;
      } else {
        setLastOpenSize(prevSize);
        return 'closed';
      }
    });
  };

  const getHeightClass = () => {
    switch (drawerSize) {
      // 加高 Small Mode 高度 (220px -> 260px) 以容納 Brush
      case 'small': return 'h-[260px]'; 
      case 'large': return 'h-[320px] md:h-[400px]'; // 稍微調小放大模式的高度 (原為 350/450)
      case 'closed':
      default:
        return 'h-12';
    }
  };

  const isChartVisible = drawerSize !== 'closed';
  const isSmallMode = drawerSize === 'small';

  useEffect(() => {
    onVisibilityChange(isChartVisible);
  }, [isChartVisible, onVisibilityChange]);

  // 新增：當尺寸改變時通知父層
  useEffect(() => {
    if (onSizeChange) {
      onSizeChange(drawerSize);
    }
  }, [drawerSize, onSizeChange]);

  return (
    <div 
      className={`
        absolute bottom-0 left-0 right-0 z-40 
        bg-white/80 backdrop-blur-2xl border-t border-white/40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        rounded-t-[40px]
        ${getHeightClass()}
      `}
    >
      {/* Integrated Control Panel */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-full shadow-lg shadow-blue-900/5 p-1.5 flex items-center gap-2 ring-1 ring-blue-100/50">
          {/* Main Title and Toggle */}
          <div 
            onClick={handleToggle}
            className="cursor-pointer pl-2.5 pr-1 flex items-center gap-2 group"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest group-hover:text-neutral-800 transition-colors">{chartTitle}</span>
            <div className={`bg-blue-50/50 rounded-full p-0.5 transition-transform duration-300 ${isChartVisible ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronUp className="w-3 h-3 text-blue-400" />
            </div>
          </div>
          
          {/* Separator */}
          <div className={`h-4 w-px bg-neutral-200/50 transition-opacity ${isChartVisible ? 'opacity-100' : 'opacity-0'}`} />

          {/* Size Controls */}
          <div className={`flex items-center gap-1 transition-opacity ${isChartVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => { e.stopPropagation(); setDrawerSize('large'); setLastOpenSize('large'); }}
              className={`p-1 rounded-full transition-colors ${drawerSize === 'large' ? 'bg-blue-100 text-blue-700' : 'text-neutral-400 hover:bg-neutral-100'}`}
              title="放大"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setDrawerSize('small'); setLastOpenSize('small'); }}
              className={`p-1 rounded-full transition-colors ${drawerSize === 'small' ? 'bg-blue-100 text-blue-700' : 'text-neutral-400 hover:bg-neutral-100'}`}
              title="縮小"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`
        h-full w-full p-4 pb-6 pt-8 transition-opacity duration-300
        ${isChartVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <PriceChart 
          selectedCities={selectedCities} 
          startPeriod={startPeriod} 
          endPeriod={endPeriod} 
          dataType={dataType}
          isSmallMode={isSmallMode} // Pass down the small mode flag
        />
      </div>
    </div>
  );
}