// src/config/cityColors.ts

export interface CityConfig {
  id: string;
  label: string;
  color: string; // 主色 (用於線條、文字)
}

// Minimalist Palette: Blue, Red, Black, White
export const CITIES_CONFIG: CityConfig[] = [
  // 1. 台北市：深藍 (權威、首都)
  { id: "taipei", label: "台北市", color: "#1e3a8a" }, // blue-900

  // 2. 新北市：正藍 (腹地廣大)
  { id: "newTaipei", label: "新北市", color: "#2563eb" }, // blue-600

  // 3. 桃園市：淺藍 (空港、年輕)
  { id: "taoyuan", label: "桃園市", color: "#60a5fa" }, // blue-400

  // 4. 新竹縣/市：灰藍 (科技、冷靜)
  { id: "hsinchu", label: "新竹縣/市", color: "#94a3b8" }, // slate-400

  // 5. 台中市：黑色 (核心、中立強勢)
  { id: "taichung", label: "台中市", color: "#000000" }, // black

  // 6. 台南市：鮮紅 (古都、熱情)
  { id: "tainan", label: "台南市", color: "#dc2626" }, // red-600

  // 7. 高雄市：深紅 (港口、工業)
  { id: "kaohsiung", label: "高雄市", color: "#991b1b" }, // red-800
];

// 全國：深灰色
export const NATIONAL_CONFIG = {
  id: "oldLabel",
  label: "全國/歷史",
  color: "#525252", // neutral-600
};

// 輔助函式：取得顏色
export const getCityColor = (cityId: string) => {
  const city = CITIES_CONFIG.find((c) => c.id === cityId);
  return city ? city.color : NATIONAL_CONFIG.color;
};

// 輔助函式：取得名稱
export const getCityName = (cityId: string) => {
  const city = CITIES_CONFIG.find((c) => c.id === cityId);
  return city ? city.label : cityId;
};