"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";
import { CITIES_CONFIG, NATIONAL_CONFIG } from "@/config/cityColors";

// 確保有資料，否則圖表會掛掉
const safePriceData = rawPriceData || [];

// 預先處理資料格式
const baseChartData = safePriceData.map(item => ({
  rawQuarter: item.Quarter,
  quarter: item.Quarter.replace("_", " "),
  // 為了安全，加上 ?. 檢查
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
  selectedCities: string[]; // 接收選中的城市 ID 陣列
  startPeriod: string;      // 開始時間
  endPeriod: string;        // 結束時間
}

export default function PriceChart({ selectedCities, startPeriod, endPeriod }: PriceChartProps) {
  
  // 根據時間篩選資料
  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return baseChartData.filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod]);

  // 如果沒有資料，顯示提示
  if (filteredData.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">尚無此區間數據</div>;
  }

  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="quarter" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickLine={false} 
            axisLine={{ stroke: '#e2e8f0' }} 
            minTickGap={30} 
          />
          <YAxis 
            unit="萬" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            axisLine={false} 
            tickLine={false} 
            domain={['auto', 'auto']} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>

          {/* 全國基準線 (永遠顯示) */}
          <Line 
            type="monotone" 
            dataKey="nation" 
            name="全國均價" 
            stroke={NATIONAL_CONFIG.color} 
            strokeWidth={2} 
            dot={false} 
            strokeDasharray="4 4" 
            activeDot={{ r: 4 }}
          />

          {/* 根據勾選的城市動態繪製線條 */}
          {CITIES_CONFIG.map((city) => {
            // 只有當這個城市在 selectedCities 裡面時才畫出來
            if (selectedCities.includes(city.id)) {
              return (
                <Line
                  key={city.id}
                  type="monotone"
                  dataKey={city.id}
                  name={city.label}
                  stroke={city.color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
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