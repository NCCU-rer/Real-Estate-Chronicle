"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default function DisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 檢查使用者是否已經點過「同意」 (存放在瀏覽器)
    const hasAccepted = localStorage.getItem("disclaimer_accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("disclaimer_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* 這裡是半透明黑底遮罩，讓後面的 Dashboard 隱約可見 */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* 聲明視窗本體 */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          {/* Logo 放在聲明頂部 */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-100 shadow-inner">
              <img 
                src="/logo_transparent.svg" 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">不動產大事紀 使用聲明</h2>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl text-slate-600 text-sm leading-relaxed space-y-3">
            <div className="flex gap-2">
              <span className="text-orange-500 font-bold">●</span>
              <p>本平台數據由政大不動產研究中心與永慶房產集團提供，僅供學術與研究參考。</p>
            </div>
            <div className="flex gap-2">
              <span className="text-orange-500 font-bold">●</span>
              <p>圖表呈現之房價走勢不代表未來投資建議。</p>
            </div>
            <div className="flex gap-2">
              <span className="text-orange-500 font-bold">●</span>
              <p>使用者引用本站資料時，請務必註明出處。</p>
            </div>
          </div>

          <button
            onClick={handleAccept}
            className="mt-8 w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-100"
          >
            <CheckCircle2 className="w-5 h-5" />
            我已瞭解並同意
          </button>
        </div>
      </div>
    </div>
  );
}