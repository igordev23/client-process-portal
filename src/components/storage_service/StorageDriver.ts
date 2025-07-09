export interface StorageDriver {
  getItem<T>(key: string, fallback?: T): Promise<T>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;

  createItem?<T>(collection: string, item: T): Promise<T>;
  updateItem?<T>(collection: string, id: string, item: T): Promise<T>;
  deleteItem?(collection: string, id: string): Promise<void>;
}
