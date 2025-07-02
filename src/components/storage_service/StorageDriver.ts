// src/components/storage_service/StorageDriver.ts
export interface StorageDriver {
  getItem<T>(key: string, fallback?: T): Promise<T>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
