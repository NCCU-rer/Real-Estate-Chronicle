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
} from "recharts";
import { CITIES_CONFIG } from "@/config/cityColors";
import { getQuarterValue } from "@/utils/eventHelper";
import { rawPriceData } from "@/data/priceData";
import { rawIndexData } from "@/data/indexData";

interface PriceChartProps {
  selectedCities: string[];
  startPeriod: string;
  endPeriod: string;
  dataType?: 'price' | 'index';
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-slate-200 rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 min-w-30">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="text-slate-500 flex-1">{entry.name}</span>
              <span className="font-mono font-bold text-slate-700">
                {Number(entry.value).toFixed(1)} 
                <span className="text-[10px] text-slate-400 font-normal ml-1">{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const MobileTooltipDisplay = ({ payload, unit }: { payload: any[] | null, unit: string }) => {
  const label = payload?.[0]?.payload?.quarter;

  return (
    <div className="bg-white p-3 text-xs h-16 border-b border-slate-100">
      <p className="font-bold text-slate-700 mb-2 h-5 truncate">
        {label || <span className="text-slate-400 font-normal">在圖表上按住並滑動來查看數據</span>}
      </p>
      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap h-8 overflow-hidden">
        {payload && payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-mono font-bold text-slate-700">
              {Number(entry.value).toFixed(1)}
              <span className="text-[10px] text-slate-400 font-normal ml-1">{unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TooltipSpy = React.memo(({ active, payload, setActiveDataPoint }: any) => {
  const quarter = payload?.[0]?.payload?.quarter;

  useEffect(() => {
    if (active && payload && payload.length) {
      setActiveDataPoint(payload);
    } else {
      setActiveDataPoint(null);
    }
  }, [active, quarter, setActiveDataPoint]);

  return null;
});
TooltipSpy.displayName = 'TooltipSpy';


export default function PriceChart({ selectedCities, startPeriod, endPeriod, dataType = 'price' }: PriceChartProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDataPoint, setActiveDataPoint] = useState<any[] | null>(null);

  useEffect(() => {
    setHasMounted(true);
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const formatXAxis = (tickItem: string) => {
    if (hasMounted && isMobile) {
      return tickItem.substring(0, 4);
    }
    return tickItem;
  };
  
  const sourceData = dataType === 'price' ? rawPriceData : rawIndexData;
  const unitLabel = dataType === 'price' ? "萬" : ""; 

  const renderTooltipContent = useCallback((props: any) => {
    if (hasMounted && isMobile) {
      return <TooltipSpy {...props} setActiveDataPoint={setActiveDataPoint} />;
    }
    return <CustomTooltip {...props} unit={unitLabel} />;
  }, [hasMounted, isMobile, unitLabel, setActiveDataPoint]);

  const filteredData = useMemo(() => {
    const startVal = getQuarterValue(startPeriod);
    const endVal = getQuarterValue(endPeriod);
    
    const safeData = sourceData || [];

    return safeData.map(item => ({
      rawQuarter: item.Quarter,
      quarter: item.Quarter.replace("_", " "),
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

  return (
    <div className="w-full h-full select-none flex flex-col">
      {hasMounted && isMobile && <MobileTooltipDisplay payload={activeDataPoint} unit={unitLabel} />}
      
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="quarter"
              tickFormatter={formatXAxis}
              tick={{ 
                fontSize: 10, 
                fill: '#94a3b8',
                angle: hasMounted && isMobile ? 0 : -45,
                textAnchor: hasMounted && isMobile ? 'middle' : 'end',
                dy: hasMounted && isMobile ? 10 : 10,
                dx: hasMounted && isMobile ? 0 : -5,
              } as any} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              height={60}
              interval={hasMounted && isMobile ? 3 : 0} 
            />

            <YAxis 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              tickLine={false}
              axisLine={false}
              width={35}
              unit={unitLabel}
              domain={['auto', 'auto']}
            />
            
            <Tooltip
              wrapperStyle={hasMounted && isMobile ? { display: 'none' } : {}}
              cursor={hasMounted && isMobile ? false : { stroke: '#cbd5e1', strokeWidth: 1 }}
              content={renderTooltipContent}
            />
            
            <Line
              type="monotone"
              dataKey="nation"
              name="全國"
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={300}
            />

            {CITIES_CONFIG.map((city) => {
              if (!selectedCities.includes(city.id)) return null;

              return (
                <Line
                  key={city.id}
                  type="monotone"
                  dataKey={city.id}
                  name={city.label}
                  stroke={city.color}
                  strokeWidth={city.id === selectedCities[0] ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  animationDuration={300}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}