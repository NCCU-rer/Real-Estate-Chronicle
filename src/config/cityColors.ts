// src/config/cityColors.ts

export interface CityConfig {
  id: string;
  label: string;
  color: string; // 主色 (用於線條、文字)
}

// 根據您提供的圖片 (Scientific Color Palette) 進行配色
// 這些顏色取自圖片底部的色票，具有高對比且沈穩的特性
export const CITIES_CONFIG: CityConfig[] = [
  // Using shades of amber/orange
  { id: "taipei", label: "台北市", color: "#f59e0b" },    // amber-500
  { id: "newTaipei", label: "新北市", color: "#fbbf24" },  // amber-400
  { id: "taoyuan", label: "桃園市", color: "#f97316" },    // orange-500
  { id: "hsinchu", label: "新竹縣/市", color: "#fb923c" },  // orange-400
  { id: "taichung", label: "台中市", color: "#ea580c" },    // orange-600
  { id: "tainan", label: "台南市", color: "#c2410c" },    // orange-700
  { id: "kaohsiung", label: "高雄市", color: "#9a3412" },   // orange-800
];

// 全國：使用圖片中的深灰色/黑色，保持中立
export const NATIONAL_CONFIG = {
  id: "nation",
  label: "全國/歷史",
  color: "#333333", 
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