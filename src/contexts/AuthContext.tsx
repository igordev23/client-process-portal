
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
import { toCamelCase } from '@/components/ui/caseConverter';
import { AuthContextType, User, Process } from '@/types/auth.types';

import { initialUsers, initialClients, initialProcesses } from '@/data/initialData';
import { useAuthLogic } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProcesses } from '@/hooks/useProcesses';
import { useEntities } from '@/hooks/useEntities';


export type { Process };
export type { ProcessUpdate } from '@/types/auth.types';
// Export deleteProcess from the context value

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

  const authLogic = useAuthLogic();
  const clientsLogic = useClients(authLogic.user);
  const processesLogic = useProcesses(authLogic.user);
  const entitiesLogic = useEntities();

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
      console.log('loaded user:', storedUser);
      console.log('loaded clients:', storedClients);
      console.log('loaded users:', storedUsers);

      authLogic.setUser(storedUser);
      clientsLogic.setClients(storedClients);
      processesLogic.setProcesses(storedProcesses);
      setUsers(storedUsers);
      entitiesLogic.setTipoCrimes(storedTipoCrimes);
      entitiesLogic.setComarcasVaras(storedComarcasVaras);
      entitiesLogic.setSituacoesPrisionais(storedSituacoesPrisionais);
    }

    loadData();
  }, []);

  const value: AuthContextType = {
    ...authLogic,
    ...clientsLogic,
    ...processesLogic,
    ...entitiesLogic,
    users,
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
