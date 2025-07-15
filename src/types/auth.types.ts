
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}

export interface Client {
  id: number;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  access_key?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
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
  situacao_prisional_id?: number;
  comarca_vara_id?: number;
  tipo_crime_id?: number;
  situacao_prisional?: string;
  comarca_vara?: string;
  tipo_crime?: string;
  client_name?: string;
}

export interface ProcessUpdate {
  id: string;
  process_id: string;
  date: string;
  description: string;
  author: string;
}

export interface Entity {
  id: number;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  users: User[];
  clients: Client[];
  processes: Process[];
  
  // Entidades
  tipos_crime: Entity[];
  comarcas_varas: Entity[];
  situacoes_prisionais: Entity[];
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  // Client methods
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setClients: (clients: Client[]) => void;
  fetchClients: () => Promise<void>;
  
  // Process methods
  addProcess: (process: Omit<Process, 'id' | 'updates'>) => Promise<void>;
  updateProcess: (id: string, process: Partial<Process>) => Promise<void>;
  deleteProcess: (id: string) => Promise<void>;
  setProcesses: (processes: Process[]) => void;
  fetchProcesses: () => Promise<void>;
  getClientProcesses: (clientId: string) => Process[];
  
  // Process update methods
  addProcessUpdate: (processId: string, update: Omit<ProcessUpdate, 'id' | 'process_id'>) => Promise<void>;
  updateProcessUpdate: (processId: string, updateId: string, update: Partial<ProcessUpdate>) => Promise<void>;
  deleteProcessUpdate: (processId: string, updateId: string) => Promise<void>;
  
  // Entity methods
  addTipoCrime: (name: string) => Promise<void>;
  removeTipoCrime: (id: number) => Promise<void>;
  editTipoCrime: (id: number, name: string) => Promise<void>;
  
  addComarcaVara: (name: string) => Promise<void>;
  removeComarcaVara: (id: number) => Promise<void>;
  editComarcaVara: (id: number, name: string) => Promise<void>;
  
  addSituacaoPrisional: (name: string) => Promise<void>;
  removeSituacaoPrisional: (id: number) => Promise<void>;
  editSituacaoPrisional: (id: number, name: string) => Promise<void>;
}
