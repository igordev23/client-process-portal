
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ClientManagement } from './ClientManagement';
import { ProcessManagement } from './process/ProcessManagement';
import { ManageEntities } from './ManageEntities';

export function Dashboard() {
  const { user, clients, processes, logout, fetchClients, fetchProcesses } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'clients' | 'processes' | 'manage'>('dashboard');

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchClients();
      fetchProcesses();
    }
  }, [activeSection, fetchClients, fetchProcesses]);

  if (activeSection === 'clients') {
    return <ClientManagement onBack={() => setActiveSection('dashboard')} />;
  }

  if (activeSection === 'processes') {
    return <ProcessManagement onBack={() => setActiveSection('dashboard')} />;
  }

  if (activeSection === 'manage') {
    return <ManageEntities onBack={() => setActiveSection('dashboard')} />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const totalProcesses = processes.length;
  const activeProcesses = processes.filter(p => p.status === 'active').length;
  const pendingProcesses = processes.filter(p => p.status === 'pending').length;
  const completedProcesses = processes.filter(p => p.status === 'completed').length;

  const recentProcesses = processes
    .sort((a, b) => new Date(b.last_update).getTime() - new Date(a.last_update).getTime())
    .slice(0, 5);

  const recentClients = clients
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema Jurídico - Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.name || 'Usuário'}
              </span>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProcesses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('clients')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Gestão de Clientes
              </CardTitle>
              <CardDescription>
                Cadastrar, editar e visualizar clientes ({clients.length} cadastrados)
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('processes')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Gestão de Processos
              </CardTitle>
              <CardDescription>
                Gerenciar processos jurídicos e atualizações ({totalProcesses} processos)
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('manage')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurações
              </CardTitle>
              <CardDescription>
                Gerenciar tipos de crime, comarcas e situações prisionais
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Processes */}
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>Últimos 5 processos atualizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProcesses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum processo encontrado</p>
                ) : (
                  recentProcesses.map((process) => {
                    const client = clients.find(c => String(c.id) === String(process.client_id));
                    return (
                      <div key={process.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{process.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {process.process_number} - {client?.name || 'Cliente não encontrado'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Atualizado em {new Date(process.last_update).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(process.status)} text-xs`}>
                          {getStatusText(process.status)}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimos 5 clientes cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum cliente encontrado</p>
                ) : (
                  recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{client.name}</h4>
                        <p className="text-xs text-gray-600">{client.cpf}</p>
                        <p className="text-xs text-gray-500">
                          Chave: {client.access_key || 'Não informada'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
