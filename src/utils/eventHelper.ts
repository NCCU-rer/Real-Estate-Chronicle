// src/utils/eventHelper.ts

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
    let city = "oldLabel"; // 預設為全國
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
      title: title,
      category: item.Category,
      isNational: city === "oldLabel",
      
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

// 3. 輔助：產生季度選單 (從 2013 開始)
export const generateQuarterOptions = () => {
  const options = [];
  for (let y = 2013; y <= 2025; y++) {
    for (let q = 1; q <= 4; q++) {
      options.push(`${y}_Q${q}`);
    }
  }
  return options;
};
