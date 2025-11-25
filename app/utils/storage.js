import { Platform } from "react-native";

const RECORDS_KEY = "emogo_records";

// 記憶體暫存
let memoryRecords = [];

/**
 * 跨平台儲存
 * - Web: localStorage
 * - Native: 暫時用記憶體（之後可以換成 Development Build）
 */
const storage = {
  async getItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    // Native 暫時用記憶體
    return JSON.stringify(memoryRecords);
  },
  async setItem(key, value) {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    // Native 暫時用記憶體
    memoryRecords = JSON.parse(value);
  },
  async removeItem(key) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    // Native 暫時用記憶體
    memoryRecords = [];
  },
};

/**
 * 取得所有記錄
 */
export const getAllRecords = async () => {
  try {
    const jsonValue = await storage.getItem(RECORDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("讀取記錄失敗:", error);
    return [];
  }
};

/**
 * 新增一筆記錄
 */
export const addRecord = async (record) => {
  try {
    const records = await getAllRecords();
    const newRecord = {
      ...record,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    records.unshift(newRecord); // 新記錄放在最前面
    await storage.setItem(RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  } catch (error) {
    console.error("新增記錄失敗:", error);
    throw error;
  }
};

/**
 * 刪除一筆記錄
 */
export const deleteRecord = async (id) => {
  try {
    const records = await getAllRecords();
    const filteredRecords = records.filter((record) => record.id !== id);
    await storage.setItem(RECORDS_KEY, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error("刪除記錄失敗:", error);
    throw error;
  }
};

/**
 * 更新一筆記錄
 */
export const updateRecord = async (id, updates) => {
  try {
    const records = await getAllRecords();
    const index = records.findIndex((record) => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      await storage.setItem(RECORDS_KEY, JSON.stringify(records));
      return records[index];
    }
    throw new Error("找不到記錄");
  } catch (error) {
    console.error("更新記錄失敗:", error);
    throw error;
  }
};

/**
 * 清除所有記錄
 */
export const clearAllRecords = async () => {
  try {
    await storage.removeItem(RECORDS_KEY);
    return true;
  } catch (error) {
    console.error("清除記錄失敗:", error);
    throw error;
  }
};
