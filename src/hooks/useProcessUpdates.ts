// hooks/useProcessUpdates.ts
import { useState } from 'react';
import { ProcessUpdate } from '@/types/auth.types';
import { storageService } from '@/components/storage_service/storageService';
import { toast } from '@/hooks/use-toast';

export function useProcessUpdates() {
  const [updates, setUpdates] = useState<ProcessUpdate[]>([]);

  const fetchUpdates = async () => {
    try {
      const data = await storageService.getItem<ProcessUpdate[]>('processUpdate', []);
      setUpdates(data);
    } catch {
      toast({ title: 'Erro ao carregar atualizações', variant: 'destructive' });
    }
  };

  const addProcessUpdate = async (
    processId: string,
    update: Omit<ProcessUpdate, 'id' | 'processId'>
  ) => {
    try {
      console.log('🔄 Enviando update para API', { processId, update });

      await storageService.createItem('processUpdate', {
        ...update,
        processId,
      });

      // 🔥 Recarrega a lista completa após adicionar
      await fetchUpdates();

      toast({ title: 'Atualização adicionada' });
    } catch {
      toast({ title: 'Erro ao adicionar atualização', variant: 'destructive' });
    }
  };

  const updateProcessUpdate = async (
    processId: string,
    updateId: string,
    update: Partial<ProcessUpdate>
  ) => {
    try {
      await storageService.updateItem('processUpdate', updateId, {
        ...update,
        processId,
      });

      // 🔥 Recarrega a lista completa após editar
      await fetchUpdates();

      toast({ title: 'Atualização atualizada' });
    } catch {
      toast({ title: 'Erro ao atualizar atualização', variant: 'destructive' });
    }
  };

  const deleteProcessUpdate = async (processId: string, updateId: string) => {
    try {
      await storageService.deleteItem('processUpdate', updateId);

      // 🔥 Recarrega a lista completa após excluir
      await fetchUpdates();

      toast({ title: 'Atualização removida' });
    } catch {
      toast({ title: 'Erro ao remover atualização', variant: 'destructive' });
    }
  };

  return {
    updates,
    fetchUpdates,
    addProcessUpdate,
    updateProcessUpdate,
    deleteProcessUpdate,
  };
}
