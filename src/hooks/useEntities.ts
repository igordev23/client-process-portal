import { useEffect, useState } from 'react';
import { storageService, storageMode } from '@/components/storage_service/storageService';

type Entity = { id: number; name: string };

export function useEntities() {
  const [tipoCrimes, setTipoCrimes] = useState<Entity[]>([]);
  const [comarcasVaras, setComarcasVaras] = useState<Entity[]>([]);
  const [situacoesPrisionais, setSituacoesPrisionais] = useState<Entity[]>([]);

  const fetchAll = async () => {
    if (storageMode === 'api') {
      setTipoCrimes(await storageService.getItem('tiposCrime'));
      setComarcasVaras(await storageService.getItem('comarcasVaras'));
      setSituacoesPrisionais(await storageService.getItem('situacoesPrisionais'));
    } else {
      setTipoCrimes(storageService.getItem('tipoCrimes') || []);
      setComarcasVaras(storageService.getItem('comarcasVaras') || []);
      setSituacoesPrisionais(storageService.getItem('situacoesPrisionais') || []);
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
    const updated = list.filter((e) => e.id !== id);
    set(updated);
    if (storageMode === 'api') {
      await storageService.deleteItem(type, id);
    } else {
      storageService.setItem(type, updated);
    }
  };

  // Editar
  const editEntity = async (type: string, id: number, newValue: string, set: any, list: Entity[]) => {
    const updated = list.map((e) => (e.id === id ? { ...e, name: newValue } : e));
    set(updated);
    if (storageMode === 'api') {
      await storageService.updateItem(type, id, { name: newValue });
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
