// src/components/ClientManagement.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth, Client } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ClientManagementProps {
  onBack: () => void;
}

export function ClientManagement({ onBack }: ClientManagementProps) {
const { clients, addClient, updateClient, deleteClient, user, users } = useAuth();
// Log para conferir os dados dos clients no momento da renderização
  console.log('Clients dentro do ClientManagement:', clients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
  });

 const filteredClients = clients.filter(client =>
  (client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
  (client.cpf?.includes(searchTerm) ?? false) ||
  (client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
);


  const resetForm = () => {
    setFormData({ name: '', cpf: '', email: '', phone: '' });
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      updateClient(editingClient.id, formData);
      setEditingClient(null);
    } else {
      addClient({ ...formData });

      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone,
    });
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(clientId);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
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
                <Button className="legal-gradient text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do cliente. Uma chave de acesso será gerada automaticamente.
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
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
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
                      Cadastrar
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
            <CardTitle>Filtrar Clientes</CardTitle>
            <CardDescription>
              Busque por nome, CPF ou email
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>CPF:</strong> {formatCPF(client.cpf)}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Telefone:</strong> {formatPhone(client.phone)}</p>
                        <p><strong>Chave de Acesso:</strong> 
                          <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                            {client.accesskey}
                          </span>
                        </p>
                       <p><strong>Cadastrado por:</strong> {
                      users.find(u => Number(u.id) === Number(client.createdby))?.name || 'Desconhecido'
                    }</p>


                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                      Cadastrado em: {client.createdat ? new Date(client.createdat).toLocaleDateString('pt-BR') : 'Data inválida'}
                    </p>

                    </div>
                    
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                        >
                          Excluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        {editingClient && (
          <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>
                  Atualize os dados do cliente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF</Label>
                  <Input
                    id="edit-cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingClient(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 legal-gradient text-white">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
