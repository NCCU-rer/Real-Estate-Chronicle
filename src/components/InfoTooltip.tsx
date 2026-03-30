// src/components/InfoTooltip.tsx
import React from 'react';
import { Info, X, ShieldCheck, Database } from 'lucide-react';
import Modal from '@/components/Modal';

interface InfoTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoTooltip = ({ isOpen, onClose }: InfoTooltipProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={200}
      className="max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
    >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
            <Info className="w-5 h-5 text-orange-600" />
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
            <h3 className="font-black text-base text-orange-600 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              資料清理邏輯與圖示說明
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              本資料源自實價登錄，為求單價準確性，僅保留主要住宅類型（如公寓、住宅大樓）交易，並排除親友、特殊關係等交易。此外，亦剔除特殊物件（如僅車位、頂樓加蓋），且已對單價、總價與屋齡等極端值進行處理，確保趨勢具備市場參考性。
            </p>
          </section>
          
          <div className="h-px bg-slate-100"></div>
          
          <section>
            <h3 className="font-black text-base text-orange-600 mb-3 flex items-center gap-2">
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
            className="px-10 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200"
          >
            我知道了
          </button>
        </div>
    </Modal>
  );
};

export default InfoTooltip;
