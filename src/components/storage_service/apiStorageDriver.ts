
// src/components/storage_service/apiStorageDriver.ts
import { StorageDriver } from './StorageDriver';
import { toSnakeCase } from '@/components/ui/caseConverter';

const API_BASE = 'http://localhost:3000/sistema';

export const apiStorageDriver: StorageDriver & {
  createItem?: <T>(key: string, value: T) => Promise<T>;
  updateItem?: <T>(key: string, id: string, value: T) => Promise<T>;
  deleteItem?: (key: string, id: string) => Promise<void>;
  getUserByEmailAndPassword?: (email: string, password: string) => Promise<any | null>;
} = {
  
  async getItem<T>(key: string, fallback?: T): Promise<T> {
    const res = await fetch(`${API_BASE}/${key}`);
    if (!res.ok) return fallback!;
    return res.json();
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await fetch(`${API_BASE}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
  },

  async removeItem(key: string): Promise<void> {
    await fetch(`${API_BASE}/${key}`, {
      method: 'DELETE',
    });
  },

  async createItem<T>(key: string, value: T): Promise<T> {
    console.log('Enviando para API:', value);
    
    // Converte para snake_case antes de enviar para a API
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
    
    // Converte para snake_case antes de enviar para a API
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

  // ✅ Método de login via API
  async getUserByEmailAndPassword(email: string, password: string): Promise<any | null> {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    return res.json();
  },
};
