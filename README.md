[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1M59WghA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21821560&assignment_repo_type=AssignmentRepo)
# Expo Router Minimal Working Example

This is a very small Expo project using **expo-router** with:

- A root `Stack` layout
- A `(tabs)` group using `Tabs`
- A `details` screen pushed on top of the tab stack
- `Link` components and `useRouter` for navigation

## How to run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npx expo start --tunnel
   ```

3. Open the app on a device or emulator using the Expo dev tools.

4. 專案架構

app/
├── (tabs)/
│   ├── _layout.js    → Tab 導航配置
│   ├── index.js      → 新增記錄頁面
│   ├── record.js     → 新增記錄頁面
│   └── settings.js   → 設定頁面
├── components/
│   ├── CameraRecorder.js
│   ├── MemoInput.js
│   ├── MoodPicker.js    → 心情選擇器元件
│   └── RecordCard.js    → 記錄卡片元件
└── utils/
    └── storage.js       → 本地儲存工具    

5. UI 原型預覽
頁面	功能
我的記錄	顯示所有記錄列表，支援下拉刷新、刪除
新增記錄	包含 4 個區塊：錄影、Memo、心情、GPS
設定	功能說明、清除資料

UI 特色
📹 影片區塊：點擊可開啟相機（目前是 placeholder）
📝 Memo 區塊：多行文字輸入
😊 心情選擇：6 種情緒，漂亮的 emoji 選擇器
📍 GPS 定位：一鍵取得當前位置

6. 手機收集到的資料放在 data/ 資料夾內
   我是從手機下載透過