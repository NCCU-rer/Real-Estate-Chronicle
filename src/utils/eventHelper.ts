// src/utils/eventHelper.ts

import { getCityName } from "@/config/cityColors";

// 1. 主要清洗邏輯
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processEvents = (data: any[]) => {
  // 防呆：如果 data 不是陣列，直接回傳空陣列，避免 map 當機
  if (!Array.isArray(data)) {
    console.error("processEvents 收到錯誤的資料格式:", data);
    return [];
  }

  // 防呆：防止資料是多層陣列 (例如 [[...], [...]])，先壓平成一層
  const flatData = data.flat();

  return flatData.map((item) => {
    // 防呆：如果 item 是空的或是奇怪的東西，就跳過
    if (!item || typeof item !== 'object') return null;

    // 拆解時間，例如 "2013_Q1" -> 2013, Q1
    const [yearStr, quarterStr] = item.Quarter ? item.Quarter.split("_") : ["0", ""];

    // 判斷這筆資料屬於哪個城市
    // 邏輯：檢查物件裡有沒有特定的 Key (例如 KaohsiungLabel)
    let city = "nation"; // 預設為全國
    let title = item.Label || "大事紀";

    if (item.TaipeiLabel) {
      city = "taipei";
      title = item.TaipeiLabel;
    } else if (item.NewTaipeiLabel) {
      city = "newTaipei";
      title = item.NewTaipeiLabel;
    } else if (item.TaoyuanLabel) {
      city = "taoyuan";
      title = item.TaoyuanLabel;
    } else if (item.HsinchuLabel) {
      city = "hsinchu";
      title = item.HsinchuLabel;
    } else if (item.TaichungLabel) {
      city = "taichung";
      title = item.TaichungLabel;
    } else if (item.TainanLabel) {
      city = "tainan";
      title = item.TainanLabel;
    } else if (item.KaohsiungLabel) {
      city = "kaohsiung";
      title = item.KaohsiungLabel;
    }

    return {
      year: parseInt(yearStr) || 0,
      quarter: quarterStr || "",
      city: city,
      cityName: getCityName(city), // Add city name
      title: title,
      category: item.Category,
      isNational: city === "nation",
      
      // ⚠️ 關鍵：將原始資料的 Detail 對應到 description (給彈跳視窗用)
      description: item.Detail || null, 
    };
  })
  // 過濾掉 null 或是沒有標題的無效資料
  .filter((item): item is NonNullable<typeof item> => item !== null && !!item.title);
};

// 2. 輔助：把 "2013_Q1" 轉成數字 20131 以便比較大小
export const getQuarterValue = (quarterStr: string) => {
  if (!quarterStr) return 0;
  const cleanStr = quarterStr.replace("_", "").replace(" ", "").replace("Q", ""); 
  return parseInt(cleanStr);
};

// 3. 輔助：產生季度選單 (從 2013 開始，預設到當前年份)
export const generateQuarterOptions = (endYear?: number) => {
  const options = [];
  const finalEndYear = endYear || new Date().getFullYear();
  for (let y = 2013; y <= finalEndYear; y++) {
    for (let q = 1; q <= 4; q++) {
      options.push(`${y}_Q${q}`);
    }
  }
  return options;
};

/**
 * 從原始資料中提取所有可用的季度
 * @param data 原始價格資料陣列或其他包含 Quarter 的資料
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAvailableQuarters = (data: any | any[]) => {
  let quarters: string[] = [];
  
  if (Array.isArray(data)) {
    quarters = data
      .map(item => item?.Quarter)
      .filter((q): q is string => typeof q === 'string' && q.includes('_'));
  } else if (data && typeof data === 'object') {
    // 處理物件格式 (例如 rawData)
    const allItems = Object.values(data).flat() as any[];
    quarters = allItems
      .map(item => item?.Quarter)
      .filter((q): q is string => typeof q === 'string' && q.includes('_'));
  }
    
  if (quarters.length === 0) return generateQuarterOptions();
  
  // 去重
  const uniqueQuarters = Array.from(new Set(quarters));
  
  // 排序確保時間順序
  return uniqueQuarters.sort((a, b) => {
    return getQuarterValue(a) - getQuarterValue(b);
  });
};
