import { CleanEvent } from "@/utils/eventHelper";

interface EventListProps {
  data: CleanEvent[];
}

export default function EventList({ data }: EventListProps) {
  return (
    <div className="space-y-6">
      {data.map((event) => (
        <div 
          key={event.id} 
          className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 group"
        >
          {/* 左側：時間與城市標籤 */}
          <div className="sm:w-32 flex-shrink-0 flex flex-col gap-2">
            
            {/* 時間方塊 */}
            <div className="text-center bg-blue-600 text-white rounded-lg py-2 px-1 shadow-sm group-hover:bg-blue-700 transition-colors">
              <span className="block text-xl font-bold tracking-wider font-mono">
                {event.year}
              </span>
              <span className="block text-sm opacity-90 font-medium">
                {event.quarter}
              </span>
            </div>

            {/* 城市標記 (如果是 oldLabelData 這種不明顯的就不顯示，或是顯示 '全國') */}
            <div className="text-center">
              <span className="inline-block bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded border border-slate-200 uppercase">
                {event.city === "oldLabel" ? "全國/歷史" : event.city}
              </span>
            </div>
          </div>

          {/* 右側：詳細內容 */}
          <div className="flex-1">
            
            {/* 標題 (從各種 Label 統一過來的) */}
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
              {event.title}
            </h3>

            {/* 分類標籤 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {event.tags.map((tag, index) => (
                <span key={index} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  #{tag}
                </span>
              ))}
            </div>

            {/* HTML 內容渲染 */}
            <div 
              className="text-slate-600 text-sm leading-relaxed prose-sm prose-p:my-1 prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: event.detail }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}