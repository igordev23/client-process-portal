
import { User, Client, Process } from '@/types/auth.types';

export const initialUsers: User[] = [
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

export const initialClients: Client[] = [
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

export const initialProcesses: Process[] = [
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
