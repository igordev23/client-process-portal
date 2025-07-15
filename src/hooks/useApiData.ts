
import { useState, useEffect } from 'react';
import { storageService } from '@/components/storage_service/storageService';
import { toCamelCase, toSnakeCase } from '@/components/ui/caseConverter';
import { toast } from '@/hooks/use-toast';

export interface ApiDataHookOptions<T> {
  key: string;
  fallback?: T[];
  autoFetch?: boolean;
}

export function useApiData<T>(options: ApiDataHookOptions<T>) {
  const { key, fallback = [], autoFetch = true } = options;
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rawData = await storageService.getItem<any[]>(key, fallback);
      const camelCaseData = toCamelCase(rawData);
      setData(camelCaseData);
    } catch (error) {
      console.error(`Erro ao buscar ${key}:`, error);
      toast({
        title: `Erro ao carregar ${key}`,
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<T, 'id'>) => {
    try {
      const snakeCaseItem = toSnakeCase(item);
      
      if (storageService.createItem) {
        const createdItem = await storageService.createItem(key, snakeCaseItem);
        const camelCaseCreatedItem = toCamelCase(createdItem);
        setData(prev => [...prev, camelCaseCreatedItem]);
        return camelCaseCreatedItem;
      } else {
        const newItem = { ...item, id: Date.now().toString() } as T;
        const updatedData = [...data, newItem];
        setData(updatedData);
        await storageService.setItem(key, toSnakeCase(updatedData));
        return newItem;
      }
    } catch (error) {
      console.error(`Erro ao criar ${key}:`, error);
      toast({
        title: `Erro ao criar ${key}`,
        description: 'Não foi possível salvar o item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const currentItem = data.find((item: any) => item.id === id);
      if (!currentItem) {
        throw new Error('Item não encontrado');
      }

      const updatedItem = { ...currentItem, ...updates };
      const snakeCaseItem = toSnakeCase(updatedItem);

      if (storageService.updateItem) {
        await storageService.updateItem(key, id, snakeCaseItem);
      }

      const updatedData = data.map((item: any) => 
        item.id === id ? updatedItem : item
      );
      setData(updatedData);
      await storageService.setItem(key, toSnakeCase(updatedData));

      return updatedItem;
    } catch (error) {
      console.error(`Erro ao atualizar ${key}:`, error);
      toast({
        title: `Erro ao atualizar ${key}`,
        description: 'Não foi possível atualizar o item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      if (storageService.deleteItem) {
        await storageService.deleteItem(key, id);
      }

      const updatedData = data.filter((item: any) => item.id !== id);
      setData(updatedData);
      await storageService.setItem(key, toSnakeCase(updatedData));
    } catch (error) {
      console.error(`Erro ao deletar ${key}:`, error);
      toast({
        title: `Erro ao deletar ${key}`,
        description: 'Não foi possível remover o item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [key, autoFetch]);

  return {
    data,
    loading,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    setData,
  };
}
