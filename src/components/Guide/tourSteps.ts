import { Step } from 'react-joyride';

export const TOUR_STEPS: Step[] = [
  {
    target: '.tour-filter-pannel',
    content: '利用側邊欄篩選器，您可以設定「觀察區間」，並切換「主要觀察」與「對照」的縣市。',
    placement: 'right',
    disableBeacon: true, // 第一步直接展開，不需要等使用者點光點
  },
  {
    target: '.tour-event-timeline',
    content: '這裡記錄了影響房市的重大政策與事件，點擊事件卡片即可查看詳細分析與內容。',
    placement: 'bottom',
  },
  {
    target: '.tour-price-chart',
    content: '這是房價中位數趨勢圖，您可以利用圖表下方的「時間滑桿」來自由縮放與平移時間軸。',
    placement: 'top',
  },
  {
  target: 'body',
  title: '歡迎使用不動產大事紀',
  content: '在開始探索前，請注意：本平台數據每季更新一次，計算採單價中位數。點擊「下一步」開始認識各項功能。',
  placement: 'center',
}
];