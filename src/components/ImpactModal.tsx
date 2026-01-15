"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { X, Activity } from "lucide-react";
import { CITIES_CONFIG } from "@/config/cityColors";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";

interface ImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    quarter: string;
    year: number;
    description?: string;
    city?: string;
  } | null;
  mainCity: string;
}

export default function ImpactModal({ isOpen, onClose, event, mainCity }: ImpactModalProps) {
  if (!isOpen || !event) return null;

  const chartData = useMemo(() => {
    const eventVal = getQuarterValue(`${event.year}_${event.quarter}`);
    const startVal = eventVal - 6; 
    const endVal = eventVal + 8;   

    return rawPriceData
      .map(item => {
        const cityKey = mainCity === 'nation' 
          ? 'Nation' 
          : mainCity.charAt(0).toUpperCase() + mainCity.slice(1);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cityData = (item as any)[cityKey];

        return {
          quarter: item.Quarter.replace("_", " "),
          rawQuarter: item.Quarter,
          val: getQuarterValue(item.Quarter),
          price: cityData?.all ? cityData.all / 10000 : 0
        };
      })
      .filter(item => item.val >= startVal && item.val <= endVal);
  }, [event, mainCity]);

  const mainCityConfig = CITIES_CONFIG.find(c => c.id === mainCity);
  const cityName = mainCityConfig ? mainCityConfig.label : "全國";
  const cityColor = mainCityConfig ? mainCityConfig.color : "#525252"; // neutral-600

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/50">
        
        <div className="px-8 py-6 border-b border-neutral-200/50 flex justify-between items-start bg-white/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider shadow-md shadow-blue-600/20">
                數據對照
              </span>
              <span className="text-xs font-bold text-neutral-500">
                {event.year} {event.quarter}
              </span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 leading-tight pr-8">
              {event.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/50 hover:bg-white text-neutral-400 hover:text-red-500 transition-all shadow-sm border border-neutral-100/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 bg-white/50 p-5 rounded-[32px] border border-white/60 shadow-sm">
             <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Activity className="w-7 h-7" />
             </div>
             <div>
               <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">觀測期間：事件前後約 1.5 年</p>
               <p className="text-lg font-black text-neutral-800">
                 {cityName} 住宅中位數價格趨勢
               </p>
             </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 30, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis 
                  dataKey="quarter" 
                  tick={{ fontSize: 10, fill: '#a3a3a3', fontWeight: 600 }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e5e5e5' }}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: 10, fill: '#a3a3a3', fontWeight: 600 }} 
                  tickLine={false} 
                  axisLine={false}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}
                  itemStyle={{ color: '#404040', fontWeight: 'bold', fontSize: '12px' }}
                />
                <ReferenceLine x={`${event.year} ${event.quarter}`} stroke="#2563eb" strokeDasharray="3 3" label={{ position: 'top', value: '事件點', fill: '#2563eb', fontSize: 10, fontWeight: 'bold' }} />
                
                <Line
                  type="monotone"
                  dataKey="price"
                  name={`${cityName}均價`}
                  stroke={cityColor}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#2563eb' }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-[10px] text-neutral-400 text-center mt-4">
            * 數據來源：內政部實價登錄 / 本站彙整計算
          </p>
        </div>
      </div>
    </div>
  );
}