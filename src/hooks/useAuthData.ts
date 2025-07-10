
import { useState, useEffect } from 'react';
import { User, Client, Process } from '@/types/auth';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
import { toCamelCase } from '@/components/ui/caseConverter';

const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

// Initial data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Dra. Maria Silva',
    email: 'maria@escritorio.com',
    cpf: '123.456.789-00',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'admin123',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@escritorio.com',
    cpf: '987.654.321-00',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'func123',
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
    createdBy: '1',
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
    createdBy: '1',
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

export function useAuthData() {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tipoCrimes, setTipoCrimes] = useState<string[]>([]);
  const [comarcasVaras, setComarcasVaras] = useState<string[]>([]);
  const [situacoesPrisionais, setSituacoesPrisionais] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const storedUser = isApiMode
        ? null
        : await localStorageDriver.getItem<User | null>('currentUser', null);

      const rawClients = await storageService.getItem<any[]>('clients', initialClients);
      const rawProcesses = await storageService.getItem<any[]>('processes', initialProcesses);
      const rawUsers = await storageService.getItem<any[]>('user', initialUsers);
      const storedTipoCrimes = await storageService.getItem<string[]>('tiposCrime', []);
      const storedComarcasVaras = await storageService.getItem<string[]>('comarcasVaras', []);
      const storedSituacoesPrisionais = await storageService.getItem<string[]>('situacoesPrisionais', []);

      const storedClients = toCamelCase(rawClients);
      const storedProcesses = toCamelCase(rawProcesses);
      const storedUsers = toCamelCase(rawUsers);

      console.log('loaded processes:', storedProcesses);
      console.log('loaded clients:', storedClients);
      console.log('loaded users:', storedUsers);

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

  return {
    user,
    setUser,
    clients,
    setClients,
    processes,
    setProcesses,
    users,
    setUsers,
    tipoCrimes,
    setTipoCrimes,
    comarcasVaras,
    setComarcasVaras,
    situacoesPrisionais,
    setSituacoesPrisionais,
  };
}
