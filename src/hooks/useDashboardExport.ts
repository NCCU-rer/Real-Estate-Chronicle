"use client";

import { useState } from "react";
import { ExportConfig } from "@/components/ExportModal";
import { domToPng } from "modern-screenshot";
import { getCityName } from "@/config/cityColors";

export function useDashboardExport(canvasRef: React.RefObject<HTMLDivElement | null>) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);

  const openExportModal = () => setIsExportOpen(true);
  const closeExportModal = () => setIsExportOpen(false);

  const handleGenerate = async (config: ExportConfig) => {
    setExportConfig(config);
    setIsGenerating(true);
    
    // 給予一點時間讓 ReportCanvas 重新渲染 (React state 更新需要時間)
    setTimeout(async () => {
      if (!canvasRef.current) {
        console.error("Export Error: Canvas ref is null");
        setIsGenerating(false);
        return;
      }

      try {
        const dataUrl = await domToPng(canvasRef.current, {
          scale: 2,
          backgroundColor: "#f8fafc",
          // 確保捕捉完整高度，排除捲軸影響
          onClone: (cloned) => {
            const style = cloned.style;
            style.height = 'auto';
            style.overflow = 'visible';
          }
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        const cityName = config.mainCity === 'nation' ? '全國' : getCityName(config.mainCity);
        link.download = `不動產大事紀報告_${cityName}_${config.start}-${config.end}.png`;
        link.click();

        setIsExportOpen(false);
      } catch (err) {
        console.error("匯出失敗:", err);
        alert("報告生成失敗，請嘗試減少內容範圍");
      } finally {
        setIsGenerating(false);
      }
    }, 500); 
  };

  return {
    isExportOpen,
    isGenerating,
    exportConfig,
    openExportModal,
    closeExportModal,
    handleGenerate,
  };
}
