
import { useEntityManager } from './useEntityManager';

export function useEntities() {
  const tipoCrimesManager = useEntityManager('tiposCrime');
  const comarcasVarasManager = useEntityManager('comarcasVaras');
  const situacoesPrisionaisManager = useEntityManager('situacoesPrisionais');

  return {
    // Tipos de Crime
    tipoCrimes: tipoCrimesManager.entities,
    addTipoCrime: tipoCrimesManager.addEntity,
    removeTipoCrime: tipoCrimesManager.removeEntity,
    editTipoCrime: tipoCrimesManager.editEntity,

    // Comarcas/Varas
    comarcasVaras: comarcasVarasManager.entities,
    addComarcaVara: comarcasVarasManager.addEntity,
    removeComarcaVara: comarcasVarasManager.removeEntity,
    editComarcaVara: comarcasVarasManager.editEntity,

    // Situações Prisionais
    situacoesPrisionais: situacoesPrisionaisManager.entities,
    addSituacaoPrisional: situacoesPrisionaisManager.addEntity,
    removeSituacaoPrisional: situacoesPrisionaisManager.removeEntity,
    editSituacaoPrisional: situacoesPrisionaisManager.editEntity,
  };
}
