
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ClientDialogForm } from '@/components/ui/ClientDialogForm';

export default function ClientManagement({ onBack }: { onBack: () => void }) {
  const { clients, deleteClient, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(clientId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="legal-gradient text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pesquisar Clientes</CardTitle>
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{client.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>CPF:</strong> {client.cpf}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Telefone:</strong> {client.phone}</p>
                        <p><strong>Chave de Acesso:</strong> {client.accessKey}</p>
                        <p><strong>Criado em:</strong> {new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingClient(client)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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

      <ClientDialogForm
        isOpen={isAddDialogOpen || !!editingClient}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingClient(null);
          }
        }}
        initialData={editingClient}
        user={user}
      />
    </div>
  );
}
