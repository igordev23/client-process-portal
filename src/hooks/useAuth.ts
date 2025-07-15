import { useState } from 'react';
import { User } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
import { fixEncodingManual } from '@/utils/fixEncodingManual'; // ✅ importado

export function useAuthLogic() {
  const [user, setUser] = useState<User | null>(null);
  const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      let foundUser: User | null = null;

      if (isApiMode && storageService.getUserByEmailAndPassword) {
        foundUser = await storageService.getUserByEmailAndPassword(email, password);
        console.log('Users dentro do useAuth:', user);
      } else {
        const storedUsers = await storageService.getItem<User[]>('user', []);
        foundUser = storedUsers.find(
          u => u.email === email && u.password === password && u.isActive
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

      // ✅ Corrige encoding do nome antes de salvar e exibir
      const fixedUser = { ...foundUser, name: fixEncodingManual(foundUser.name) };
      setUser(fixedUser);

      if (!isApiMode) {
        await localStorageDriver.setItem('currentUser', fixedUser);
      }

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo(a), ${fixedUser.name}!`,
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
