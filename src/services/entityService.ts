
import { storageService } from '@/components/storage_service/storageService';

export const entityService = {
  // Tipo Crimes
  addTipoCrime: (value: string, tipoCrimes: string[]): string[] => {
    if (!tipoCrimes.includes(value)) {
      const updated = [...tipoCrimes, value];
      storageService.setItem('tipoCrimes', updated);
      return updated;
    }
    return tipoCrimes;
  },

  removeTipoCrime: (value: string, tipoCrimes: string[]): string[] => {
    const updated = tipoCrimes.filter(item => item !== value);
    storageService.setItem('tipoCrimes', updated);
    return updated;
  },

  editTipoCrime: (oldValue: string, newValue: string, tipoCrimes: string[]): string[] => {
    const updated = tipoCrimes.map(item => (item === oldValue ? newValue : item));
    storageService.setItem('tipoCrimes', updated);
    return updated;
  },

  // Comarcas Varas
  addComarcaVara: (value: string, comarcasVaras: string[]): string[] => {
    if (!comarcasVaras.includes(value)) {
      const updated = [...comarcasVaras, value];
      storageService.setItem('comarcasVaras', updated);
      return updated;
    }
    return comarcasVaras;
  },

  removeComarcaVara: (value: string, comarcasVaras: string[]): string[] => {
    const updated = comarcasVaras.filter(item => item !== value);
    storageService.setItem('comarcasVaras', updated);
    return updated;
  },

  editComarcaVara: (oldValue: string, newValue: string, comarcasVaras: string[]): string[] => {
    const updated = comarcasVaras.map(item => (item === oldValue ? newValue : item));
    storageService.setItem('comarcasVaras', updated);
    return updated;
  },

  // Situações Prisionais
  addSituacaoPrisional: (value: string, situacoesPrisionais: string[]): string[] => {
    if (!situacoesPrisionais.includes(value)) {
      const updated = [...situacoesPrisionais, value];
      storageService.setItem('situacoesPrisionais', updated);
      return updated;
    }
    return situacoesPrisionais;
  },

  removeSituacaoPrisional: (value: string, situacoesPrisionais: string[]): string[] => {
    const updated = situacoesPrisionais.filter(item => item !== value);
    storageService.setItem('situacoesPrisionais', updated);
    return updated;
  },

  editSituacaoPrisional: (oldValue: string, newValue: string, situacoesPrisionais: string[]): string[] => {
    const updated = situacoesPrisionais.map(item => (item === oldValue ? newValue : item));
    storageService.setItem('situacoesPrisionais', updated);
    return updated;
  }
};
