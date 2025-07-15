
import { User, Client } from '@/types/auth.types';
import { useApiData } from './useApiData';
import { toast } from '@/hooks/use-toast';

export function useClients(user: User | null) {
  const {
    data: clients,
    loading,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    setData,
  } = useApiData<Client>({
    key: 'clients',
    fallback: [],
  });

  const generateAccessKey = (name: string): string => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${year}${random}`;
  };

  const addClient = async (
    clientData: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ) => {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'É preciso estar logado para cadastrar um cliente',
        variant: 'destructive',
      });
      return;
    }

    const newClient: Omit<Client, 'id'> = {
      ...clientData,
      accessKey: generateAccessKey(clientData.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    };

    try {
      await createItem(newClient);
      toast({
        title: 'Cliente cadastrado',
        description: `Cliente ${newClient.name} cadastrado com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: 'Erro ao salvar cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updatedClient = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateItem(id, updatedClient);
      toast({
        title: 'Cliente atualizado',
        description: 'Dados do cliente foram atualizados com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  const deleteClient = async (id: string) => {
    if (user?.role !== 'admin') {
      toast({
        title: 'Acesso negado',
        description: 'Apenas administradores podem excluir clientes',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteItem(id);
      toast({ 
        title: 'Cliente removido', 
        description: 'Cliente foi removido do sistema' 
      });
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: 'Erro ao remover cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
    }
  };

  return {
    clients,
    loading,
    fetchClients: fetchData,
    setClients: setData,
    addClient,
    updateClient,
    deleteClient,
  };
}
