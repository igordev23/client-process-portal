
import { useEffect, useState } from 'react';
import { storageService, storageMode } from '@/components/storage_service/storageService';
import { Entity } from '@/types/auth.types';

export function useEntities() {
  const [tipos_crime, setTiposCrime] = useState<Entity[]>([]);
  const [comarcas_varas, setComarcasVaras] = useState<Entity[]>([]);
  const [situacoes_prisionais, setSituacoesPrisionais] = useState<Entity[]>([]);

  const fetchAll = async () => {
    try {
      if (storageMode === 'api') {
        // Usar os endpoints corretos da API
        const tiposData = await storageService.getItem('tiposCrime', []);
        const comarcasData = await storageService.getItem('comarcasVaras', []);
        const situacoesData = await storageService.getItem('situacoesPrisionais', []);
        
        setTiposCrime(tiposData);
        setComarcasVaras(comarcasData);
        setSituacoesPrisionais(situacoesData);
      } else {
        setTiposCrime(await storageService.getItem('tipos_crime', []));
        setComarcasVaras(await storageService.getItem('comarcas_varas', []));
        setSituacoesPrisionais(await storageService.getItem('situacoes_prisionais', []));
      }
    } catch (error) {
      console.error('Erro ao carregar entidades:', error);
      // Fallback para arrays vazios em caso de erro
      setTiposCrime([]);
      setComarcasVaras([]);
      setSituacoesPrisionais([]);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Adicionar
  const addEntity = async (type: string, apiEndpoint: string, value: string, set: any, list: Entity[]) => {
    if (list.some((e) => e.name === value)) return;
    
    try {
      if (storageMode === 'api') {
        const result = await storageService.createItem(apiEndpoint, { name: value });
        set([...list, result]);
      } else {
        const updated = [...list, { id: Date.now(), name: value }];
        set(updated);
        storageService.setItem(type, updated);
      }
    } catch (error) {
      console.error(`Erro ao adicionar ${type}:`, error);
    }
  };

  // Remover
  const removeEntity = async (type: string, apiEndpoint: string, id: number, set: any, list: Entity[]) => {
    try {
      if (storageMode === 'api') {
        await storageService.deleteItem(apiEndpoint, id.toString());
        const updated = list.filter((e) => e.id !== id);
        set(updated);
      } else {
        const updated = list.filter((e) => e.id !== id);
        set(updated);
        storageService.setItem(type, updated);
      }
    } catch (error) {
      console.error(`Erro ao remover ${type}:`, error);
      throw error;
    }
  };

  // Editar
  const editEntity = async (type: string, apiEndpoint: string, id: number, newValue: string, set: any, list: Entity[]) => {
    try {
      if (storageMode === 'api') {
        await storageService.updateItem(apiEndpoint, id.toString(), { name: newValue });
        const updated = list.map((e) => (e.id === id ? { ...e, name: newValue } : e));
        set(updated);
      } else {
        const updated = list.map((e) => (e.id === id ? { ...e, name: newValue } : e));
        set(updated);
        storageService.setItem(type, updated);
      }
    } catch (error) {
      console.error(`Erro ao editar ${type}:`, error);
      throw error;
    }
  };

  return {
    tipos_crime,
    comarcas_varas,
    situacoes_prisionais,
    
    addTipoCrime: (value: string) => addEntity('tipos_crime', 'tiposCrime', value, setTiposCrime, tipos_crime),
    removeTipoCrime: (id: number) => removeEntity('tipos_crime', 'tiposCrime', id, setTiposCrime, tipos_crime),
    editTipoCrime: (id: number, value: string) => editEntity('tipos_crime', 'tiposCrime', id, value, setTiposCrime, tipos_crime),

    addComarcaVara: (value: string) => addEntity('comarcas_varas', 'comarcasVaras', value, setComarcasVaras, comarcas_varas),
    removeComarcaVara: (id: number) => removeEntity('comarcas_varas', 'comarcasVaras', id, setComarcasVaras, comarcas_varas),
    editComarcaVara: (id: number, value: string) => editEntity('comarcas_varas', 'comarcasVaras', id, value, setComarcasVaras, comarcas_varas),

    addSituacaoPrisional: (value: string) => addEntity('situacoes_prisionais', 'situacoesPrisionais', value, setSituacoesPrisionais, situacoes_prisionais),
    removeSituacaoPrisional: (id: number) => removeEntity('situacoes_prisionais', 'situacoesPrisionais', id, setSituacoesPrisionais, situacoes_prisionais),
    editSituacaoPrisional: (id: number, value: string) => editEntity('situacoes_prisionais', 'situacoesPrisionais', id, value, setSituacoesPrisionais, situacoes_prisionais),
  };
}
