// src/config/cityColors.ts

export interface CityConfig {
  id: string;
  label: string;
  color: string; // 主色 (用於線條、文字)
}

// 推薦的高對比類別色票 (Categorical Palette)
// 這些顏色跨度較大，能有效在圖表中區分多條重疊的線條
export const CITIES_CONFIG: CityConfig[] = [
  { id: "taipei", label: "台北市", color: "#2563eb" },    // 藍色 (blue-600)
  { id: "newTaipei", label: "新北市", color: "#059669" },  // 綠色 (emerald-600)
  { id: "taoyuan", label: "桃園市", color: "#d97706" },    // 琥珀色 (amber-600)
  { id: "hsinchu", label: "新竹縣/市", color: "#0891b2" },  // 青色 (cyan-600)
  { id: "taichung", label: "台中市", color: "#dc2626" },    // 紅色 (red-600)
  { id: "tainan", label: "台南市", color: "#7c3aed" },    // 紫色 (violet-600)
  { id: "kaohsiung", label: "高雄市", color: "#db2777" },   // 粉色 (pink-600)
];

// 全國：使用中立的深灰色，作為基準線
export const NATIONAL_CONFIG = {
  id: "nation",
  label: "全國均價",
  color: "#475569", // slate-600
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
