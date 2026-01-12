// src/components/InfoTooltip.tsx
import React from 'react';

const InfoTooltip = () => {
  return (
    // This container is now absolutely positioned at the top-right of the viewport
    // It acts as the anchor for the icon and the tooltip popup.
    <div className="absolute top-4 right-6 group z-999 font-sans">
      {/* 資訊圖示 */}
      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center cursor-pointer">
        <span className="text-sm font-bold text-slate-600">i</span>
      </div>

      {/* 彈出式說明框 (positioned relative to the container above) */}
      <div className="absolute top-full right-0 mt-2 w-80 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
        <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2"> {/* Added scrollable container */}
          <h3 className="font-bold text-md text-blue-600 mb-2">資料清理邏輯與圖示說明</h3>
          <p className="text-xs text-slate-600 mb-3">
            本資料源自實價登錄，為求單價準確性，僅保留主要住宅類型（如公寓、住宅大樓）交易，並排除親友、特殊關係等交易。此外，亦剔除特殊物件（如僅車位、頂樓加蓋），且已對單價、總價與屋齡等極端值進行處理，確保趨勢具備市場參考性。
          </p>
          <hr className="my-2 border-slate-100" />
          <h3 className="font-bold text-md text-blue-600 mb-2">免責聲明</h3>
          <p className="text-xs text-slate-600">
            本中心建立不動產大事紀，旨在提供資料市場對於不動產相關事件紀錄之彙整，並加以房價中位數聯合呈現，以便民眾或專家學者參考。然由於房價影響因素眾多，事件的發生對住宅價格影響可能有提前或滯延的關係，表中呈現事件與價格趨勢並非有絕對關係，僅以事件紀錄方式呈現。
          </p>
        </div>
        <div className="absolute bottom-full right-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
