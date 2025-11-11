import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Copy } from 'lucide-react';

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

  const credenciais = [
    {
      id: '1',
      name: 'Dra. Maria Silva',
      email: 'maria@escritorio.com',
      role: 'Admin',
      password: 'admin123',
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@escritorio.com',
      role: 'Funcionário',
      password: 'func123',
    },
  ];

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
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
          
          <CardContent className="space-y-6">
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

            {/* Card de Credenciais de Teste */}
            <Card className="bg-gray-50 border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700 text-center">
                  Credenciais de Teste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {credenciais.map((user) => (
                  <div key={user.id} className="p-2 rounded-lg bg-white shadow-sm border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Email: {user.email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-1"
                        onClick={() => copiarTexto(user.email)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-700">
                      Senha: {user.password}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-1"
                        onClick={() => copiarTexto(user.password)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
