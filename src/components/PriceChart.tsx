"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Area,
  ComposedChart,
} from "recharts";
import { CITIES_CONFIG } from "@/config/cityColors";
import { getQuarterValue } from "@/utils/eventHelper";
import { rawPriceData } from "@/data/priceData";
import { rawIndexData } from "@/data/indexData";
import { CalendarRange } from "lucide-react";

interface PriceChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
  dataType?: 'price' | 'index';
  isSmallMode?: boolean;
}

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  stroke: string;
  payload: {
    quarter: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  unit?: string;
}

const CustomTooltip = ({ active, payload, label, unit }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 border border-neutral-200 rounded-xl shadow-2xl text-xs z-50 ring-1 ring-neutral-100">
        <p className="font-bold text-neutral-700 mb-2 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 rounded-full"></span>
          {label}
        </p>
        <div className="space-y-1.5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-3 min-w-30">
              <div 
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm" 
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="text-neutral-500 flex-1 font-medium">{entry.name}</span>
              <span className="font-mono font-bold text-neutral-700 text-sm">
                {Number(entry.value).toFixed(1)} 
                <span className="text-[10px] text-neutral-400 font-normal ml-1">{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const MobileTooltipDisplay = ({ payload, unit }: { payload: TooltipPayloadItem[] | null, unit: string }) => {
  const label = payload?.[0]?.payload?.quarter;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 text-xs h-16 border-b border-neutral-100 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-2 h-5">
         <p className="font-bold text-neutral-700 truncate flex items-center gap-2">
           {label ? (
             <>
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
               {label}
             </>
           ) : (
             <span className="text-neutral-400 font-normal flex items-center gap-1">
               <span className="animate-bounce">👆</span> 按住圖表滑動查看
             </span>
           )}
         </p>
      </div>
      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap h-8 overflow-hidden">
        {payload && payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
            <span className="text-neutral-500 font-medium">{entry.name}</span>
            <span className="font-mono font-bold text-neutral-700">
              {Number(entry.value).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TooltipSpy = React.memo(({ active, payload, setActiveDataPoint }: { active?: boolean; payload?: TooltipPayloadItem[]; setActiveDataPoint: (p: TooltipPayloadItem[] | null) => void }) => {
  const quarter = payload?.[0]?.payload?.quarter;

  useEffect(() => {
    if (active && payload && payload.length) {
      setActiveDataPoint(payload);
    } else {
      setActiveDataPoint(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, quarter, setActiveDataPoint]);

  return null;
});
TooltipSpy.displayName = 'TooltipSpy';


export default function PriceChart({ selectedCities, startPeriod, endPeriod, dataType = 'price' }: PriceChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeDataPoint, setActiveDataPoint] = useState<TooltipPayloadItem[] | null>(null);

  const sourceData = dataType === 'price' ? rawPriceData : rawIndexData;
  const unitLabel = dataType === 'price' ? "萬" : ""; 

  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    const safeData = sourceData || [];

    return safeData.map(item => ({
      rawQuarter: item.Quarter,
      quarter: item.Quarter.replace("_", " "),
      shortQuarter: item.Quarter.split("_")[0].slice(2) + (item.Quarter.includes("Q1") ? "'" : ""), // '13, '14...
      nation: item.Nation?.all ? (dataType === 'price' ? item.Nation.all / 10000 : item.Nation.all) : 0,
      taipei: item.Taipei?.all ? (dataType === 'price' ? item.Taipei.all / 10000 : item.Taipei.all) : 0,
      newTaipei: item.NewTaipei?.all ? (dataType === 'price' ? item.NewTaipei.all / 10000 : item.NewTaipei.all) : 0,
      taoyuan: item.Taoyuan?.all ? (dataType === 'price' ? item.Taoyuan.all / 10000 : item.Taoyuan.all) : 0,
      taichung: item.Taichung?.all ? (dataType === 'price' ? item.Taichung.all / 10000 : item.Taichung.all) : 0,
      tainan: item.Tainan?.all ? (dataType === 'price' ? item.Tainan.all / 10000 : item.Tainan.all) : 0,
      kaohsiung: item.Kaohsiung?.all ? (dataType === 'price' ? item.Kaohsiung.all / 10000 : item.Kaohsiung.all) : 0,
      hsinchu: item.Hsinchu?.all ? (dataType === 'price' ? item.Hsinchu.all / 10000 : item.Hsinchu.all) : 0,
    })).filter(item => {
      const currentVal = getQuarterValue(item.rawQuarter);
      return currentVal >= startVal && currentVal <= endVal;
    });
  }, [startPeriod, endPeriod, dataType, sourceData]);

  const [brushedData, setBrushedData] = useState(filteredData);
  // 新增狀態來追蹤目前顯示的時間範圍
  const [displayRange, setDisplayRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  
  // 初始化或資料更新時重置
  useEffect(() => {
    setBrushedData(filteredData);
    if (filteredData.length > 0) {
      setDisplayRange({
        start: filteredData[0].quarter,
        end: filteredData[filteredData.length - 1].quarter
      });
    }
  }, [filteredData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBrushChange = useCallback((range: any) => {
    if (range && filteredData.length > 0) {
      const { startIndex, endIndex } = range;
      const sliced = filteredData.slice(startIndex, endIndex + 1);
      setBrushedData(sliced);
      
      // 更新上方顯示的時間
      if (sliced.length > 0) {
        setDisplayRange({
          start: sliced[0].quarter,
          end: sliced[sliced.length - 1].quarter
        });
      }
    }
  }, [filteredData]);

  const formatXAxis = useCallback((tickItem: string) => {
    // 找出對應的資料項目
    const item = filteredData.find(d => d.quarter === tickItem);
    if (!item) return tickItem;

    if (isMobile) {
      // 手機版：只顯示年份，並且只在 Q1 顯示年份標記，讓軸線更乾淨
      return tickItem.includes("Q1") ? item.shortQuarter.replace("'", "20") : "";
    }
    return tickItem;
  }, [isMobile, filteredData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTooltipContent = useCallback((props: any) => {
    if (isMobile) {
      return <TooltipSpy {...props} setActiveDataPoint={setActiveDataPoint} />;
    }
    return <CustomTooltip {...props} unit={unitLabel} />;
  }, [isMobile, unitLabel, setActiveDataPoint]);

  const mainCityId = selectedCities.length > 0 ? selectedCities[0] : 'nation';
  const mainCityConfig = CITIES_CONFIG.find(c => c.id === mainCityId);
  const mainCityColor = mainCityConfig ? mainCityConfig.color : '#a3a3a3';

  return (
    <div className="w-full h-full select-none flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
      
      {/* 新增：動態時間範圍顯示器 (放在上方，解決 Brush 字太小的問題) */}
      <div className="flex items-center justify-end px-4 pt-2 pb-0">
        <div className="flex items-center gap-2 bg-neutral-100/80 px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm">
          <CalendarRange className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs font-bold text-neutral-600 font-mono">
            {displayRange.start} <span className="text-neutral-300 mx-1">→</span> {displayRange.end}
          </span>
        </div>
      </div>

      {isMobile && <MobileTooltipDisplay payload={activeDataPoint} unit={unitLabel} />}
      
      <div className="w-full flex-1 flex flex-col min-h-0">
        {/* Main Chart Area: Takes up all available space except for the brush */}
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={brushedData}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }} // 增加左右邊距，避免頭尾標籤被切掉
            >
              <defs>
                {/* 為每個城市定義漸層 */}
                <linearGradient id="colorNation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0}/>
                </linearGradient>
                {CITIES_CONFIG.map(city => (
                  <linearGradient key={city.id} id={`color-${city.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={city.color} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={city.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              
                          <XAxis 
                            dataKey="quarter"
                            tickFormatter={formatXAxis}
                            tick={{ 
                              fontSize: 11, 
                              fill: '#a3a3a3',
                              fontWeight: 500
                            } as any} 
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                            height={30}
                            interval={isMobile ? "preserveStartEnd" : 3} // 手機版自動隱藏過密的標籤
                            minTickGap={30}
                            padding={{ left: 15, right: 15 }} // ★ 新增：內部留白，確保頭尾標籤不會切到
                          />
              <YAxis 
                tick={{ fontSize: 10, fill: '#a3a3a3', fontWeight: 500 }} 
                tickLine={false}
                axisLine={false}
                width={40}
                unit={unitLabel}
                domain={['auto', 'auto']}
                orientation="right" // Y軸放右邊，閱讀視線比較順
              />
              
              <Tooltip
                wrapperStyle={isMobile ? { display: 'none' } : {}}
                cursor={{ stroke: '#a3a3a3', strokeWidth: 1, strokeDasharray: '5 5' }}
                content={renderTooltipContent}
              />
              
              {/* 這裡改用 ComposedChart 混和 Area 和 Line */}
              {/* 1. 全國 (虛線) */}
              <Line
                type="monotone"
                dataKey="nation"
                name="全國"
                stroke="#a3a3a3" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#a3a3a3' }}
                animationDuration={500}
              />

              {/* 2. 其他選中城市 (實線 + 漸層 Area) */}
              {CITIES_CONFIG.map((city) => {
                if (!selectedCities.includes(city.id)) return null;

                return (
                  <React.Fragment key={city.id}>
                    {/* 只有主城市顯示漸層背景，避免畫面太髒 */}
                    {city.id === selectedCities[0] && (
                      <Area
                        type="monotone"
                        dataKey={city.id}
                        stroke="none"
                        fill={`url(#color-${city.id})`}
                        animationDuration={500}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey={city.id}
                      name={city.label}
                      stroke={city.color}
                      strokeWidth={city.id === selectedCities[0] ? 3 : 2}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: city.color }}
                      animationDuration={500}
                    />
                  </React.Fragment>
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 優化後的 Brush 區域 - 固定高度 50px，確保永遠可見 */}
        <div className="h-12.5 w-full px-2 shrink-0">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <Brush 
                dataKey="quarter" 
                height={40} 
                stroke="#2563eb"     // ★ 選取框邊框：亮藍色，非常明顯
                travellerWidth={20} 
                fill="#eff6ff"       // ★ 選取框背景：淺藍色，與未選取區分
                fillOpacity={0.2}    // ★ 輕微透明
                tickFormatter={() => ""} 
                onChange={handleBrushChange}
                alwaysShowText={false}
              >
                {/* Brush 裡面的小縮圖 */}
                <Line 
                  type="monotone" 
                  dataKey={mainCityId} 
                  stroke={mainCityColor} 
                  strokeWidth={1.5} 
                  dot={false} 
                />
              </Brush>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}