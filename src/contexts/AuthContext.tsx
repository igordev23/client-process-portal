import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService'; // ajuste o caminho conforme sua estrutura

export type UserRole = 'admin' | 'employee' | 'client';
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  password: string; // 🔥 Novo campo
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
  createdBy: string; // 🔥 ID do usuário que cadastrou
}

export interface ProcessUpdate {
  id: string;
  date: string;
  description: string;
  author: string;
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
  situacaoPrisional?: string;
  comarcaVara?: string;
  tipoCrime?: string;
}

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

// Dados iniciais
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Dra. Maria Silva',
    email: 'maria@escritorio.com',
    cpf: '123.456.789-00',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'admin123', // 🔥 Senha definida no sistema
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@escritorio.com',
    cpf: '987.654.321-00',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'func123', // 🔥 Senha definida no sistema
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
    createdBy: '1', // ID do usuário que cadastrou
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
    createdBy: '1', // ID do usuário que cadastrou
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
    situacaoPrisional: 'Preso preventivamente',
    comarcaVara: 'Vara Criminal de São Paulo',
    tipoCrime: 'Receptação',
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
    situacaoPrisional: 'Em liberdade',
    comarcaVara: '2ª Vara do Trabalho de SP',
    tipoCrime: 'Trabalhista',
  },
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [tipoCrimes, setTipoCrimes] = useState<string[]>([]);
  const [comarcasVaras, setComarcasVaras] = useState<string[]>([]);
  const [situacoesPrisionais, setSituacoesPrisionais] = useState<string[]>([]);

  useEffect(() => {
  async function loadData() {
    const storedUser = await storageService.getItem<User | null>('currentUser', null);
    const storedClients = await storageService.getItem<Client[]>('clients', initialClients);
    const storedProcesses = await storageService.getItem<Process[]>('processes', initialProcesses);
    const storedUsers = await storageService.getItem<User[]>('users', initialUsers);
    const storedTipoCrimes = await storageService.getItem<string[]>('tipoCrimes', []);
    const storedComarcasVaras = await storageService.getItem<string[]>('comarcasVaras', []);
    const storedSituacoesPrisionais = await storageService.getItem<string[]>('situacoesPrisionais', []);

    setUser(storedUser);
    setClients(storedClients);
    setProcesses(storedProcesses);
    setUsers(storedUsers);
    setTipoCrimes(storedTipoCrimes);
    setComarcasVaras(storedComarcasVaras);
    setSituacoesPrisionais(storedSituacoesPrisionais);
  }

  loadData();
}, []);


  const login = async (email: string, password: string): Promise<boolean> => {
  const foundUser = users.find(u => u.email === email && u.password === password);
  if (foundUser) {
    setUser(foundUser);
    storageService.setItem('currentUser', foundUser);
    toast({ title: 'Login realizado com sucesso', description: `Bem-vindo(a), ${foundUser.name}!` });
    return true;
  }
  toast({ title: 'Erro no login', description: 'Email ou senha incorretos', variant: 'destructive' });
  return false;
};


  const logout = () => {
    setUser(null);
    storageService.removeItem('currentUser');
    toast({ title: 'Logout realizado', description: 'Até logo!' });
  };

  const generateAccessKey = (name: string): string => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${initials}${year}${random}`;
  };

  const addClient = (clientData: Omit<Client, 'id' | 'accessKey' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
  if (!user) {
    toast({ title: 'Ação não permitida', description: 'É preciso estar logado para cadastrar um cliente', variant: 'destructive' });
    return;
  }

  const newClient: Client = {
    ...clientData,
    id: Date.now().toString(),
    accessKey: generateAccessKey(clientData.name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user.id, // 🔥 Inclui o ID do usuário logado
  };

  const updatedClients = [...clients, newClient];
  setClients(updatedClients);
  storageService.setItem('clients', updatedClients);
  toast({ title: 'Cliente cadastrado', description: `Cliente ${newClient.name} cadastrado com chave de acesso: ${newClient.accessKey}` });
};


  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates, updatedAt: new Date().toISOString() } : client
    );
    setClients(updatedClients);
    storageService.setItem('clients', updatedClients);
    toast({ title: 'Cliente atualizado', description: 'Dados do cliente foram atualizados com sucesso' });
  };

  const deleteClient = (id: string) => {
    if (user?.role !== 'admin') {
      toast({ title: 'Acesso negado', description: 'Apenas administradores podem excluir clientes', variant: 'destructive' });
      return;
    }
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    storageService.setItem('clients', updatedClients);
    toast({ title: 'Cliente removido', description: 'Cliente foi removido do sistema' });
  };

  // Processes
  const addProcess = (processData: Omit<Process, 'id' | 'updates'>) => {
    const newProcess: Process = {
      ...processData,
      id: Date.now().toString(),
      updates: [],
    };
    const updatedProcesses = [...processes, newProcess];
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Processo cadastrado', description: `Processo ${newProcess.processNumber} foi cadastrado` });
  };

  const updateProcess = (id: string, updates: Partial<Process>) => {
    const updatedProcesses = processes.map(proc =>
      proc.id === id ? { ...proc, ...updates, lastUpdate: new Date().toISOString() } : proc
    );
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Processo atualizado', description: 'Dados do processo foram atualizados' });
  };

  const deleteProcess = (id: string) => {
    const updatedProcesses = processes.filter(proc => proc.id !== id);
    setProcesses(updatedProcesses);
    storageService.setItem('processes', updatedProcesses);
    toast({ title: 'Processo removido', description: 'Processo removido do sistema' });
  };

  // Process Updates
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

  // Tipo Crimes
  const addTipoCrime = (value: string) => {
    if (!tipoCrimes.includes(value)) {
      const updated = [...tipoCrimes, value];
      setTipoCrimes(updated);
      storageService.setItem('tipoCrimes', updated);
    }
  };
  const removeTipoCrime = (value: string) => {
    const updated = tipoCrimes.filter(item => item !== value);
    setTipoCrimes(updated);
    storageService.setItem('tipoCrimes', updated);
  };
  const editTipoCrime = (oldValue: string, newValue: string) => {
    const updated = tipoCrimes.map(item => (item === oldValue ? newValue : item));
    setTipoCrimes(updated);
    storageService.setItem('tipoCrimes', updated);
  };

  // Comarcas Varas
  const addComarcaVara = (value: string) => {
    if (!comarcasVaras.includes(value)) {
      const updated = [...comarcasVaras, value];
      setComarcasVaras(updated);
      storageService.setItem('comarcasVaras', updated);
    }
  };
  const removeComarcaVara = (value: string) => {
    const updated = comarcasVaras.filter(item => item !== value);
    setComarcasVaras(updated);
    storageService.setItem('comarcasVaras', updated);
  };
  const editComarcaVara = (oldValue: string, newValue: string) => {
    const updated = comarcasVaras.map(item => (item === oldValue ? newValue : item));
    setComarcasVaras(updated);
    storageService.setItem('comarcasVaras', updated);
  };

  // Situações Prisionais
  const addSituacaoPrisional = (value: string) => {
    if (!situacoesPrisionais.includes(value)) {
      const updated = [...situacoesPrisionais, value];
      setSituacoesPrisionais(updated);
      storageService.setItem('situacoesPrisionais', updated);
    }
  };
  const removeSituacaoPrisional = (value: string) => {
    const updated = situacoesPrisionais.filter(item => item !== value);
    setSituacoesPrisionais(updated);
    storageService.setItem('situacoesPrisionais', updated);
  };
  const editSituacaoPrisional = (oldValue: string, newValue: string) => {
    const updated = situacoesPrisionais.map(item => (item === oldValue ? newValue : item));
    setSituacoesPrisionais(updated);
    storageService.setItem('situacoesPrisionais', updated);
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
