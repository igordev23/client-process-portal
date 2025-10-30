// src/components/storage_service/staticWithLocalDriver.ts
import { StorageDriver } from './StorageDriver';
import { localStorageDriver } from './localStorageDriver';
import { staticDataDriver } from './staticDataDriver';

export const staticWithLocalDriver: StorageDriver = {
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    // Tenta carregar do localStorage primeiro
    const localData = await localStorageDriver.getItem<T | null>(key, null as any);
    if (localData) return localData;

    // Se não existir, carrega do staticDataDriver e salva no localStorage
    const staticData = await staticDataDriver.getItem<T>(key, fallback!);
    if (staticData) {
      await localStorageDriver.setItem(key, staticData);
      return staticData;
    }

    return fallback!;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await localStorageDriver.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await localStorageDriver.removeItem(key);
  },

  async createItem<T>(collection: string, item: T): Promise<T> {
    const items = await localStorageDriver.getItem<any[]>(collection, []);
    const newItem = { ...item, id: (item as any).id || crypto.randomUUID?.() || Date.now().toString() };
    await localStorageDriver.setItem(collection, [...items, newItem]);
    return newItem;
  },

  async updateItem<T>(collection: string, id: string, updated: T): Promise<T> {
    const items = await localStorageDriver.getItem<any[]>(collection, []);
    let updatedItem: T | null = null;

    const updatedItems = items.map((i) => {
      if ((i as any).id === id) {
        updatedItem = { ...i, ...updated };
        return updatedItem;
      }
      return i;
    });

    if (!updatedItem) throw new Error(`Item with id ${id} not found in ${collection}`);

    await localStorageDriver.setItem(collection, updatedItems);
    return updatedItem;
  },

  async deleteItem(collection: string, id: string): Promise<void> {
    const items = await localStorageDriver.getItem<any[]>(collection, []);
    const filtered = items.filter((i) => (i as any).id !== id);
    await localStorageDriver.setItem(collection, filtered);
  },
};
