import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const RECORDS_KEY = "emogo_records";
const LAST_OPEN_KEY = "emogo_last_open";

/**
 * 跨平台永久儲存
 * - Web: localStorage
 * - Native: expo-secure-store（永久儲存，app 關閉資料仍在）
 */
const storage = {
  async getItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    // Native 使用 SecureStore 永久儲存
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    // Native 使用 SecureStore 永久儲存
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    // Native 使用 SecureStore
    await SecureStore.deleteItemAsync(key);
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

/**
 * 記錄最後開啟 App 的時間
 */
export const updateLastOpenTime = async () => {
  try {
    await storage.setItem(LAST_OPEN_KEY, new Date().toISOString());
  } catch (error) {
    console.error("更新最後開啟時間失敗:", error);
  }
};

/**
 * 取得最後開啟 App 的時間
 */
export const getLastOpenTime = async () => {
  try {
    return await storage.getItem(LAST_OPEN_KEY);
  } catch (error) {
    console.error("取得最後開啟時間失敗:", error);
    return null;
  }
};

/**
 * 匯出所有記錄為 JSON 字串
 */
export const exportRecordsAsJSON = async () => {
  try {
    const records = await getAllRecords();
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: records.length,
      records: records,
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("匯出記錄失敗:", error);
    throw error;
  }
};