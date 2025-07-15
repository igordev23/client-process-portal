// src/components/ClientManagement.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth, Client } from '@/contexts/AuthContext';

interface ClientManagementProps {
  onBack: () => void;
}

export function ClientManagement({ onBack }: ClientManagementProps) {
  const { clients, addClient, updateClient, deleteClient, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    access_key: '',
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      email: '',
      phone: '',
      access_key: '',
    });
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      await updateClient(editingClient.id.toString(), {
        ...formData,
        updated_by: user?.id || 1,
      });
    } else {
      await addClient({
        ...formData,
        created_by: user?.id || 1,
      });
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      cpf: client.cpf,
      email: client.email || '',
      phone: client.phone || '',
      access_key: client.access_key || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient(clientId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Clientes</h1>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="legal-gradient text-white" onClick={() => resetForm()}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? 'Altere os dados do cliente' : 'Preencha os dados do cliente'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="access_key">Chave de Acesso</Label>
                    <Input
                      id="access_key"
                      value={formData.access_key}
                      onChange={(e) => setFormData({...formData, access_key: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 legal-gradient text-white">
                      {editingClient ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar Cliente</CardTitle>
            <CardDescription>
              Digite nome, CPF, e-mail ou telefone para filtrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Digite para pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Client List */}
        <div className="grid gap-4">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhum cliente encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{client.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><strong>CPF:</strong> {client.cpf}</p>
                        <p><strong>E-mail:</strong> {client.email || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> {client.phone || 'Não informado'}</p>
                        <p><strong>Chave de Acesso:</strong> {client.access_key || 'Não informada'}</p>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        <p><strong>Criado por:</strong> Usuário {client.created_by || 'N/A'}</p>
                        <p><strong>Criado em:</strong> {client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client.id.toString())}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
