// src/components/InfoTooltip.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NotebookText, X } from 'lucide-react';

const InfoTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed top-4 right-6 z-[100] font-sans" ref={tooltipRef}>
      {/* 資訊圖示 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          isOpen ? 'bg-neutral-900 text-white rotate-90' : 'bg-white text-neutral-500 hover:bg-neutral-50'
        }`}
        aria-label="顯示資訊"
      >
        {isOpen ? <X className="w-5 h-5" /> : <NotebookText className="w-5 h-5" />}
      </button>

      {/* 彈出式說明框 */}
      <div 
        className={`
          absolute top-full right-0 mt-4 w-[calc(100vw-3rem)] sm:w-96 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-2xl p-6
          transition-all duration-300 transform origin-top-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}
        `}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-3">
           <NotebookText className="w-5 h-5 text-blue-600" />
           <h3 className="font-bold text-lg text-neutral-900">關於本站</h3>
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 space-y-6">
          <section>
            <h4 className="font-bold text-sm text-neutral-700 mb-2">
              資料來源與處理
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed text-justify">
              本資料源自實價登錄，為求單價準確性，僅保留主要住宅類型（如公寓、住宅大樓）交易，並排除親友、特殊關係等交易。此外，亦剔除特殊物件（如僅車位、頂樓加蓋），且已對單價、總價與屋齡等極端值進行處理，確保趨勢具備市場參考性。
            </p>
          </section>
          
          <section>
            <h4 className="font-bold text-sm text-neutral-700 mb-2">
              免責聲明
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed text-justify">
              本中心建立不動產大事紀，旨在提供資料市場對於不動產相關事件紀錄之彙整，並加以房價中位數聯合呈現，以便民眾或專家學者參考。然由於房價影響因素眾多，事件的發生對住宅價格影響可能有提前或滯延的關係，表中呈現事件與價格趨勢並非有絕對關係，僅以事件紀錄方式呈現。
            </p>
          </section>
        </div>
        
      </div>
    </div>
  );
};

export default InfoTooltip;