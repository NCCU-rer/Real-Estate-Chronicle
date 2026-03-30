'use client';

import React, { useState, useEffect } from 'react';
import { Joyride, type EventData, STATUS } from 'react-joyride';
import { TOUR_STEPS } from '@/components/tourSteps';

export default function UserTour() {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 檢查是否已經看過導覽
    const hasRunTour = localStorage.getItem('hasRunTour');
    
    if (!hasRunTour) {
      // 延遲 3 秒，確保避開 Splash 開場動畫，讓網頁徹底載入後才出現
      const timer = setTimeout(() => setRun(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      // 使用者看完或跳過後，記錄在瀏覽器，下次不再打擾
      localStorage.setItem('hasRunTour', 'true');
      setRun(false);
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous={true} // 允許「下一步」連續播放
      onEvent={handleJoyrideCallback}
      options={{
        showProgress: true,
        buttons: ['back', 'close', 'primary', 'skip'],
        scrollOffset: 100,
        primaryColor: '#2D2D24',
        textColor: '#2D2D24',
        zIndex: 10000,
      }}
      locale={{
        back: '上一步',
        close: '關閉',
        last: '開始探索',
        next: '下一步',
        skip: '跳過導覽',
      }}
    />
  );
}