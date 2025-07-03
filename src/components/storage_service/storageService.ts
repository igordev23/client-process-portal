// src/components/storage_service/storageService.ts
import { StorageDriver } from './StorageDriver';
import { localStorageDriver } from './localStorageDriver';
import { apiStorageDriver } from './apiStorageDriver';

const mode = import.meta.env.VITE_STORAGE_MODE || 'local'; // 'local' ou 'api'

const driver: StorageDriver = mode === 'api' ? apiStorageDriver : localStorageDriver;

export const storageService = {
  getItem: driver.getItem,
  setItem: driver.setItem,
  removeItem: driver.removeItem,
};

