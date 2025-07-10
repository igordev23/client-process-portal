
import { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/components/storage_service/storageService';

const isApiMode = import.meta.env.VITE_STORAGE_MODE === 'api';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      let foundUser: User | null = null;

      if (isApiMode && storageService.getUserByEmailAndPassword) {
        foundUser = await storageService.getUserByEmailAndPassword(email, password);
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
        return null;
      }

      if (!isApiMode) {
        await storageService.setItem('currentUser', foundUser);
      }

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });

      return foundUser;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      toast({
        title: 'Erro no login',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      });
      return null;
    }
  },

  logout(): void {
    if (!isApiMode) {
      storageService.removeItem('currentUser');
    }
    toast({ title: 'Logout realizado', description: 'Até logo!' });
  }
};
