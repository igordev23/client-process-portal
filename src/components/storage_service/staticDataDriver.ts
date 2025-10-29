// src/components/storage_service/staticDataDriver.ts
import { StorageDriver } from './StorageDriver';
import { initialUsers, initialClients, initialProcesses } from '@/data/initialData';

export const staticDataDriver: StorageDriver = {
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    switch (key) {
      case 'user':
        return initialUsers as unknown as T;
      case 'clients':
        return initialClients as unknown as T;
      case 'processes':
        return initialProcesses as unknown as T;
      default:
        return fallback!;
    }
  },

  async setItem<T>(_key: string, _value: T): Promise<void> {
    console.warn('staticDataDriver: setItem chamado, mas os dados são somente leitura.');
  },

  async removeItem(_key: string): Promise<void> {
    console.warn('staticDataDriver: removeItem chamado, mas os dados são somente leitura.');
  },
};
