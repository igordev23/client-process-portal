// src/components/storage_service/storageService.ts
import { StorageDriver } from './StorageDriver';
import { localStorageDriver } from './localStorageDriver';
import { apiStorageDriver } from './apiStorageDriver';
import { staticWithLocalDriver } from './staticWithLocalDriver';
import { toCamelCase, toSnakeCase } from '@/components/ui/caseConverter';

// 🔀 Define o modo de operação: 'api', 'local' ou 'static'
const mode = import.meta.env.VITE_STORAGE_MODE || 'static';
export const storageMode = mode;

// Seleciona o driver de acordo com o modo
const driver: StorageDriver =
  mode === 'api'
    ? apiStorageDriver
    : mode === 'local'
    ? localStorageDriver
    : staticWithLocalDriver; // ✅ agora usa o driver híbrido

// 🔁 Envolve os métodos com conversão de snake_case/camelCase no modo local
function wrapWithConverters(driver: StorageDriver): StorageDriver {
  if (mode !== 'local') return driver;

  return {
    getItem: async <T>(key: string, fallback?: T): Promise<T> => {
      const data = await driver.getItem<T>(key, fallback);
      return toCamelCase(data);
    },
    setItem: async <T>(key: string, value: T): Promise<void> => {
      await driver.setItem(key, toSnakeCase(value));
    },
    removeItem: (key: string): Promise<void> => driver.removeItem(key),

    createItem: driver.createItem
      ? async <T>(collection: string, item: T): Promise<T> => {
          const result = await driver.createItem!(collection, toSnakeCase(item));
          return toCamelCase(result);
        }
      : undefined,

    updateItem: driver.updateItem
      ? async <T>(collection: string, id: string, item: T): Promise<void> => {
          await driver.updateItem!(collection, id, toSnakeCase(item));
        }
      : undefined,

    deleteItem: driver.deleteItem
      ? async (collection: string, id: string): Promise<void> => {
          await driver.deleteItem!(collection, id);
        }
      : undefined,

    ...(driver.getUserByEmailAndPassword && {
      getUserByEmailAndPassword: driver.getUserByEmailAndPassword,
    }),
  } as StorageDriver;
}

const wrappedDriver = wrapWithConverters(driver);

// 🚀 Exporta o serviço pronto para uso em todo o app
export const storageService = {
  getItem: <T>(key: string, fallback?: T): Promise<T> =>
    wrappedDriver.getItem<T>(key, fallback),

  setItem: <T>(key: string, value: T): Promise<void> =>
    wrappedDriver.setItem<T>(key, value),

  removeItem: (key: string): Promise<void> => wrappedDriver.removeItem(key),

  createItem: <T>(collection: string, item: T) =>
    wrappedDriver.createItem
      ? wrappedDriver.createItem<T>(collection, item)
      : Promise.reject(),

  updateItem: <T>(collection: string, id: string, item: T) =>
    wrappedDriver.updateItem
      ? wrappedDriver.updateItem<T>(collection, id, item)
      : Promise.reject(),

  deleteItem: (collection: string, id: string) =>
    wrappedDriver.deleteItem
      ? wrappedDriver.deleteItem(collection, id)
      : Promise.reject(),

  getUserByEmailAndPassword:
    'getUserByEmailAndPassword' in wrappedDriver
      ? (wrappedDriver as any).getUserByEmailAndPassword
      : undefined,
};
