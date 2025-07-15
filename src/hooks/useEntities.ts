
import { useEffect, useState } from 'react';
import { storageService, storageMode } from '@/components/storage_service/storageService';

type Entity = { id: number; name: string };

export function useEntities() {
  const [tipos_crime, setTiposCrime] = useState<Entity[]>([]);
  const [comarcas_varas, setComarcasVaras] = useState<Entity[]>([]);
  const [situacoes_prisionais, setSituacoesPrisionais] = useState<Entity[]>([]);

  const fetchAll = async () => {
    if (storageMode === 'api') {
      setTiposCrime(await storageService.getItem('tipos_crime'));
      setComarcasVaras(await storageService.getItem('comarcas_varas'));
      setSituacoesPrisionais(await storageService.getItem('situacoes_prisionais'));
    } else {
      setTiposCrime(await storageService.getItem('tipos_crime', []));
      setComarcasVaras(await storageService.getItem('comarcas_varas', []));
      setSituacoesPrisionais(await storageService.getItem('situacoes_prisionais', []));
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
      await storageService.deleteItem(type, id.toString());
      const updated = list.filter((e) => e.id !== id);
      set(updated);
    } else {
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
    tipos_crime,
    comarcas_varas,
    situacoes_prisionais,
    addTipoCrime: (value: string) => addEntity('tipos_crime', value, setTiposCrime, tipos_crime),
    removeTipoCrime: (id: number) => removeEntity('tipos_crime', id, setTiposCrime, tipos_crime),
    editTipoCrime: (id: number, value: string) => editEntity('tipos_crime', id, value, setTiposCrime, tipos_crime),

    addComarcaVara: (value: string) => addEntity('comarcas_varas', value, setComarcasVaras, comarcas_varas),
    removeComarcaVara: (id: number) => removeEntity('comarcas_varas', id, setComarcasVaras, comarcas_varas),
    editComarcaVara: (id: number, value: string) => editEntity('comarcas_varas', id, value, setComarcasVaras, comarcas_varas),

    addSituacaoPrisional: (value: string) => addEntity('situacoes_prisionais', value, setSituacoesPrisionais, situacoes_prisionais),
    removeSituacaoPrisional: (id: number) => removeEntity('situacoes_prisionais', id, setSituacoesPrisionais, situacoes_prisionais),
    editSituacaoPrisional: (id: number, value: string) => editEntity('situacoes_prisionais', id, value, setSituacoesPrisionais, situacoes_prisionais),
  };
}
