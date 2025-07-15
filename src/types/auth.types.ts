
export type UserRole = 'admin' | 'employee' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  password: string;
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
  createdBy: string;
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
  situacaoPrisionalId?: number;
  comarcaVaraId?: number;
  tipoCrimeId?: number;
}

export interface Entity {
  id: number;
  name: string;
}

export interface AuthContextType {
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
  tipoCrimes: Entity[];
  addTipoCrime: (value: string) => void;
  removeTipoCrime: (id: number) => void;
  editTipoCrime: (id: number, newValue: string) => void;
  comarcasVaras: Entity[];
  addComarcaVara: (value: string) => void;
  removeComarcaVara: (id: number) => void;
  editComarcaVara: (id: number, newValue: string) => void;
  situacoesPrisionais: Entity[];
  addSituacaoPrisional: (value: string) => void;
  removeSituacaoPrisional: (id: number) => void;
  editSituacaoPrisional: (id: number, newValue: string) => void;
  fetchProcesses: () => Promise<void>;
}
