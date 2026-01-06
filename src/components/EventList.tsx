"use client";

import { useState, useMemo } from "react";

interface EventItem {
  year: number;
  quarter: string;
  title: string;
  description?: string;
  city?: string;
  category?: string;
  isNational?: boolean;
}

interface EventListProps {
  data: EventItem[];
}

interface GroupedQuarter {
  year: number;
  quarter: string;
  nationalEvents: EventItem[];
  localEvents: EventItem[];
}

export default function EventList({ data }: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 1. 資料分組 (邏輯不變，只是排序建議從舊到新，因為橫向捲動通常是時間軸向右)
  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedQuarter> = {};
    
    // 橫向時間軸建議：舊 -> 新 (從左到右)
    const sortedData = [...data].sort((a, b) => {
       if (a.year !== b.year) return a.year - b.year; 
       return a.quarter.localeCompare(b.quarter);
    });

    sortedData.forEach(event => {
      const key = `${event.year}_${event.quarter}`;
      if (!groups[key]) {
        groups[key] = {
          year: event.year,
          quarter: event.quarter,
          nationalEvents: [],
          localEvents: []
        };
      }
      if (event.isNational) {
        groups[key].nationalEvents.push(event);
      } else {
        groups[key].localEvents.push(event);
      }
    });

    return Object.values(groups).sort((a, b) => {
       if (a.year !== b.year) return a.year - b.year;
       return a.quarter.localeCompare(b.quarter);
    });
  }, [data]);

  // 2. 卡片渲染元件
  const renderEventCard = (event: EventItem, index: number, type: 'nat' | 'loc') => {
    const uniqueId = `${event.year}_${event.quarter}_${type}_${index}`;
    const isOpen = expandedId === uniqueId;
    const isNational = type === 'nat';

    return (
      <div 
        key={uniqueId}
        className={`
          w-[280px] border rounded-lg p-3 shadow-sm transition-all duration-300 relative shrink-0 text-left
          ${isOpen ? "bg-slate-50 border-blue-200 shadow-md ring-1 ring-blue-100 z-50" : "bg-white border-slate-100 hover:shadow-md z-10"}
          
          /* 箭頭：全國(上)往下指，地方(下)往上指 */
          before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:w-2.5 before:h-2.5 before:bg-inherit before:border-t before:border-r before:border-inherit before:rotate-[135deg]
          ${isNational 
            ? "mb-4 before:-bottom-[6px]" // 全國在上，箭頭向下
            : "mt-4 before:-top-[6px] before:rotate-[-45deg]" // 地方在下，箭頭向上
          }
        `}
      >
        <div className="cursor-pointer" onClick={() => event.description && toggleExpand(uniqueId)}>
          <h3 className={`text-sm font-bold mb-1 leading-snug line-clamp-2 ${isOpen ? "text-blue-700 line-clamp-none" : "text-slate-800"}`}>
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-1">
            {isNational ? (
              <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded">全國</span>
            ) : (
              <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">在地</span>
            )}
            {event.category && (
              <span className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded truncate max-w-[100px]">#{event.category}</span>
            )}
          </div>
        </div>

        {event.description && isOpen && (
          <div className="mt-2 pt-2 border-t border-slate-200 animate-in fade-in zoom-in-95 duration-200">
             <div 
               className="prose prose-xs text-slate-600 max-w-none leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar"
               dangerouslySetInnerHTML={{ __html: event.description }} 
             />
             <button onClick={(e) => { e.stopPropagation(); toggleExpand(uniqueId); }} className="w-full text-center text-[10px] text-slate-400 hover:text-blue-600 mt-2">收合內容</button>
          </div>
        )}
        
        {/* 展開提示按鈕 */}
        {event.description && !isOpen && (
           <button onClick={(e) => { e.stopPropagation(); toggleExpand(uniqueId); }} className="text-[10px] text-slate-300 hover:text-blue-600 flex items-center gap-1 mt-1">
             <span>詳情</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      
      {/* 頂部標示列 */}
      <div className="absolute top-4 left-6 z-20 flex gap-4 text-xs font-bold text-slate-400 bg-white/90 backdrop-blur px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          <span>全國/歷史 (上)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>在地建設 (下)</span>
        </div>
      </div>

      {/* 橫向捲動容器 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative px-10">
        
        {/* 中央軸線 (水平) */}
        <div className="absolute top-1/2 left-0 w-[max-content] min-w-full h-0.5 bg-slate-200 z-0 mt-[-1px]"></div>

        <div className="flex items-center h-full gap-8 min-w-max pt-10 pb-4">
          {groupedData.map((group) => (
            <div key={`${group.year}_${group.quarter}`} className="flex flex-col items-center h-full min-w-[280px] relative group">
              
              {/* === 上半部：全國事件 (National) === */}
              {/* 使用 justify-end 讓卡片貼近中線 */}
              <div className="flex-1 flex flex-col justify-end w-full items-center pb-6 space-y-2">
                {group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))}
              </div>

              {/* === 中間：時間點 === */}
              <div className="shrink-0 z-20 relative">
                 <div className={`
                    w-10 h-10 rounded-full flex flex-col items-center justify-center text-[10px] font-bold shadow-md border-2 bg-white transition-transform hover:scale-110
                    ${(group.nationalEvents.length > 0 && group.localEvents.length > 0)
                      ? "text-slate-800 border-purple-500" 
                      : (group.nationalEvents.length > 0)
                        ? "text-slate-600 border-slate-400"
                        : "text-blue-600 border-blue-400"
                    }
                 `}>
                   <span className="leading-none">{group.year}</span>
                   <span className="leading-none opacity-80">{group.quarter}</span>
                 </div>
                 {/* 垂直輔助線 */}
                 <div className="absolute top-[-100vh] bottom-[-100vh] left-1/2 w-[1px] border-l border-dashed border-slate-200 -z-10 group-hover:border-slate-400 transition-colors"></div>
              </div>

              {/* === 下半部：地方事件 (Local) === */}
              {/* 使用 justify-start 讓卡片貼近中線 */}
              <div className="flex-1 flex flex-col justify-start w-full items-center pt-6 space-y-2">
                {group.localEvents.map((event, idx) => renderEventCard(event, idx, 'loc'))}
              </div>

            </div>
          ))}
          
          {/* 結尾空白，方便閱讀最後一筆 */}
          <div className="w-10"></div>
        </div>
      </div>
    </div>
  );
}