"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors";

const safePriceData = rawPriceData || [];

const baseChartData = safePriceData.map(item => ({
  rawQuarter: item.Quarter,
  quarter: item.Quarter.replace("_", " "),
  nation: item.Nation?.all ? item.Nation.all / 10000 : 0,
  taipei: item.Taipei?.all ? item.Taipei.all / 10000 : 0,
  newTaipei: item.NewTaipei?.all ? item.NewTaipei.all / 10000 : 0,
  taoyuan: item.Taoyuan?.all ? item.Taoyuan.all / 10000 : 0,
  taichung: item.Taichung?.all ? item.Taichung.all / 10000 : 0,
  tainan: item.Tainan?.all ? item.Tainan.all / 10000 : 0,
  kaohsiung: item.Kaohsiung?.all ? item.Kaohsiung.all / 10000 : 0,
  hsinchu: item.Hsinchu?.all ? item.Hsinchu.all / 10000 : 0,
}));

interface PriceChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
}

// ✨ 修正：使用 any 繞過 TypeScript 對 Recharts Tooltip 的嚴格檢查
// 這樣可以確保 active, payload, label 都能正常讀取而不報錯
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl text-xs text-white">
        <p className="font-bold mb-2 text-slate-300 border-b border-slate-700 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 min-w-120px">
              <div 
                className="w-2 h-2 rounded-full shadow-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-200 flex-1">{entry.name}</span>
              <span className="font-mono font-bold text-white">
                {Number(entry.value).toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">萬</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function PriceChart({ selectedCities, startPeriod, endPeriod }: PriceChartProps) {
  
  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return baseChartData.filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod]);

  if (filteredData.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400 text-sm">此區間尚無數據</div>;
  }

  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="quarter" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickLine={false} 
            axisLine={{ stroke: '#e2e8f0' }} 
            minTickGap={30} 
          />
          <YAxis 
            unit="萬" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
            domain={['auto', 'auto']} 
            width={35}
          />
          {/* ✨ 使用修正後的 CustomTooltip */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}/>

          <Line 
            type="monotone" 
            dataKey="nation" 
            name="全國均價" 
            stroke={NATIONAL_CONFIG.color} 
            strokeWidth={2} 
            dot={false} 
            strokeDasharray="4 4" 
            activeDot={{ r: 4, strokeWidth: 0 }}
          />

          {CITIES_CONFIG.map((city) => {
            if (selectedCities.includes(city.id)) {
              return (
                <Line
                  key={city.id}
                  type="monotone"
                  dataKey={city.id}
                  name={city.label}
                  stroke={city.color}
                  strokeWidth={2}
                  dot={{ r: 0 }} 
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  animationDuration={1000}
                />
              );
            }
            return null;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}