"use client";

import { useState, useMemo } from "react";

// 定義事件資料的型別
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

// 定義分組後的結構
interface GroupedQuarter {
  year: number;
  quarter: string;
  nationalEvents: EventItem[];
  localEvents: EventItem[];
}

export default function EventList({ data }: EventListProps) {
  // 狀態：使用複合字串 (例如 "2024_Q1_nat_0") 來記錄哪一個特定卡片被展開
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 1. 資料前處理：將散亂的事件依照「季度」進行分組
  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedQuarter> = {};
    
    // 依照時間排序 (新的在前)
    // 注意：原本傳進來的 data 可能已經排好序，或是亂的，這裡建議確保排序
    const sortedData = [...data].sort((a, b) => {
       if (a.year !== b.year) return b.year - a.year; // 年份降冪
       // 季度 Q4 -> Q1 降冪
       return b.quarter.localeCompare(a.quarter);
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

    // 轉回陣列以便 map 渲染
    return Object.values(groups).sort((a, b) => {
       if (a.year !== b.year) return b.year - a.year;
       return b.quarter.localeCompare(a.quarter);
    });
  }, [data]);

  // 2. 渲染單一事件卡片的元件 (抽出來避免程式碼重複)
  const renderEventCard = (event: EventItem, index: number, type: 'nat' | 'loc') => {
    const uniqueId = `${event.year}_${event.quarter}_${type}_${index}`;
    const isOpen = expandedId === uniqueId;
    const isNational = type === 'nat';

    return (
      <div 
        key={uniqueId}
        className={`
          border rounded-lg p-3 shadow-sm transition-all duration-300 relative mb-3 last:mb-0
          ${isOpen ? "bg-slate-50 border-blue-200 shadow-md ring-1 ring-blue-100" : "bg-white border-slate-100 hover:shadow-md"}
          
          /* 電腦版箭頭：全國向右指，地方向左指 */
          md:before:content-[''] md:before:absolute md:before:top-4 md:before:w-2.5 md:before:h-2.5 md:before:bg-inherit md:before:border-t md:before:border-r md:before:border-inherit md:before:rotate-45 md:before:z-10
          ${isNational 
            ? "md:mr-6 md:before:-right-[6px] md:before:border-l-0 md:before:border-b-0" 
            : "md:ml-6 md:before:-left-[6px] md:before:border-t-0 md:before:border-r-0 md:before:rotate-[225deg]"
          }
        `}
      >
        {/* 卡片標題 */}
        <div 
          className="cursor-pointer" 
          onClick={() => event.description && toggleExpand(uniqueId)}
        >
          <h3 className={`text-base font-bold mb-1 leading-snug ${isOpen ? "text-blue-700" : "text-slate-800"}`}>
            {event.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-2">
            {isNational ? (
              <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded">全國/歷史</span>
            ) : (
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">在地大事</span>
            )}
            {event.category && (
              <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded">#{event.category}</span>
            )}
          </div>
        </div>

        {/* 展開內容 */}
        {event.description && (
          <div>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-slate-200 animate-in slide-in-from-top-2 fade-in duration-200">
                <div 
                  className="prose prose-sm text-slate-600 max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description }} 
                />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(uniqueId);
              }}
              className="text-xs font-medium flex items-center gap-1 transition-colors mt-2 text-slate-400 hover:text-blue-600"
            >
              {isOpen ? (
                <>
                  <span>收合內容</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 rotate-180"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </>
              ) : (
                <>
                  <span>查看詳細內容</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative pb-10">
      
      {/* 頂部標題列 */}
      <div className="hidden md:flex justify-between items-center mb-6 text-sm font-bold text-slate-400 border-b border-slate-200 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20">
        <div className="w-[45%] text-right pr-6 flex items-center justify-end gap-2">
          <span>全國/歷史大事</span>
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
        </div>
        <div className="text-xs text-slate-300">時間軸</div>
        <div className="w-[45%] pl-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>在地建設/房市</span>
        </div>
      </div>

      <div className="relative">
        {/* 中央軸線 */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-ml-[1px] z-0"></div>

        {/* 迭代每一個「季度群組」 */}
        <div className="space-y-8 md:space-y-6 relative z-10">
          {groupedData.map((group) => (
            <div key={`${group.year}_${group.quarter}`} className="relative md:flex md:items-start md:justify-between w-full group">
              
              {/* === 左側：全國事件 (National) === */}
              {/* 電腦版：寬度 45%，靠右對齊文字 / 手機版：不做限制，但在下方顯示 */}
              <div className="pl-12 md:pl-0 md:w-[45%] md:flex md:flex-col md:items-end">
                {group.nationalEvents.length > 0 ? (
                  group.nationalEvents.map((event, idx) => renderEventCard(event, idx, 'nat'))
                ) : (
                  // 如果這季沒有全國事件，電腦版留白
                  <div className="hidden md:block h-1"></div> 
                )}
              </div>

              {/* === 中間：時間點 (Timeline Dot) === */}
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 flex items-center justify-center">
                 {/* 判斷這一季的顏色：如果兩邊都有事件用混色，單邊則用該邊顏色 */}
                 <div className={`
                    w-9 h-9 rounded-full flex flex-col items-center justify-center text-[10px] font-bold shadow-sm border-2 bg-white z-20
                    ${(group.nationalEvents.length > 0 && group.localEvents.length > 0)
                      ? "text-slate-800 border-purple-500" // 雙邊都有 (紫色框提示熱鬧)
                      : (group.nationalEvents.length > 0)
                        ? "text-slate-600 border-slate-400" // 只有全國 (灰)
                        : "text-blue-600 border-blue-400"   // 只有地方 (藍)
                    }
                 `}>
                   <span className="leading-none">{group.year}</span>
                   <span className="leading-none opacity-80">{group.quarter}</span>
                 </div>
              </div>

              {/* === 右側：地方事件 (Local) === */}
              {/* 電腦版：寬度 45% / 手機版：在下方堆疊 */}
              <div className="pl-12 md:pl-0 md:w-[45%] md:flex md:flex-col md:items-start mt-2 md:mt-0">
                {group.localEvents.length > 0 ? (
                  group.localEvents.map((event, idx) => renderEventCard(event, idx, 'loc'))
                ) : (
                   <div className="hidden md:block h-1"></div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}