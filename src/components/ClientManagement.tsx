
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth, Client } from '@/contexts/AuthContext';
import { ClientDialogForm } from '@/components/ui/ClientDialogForm';

interface ClientManagementProps {
  onBack: () => void;
}

export function ClientManagement({ onBack }: ClientManagementProps) {
  const { clients, addClient, updateClient, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = (clientData: Omit<Client, 'id'>) => {
    addClient(clientData);
    setIsAddDialogOpen(false);
  };

  const handleEditClient = (clientData: Omit<Client, 'id'>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, clientData);
      setIsEditDialogOpen(false);
      setSelectedClient(null);
    }
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
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
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do cliente
                  </DialogDescription>
                </DialogHeader>
                <ClientDialogForm
                  onSubmit={handleAddClient}
                  onCancel={() => setIsAddDialogOpen(false)}
                  user={user}
                />
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
            <CardTitle>Buscar Clientes</CardTitle>
            <CardDescription>
              Pesquise por nome, CPF, email ou telefone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Digite para pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
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
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <Badge variant="secondary" className="ml-4">
                          {client.status || 'Ativo'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>CPF:</strong> {client.cpf}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Telefone:</strong> {client.phone}</p>
                        <p><strong>Endereço:</strong> {client.address}</p>
                        {client.birthDate && (
                          <p><strong>Data de Nascimento:</strong> {new Date(client.birthDate).toLocaleDateString('pt-BR')}</p>
                        )}
                        {client.rg && <p><strong>RG:</strong> {client.rg}</p>}
                        {client.profession && <p><strong>Profissão:</strong> {client.profession}</p>}
                        {client.maritalStatus && <p><strong>Estado Civil:</strong> {client.maritalStatus}</p>}
                        {client.nationality && <p><strong>Nacionalidade:</strong> {client.nationality}</p>}
                      </div>
                      
                      {client.notes && (
                        <div className="mt-3">
                          <p className="text-sm"><strong>Observações:</strong></p>
                          <p className="text-sm text-gray-600 mt-1">{client.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <p>
                          <strong>Cadastrado por:</strong> {client.createdBy || 'Sistema'} | 
                          <strong> Em:</strong> {client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : '—'}
                        </p>
                        <p><strong>Chave de Acesso:</strong> {client.accessKey || '—'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(client)}
                        className="w-full lg:w-48"
                      >
                        Editar Cliente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifique os dados do cliente
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientDialogForm
              onSubmit={handleEditClient}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
              }}
              user={user}
              initialData={selectedClient}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
