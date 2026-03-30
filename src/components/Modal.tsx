"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  className?: string; // 允許外部傳入自定義樣式 (如 max-w-lg)
  closeOnBackdropClick?: boolean; // 是否允許點擊背景關閉
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  zIndex = 9999, 
  className = "",
  closeOnBackdropClick = true
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // 確保只在 Client-side 渲染，避免 Next.js SSR 找不到 document 報錯
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // 鎖定背景滾動
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset"; // 恢復背景滾動
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const content = (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 font-sans" style={{ zIndex }}>
      {/* 黑色半透明遮罩背景 */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      {/* 彈出視窗本體 */}
      <div className={`relative w-full transition-all duration-300 transform animate-in zoom-in-95 slide-in-from-bottom-4 ${className}`}>
        {children}
      </div>
    </div>
  );

  // 使用 React Portal 將 Modal 渲染在 body 節點的最外層
  return createPortal(content, document.body);
}