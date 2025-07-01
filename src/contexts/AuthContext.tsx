import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'employee' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  accessKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Process {
  id: string;
  clientId: string;
  processNumber: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  lastUpdate: string;
  description: string;
  lawyer: string;
  updates: ProcessUpdate[];
  prisonStatus?: string;
  court?: string;
  crimeType?: string;
}

export interface ProcessUpdate {
  id: string;
  date: string;
  description: string;
  author: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  clients: Client[];
  processes: Process[];
  users: User[];
  addClient: (client: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProcess: (process: Omit<Process, 'id' | 'updates'>) => void;
  updateProcess: (id: string, process: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  addProcessUpdate: (processId: string, update: Omit<ProcessUpdate, 'id'>) => void;
  getClientProcesses: (clientId: string) => Process[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Dra. Maria Silva',
    email: 'maria@escritorio.com',
    cpf: '123.456.789-00',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@escritorio.com',
    cpf: '987.654.321-00',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Ana Carolina Pereira',
    cpf: '111.222.333-44',
    email: 'ana@email.com',
    phone: '(11) 99999-1111',
    accessKey: 'ACP2024001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Roberto Lima',
    cpf: '555.666.777-88',
    email: 'roberto@email.com',
    phone: '(11) 99999-2222',
    accessKey: 'RL2024002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialProcesses: Process[] = [
  {
    id: '1',
    clientId: '1',
    processNumber: '1234567-89.2024.8.26.0001',
    title: 'Ação de Revisão de Benefício',
    status: 'active',
    startDate: '2024-01-15',
    lastUpdate: '2024-06-20',
    description: 'Revisão de auxílio-doença junto ao INSS',
    lawyer: 'Dra. Maria Silva',
    updates: [
      {
        id: '1',
        date: '2024-06-20',
        description: 'Audiência agendada para 15/07/2024',
        author: 'Dra. Maria Silva',
      },
      {
        id: '2',
        date: '2024-05-10',
        description: 'Documentos complementares enviados',
        author: 'João Santos',
      },
    ],
    prisonStatus: 'Preso preventivamente',
    court: 'Vara Criminal de São Paulo',
    crimeType: 'Receptação',
  },
  {
    id: '2',
    clientId: '2',
    processNumber: '9876543-21.2024.8.26.0002',
    title: 'Ação Trabalhista',
    status: 'pending',
    startDate: '2024-03-01',
    lastUpdate: '2024-06-18',
    description: 'Reclamação trabalhista por horas extras',
    lawyer: 'Dra. Maria Silva',
    updates: [
      {
        id: '3',
        date: '2024-06-18',
        description: 'Aguardando resposta da empresa',
        author: 'Dra. Maria Silva',
      },
    ],
    prisonStatus: 'Em liberdade',
    court: '2ª Vara do Trabalho de SP',
    crimeType: 'Trabalhista',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedClients = localStorage.getItem('clients');
    const storedProcesses = localStorage.getItem('processes');
    const storedUsers = localStorage.getItem('users');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setClients(storedClients ? JSON.parse(storedClients) : initialClients);
    setProcesses(storedProcesses ? JSON.parse(storedProcesses) : initialProcesses);
    setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);

    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      toast({ title: 'Login realizado com sucesso', description: `Bem-vindo(a), ${foundUser.name}!` });
      return true;
    }

    toast({ title: 'Erro no login', description: 'Email ou senha incorretos', variant: 'destructive' });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({ title: 'Logout realizado', description: 'Até logo!' });
  };

  const generateAccessKey = (name: string): string => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${year}${random}`;
  };

  const addClient = (clientData: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      accessKey: generateAccessKey(clientData.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    toast({ title: 'Cliente cadastrado', description: `Cliente ${newClient.name} cadastrado com chave de acesso: ${newClient.accessKey}` });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates, updatedAt: new Date().toISOString() } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    toast({ title: 'Cliente atualizado', description: 'Dados do cliente foram atualizados com sucesso' });
  };

  const deleteClient = (id: string) => {
    if (user?.role !== 'admin') {
      toast({ title: 'Acesso negado', description: 'Apenas administradores podem excluir clientes', variant: 'destructive' });
      return;
    }

    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    toast({ title: 'Cliente removido', description: 'Cliente foi removido do sistema' });
  };

  const addProcess = (processData: Omit<Process, 'id' | 'updates'>) => {
    const newProcess: Process = {
      ...processData,
      id: Date.now().toString(),
      updates: [],
    };

    const updatedProcesses = [...processes, newProcess];
    setProcesses(updatedProcesses);
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    toast({ title: 'Processo cadastrado', description: `Processo ${newProcess.processNumber} foi cadastrado` });
  };

  const updateProcess = (id: string, updates: Partial<Process>) => {
    const updatedProcesses = processes.map(process =>
      process.id === id ? { ...process, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : process
    );
    setProcesses(updatedProcesses);
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    toast({ title: 'Processo atualizado', description: 'Dados do processo foram atualizados' });
  };

  const deleteProcess = (id: string) => {
    const updated = processes.filter(p => p.id !== id);
    setProcesses(updated);
    localStorage.setItem('processes', JSON.stringify(updated));
    toast({ title: 'Processo excluído', description: 'O processo foi removido com sucesso' });
  };

  const addProcessUpdate = (processId: string, updateData: Omit<ProcessUpdate, 'id'>) => {
    const newUpdate: ProcessUpdate = {
      ...updateData,
      id: Date.now().toString(),
    };

    const updatedProcesses = processes.map(process =>
      process.id === processId
        ? { ...process, updates: [...process.updates, newUpdate], lastUpdate: newUpdate.date }
        : process
    );

    setProcesses(updatedProcesses);
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    toast({ title: 'Atualização adicionada', description: 'Nova atualização foi adicionada ao processo' });
  };

  const getClientProcesses = (clientId: string): Process[] => {
    return processes.filter(process => process.clientId === clientId);
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
