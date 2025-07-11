// src/components/storage_service/localStorageDriver.ts
import { StorageDriver } from './StorageDriver';

export const localStorageDriver: StorageDriver = {
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback!;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  },

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};
