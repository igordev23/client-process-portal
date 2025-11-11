import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
import { toCamelCase } from '@/components/ui/caseConverter';
import { AuthContextType, User, Process, Client } from '@/types/auth.types';

import { initialUsers, initialClients, initialProcesses } from '@/data/initialData';
import { useAuthLogic } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProcesses } from '@/hooks/useProcesses';
import { useEntities } from '@/hooks/useEntities';
import { useProcessUpdates } from '@/hooks/useProcessUpdates';
import { fixEncodingManual, fixUsersEncoding } from '@/utils/fixEncodingManual';

export type { Process, Client };
export type { ProcessUpdate } from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1); // 👈 novo: total de páginas
  const [currentPage, setCurrentPage] = useState<number>(1); // 👈 novo: página atual

  const authLogic = useAuthLogic();
  const clientsLogic = useClients(authLogic.user);
  const processesLogic = useProcesses(authLogic.user);
  const entitiesLogic = useEntities();
  const processUpdatesLogic = useProcessUpdates();

  useEffect(() => {
    async function loadData() {
      const storedUser = await localStorageDriver.getItem<User | null>('currentUser', null);
      if (storedUser) authLogic.setUser(storedUser);

      setIsLoading(false);

      // 🧠 carrega clientes normalmente
      const rawClients = await storageService.getItem<any[]>('clients', initialClients);

      // ✅ carrega processos com suporte à paginação
      const responseProcesses = await storageService.getItem<any>('processes', initialProcesses, currentPage, 20);

      // Se vier no formato paginado, extrai data, totalPages etc.
      const rawProcesses = Array.isArray(responseProcesses)
        ? responseProcesses
        : responseProcesses?.data || [];

      const totalFromApi = responseProcesses?.totalPages || 1;
      setTotalPages(totalFromApi);

      const rawUsers = await storageService.getItem<any[]>('user', initialUsers);
      const storedTipoCrimes = await storageService.getItem<string[]>('tiposCrime', []);
      const storedComarcasVaras = await storageService.getItem<string[]>('comarcasVaras', []);
      const storedSituacoesPrisionais = await storageService.getItem<string[]>('situacoesPrisionais', []);
      const storedprocessupdtaes = await storageService.getItem<any[]>('processUpdate', []);

      // converte campos de snake_case para camelCase
      const storedClients = toCamelCase(rawClients);
      const storedProcesses = toCamelCase(rawProcesses);
      const storedUsers = toCamelCase(rawUsers);

      // corrige possíveis caracteres corrompidos nos nomes
      const fixedUsers = fixUsersEncoding(storedUsers);

      clientsLogic.setClients(storedClients);
      processesLogic.setProcesses(storedProcesses);
      setUsers(fixedUsers);
    }

    loadData();
  }, [currentPage]); // 🔁 recarrega quando a página muda

  const value: AuthContextType = {
    ...authLogic,
    ...clientsLogic,
    ...processesLogic,
    ...entitiesLogic,
    ...processUpdatesLogic,
    users,
    isLoading,
    totalPages,
    currentPage,
    setCurrentPage, // 👈 permite mudar a página no Dashboard futuramente
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
