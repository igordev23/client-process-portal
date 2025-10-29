import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

// Importando as imagens
import LogoIniciais from '@/assets/Logoiniciais.jpg';
import NomeEscritorio from '@/assets/nomeescritorio.jpg';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="glass-effect shadow-xl">
          <CardHeader className="text-center pb-2">
            {/* Logo Iniciais */}
            <div className="mx-auto mb-4">
              <img 
                src={LogoIniciais} 
                alt="Logo iniciais" 
                className="mx-auto w-20 h-20 object-contain"
              />
            </div>

            {/* Nome do sistema */}
            <CardTitle className="text-2xl font-bold text-gray-900">
              Legal Control
            </CardTitle>

            {/* Nome do escritório */}
            <div className="mx-auto mt-2">
              <img 
                src={NomeEscritorio} 
                alt="Nome do Escritório" 
                className="mx-auto w-48 object-contain"
              />
            </div>

            <CardDescription className="text-gray-600 mt-4">
              Faça login para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@escritorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 legal-gradient text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
