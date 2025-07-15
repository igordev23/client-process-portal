
import { useState } from 'react';
import { Process, User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

export function useProcesses(user: User | null) {
  const [processes, setProcesses] = useState<Process[]>([]);

  // Buscar todos os processos
  const fetchProcesses = async () => {
    try {
      const data = await storageService.getItem<Process[]>('processes', []);
      setProcesses(data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: 'Erro ao carregar processos',
        description: 'Não foi possível atualizar os dados dos processos',
        variant: 'destructive',
      });
    }
  };
  
  // Criar um novo processo
  const addProcess = async (processData: Omit<Process, 'id' | 'updates'>) => {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'É preciso estar logado para cadastrar um processo',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const localIso = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 19).replace('T', ' ');

    const newProcess: Process = {
      ...processData,
      start_date: localIso,
      last_update: localIso,
      id: Date.now().toString(),
      updates: [],
    };

    try {
      if (storageService.createItem) {
        await storageService.createItem<Process>('processes', newProcess);
        await fetchProcesses();
      } else {
        const updatedProcesses = [...processes, newProcess];
        setProcesses(updatedProcesses);
        await storageService.setItem('processes', updatedProcesses);
      }

      toast({
        title: 'Processo cadastrado',
        description: `Processo ${newProcess.process_number} foi cadastrado com sucesso.`,
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

  // Atualizar dados de um processo existente
  const updateProcess = async (id: string, updates: Partial<Process>) => {
    try {
      const updatedProcesses = processes.map(proc =>
        proc.id === id ? { ...proc, ...updates, last_update: new Date().toISOString() } : proc
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

      toast({ title: 'Processo atualizado', description: 'Dados do processo foram atualizados.' });
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      toast({
        title: 'Erro ao atualizar processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  // Excluir um processo
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
      toast({ title: 'Processo removido', description: 'Processo removido do sistema.' });
    } catch (error) {
      console.error('Erro ao remover processo:', error);
      toast({
        title: 'Erro ao remover processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  // Filtrar processos por cliente
  const getClientProcesses = (clientId: string) => {
    return processes.filter(proc => proc.client_id === clientId);
  };

  return {
    processes,
    setProcesses,
    fetchProcesses,
    addProcess,
    updateProcess,
    deleteProcess,
    getClientProcesses,
  };
}
