
import { Client, User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

const generateAccessKey = (name: string): string => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${initials}${year}${random}`;
};

export const clientService = {
  async addClient(
    clientData: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    user: User
  ): Promise<Client | null> {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      accessKey: generateAccessKey(clientData.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    };

    try {
      if (storageService.createItem) {
        return await storageService.createItem<Client>('clients', newClient);
      } else {
        await storageService.setItem('clients', newClient);
        return newClient;
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: 'Erro ao salvar cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return null;
    }
  },

  async updateClient(id: string, updates: Partial<Client>, clients: Client[]): Promise<Client | null> {
    try {
      const currentClient = clients.find(client => client.id === id);
      if (!currentClient) {
        throw new Error('Cliente não encontrado');
      }

      const updatedClient: Client = {
        ...currentClient,
        ...updates,
        accessKey: currentClient.accessKey,
        updatedAt: new Date().toISOString(),
      };

      if (storageService.updateItem) {
        await storageService.updateItem<Client>('clients', id, updatedClient);
      } else {
        await storageService.setItem('clients', updatedClient);
      }

      toast({
        title: 'Cliente atualizado',
        description: 'Dados do cliente foram atualizados com sucesso',
      });

      return updatedClient;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return null;
    }
  },

  async deleteClient(id: string, userRole: string): Promise<boolean> {
    if (userRole !== 'admin') {
      toast({
        title: 'Acesso negado',
        description: 'Apenas administradores podem excluir clientes',
        variant: 'destructive',
      });
      return false;
    }

    try {
      if (storageService.deleteItem) {
        await storageService.deleteItem('clients', id);
      }
      toast({ title: 'Cliente removido', description: 'Cliente foi removido do sistema' });
      return true;
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: 'Erro ao remover cliente',
        description: 'Verifique sua conexão com o servidor',
        variant: 'destructive',
      });
      return false;
    }
  }
};
