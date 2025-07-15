
import { useState } from 'react';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';

export function useAuthLogic() {
  const [user, setUser] = useState<User | null>(null);
  const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      let foundUser: User | null = null;

      if (isApiMode && storageService.getUserByEmailAndPassword) {
        foundUser = await storageService.getUserByEmailAndPassword(email, password);
      } else {
        const storedUsers = await storageService.getItem<User[]>('user', []);
        foundUser = storedUsers.find(
          u => u.email === email && u.password === password && (u.is_active !== false)
        ) || null;
      }

      if (!foundUser) {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos',
          variant: 'destructive',
        });
        return false;
      }

      setUser(foundUser);

      if (!isApiMode) {
        await localStorageDriver.setItem('currentUser', foundUser);
      }

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      toast({
        title: 'Erro no login',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    if (!isApiMode) {
      storageService.removeItem('currentUser');
    }
    toast({ title: 'Logout realizado', description: 'Até logo!' });
  };

  return {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
