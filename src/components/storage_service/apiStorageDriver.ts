
import { StorageDriver } from './StorageDriver';

// Simple case converter functions
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        newObj[snakeKey] = toSnakeCase(obj[key]);
      }
    }
    return newObj;
  }
  
  return obj;
}

const API_BASE = 'http://localhost:3000/sistema';

export const apiStorageDriver: StorageDriver & {
  createItem?: <T>(key: string, value: T) => Promise<T>;
  updateItem?: <T>(key: string, id: string, value: T) => Promise<T>;
  deleteItem?: (key: string, id: string) => Promise<void>;
  getUserByEmailAndPassword?: (email: string, password: string) => Promise<any | null>;
} = {
  
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}/${key}`);
      if (!res.ok) {
        console.warn(`Erro ao buscar ${key}:`, res.status);
        return fallback as T;
      }
      return res.json();
    } catch (error) {
      console.error(`Erro ao buscar ${key}:`, error);
      return fallback as T;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    // No-op for API mode - data is managed server-side
    console.log('setItem chamado no modo API:', key, value);
  },

  async removeItem(key: string): Promise<void> {
    // No-op for API mode
    console.log('removeItem chamado no modo API:', key);
  },

  async createItem<T>(key: string, value: T): Promise<T> {
    console.log('Enviando para API:', value);
    
    const snakeCaseValue = toSnakeCase(value);
    console.log('Convertido para snake_case:', snakeCaseValue);
    
    const res = await fetch(`${API_BASE}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseValue),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro na API:', errorText);
      throw new Error(`Erro ao criar item em ${key}: ${res.status} - ${errorText}`);
    }
    
    return res.json();
  },

  async updateItem<T>(key: string, id: string, value: T): Promise<T> {
    console.log('Atualizando via API:', value);
    
    const snakeCaseValue = toSnakeCase(value);
    console.log('Convertido para snake_case:', snakeCaseValue);
    
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseValue),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro na API:', errorText);
      throw new Error(`Erro ao atualizar item ${id} em ${key}: ${res.status} - ${errorText}`);
    }
    
    return res.json();
  },

  async deleteItem(key: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro na API:', errorText);
      throw new Error(`Erro ao deletar item ${id} em ${key}: ${res.status} - ${errorText}`);
    }
  },

  async getUserByEmailAndPassword(email: string, password: string): Promise<any | null> {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      if (res.status === 401) return null;
      throw new Error('Erro ao fazer login');
    }

    return res.json();
  }
};
