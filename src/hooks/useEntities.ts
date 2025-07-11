import { useState } from 'react';
import { storageService, storageMode } from '@/components/storage_service/storageService';

export function useEntities() {
  const [tipoCrimes, setTipoCrimes] = useState<string[]>([]);
  const [comarcasVaras, setComarcasVaras] = useState<string[]>([]);
  const [situacoesPrisionais, setSituacoesPrisionais] = useState<string[]>([]);

  // Tipo Crimes
  const addTipoCrime = async (value: string) => {
    if (!tipoCrimes.includes(value)) {
      const updated = [...tipoCrimes, value];
      setTipoCrimes(updated);

      if (storageMode === 'api') {
await storageService.createItem('tiposCrime', { name: value });

      } else {
        storageService.setItem('tipoCrimes', updated);
      }
    }
  };

  const removeTipoCrime = (value: string) => {
    const updated = tipoCrimes.filter(item => item !== value);
    setTipoCrimes(updated);
    storageService.setItem('tipoCrimes', updated);
  };

  const editTipoCrime = (oldValue: string, newValue: string) => {
    const updated = tipoCrimes.map(item => (item === oldValue ? newValue : item));
    setTipoCrimes(updated);
    storageService.setItem('tipoCrimes', updated);
  };

  // Comarcas Varas
  const addComarcaVara = async (value: string) => {
    if (!comarcasVaras.includes(value)) {
      const updated = [...comarcasVaras, value];
      setComarcasVaras(updated);

      if (storageMode === 'api') {
        await storageService.createItem('comarcasVaras', { name: value });
      } else {
        storageService.setItem('comarcasVaras', updated);
      }
    }
  };

  const removeComarcaVara = (value: string) => {
    const updated = comarcasVaras.filter(item => item !== value);
    setComarcasVaras(updated);
    storageService.setItem('comarcasVaras', updated);
  };

  const editComarcaVara = (oldValue: string, newValue: string) => {
    const updated = comarcasVaras.map(item => (item === oldValue ? newValue : item));
    setComarcasVaras(updated);
    storageService.setItem('comarcasVaras', updated);
  };

  // Situações Prisionais
  const addSituacaoPrisional = async (value: string) => {
    if (!situacoesPrisionais.includes(value)) {
      const updated = [...situacoesPrisionais, value];
      setSituacoesPrisionais(updated);

      if (storageMode === 'api') {
        await storageService.createItem('situacoesPrisionais', { name: value });
      } else {
        storageService.setItem('situacoesPrisionais', updated);
      }
    }
  };

  const removeSituacaoPrisional = (value: string) => {
    const updated = situacoesPrisionais.filter(item => item !== value);
    setSituacoesPrisionais(updated);
    storageService.setItem('situacoesPrisionais', updated);
  };

  const editSituacaoPrisional = (oldValue: string, newValue: string) => {
    const updated = situacoesPrisionais.map(item => (item === oldValue ? newValue : item));
    setSituacoesPrisionais(updated);
    storageService.setItem('situacoesPrisionais', updated);
  };

  return {
    tipoCrimes,
    setTipoCrimes,
    addTipoCrime,
    removeTipoCrime,
    editTipoCrime,
    comarcasVaras,
    setComarcasVaras,
    addComarcaVara,
    removeComarcaVara,
    editComarcaVara,
    situacoesPrisionais,
    setSituacoesPrisionais,
    addSituacaoPrisional,
    removeSituacaoPrisional,
    editSituacaoPrisional,
  };
}
