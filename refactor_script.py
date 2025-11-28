#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重構腳本：將所有按鈕事件改為使用統一的 ButtonEventManager
"""

import re

# 讀取原始檔案
with open('1027_dashboard2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 在 <script> 標籤後插入 ButtonEventManager 類別
button_manager_code = '''<script>
/* ===================================================================
 * 【重構】統一的按鈕事件管理器
 * ===================================================================
 * 目的：將所有按鈕事件處理邏輯集中管理，避免程式碼分散
 * 改進：
 * 1. 所有按鈕事件處理集中在 ButtonEventManager 類別中
 * 2. 移除重複的按鈕建立和綁定邏輯
 * 3. 統一的事件處理介面，易於維護和擴展
 * =================================================================== */
class ButtonEventManager {
  constructor() {
    this.handlers = new Map();
    this.initialized = false;
  }

  /**
   * 註冊按鈕事件處理器
   * @param {string} buttonId - 按鈕 ID 或選擇器
   * @param {string} eventType - 事件類型（'click', 'change', 等）
   * @param {Function} handler - 事件處理函數
   * @param {Object} options - 選項（如 { useD3: true }）
   */
  register(buttonId, eventType, handler, options = {}) {
    const key = `${buttonId}_${eventType}`;
    this.handlers.set(key, { buttonId, eventType, handler, options });
  }

  /**
   * 初始化所有已註冊的事件處理器
   */
  init() {
    if (this.initialized) return;
    
    this.handlers.forEach(({ buttonId, eventType, handler, options }) => {
      try {
        if (options.useD3) {
          // 使用 D3.js 選擇器
          const selection = d3.select(buttonId);
          if (!selection.empty()) {
            selection.on(eventType, handler);
            console.log(`✅ D3 事件已綁定: ${buttonId} - ${eventType}`);
          } else {
            console.warn(`⚠️ 找不到元素: ${buttonId}`);
          }
        } else {
          // 使用原生 DOM API
          const element = document.querySelector(buttonId) || document.getElementById(buttonId.replace('#', ''));
          if (element) {
            element.addEventListener(eventType, handler);
            console.log(`✅ 原生事件已綁定: ${buttonId} - ${eventType}`);
          } else {
            console.warn(`⚠️ 找不到元素: ${buttonId}`);
          }
        }
      } catch (error) {
        console.error(`❌ 綁定事件失敗: ${buttonId} - ${eventType}`, error);
      }
    });
    
    this.initialized = true;
    console.log('✅ 按鈕事件管理器初始化完成');
  }

  /**
   * 移除事件處理器
   */
  unregister(buttonId, eventType) {
    const key = `${buttonId}_${eventType}`;
    this.handlers.delete(key);
  }

  /**
   * 清除所有事件處理器
   */
  clear() {
    this.handlers.clear();
    this.initialized = false;
  }
}

// 建立全域的按鈕事件管理器實例
const buttonManager = new ButtonEventManager();

'''

# 找到第一個 <script> 標籤的位置（在 </style> 之後）
script_pattern = r'(</style>\s*</div>\s*<script>)'
match = re.search(script_pattern, content)
if match:
    insert_pos = match.end()
    # 在 <script> 標籤後插入 ButtonEventManager
    new_content = content[:insert_pos] + '\n' + button_manager_code + content[insert_pos + len('<script>'):]
else:
    # 如果找不到，在 document.addEventListener 之前插入
    new_content = content.replace(
        'document.addEventListener(\'DOMContentLoaded\', function() {',
        button_manager_code + 'document.addEventListener(\'DOMContentLoaded\', function() {'
    )

# 寫入重構檔案
with open('1027_dashboard2_refactored.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✅ 重構檔案已建立：1027_dashboard2_refactored.html')
print('📝 下一步：將所有按鈕事件改為使用 buttonManager.register() 註冊')

