// src/components/storage_service/apiStorageDriver.ts
import { StorageDriver } from './StorageDriver';

const API_BASE = 'http://localhost:3000/clientes';

export const apiStorageDriver: StorageDriver = {
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    const res = await fetch(`${API_BASE}/${key}`);
    if (!res.ok) return fallback!;
    return res.json();
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await fetch(`${API_BASE}/${key}`, {
      method: 'POST', // ou PUT dependendo do caso
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
  },

  async removeItem(key: string): Promise<void> {
    await fetch(`${API_BASE}/${key}`, {
      method: 'DELETE',
    });
  },
};
