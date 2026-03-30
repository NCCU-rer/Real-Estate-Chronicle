"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 2 秒後開始淡出
    const timer1 = setTimeout(() => setIsFadingOut(true), 2000);
    // 2.5 秒後徹底移除開場動畫，正式渲染主畫面
    const timer2 = setTimeout(() => setShowSplash(false), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[99999] bg-slate-50 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-1000">
          {/* Logo 動畫容器 - 使用 clip-path 實現填滿效果 */}
          <div className="relative w-24 h-24 mb-6">
            {/* 1. 底層：灰階外框 */}
            <Image
              src="/logo_transparent.svg"
              alt="Logo Outline"
              fill
              priority
              className="object-contain"
            />

            {/* 2. 頂層：彩色的 Logo，使用 clip-path 動畫來顯示 */}
            <div className="absolute inset-0 animation-clip-reveal">
              <Image
                src="/icon.svg"
                alt="Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          
          {/* 主標題 */}
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            不動產大事紀
          </h1>
          
          {/* 分隔線 */}
          <div className="w-12 h-1 bg-orange-500 rounded-full mb-5"></div>
          
          {/* 副標題 */}
          <p className="text-sm md:text-base font-bold text-slate-500 tracking-[0.2em] uppercase">
            政大不動產研究中心
          </p>
        </div>
        
        {/* 注入動畫 CSS */}
        <style jsx>{`
          @keyframes clip-reveal {
            from { clip-path: inset(100% 0 0 0); }
            to { clip-path: inset(0% 0 0 0); }
          }
          .animation-clip-reveal {
            animation: clip-reveal 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  // 開場動畫結束後，才渲染子組件 (包含主網頁與說明彈窗)
  // 這樣所有組件的 animate-in 進場動畫都會在同一時間點準確觸發！
  return <>{children}</>;
}