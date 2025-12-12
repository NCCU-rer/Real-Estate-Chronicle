import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import { rawData } from "@/data/sourceData";   // 1. 引入原始資料
import { processEvents } from "@/utils/eventHelper"; // 2. 引入清洗工具

export default function Home() {
  // 3. 執行資料清洗與合併 (這會把所有城市的資料合併成一個大陣列，並排序好)
  const unifiedEvents = processEvents(rawData);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 左邊：大事紀列表 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[85vh]">
            <div className="mb-4 pb-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-500 pl-3">
                不動產歷史大事紀
              </h2>
              <span className="text-sm text-slate-400">
                共 {unifiedEvents.length} 筆資料
              </span>
            </div>
            
            {/* 列表區塊 (設定 overflow 讓它可以捲動) */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               <EventList data={unifiedEvents} />
            </div>
          </div>

          {/* 右邊：房價趨勢圖 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[85vh]">
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">
              房價單價中位數趨勢
            </h2>
            <div className="h-full bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
              <p className="text-lg font-medium">圖表開發中...</p>
              <p className="text-sm mt-2">Chart Component Coming Soon</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
