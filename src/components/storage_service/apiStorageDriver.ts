// src/components/storage_service/apiStorageDriver.ts
import { StorageDriver } from './StorageDriver';

const API_BASE = 'http://localhost:3000/sistema';

export const apiStorageDriver: StorageDriver & {
  createItem?: <T>(key: string, value: T) => Promise<T>;
  updateItem?: <T>(key: string, id: string, value: T) => Promise<T>;
  deleteItem?: (key: string, id: string) => Promise<void>;
  getUserByEmailAndPassword?: (email: string, password: string) => Promise<any | null>; // 👈 ADICIONADO
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
    const res = await fetch(`${API_BASE}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    if (!res.ok) throw new Error(`Erro ao criar item em ${key}`);
    return res.json();
  },

  async updateItem<T>(key: string, id: string, value: T): Promise<T> {
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    if (!res.ok) throw new Error(`Erro ao atualizar item ${id} em ${key}`);
    return res.json();
  },

  async deleteItem(key: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Erro ao deletar item ${id} em ${key}`);
  },

  // ✅ Novo método de login via API
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
