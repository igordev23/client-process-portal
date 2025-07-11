
import { useState } from 'react';
import { Process, ProcessUpdate, User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

export function useProcesses(user: User | null) {
  const [processes, setProcesses] = useState<Process[]>([]);

  const addProcess = async (processData: Omit<Process, 'id' | 'updates'>) => {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'É preciso estar logado para cadastrar um processo',
        variant: 'destructive',
      });
      return;
    }

    const newProcess: Process = {
      ...processData,
      id: Date.now().toString(),
      updates: [],
    };

    try {
      if (storageService.createItem) {
        const savedProcess = await storageService.createItem<Process>('processes', newProcess);
        const updatedProcesses = [...processes, savedProcess];
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      } else {
        const updatedProcesses = [...processes, newProcess];
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      }
      toast({
        title: 'Processo cadastrado',
        description: `Processo ${newProcess.processNumber} foi cadastrado com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar processo:', error);
      toast({
        title: 'Erro ao salvar processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const updateProcess = async (id: string, updates: Partial<Process>) => {
    try {
      const updatedProcesses = processes.map(proc =>
        proc.id === id ? { ...proc, ...updates, lastUpdate: new Date().toISOString() } : proc
      );

      if (storageService.updateItem) {
        const processToUpdate = updatedProcesses.find(p => p.id === id)!;
        await storageService.updateItem<Process>('processes', id, processToUpdate);
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      } else {
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      }

      toast({ title: 'Processo atualizado', description: 'Dados do processo foram atualizados' });
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      toast({
        title: 'Erro ao atualizar processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      if (storageService.deleteItem) {
        await storageService.deleteItem('processes', id);
        const updatedProcesses = processes.filter(proc => proc.id !== id);
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      } else {
        const updatedProcesses = processes.filter(proc => proc.id !== id);
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      }
      toast({ title: 'Processo removido', description: 'Processo removido do sistema' });
    } catch (error) {
      console.error('Erro ao remover processo:', error);
      toast({
        title: 'Erro ao remover processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const addProcessUpdate = (processId: string, updateData: Omit<ProcessUpdate, 'id'>) => {
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
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização adicionada', description: 'Nova atualização do processo adicionada' });
  };

  const updateProcessUpdate = (processId: string, updateId: string, newUpdate: Partial<ProcessUpdate>) => {
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
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização modificada', description: 'Dados da atualização do processo foram modificados' });
  };

  const deleteProcessUpdate = (processId: string, updateId: string) => {
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
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Atualização removida', description: 'Atualização do processo removida' });
  };

  const getClientProcesses = (clientId: string) => {
    return processes.filter(proc => proc.clientId === clientId);
  };

  return {
    processes,
    setProcesses,
    addProcess,
    updateProcess,
    deleteProcess,
    addProcessUpdate,
    updateProcessUpdate,
    deleteProcessUpdate,
    getClientProcesses,
  };
}
