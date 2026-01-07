"use client";

import { 
  X, 
  Info, 
  Filter, 
  Globe2, 
  MapPin, 
  AlertTriangle,
  FileText
} from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 彈窗本體 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">網站說明與定義</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - 可捲動區域 */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Section 1: 資料清理邏輯 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">資料清理邏輯與圖示說明</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed text-justify">
              <p>
                本資料源自實價登錄，為求單價準確性，僅保留主要住宅類型（如公寓、住宅大樓）交易，並排除親友、特殊關係等交易。此外，亦剔除特殊物件（如僅車位、頂樓加蓋），且已對單價、總價與屋齡等極端值進行處理，確保趨勢具備市場參考性。
              </p>
            </div>
          </section>

          {/* Section 2: 事件類型分類 */}
          <section>
             <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">收錄事件類型</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* 全國事件 */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-100 pb-2">
                  <Globe2 className="w-4 h-4 text-blue-500" />
                  全國事件
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">政策法規</span>
                  <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">宏觀經濟</span>
                  <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">社會事件</span>
                </div>
              </div>

              {/* 地方事件 */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  地方事件
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">例行性稅基調整</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">重大建設</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">土地規劃與開發</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">政策法規</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 免責聲明 */}
          <section className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-orange-800 mb-1">免責聲明</h3>
                <p className="text-xs text-orange-700/80 leading-relaxed text-justify">
                  本中心建立不動產大事紀，旨在提供資料市場對於不動產相關事件紀錄之彙整，並加以房價中位數聯合呈現，以便民眾或專家學者參考。然由於房價影響因素眾多，事件的發生對住宅價格影響可能有提前或滯延的關係，表中呈現事件與價格趨勢並非有絕對關係，僅以事件紀錄方式呈現。
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}