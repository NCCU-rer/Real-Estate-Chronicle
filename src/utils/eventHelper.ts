// src/utils/eventHelper.ts

// 👇 關鍵就是補上這一段 export interface
export interface RawEvent {
  year: number;
  quarter: string;
  title: string;
  description?: string;
  city?: string;
  category?: string;
  isNational?: boolean;
}

// 產生季度選單 (支援自訂起始年份)
export const generateQuarterOptions = (startYear: number = 2013) => {
  const options = [];
  // 假設資料到 2025 年
  for (let year = startYear; year <= 2025; year++) {
    for (let q = 1; q <= 4; q++) {
      options.push(`${year}_Q${q}`);
    }
  }
  return options;
};

// 將季度字串轉為數值以便比較 (例如 2023_Q1 -> 20231)
export const getQuarterValue = (quarterStr: string) => {
  const [year, q] = quarterStr.split("_");
  return parseInt(year) * 10 + parseInt(q.replace("Q", ""));
};

// 城市名稱對照表 (簡單版，或是你可以 import config)
const getCityName = (id: string) => {
  const map: Record<string, string> = {
    taipei: '台北市',
    newTaipei: '新北市',
    taoyuan: '桃園市',
    taichung: '台中市',
    tainan: '台南市',
    kaohsiung: '高雄市',
    hsinchu: '新竹縣市',
    nation: '全國',
  };
  return map[id] || id;
};

// 處理原始事件資料，加上 id 與中文城市名
export const processEvents = (events: RawEvent[]) => {
  return events.map((event, index) => ({
    ...event,
    id: `event-${index}`,
    cityName: event.city ? getCityName(event.city) : '',
  }));
};