
import { Process, ProcessUpdate, User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

export const processService = {
  async addProcess(processData: Omit<Process, 'id' | 'updates'>, user: User): Promise<Process | null> {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'É preciso estar logado para cadastrar um processo',
        variant: 'destructive',
      });
      return null;
    }

    const newProcess: Process = {
      ...processData,
      id: Date.now().toString(),
      updates: [],
    };

    try {
      if (storageService.createItem) {
        return await storageService.createItem<Process>('processes', newProcess);
      } else {
        await storageService.setItem('processes', newProcess);
        return newProcess;
      }
    } catch (error) {
      console.error('Erro ao cadastrar processo:', error);
      toast({
        title: 'Erro ao salvar processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return null;
    }
  },

  async updateProcess(id: string, updates: Partial<Process>, processes: Process[]): Promise<Process | null> {
    try {
      const processToUpdate = processes.find(p => p.id === id);
      if (!processToUpdate) {
        throw new Error('Processo não encontrado');
      }

      const updatedProcess = { 
        ...processToUpdate, 
        ...updates, 
        lastUpdate: new Date().toISOString() 
      };

      if (storageService.updateItem) {
        await storageService.updateItem<Process>('processes', id, updatedProcess);
      } else {
        await storageService.setItem('processes', updatedProcess);
      }

      toast({ title: 'Processo atualizado', description: 'Dados do processo foram atualizados' });
      return updatedProcess;
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      toast({
        title: 'Erro ao atualizar processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return null;
    }
  },

  async deleteProcess(id: string): Promise<boolean> {
    try {
      if (storageService.deleteItem) {
        await storageService.deleteItem('processes', id);
      }
      toast({ title: 'Processo removido', description: 'Processo removido do sistema' });
      return true;
    } catch (error) {
      console.error('Erro ao remover processo:', error);
      toast({
        title: 'Erro ao remover processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return false;
    }
  },

  addProcessUpdate(processId: string, updateData: Omit<ProcessUpdate, 'id'>, processes: Process[]): Process[] {
    const updatedProcesses = processes.map(proc => {
      if (proc.id === processId) {
        const newUpdate: ProcessUpdate = {
          id: Date.now().toString(),
          ...updateData,
        };
        return {
          ...proc,
          updates: [...proc.updates, newUpdate],
          lastUpdate: new Date().toISOString(),
        };
      }
      return proc;
    });

    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização adicionada', description: 'Nova atualização do processo adicionada' });
    return updatedProcesses;
  },

  updateProcessUpdate(processId: string, updateId: string, newUpdate: Partial<ProcessUpdate>, processes: Process[]): Process[] {
    const updatedProcesses = processes.map(proc => {
      if (proc.id === processId) {
        const updatedUpdates = proc.updates.map(upd =>
          upd.id === updateId ? { ...upd, ...newUpdate } : upd
        );
        return {
          ...proc,
          updates: updatedUpdates,
          lastUpdate: new Date().toISOString(),
        };
      }
      return proc;
    });

    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização modificada', description: 'Dados da atualização do processo foram modificados' });
    return updatedProcesses;
  },

  deleteProcessUpdate(processId: string, updateId: string, processes: Process[]): Process[] {
    const updatedProcesses = processes.map(proc => {
      if (proc.id === processId) {
        const filteredUpdates = proc.updates.filter(upd => upd.id !== updateId);
        return {
          ...proc,
          updates: filteredUpdates,
          lastUpdate: new Date().toISOString(),
        };
      }
      return proc;
    });

    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização removida', description: 'Atualização do processo removida' });
    return updatedProcesses;
  },

  getClientProcesses(clientId: string, processes: Process[]): Process[] {
    return processes.filter(proc => proc.clientId === clientId);
  }
};
