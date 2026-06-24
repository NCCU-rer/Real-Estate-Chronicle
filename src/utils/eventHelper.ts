// src/utils/eventHelper.ts

import { getCityName } from "@/config/cityColors";

// 1. 銝餉?皜??摩
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processEvents = (data: any[]) => {
  // ?脣?嚗???data 銝???嚗?亙??喟征???嚗??map ?嗆?
  if (!Array.isArray(data)) {
    console.error("processEvents ?嗅?航炊???撘?", data);
    return [];
  }

  // ?脣?嚗甇Ｚ??憭惜??? (靘? [[...], [...]])嚗?憯像??撅?
  const flatData = data.flat();

  return flatData.map((item) => {
    // ?脣?嚗???item ?舐征???臬??芰??梯正嚗停頝喲?
    if (!item || typeof item !== 'object') return null;

    // ?圾??嚗?憒?"2013_Q1" -> 2013, Q1
    const [yearStr, quarterStr] = item.Quarter ? item.Quarter.split("_") : ["0", ""];

    // ?斗??鞈?撅祆?芸?撣?
    // ?摩嚗炎?亦隞嗉ㄐ???摰? Key (靘? KaohsiungLabel)
    let city = "nation"; // ?身?箏??
    let title = item.Label || "憭找?蝝";

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
      isNational: city === "nation",
      
      // ?? ?嚗???鞈???Detail 撠???description (蝯血?頝唾?蝒)
      description: item.Detail || null, 
    };
  })
  // ?蕪??null ?瘝?璅??????
  .filter((item): item is NonNullable<typeof item> => item !== null && !!item.title);
};

// 2. 頛嚗? "2013_Q1" 頧??詨? 20131 隞乩噶瘥?憭批?
export const getQuarterValue = (quarterStr: string) => {
  if (!quarterStr) return 0;
  const cleanStr = quarterStr.replace("_", "").replace(" ", "").replace("Q", ""); 
  return parseInt(cleanStr);
};

// 4. 頛嚗?鈭辣??潸??葉?Ｙ??舐摮?漲?賊?
export const getQuarterOptionsFromData = (eventData: any[] = [], priceData: any[] = []) => {
  const eventQuarters = Array.isArray(eventData)
    ? eventData.flat().map((item) => item?.Quarter).filter(Boolean)
    : [];

  const priceQuarters = Array.isArray(priceData)
    ? priceData.map((item) => item?.Quarter).filter(Boolean)
    : [];

  return Array.from(new Set([...eventQuarters, ...priceQuarters]))
    .map((quarter) => ({ quarter, value: getQuarterValue(quarter) }))
    .sort((a, b) => a.value - b.value)
    .map(({ quarter }) => quarter);
};

// 5. 頛嚗?迤摨阡??(敺?2013 ??, ?身靘??嗅?撟港遢)
export const generateQuarterOptions = (startYear = 2013, endYear = new Date().getFullYear()) => {
  const options = [];
  for (let y = startYear; y <= endYear; y++) {
    for (let q = 1; q <= 4; q++) {
      options.push(`${y}_Q${q}`);
    }
  }
  return options;
};

// 6. 敺?憪??葉?????函?摮?漲
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAvailableQuarters = (data: any | any[]) => {
  let quarters: string[] = [];
  
  if (Array.isArray(data)) {
    quarters = data
      .map(item => item?.Quarter)
      .filter((q): q is string => typeof q === 'string' && q.includes('_'));
  } else if (data && typeof data === 'object') {
    // ???拐辣?澆? (靘? rawData)
    const allItems = Object.values(data).flat() as any[];
    quarters = allItems
      .map(item => item?.Quarter)
      .filter((q): q is string => typeof q === 'string' && q.includes('_'));
  }
    
  if (quarters.length === 0) return generateQuarterOptions();
  
  // ?駁?
  const uniqueQuarters = Array.from(new Set(quarters));
  
  // ??蝣箔?????
  return uniqueQuarters.sort((a, b) => {
    return getQuarterValue(a) - getQuarterValue(b);
  });
};



