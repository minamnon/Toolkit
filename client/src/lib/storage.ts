// Local storage utilities for offline data persistence
export interface LocalStorageData {
  distillationOperations: any[];
  containerClassifications: any[];
}

const STORAGE_KEY = 'distillery_app_data';

export function getLocalData(): LocalStorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return {
    distillationOperations: [],
    containerClassifications: [],
  };
}

export function saveLocalData(data: Partial<LocalStorageData>): void {
  try {
    const currentData = getLocalData();
    const newData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function addDistillationOperation(operation: any): void {
  const data = getLocalData();
  data.distillationOperations.unshift({
    ...operation,
    id: Date.now(),
    timestamp: new Date().toLocaleString('ar-SA'),
  });
  saveLocalData({ distillationOperations: data.distillationOperations });
}

export function addContainerClassification(classification: any): void {
  const data = getLocalData();
  data.containerClassifications.unshift({
    ...classification,
    id: Date.now(),
    timestamp: new Date().toLocaleString('ar-SA'),
  });
  saveLocalData({ containerClassifications: data.containerClassifications });
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
