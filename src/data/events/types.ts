export interface RawEvent {
  Quarter: string;
  Detail: string;
  Category: string | string[];
  // 允許任何名稱的 Label
  Label?: string;
  NationalLabel?: string;
  TaipeiLabel?: string;
  NewTaipeiLabel?: string;
  TaoyuanLabel?: string;
  HsinchuLabel?: string;
  TaichungLabel?: string;
  TainanLabel?: string;
  KaohsiungLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 允許其他欄位
}
