
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { User, Client, Process, ProcessUpdate } from '@/types/auth';
export type { Process, ProcessUpdate };
import { useAuthData } from '@/hooks/useAuthData';
import { authService } from '@/services/authService';
import { clientService } from '@/services/clientService';
import { processService } from '@/services/processService';
import { entityService } from '@/services/entityService';
import { storageService } from '@/components/storage_service/storageService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  clients: Client[];
  processes: Process[];
  users: User[];
  addClient: (client: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProcess: (process: Omit<Process, 'id' | 'updates'>) => void;
  updateProcess: (id: string, process: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  addProcessUpdate: (processId: string, update: Omit<ProcessUpdate, 'id'>) => void;
  getClientProcesses: (clientId: string) => Process[];
  updateProcessUpdate: (processId: string, updateId: string, newUpdate: Partial<ProcessUpdate>) => void;
  deleteProcessUpdate: (processId: string, updateId: string) => void;
  tipoCrimes: string[];
  addTipoCrime: (value: string) => void;
  removeTipoCrime: (value: string) => void;
  editTipoCrime: (oldValue: string, newValue: string) => void;
  comarcasVaras: string[];
  addComarcaVara: (value: string) => void;
  removeComarcaVara: (value: string) => void;
  editComarcaVara: (oldValue: string, newValue: string) => void;
  situacoesPrisionais: string[];
  addSituacaoPrisional: (value: string) => void;
  removeSituacaoPrisional: (value: string) => void;
  editSituacaoPrisional: (oldValue: string, newValue: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    setUser,
    clients,
    setClients,
    processes,
    setProcesses,
    users,
    tipoCrimes,
    setTipoCrimes,
    comarcasVaras,
    setComarcasVaras,
    situacoesPrisionais,
    setSituacoesPrisionais,
  } = useAuthData();

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedUser = await authService.login(email, password);
    if (loggedUser) {
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    authService.logout();
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

    const newClient = await clientService.addClient(clientData, user);
    if (newClient) {
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      await storageService.setItem('clients', updatedClients);
      toast({
        title: 'Cliente cadastrado',
        description: `Cliente ${newClient.name} cadastrado com sucesso`,
      });
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const updatedClient = await clientService.updateClient(id, updates, clients);
    if (updatedClient) {
      const updatedClients = clients.map(c => (c.id === id ? updatedClient : c));
      setClients(updatedClients);
      await storageService.setItem('clients', updatedClients);
    }
  };

  const deleteClient = async (id: string) => {
    const success = await clientService.deleteClient(id, user?.role || '');
    if (success) {
      const updatedClients = clients.filter(client => client.id !== id);
      setClients(updatedClients);
      await storageService.setItem('clients', updatedClients);
    }
  };

  const addProcess = async (processData: Omit<Process, 'id' | 'updates'>) => {
    if (!user) return;

    const newProcess = await processService.addProcess(processData, user);
    if (newProcess) {
      const updatedProcesses = [...processes, newProcess];
      setProcesses(updatedProcesses);
      await storageService.setItem('processes', updatedProcesses);
      toast({
        title: 'Processo cadastrado',
        description: `Processo ${newProcess.processNumber} foi cadastrado com sucesso`,
      });
    }
  };

  const updateProcess = async (id: string, updates: Partial<Process>) => {
    const updatedProcess = await processService.updateProcess(id, updates, processes);
    if (updatedProcess) {
      const updatedProcesses = processes.map(proc =>
        proc.id === id ? updatedProcess : proc
      );
      setProcesses(updatedProcesses);
      await storageService.setItem('processes', updatedProcesses);
    }
  };

  const deleteProcess = async (id: string) => {
    const success = await processService.deleteProcess(id);
    if (success) {
      const updatedProcesses = processes.filter(proc => proc.id !== id);
      setProcesses(updatedProcesses);
      await storageService.setItem('processes', updatedProcesses);
    }
  };

  const addProcessUpdate = (processId: string, updateData: Omit<ProcessUpdate, 'id'>) => {
    const updatedProcesses = processService.addProcessUpdate(processId, updateData, processes);
    setProcesses(updatedProcesses);
  };

  const updateProcessUpdate = (processId: string, updateId: string, newUpdate: Partial<ProcessUpdate>) => {
    const updatedProcesses = processService.updateProcessUpdate(processId, updateId, newUpdate, processes);
    setProcesses(updatedProcesses);
  };

  const deleteProcessUpdate = (processId: string, updateId: string) => {
    const updatedProcesses = processService.deleteProcessUpdate(processId, updateId, processes);
    setProcesses(updatedProcesses);
  };

  const getClientProcesses = (clientId: string) => {
    return processService.getClientProcesses(clientId, processes);
  };

  // Entity management functions
  const addTipoCrime = (value: string) => {
    const updated = entityService.addTipoCrime(value, tipoCrimes);
    setTipoCrimes(updated);
  };

  const removeTipoCrime = (value: string) => {
    const updated = entityService.removeTipoCrime(value, tipoCrimes);
    setTipoCrimes(updated);
  };

  const editTipoCrime = (oldValue: string, newValue: string) => {
    const updated = entityService.editTipoCrime(oldValue, newValue, tipoCrimes);
    setTipoCrimes(updated);
  };

  const addComarcaVara = (value: string) => {
    const updated = entityService.addComarcaVara(value, comarcasVaras);
    setComarcasVaras(updated);
  };

  const removeComarcaVara = (value: string) => {
    const updated = entityService.removeComarcaVara(value, comarcasVaras);
    setComarcasVaras(updated);
  };

  const editComarcaVara = (oldValue: string, newValue: string) => {
    const updated = entityService.editComarcaVara(oldValue, newValue, comarcasVaras);
    setComarcasVaras(updated);
  };

  const addSituacaoPrisional = (value: string) => {
    const updated = entityService.addSituacaoPrisional(value, situacoesPrisionais);
    setSituacoesPrisionais(updated);
  };

  const removeSituacaoPrisional = (value: string) => {
    const updated = entityService.removeSituacaoPrisional(value, situacoesPrisionais);
    setSituacoesPrisionais(updated);
  };

  const editSituacaoPrisional = (oldValue: string, newValue: string) => {
    const updated = entityService.editSituacaoPrisional(oldValue, newValue, situacoesPrisionais);
    setSituacoesPrisionais(updated);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    clients,
    processes,
    users,
    addClient,
    updateClient,
    deleteClient,
    addProcess,
    updateProcess,
    deleteProcess,
    addProcessUpdate,
    getClientProcesses,
    updateProcessUpdate,
    deleteProcessUpdate,
    tipoCrimes,
    addTipoCrime,
    removeTipoCrime,
    editTipoCrime,
    comarcasVaras,
    addComarcaVara,
    removeComarcaVara,
    editComarcaVara,
    situacoesPrisionais,
    addSituacaoPrisional,
    removeSituacaoPrisional,
    editSituacaoPrisional,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
