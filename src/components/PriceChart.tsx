"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";
// ✨ 匯入統一設定
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors";

// 資料預處理 (保持不變)
const baseChartData = rawPriceData.map(item => ({
  rawQuarter: item.Quarter,
  quarter: item.Quarter.replace("_", " "),
  nation: item.Nation.all / 10000,
  taipei: item.Taipei.all / 10000,
  newTaipei: item.NewTaipei.all / 10000,
  taoyuan: item.Taoyuan.all / 10000,
  taichung: item.Taichung.all / 10000,
  tainan: item.Tainan.all / 10000,
  kaohsiung: item.Kaohsiung.all / 10000,
  hsinchu: item.Hsinchu.all / 10000,
}));

interface PriceChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
}

export default function PriceChart({ selectedCities, startPeriod, endPeriod }: PriceChartProps) {
  
  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return baseChartData.filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod]);

  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} minTickGap={30} />
          <YAxis unit="萬" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: '5px' }}/>

          {/* 全國基準線 */}
          <Line 
            type="monotone" 
            dataKey="nation" 
            name="全國均價" 
            stroke={NATIONAL_CONFIG.color} // ✨ 使用統一顏色
            strokeWidth={2} 
            dot={false} 
            strokeDasharray="4 4" 
            activeDot={{ r: 4 }}
          />

          {/* 繪製各城市線條 */}
          {CITIES_CONFIG.map((city) => {
            if (selectedCities.includes("all") || selectedCities.includes(city.id)) {
              return (
                <Line
                  key={city.id}
                  type="monotone"
                  dataKey={city.id}
                  name={city.label}
                  stroke={city.color} // ✨ 使用統一顏色
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
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