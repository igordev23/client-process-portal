
import { useState } from 'react';
import { Client, User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

export function useClients(user: User | null) {
  const [clients, setClients] = useState<Client[]>([]);

  const generateAccessKey = (name: string): string => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${year}${random}`;
  };

  const fetchClients = async () => {
    try {
      const storedClients = await storageService.getItem<Client[]>('clients', []);
      setClients(storedClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const addClient = async (
    clientData: Omit<Client, 'id' | 'access_key' | 'created_at' | 'updated_at' | 'created_by'>
  ) => {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'É preciso estar logado para cadastrar um cliente',
        variant: 'destructive',
      });
      return;
    }

    const newClient: Client = {
      ...clientData,
      id: Date.now(),
      access_key: generateAccessKey(clientData.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user.id,
    };

    try {
      if (storageService.createItem) {
        const savedClient = await storageService.createItem<Client>('clients', newClient);
        const updatedClients = [...clients, savedClient];
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      } else {
        const updatedClients = [...clients, newClient];
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      }

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
      const currentClient = clients.find(client => String(client.id) === String(id));
      if (!currentClient) {
        throw new Error('Cliente não encontrado');
      }

      const updatedClient: Client = {
        ...currentClient,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (storageService.updateItem) {
        await storageService.updateItem<Client>('clients', id, updatedClient);
        const updatedClients = clients.map(c => (String(c.id) === String(id) ? updatedClient : c));
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      } else {
        const updatedClients = clients.map(c => (String(c.id) === String(id) ? updatedClient : c));
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      }

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
      if (storageService.deleteItem) {
        await storageService.deleteItem('clients', id);
        const updatedClients = clients.filter(client => String(client.id) !== String(id));
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      } else {
        const updatedClients = clients.filter(client => String(client.id) !== String(id));
        setClients(updatedClients);
        await storageService.setItem('clients', updatedClients);
      }
      toast({ title: 'Cliente removido', description: 'Cliente foi removido do sistema' });
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
    setClients,
    addClient,
    updateClient,
    deleteClient,
    fetchClients,
  };
}
