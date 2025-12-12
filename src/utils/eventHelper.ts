import { RawEvent } from "@/data/sourceData";

// 定義組件最後想吃的乾淨格式
export interface CleanEvent {
  id: string;
  year: string;
  quarter: string;
  title: string;
  detail: string;
  tags: string[];
  city?: string; // 標記這是哪個城市的資料
}

// 判斷並抓取正確的標題
const getTitle = (item: RawEvent): string => {
  return (
    item.Label ||
    item.NationalLabel ||
    item.TaipeiLabel ||
    item.NewTaipeiLabel ||
    item.TaoyuanLabel ||
    item.HsinchuLabel ||
    item.TaichungLabel ||
    item.TainanLabel ||
    item.KaohsiungLabel ||
    "無標題"
  );
};

// 處理分類 (有時候是字串，有時候是陣列，統一變成陣列)
const getTags = (category: string | string[]): string[] => {
  if (Array.isArray(category)) return category;
  return [category];
};

// 主函式：傳入原始的大物件，回傳乾淨的陣列
export const processEvents = (dataObj: Record<string, RawEvent[]>): CleanEvent[] => {
  let allEvents: CleanEvent[] = [];

  // 1. 遍歷每一個區域 (key = taipeiData, kaohsiungData...)
  Object.keys(dataObj).forEach((key) => {
    const cityEvents = dataObj[key];
    
    // 2. 轉換每一筆資料
    const cleanCityEvents = cityEvents.map((item, index) => {
      const [year, q] = item.Quarter.split("_"); // 把 "2014_Q2" 切開
      
      return {
        id: `${key}-${index}-${item.Quarter}`, // 產生唯一 ID
        year,
        quarter: q,
        title: getTitle(item),
        detail: item.Detail,
        tags: getTags(item.Category),
        city: key.replace("Data", ""), // 把 "taipeiData" 變成 "taipei"
      };
    });

    allEvents = [...allEvents, ...cleanCityEvents];
  });

  // 3. 依照時間排序 (年份 -> 季度)
  return allEvents.sort((a, b) => {
    if (a.year !== b.year) return Number(b.year) - Number(a.year); // 年份降冪 (新的在上面)
    return b.quarter.localeCompare(a.quarter); // 季度降冪
  });
};
