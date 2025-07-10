
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
