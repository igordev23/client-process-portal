// src/components/storage_service/storageService.ts
import { StorageDriver } from './StorageDriver';
import { localStorageDriver } from './localStorageDriver';
import { apiStorageDriver } from './apiStorageDriver';

const mode = import.meta.env.VITE_STORAGE_MODE || 'local'; // 'local' ou 'api'

const driver: StorageDriver = mode === 'api' ? apiStorageDriver : localStorageDriver;

export const storageService = {
  getItem: <T>(key: string, fallback?: T): Promise<T> => driver.getItem<T>(key, fallback),
  setItem: <T>(key: string, value: T): Promise<void> => driver.setItem<T>(key, value),
  removeItem: (key: string): Promise<void> => driver.removeItem(key),

  createItem: <T>(collection: string, item: T) =>
    driver.createItem ? driver.createItem<T>(collection, item) : Promise.reject(),

  updateItem: <T>(collection: string, id: string, item: T) =>
    driver.updateItem ? driver.updateItem<T>(collection, id, item) : Promise.reject(),

  deleteItem: (collection: string, id: string) =>
    driver.deleteItem ? driver.deleteItem(collection, id) : Promise.reject(),

  // Expondo o método getUserByEmailAndPassword, só se existir no driver
  getUserByEmailAndPassword:
    'getUserByEmailAndPassword' in driver
      ? (email: string, password: string) => (driver as any).getUserByEmailAndPassword(email, password)
      : undefined,
};
