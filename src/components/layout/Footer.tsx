import React from 'react';

const Footer = () => {
  return (
    <footer className="h-10 bg-white border-t-2 flex items-center justify-center px-6 shrink-0 z-50" style={{ borderTopColor: '#B7791F' }}>
      <p className="text-[11px] font-bold text-slate-400 tracking-wide">
        資料來源：<span className="text-slate-600">政大不動產研究中心</span> © 2024 <span style={{ color: '#B7791F' }}>政大不動產大事紀研究報告</span>
      </p>
    </footer>
  );
};

export default Footer;
