
export type UserRole = 'admin' | 'employee' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  password: string;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  access_key: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ProcessUpdate {
  id: string;
  date: string;
  description: string;
  author: string;
}

export interface Process {
  id: string;
  client_id: string;
  process_number: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  last_update: string;
  description: string;
  lawyer: string;
  updates: ProcessUpdate[];
  situacao_prisional?: string;
  comarca_vara?: string;
  tipo_crime?: string;
  situacao_prisional_id?: number;
  comarca_vara_id?: number;
  tipo_crime_id?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  clients: Client[];
  processes: Process[];
  users: User[];
  addClient: (client: Omit<Client, 'id' | 'access_key' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProcess: (process: Omit<Process, 'id' | 'updates'>) => void;
  updateProcess: (id: string, process: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  addProcessUpdate: (processId: string, update: Omit<ProcessUpdate, 'id'>) => void;
  getClientProcesses: (clientId: string) => Process[];
  updateProcessUpdate: (processId: string, updateId: string, newUpdate: Partial<ProcessUpdate>) => void;
  deleteProcessUpdate: (processId: string, updateId: string) => void;
  tipos_crime: string[];
  addTipoCrime: (value: string) => void;
  removeTipoCrime: (value: string) => void;
  editTipoCrime: (oldValue: string, newValue: string) => void;
  comarcas_varas: string[];
  addComarcaVara: (value: string) => void;
  removeComarcaVara: (value: string) => void;
  editComarcaVara: (oldValue: string, newValue: string) => void;
  situacoes_prisionais: string[];
  addSituacaoPrisional: (value: string) => void;
  removeSituacaoPrisional: (value: string) => void;
  editSituacaoPrisional: (oldValue: string, newValue: string) => void;
}
