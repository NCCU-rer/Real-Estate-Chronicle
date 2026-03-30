"use client";

import React from "react";
import { Zap, Loader2 } from "lucide-react";

interface ExportLoadingOverlayProps {
  isVisible: boolean;
  progress: number;
}

export default function ExportLoadingOverlay({ isVisible, progress }: ExportLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-lg flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
      
      {/* 頂部裝飾 */}
      <div className="absolute top-12 flex items-center gap-3 opacity-50">
        <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-[#B7791F]"></div>
        <Zap className="w-5 h-5 text-[#B7791F]" />
        <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-[#B7791F]"></div>
      </div>

      <div className="w-full max-w-md px-10 flex flex-col items-center">
        {/* 動態進度圓環 */}
        <div className="relative mb-10">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-white/10"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progress) / 100}
              className="text-[#B7791F] transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black font-mono">{progress}%</span>
            <span className="text-[10px] font-bold text-[#B7791F] uppercase tracking-widest">Progress</span>
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-[0.2em] mb-4 text-center">
          正在輸出報告
        </h2>
        
        <p className="text-slate-400 text-sm font-medium mb-8 text-center leading-relaxed">
          系統正在輸出資料中<br/>
          請勿關閉視窗，確保資料完整輸出
        </p>

        {/* 橘白條紋進度條 */}
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
          <div 
            className="h-full bg-[#B7791F] transition-all duration-500 ease-out relative"
            style={{ 
              width: `${progress}%`,
              backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
              backgroundSize: '30px 30px',
              animation: 'stripe-move 1s linear infinite'
            }}
          >
            {/* 進度條光暈 */}
            <div className="absolute inset-0 shadow-[0_0_15px_#B7791F80]"></div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <Loader2 className="w-4 h-4 animate-spin text-[#B7791F]" />
          <span className="text-[11px] font-bold text-slate-300">
            {progress < 100 ? "排版處理中..." : "檔案準備完成，即將開始下載"}
          </span>
        </div>
      </div>

      {/* 注入條紋動畫 CSS */}
      <style jsx>{`
        @keyframes stripe-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 0; }
        }
      `}</style>
    </div>
  );
}
