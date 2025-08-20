import { useEffect, useState } from 'react';
import { storageService, storageMode } from '@/components/storage_service/storageService';
import { Entity } from '@/types/auth.types';

export function useEntities() {
  const [tipoCrimes, setTipoCrimes] = useState<Entity[]>([]);
  const [comarcasVaras, setComarcasVaras] = useState<Entity[]>([]);
  const [situacoesPrisionais, setSituacoesPrisionais] = useState<Entity[]>([]);

  const fetchAll = async () => {
    if (storageMode === 'api') {
      try {
        const tipoCrimesData = await storageService.getItem('tiposCrime');
        const comarcasVarasData = await storageService.getItem('comarcasVaras');
        const situacoesPrisionaisData = await storageService.getItem('situacoesPrisionais');
        
        setTipoCrimes(Array.isArray(tipoCrimesData) ? tipoCrimesData : []);
        setComarcasVaras(Array.isArray(comarcasVarasData) ? comarcasVarasData : []);
        setSituacoesPrisionais(Array.isArray(situacoesPrisionaisData) ? situacoesPrisionaisData : []);
      } catch (error) {
        console.error('Error loading entities:', error);
      }
    } else {
      const tipoCrimesLocal = storageService.getItem('tipoCrimes') || [];
      const comarcasVarasLocal = storageService.getItem('comarcasVaras') || [];
      const situacoesPrisionaisLocal = storageService.getItem('situacoesPrisionais') || [];
      
      setTipoCrimes(Array.isArray(tipoCrimesLocal) ? tipoCrimesLocal : []);
      setComarcasVaras(Array.isArray(comarcasVarasLocal) ? comarcasVarasLocal : []);
      setSituacoesPrisionais(Array.isArray(situacoesPrisionaisLocal) ? situacoesPrisionaisLocal : []);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Adicionar
  const addEntity = async (type: string, value: string, set: any, list: Entity[]) => {
    if (list.some((e) => e.name === value)) return;
    if (storageMode === 'api') {
      const result = await storageService.createItem(type, { name: value });
      set([...list, result]);
    } else {
      const updated = [...list, { id: Date.now(), name: value }];
      set(updated);
      storageService.setItem(type, updated);
    }
  };

  // Remover
  const removeEntity = async (type: string, id: number, set: any, list: Entity[]) => {
  if (storageMode === 'api') {
    // Tenta remover do backend primeiro
    await storageService.deleteItem(type, id.toString());
    // Se sucesso, atualiza o estado local
    const updated = list.filter((e) => e.id !== id);
    set(updated);
  } else {
    // Modo local: atualiza direto
    const updated = list.filter((e) => e.id !== id);
    set(updated);
    storageService.setItem(type, updated);
  }
};


  // Editar
  const editEntity = async (type: string, id: number, newValue: string, set: any, list: Entity[]) => {
    const updated = list.map((e) => (e.id === id ? { ...e, name: newValue } : e));
    set(updated);
    if (storageMode === 'api') {
      await storageService.updateItem(type, id.toString(), { name: newValue });
    } else {
      storageService.setItem(type, updated);
    }
  };

  return {
    tipoCrimes,
    comarcasVaras,
    situacoesPrisionais,
    addTipoCrime: (value: string) => addEntity('tiposCrime', value, setTipoCrimes, tipoCrimes),
    removeTipoCrime: (id: number) => removeEntity('tiposCrime', id, setTipoCrimes, tipoCrimes),
    editTipoCrime: (id: number, value: string) => editEntity('tiposCrime', id, value, setTipoCrimes, tipoCrimes),

    addComarcaVara: (value: string) => addEntity('comarcasVaras', value, setComarcasVaras, comarcasVaras),
    removeComarcaVara: (id: number) => removeEntity('comarcasVaras', id, setComarcasVaras, comarcasVaras),
    editComarcaVara: (id: number, value: string) => editEntity('comarcasVaras', id, value, setComarcasVaras, comarcasVaras),

    addSituacaoPrisional: (value: string) => addEntity('situacoesPrisionais', value, setSituacoesPrisionais, situacoesPrisionais),
    removeSituacaoPrisional: (id: number) => removeEntity('situacoesPrisionais', id, setSituacoesPrisionais, situacoesPrisionais),
    editSituacaoPrisional: (id: number, value: string) => editEntity('situacoesPrisionais', id, value, setSituacoesPrisionais, situacoesPrisionais),
  };
}
