"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";

const cityConfig = {
  taipei: { name: "台北市", color: "#247533" },
  newTaipei: { name: "新北市", color: "#297270" },
  hsinchu: { name: "新竹縣市", color: "#2998d8" },
  taoyuan: { name: "桃園市", color: "#8ab07c" },
  taichung: { name: "台中市", color: "#e7c66b" },
  tainan: { name: "台南市", color: "#f3a361" },
  kaohsiung: { name: "高雄市", color: "#e66d50" },
};

// 資料預處理：轉成 LineChart 易讀的格式
const baseChartData = rawPriceData.map(item => ({
  rawQuarter: item.Quarter,
  quarter: item.Quarter.replace("_", " "), // X軸顯示文字
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
  // 為了相容性保留這兩個 props，但在 RWD 模式下我們不會用到它們
  width?: number;
  height?: number;
}

export default function PriceChart({ selectedCities, startPeriod, endPeriod }: PriceChartProps) {
  
  // 根據使用者選的時間區間過濾資料
  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    return baseChartData.filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod]);

  return (
    // 使用 w-full h-full 讓它自動填滿父層容器 (也就是底部的 25vh)
    <div className="w-full h-full select-none">
      {/* ✨ 關鍵修正：加回 ResponsiveContainer，讓圖表自動適應寬高 */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={filteredData} 
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
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
          <Legend wrapperStyle={{ paddingTop: '5px' }}/>

          {/* 全國基準線 (虛線) */}
          <Line 
            type="monotone" 
            dataKey="nation" 
            name="全國均價" 
            stroke="#cbd5e1" 
            strokeWidth={2} 
            dot={false} 
            strokeDasharray="4 4" 
            activeDot={{ r: 4 }}
          />

          {/* 繪製各城市線條 */}
          {Object.entries(cityConfig).map(([key, config]) => {
            if (selectedCities.includes("all") || selectedCities.includes(key)) {
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={config.name}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 2 }} // 小圓點
                  activeDot={{ r: 6 }} // 滑鼠移上去變大
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