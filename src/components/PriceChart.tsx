"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { rawPriceData } from "@/data/priceData";
import { getQuarterValue } from "@/utils/eventHelper";

// 靜態設定
const cityConfig = {
  taipei: { name: "台北市", color: "#247533" },
  newTaipei: { name: "新北市", color: "#297270" },
  hsinchu: { name: "新竹縣市", color: "#2998d8" },
  taoyuan: { name: "桃園市", color: "#8ab07c" },
  taichung: { name: "台中市", color: "#e7c66b" },
  tainan: { name: "台南市", color: "#f3a361" },
  kaohsiung: { name: "高雄市", color: "#e66d50" },
};

// 基礎資料處理
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
  selectedCities: string[]; // ⚠️ 修改：改成接收字串陣列
  startPeriod: string;
  endPeriod: string;
}

export default function PriceChart({ selectedCities, startPeriod, endPeriod }: PriceChartProps) {
  
  // 根據時間篩選
  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);

    return baseChartData.filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod]);

  return (
    <div className="w-full h-full bg-white rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="quarter" 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            tickLine={false}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis unit="萬" tick={{ fill: '#64748b', fontSize: 12 }} domain={['auto', 'auto']} />
          
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => Number(value).toFixed(1) + " 萬/坪"} 
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>

          {/* 全國 (永遠顯示，作為基準線) */}
          <Line 
            type="monotone" 
            dataKey="nation" 
            name="全國" 
            stroke="#334155" 
            strokeWidth={3} 
            dot={false} 
            strokeDasharray="5 5" 
          />

          {/* 城市線條：檢查是否在 selectedCities 陣列中 */}
          {Object.entries(cityConfig).map(([key, config]) => {
            // 邏輯：如果選了 "all" 或者 該城市在選取名單中，就顯示
            if (selectedCities.includes("all") || selectedCities.includes(key)) {
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={config.name}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 3 }} // 顯示小圓點方便辨識
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