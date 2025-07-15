
import { Process, User } from '@/types/auth.types';
import { useApiData } from './useApiData';
import { toast } from '@/hooks/use-toast';

export function useProcesses(user: User | null) {
  const {
    data: processes,
    loading,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    setData,
  } = useApiData<Process>({
    key: 'processes',
    fallback: [],
  });

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

    const newProcess: Omit<Process, 'id'> = {
      ...processData,
      startDate: localIso,
      lastUpdate: localIso,
      updates: [],
    };

    try {
      await createItem(newProcess);
      toast({
        title: 'Processo cadastrado',
        description: `Processo ${newProcess.processNumber} foi cadastrado com sucesso.`,
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
      const updatedProcess = {
        ...updates,
        lastUpdate: new Date().toISOString(),
      };

      await updateItem(id, updatedProcess);
      toast({ 
        title: 'Processo atualizado', 
        description: 'Dados do processo foram atualizados.' 
      });
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
      await deleteItem(id);
      toast({ 
        title: 'Processo removido', 
        description: 'Processo removido do sistema.' 
      });
    } catch (error) {
      console.error('Erro ao remover processo:', error);
      toast({
        title: 'Erro ao remover processo',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const getClientProcesses = (clientId: string) => {
    return processes.filter(proc => proc.clientId === clientId);
  };

  return {
    processes,
    loading,
    fetchProcesses: fetchData,
    setProcesses: setData,
    addProcess,
    updateProcess,
    deleteProcess,
    getClientProcesses,
  };
}
