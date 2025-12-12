// 這裡定義一個叫做 Navbar 的組件
export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 左邊：Logo 與標題 */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              {/* 我們先用一個簡單的圖示代表 Logo */}
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                房
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                不動產大事紀
              </span>
            </div>
          </div>

          {/* 右邊：選單連結 (目前先做樣子) */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
              關於平台
            </button>
            <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
              登入系統
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
