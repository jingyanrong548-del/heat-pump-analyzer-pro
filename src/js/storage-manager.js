// src/js/storage-manager.js

const STORAGE_KEY = 'heatPumpAnalyzerProData_v1'; // 添加版本号以防混淆

/**
 * 将所有输入参数作为一个对象保存到 localStorage
 */
export function saveParams(params) {
  try {
    const paramsString = JSON.stringify(params);
    localStorage.setItem(STORAGE_KEY, paramsString);
    // console.log('参数已保存到本地存储'); // 调试用，嫌吵可以注释掉
  } catch (error) {
    console.error("无法保存数据到 localStorage:", error);
  }
}

/**
 * 从 localStorage 加载已保存的参数
 */
export function loadParams() {
  try {
    const paramsString = localStorage.getItem(STORAGE_KEY);
    if (paramsString) {
      return JSON.parse(paramsString);
    }
    return null;
  } catch (error) {
    console.error("无法从 localStorage 加载数据:", error);
    return null;
  }
}

/**
 * 从 localStorage 中清除已保存的参数
 */
export function clearParams() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('本地存储已清除');
  } catch (error) {
    console.error("无法从 localStorage 清除数据:", error);
  }
}