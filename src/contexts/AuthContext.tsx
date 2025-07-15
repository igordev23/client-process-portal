
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
import { AuthContextType, User, Process, ProcessUpdate } from '@/types/auth.types';
import { initialUsers, initialClients, initialProcesses } from '@/data/initialData';
import { useAuthLogic } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProcesses } from '@/hooks/useProcesses';
import { useEntities } from '@/hooks/useEntities';
import { useProcessUpdates } from '@/hooks/useProcessUpdates';

export type { Process, ProcessUpdate };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

  const authLogic = useAuthLogic();
  const clientsLogic = useClients(authLogic.user);
  const processesLogic = useProcesses(authLogic.user);
  const entitiesLogic = useEntities();
  const processUpdatesLogic = useProcessUpdates();

  useEffect(() => {
    async function loadData() {
      const storedUser = isApiMode
        ? null
        : await localStorageDriver.getItem<User | null>('currentUser', null);

      const storedClients = await storageService.getItem<any[]>('clients', initialClients);
      const storedProcesses = await storageService.getItem<any[]>('processes', initialProcesses);
      const storedUsers = await storageService.getItem<any[]>('user', initialUsers);

      console.log('loaded processes:', storedProcesses);
      console.log('loaded user:', storedUser);
      console.log('loaded clients:', storedClients);
      console.log('loaded users:', storedUsers);

      authLogic.setUser(storedUser);
      clientsLogic.setClients(storedClients);
      processesLogic.setProcesses(storedProcesses);
      setUsers(storedUsers);
    }

    loadData();
  }, []);

  const value: AuthContextType = {
    ...authLogic,
    ...clientsLogic,
    ...processesLogic,
    ...entitiesLogic,
    ...processUpdatesLogic,
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
