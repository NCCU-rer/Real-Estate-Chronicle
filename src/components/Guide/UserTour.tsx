'use client';

import React, { useState, useEffect } from 'react';
import { Joyride, STATUS, type EventData } from 'react-joyride';
import { TOUR_STEPS } from './tourSteps';

// 這是唯一的 export default，不要在檔案底部再寫一次 export default UserTour;
export default function UserTour() {
  const [run, setRun] = useState(false); 

  // 監聽來自「免責聲明」或「研究說明」組件的點擊事件
  useEffect(() => {
    const startTour = () => {
      console.log("導覽啟動！");
      setRun(true);
    };
    window.addEventListener('start-onboarding-tour', startTour);
    return () => window.removeEventListener('start-onboarding-tour', startTour);
  }, []);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      showProgress
      showSkipButton
      onEvent={handleJoyrideCallback}
      scrollOffset={100} // 避免高亮框被 Navbar 擋住
      options={{
        primaryColor: '#B7791F', // 你的琥珀古銅色
        zIndex: 10000, 
      }}
      locale={{
        back: '上一步',
        close: '關閉說明',
        last: '開始探索',
        next: '下一步',
        skip: '跳過',
      }}
    />
  );
}