// src/components/InfoTooltip.tsx
import React, { useEffect } from 'react';
import { Info, X, ShieldCheck, Database } from 'lucide-react';

interface InfoTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoTooltip = ({ isOpen, onClose }: InfoTooltipProps) => {
  // Close when pressing Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* 黑色半透明遮罩背景 */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 彈出式說明框 */}
      <div 
        className={`
          relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden
          transition-all duration-300 transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
        `}
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
            <Info className="w-5 h-5 text-blue-600" />
            研究說明與免責聲明
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
          <section>
            <h3 className="font-black text-base text-blue-600 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              資料清理邏輯與圖示說明
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              本資料源自實價登錄，為求單價準確性，僅保留主要住宅類型（如公寓、住宅大樓）交易，並排除親友、特殊關係等交易。此外，亦剔除特殊物件（如僅車位、頂樓加蓋），且已對單價、總價與屋齡等極端值進行處理，確保趨勢具備市場參考性。
            </p>
          </section>
          
          <div className="h-px bg-slate-100"></div>
          
          <section>
            <h3 className="font-black text-base text-blue-600 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              免責聲明
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              本中心建立不動產大事紀，旨在提供資料市場對於不動產相關事件紀錄之彙整，並加以房價中位數聯合呈現，以便民眾或專家學者參考。然由於房價影響因素眾多，事件的發生對住宅價格影響可能有提前或滯延的關係，表中呈現事件與價格趨勢並非有絕對關係，僅以事件紀錄方式呈現。
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-800 text-white rounded-full font-bold text-sm hover:bg-slate-700 transition-all active:scale-95 shadow-lg"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
