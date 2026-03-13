"use client";

import { useState } from "react";
import { ExportConfig } from "@/components/ExportModal";
import { domToCanvas } from "modern-screenshot";
import { getCityName } from "@/config/cityColors";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

export function useDashboardExport(canvasRef: React.RefObject<HTMLDivElement | null>) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);

  const openExportModal = () => setIsExportOpen(true);
  const closeExportModal = () => setIsExportOpen(false);

  const handleGenerate = async (config: ExportConfig) => {
    setExportConfig(config);
    setIsGenerating(true);
    
    // 給予渲染時間
    setTimeout(async () => {
      if (!canvasRef.current) {
        setIsGenerating(false);
        return;
      }

      try {
        // 1. 取得所有待捕捉的頁面節點
        const pageNodes = canvasRef.current.querySelectorAll('.report-page');
        if (pageNodes.length === 0) throw new Error("No report pages found");

        const cityName = config.mainCity === 'nation' ? '全國' : getCityName(config.mainCity);
        const baseFileName = `不動產大事紀報告_${cityName}_${config.start}-${config.end}`;

        if (config.format === 'pdf') {
          // --- PDF 模式 ---
          let pdf: jsPDF | null = null;

          for (let i = 0; i < pageNodes.length; i++) {
            const canvas = await domToCanvas(pageNodes[i] as HTMLElement, { scale: 2 });
            const width = canvas.width;
            const height = canvas.height;

            if (!pdf) {
              pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [width, height] });
            } else {
              pdf.addPage([width, height], 'landscape');
            }

            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
          }
          pdf?.save(`${baseFileName}.pdf`);

        } else {
          // --- JPEG ZIP 模式 ---
          const zip = new JSZip();
          
          for (let i = 0; i < pageNodes.length; i++) {
            const canvas = await domToCanvas(pageNodes[i] as HTMLElement, { scale: 2 });
            const imgData = canvas.toDataURL("image/jpeg", 0.9).split(',')[1]; // 取得 Base64 內容
            zip.file(`${baseFileName}_P${i + 1}.jpg`, imgData, { base64: true });
          }

          const content = await zip.generateAsync({ type: "blob" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = `${baseFileName}_圖片包.zip`;
          link.click();
        }

        setIsExportOpen(false);
      } catch (err) {
        console.error("匯出失敗:", err);
        alert("報告生成失敗，請嘗試減少內容範圍");
      } finally {
        setIsGenerating(false);
      }
    }, 1500); 
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
