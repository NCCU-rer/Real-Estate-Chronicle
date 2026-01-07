// src/config/cityColors.ts

export interface CityConfig {
  id: string;
  label: string;
  color: string; // 主色 (用於線條、文字)
}

// 根據您提供的圖片 (Scientific Color Palette) 進行配色
// 這些顏色取自圖片底部的色票，具有高對比且沈穩的特性
export const CITIES_CONFIG: CityConfig[] = [
  // 1. 台北市：深紫色 (權威、首都感) -> 取自色票 #4d5a9a
  { id: "taipei", label: "台北市", color: "#4d5a9a" },

  // 2. 新北市：天藍色 (腹地廣大、包容) -> 取自色票 #50b1e8
  { id: "newTaipei", label: "新北市", color: "#50b1e8" },

  // 3. 桃園市：強烈藍 (空港、交通) -> 取自色票 #0068ad
  { id: "taoyuan", label: "桃園市", color: "#0068ad" },

  // 4. 新竹縣/市：湖水綠/青色 (科技、永續) -> 取自色票 #0fa179
  { id: "hsinchu", label: "新竹縣/市", color: "#0fa179" },

  // 5. 台中市：金黃/琥珀色 (核心、陽光) -> 取自色票 #e59c00
  { id: "taichung", label: "台中市", color: "#e59c00" },

  // 6. 台南市：深紅色 (古都、歷史) -> 取自色票 #b32f31
  { id: "tainan", label: "台南市", color: "#b32f31" },

  // 7. 高雄市：深灰藍/石板色 (工業、港口、沈穩) -> 衍生自圖表軸線色調，與其他六色區隔
  // 因為圖片中的黃色(#f0e54f)太亮不適合文字，我們選用圖表中呈現的深色系來平衡
  { id: "kaohsiung", label: "高雄市", color: "#5e6e82" }, 
];

// 全國：使用圖片中的深灰色/黑色，保持中立
export const NATIONAL_CONFIG = {
  id: "oldLabel",
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