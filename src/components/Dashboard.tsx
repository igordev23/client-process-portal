import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ClientManagement } from './ClientManagement';
import { ProcessManagement } from './ProcessManagement';

type TabType = 'dashboard' | 'clients' | 'processes';

export function Dashboard() {
  const { user, logout, clients, processes } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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

  if (activeTab === 'clients') {
    return <ClientManagement onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'processes') {
    return <ProcessManagement onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sistema Jurídico</h1>
                <p className="text-sm text-gray-500">Gestão de Processos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="text-sm"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'processes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Processos
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeProcesses}</div>
              <p className="text-xs text-muted-foreground">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processos Pendentes</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProcesses}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processos Concluídos</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProcesses}</div>
              <p className="text-xs text-muted-foreground">
                Finalizados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Processes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>
                Últimos processos atualizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.slice(0, 5).map((process) => {
                  const client = clients.find(c => c.id === process.clientId);
                  return (
                    <div key={process.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{process.title}</h4>
                        <p className="text-xs text-gray-500">{client?.name}</p>
                        <p className="text-xs text-gray-400">{process.processNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getStatusColor(process.status)}`}>
                          {getStatusText(process.status)}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{process.lastUpdate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>
                Últimos clientes cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{client.name}</h4>
                      <p className="text-xs text-gray-500">{client.cpf}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {client.accessKey}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
