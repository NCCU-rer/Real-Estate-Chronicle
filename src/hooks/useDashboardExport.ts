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
  const [exportProgress, setExportProgress] = useState(0);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);

  const openExportModal = () => setIsExportOpen(true);
  const closeExportModal = () => setIsExportOpen(false);

  const handleGenerate = async (config: ExportConfig) => {
    setExportConfig(config);
    setIsGenerating(true);
    setExportProgress(5);
    
    // 生產環境優化：確保 Loading UI 先渲染出來
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setTimeout(async () => {
      if (!canvasRef.current) {
        setIsGenerating(false);
        return;
      }

      try {
        // 抓取所有 PageFrame
        const pageNodes = canvasRef.current.querySelectorAll('.report-page');
        if (pageNodes.length === 0) throw new Error("No report pages found");

        const totalPages = pageNodes.length;
        const cityName = config.mainCity === 'nation' ? '全國' : getCityName(config.mainCity);
        const baseFileName = `不動產大事紀報告_${cityName}_${config.start}-${config.end}`;

        if (config.format === 'pdf') {
          // --- PDF 模式：動態高度適配 ---
          let pdf: jsPDF | null = null;

          for (let i = 0; i < totalPages; i++) {
            const node = pageNodes[i] as HTMLElement;
            
            // 關鍵：先獲取節點撐開後的實際高度
            const canvas = await domToCanvas(node, { 
              scale: 2,
              backgroundColor: "#f8fafc",
            });
            
            const width = canvas.width;
            const height = canvas.height;

            // 根據 canvas 的寬高動態建立 PDF 頁面
            if (!pdf) {
              pdf = new jsPDF({ 
                orientation: width > height ? 'landscape' : 'portrait', 
                unit: 'px', 
                format: [width, height] 
              });
            } else {
              pdf.addPage([width, height], width > height ? 'landscape' : 'portrait');
            }

            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
            
            setExportProgress(Math.floor(((i + 1) / totalPages) * 90));
          }
          pdf?.save(`${baseFileName}.pdf`);

        } else {
          // --- JPEG ZIP 模式 ---
          const zip = new JSZip();
          for (let i = 0; i < totalPages; i++) {
            const node = pageNodes[i] as HTMLElement;
            const canvas = await domToCanvas(node, { scale: 2 });
            const imgData = canvas.toDataURL("image/jpeg", 0.9).split(',')[1];
            zip.file(`${baseFileName}_P${i + 1}.jpg`, imgData, { base64: true });
            
            setExportProgress(Math.floor(((i + 1) / totalPages) * 80));
          }

          const content = await zip.generateAsync({ type: "blob" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = `${baseFileName}_圖片包.zip`;
          link.click();
        }

        setExportProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setIsExportOpen(false);
        }, 500);
      } catch (err) {
        console.error("匯出失敗:", err);
        alert("報告輸出失敗，請確認內容是否過多");
        setIsGenerating(false);
      }
    }, 1500); 
  };

  return {
    isExportOpen,
    isGenerating,
    exportProgress,
    exportConfig,
    openExportModal,
    closeExportModal,
    handleGenerate,
  };
}
