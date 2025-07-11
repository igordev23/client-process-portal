
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ClientManagement } from '@/components/ClientManagement';
import { ProcessManagement } from '@/components/process/ProcessManagement';
import { ManageEntities } from '@/components/ManageEntities';

type DashboardView = 'dashboard' | 'clients' | 'processes' | 'manage';

export function Dashboard() {
  const { user, logout, clients, processes } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');

  if (currentView === 'clients') {
    return <ClientManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'processes') {
    return <ProcessManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'manage') {
    return <ManageEntities onBack={() => setCurrentView('dashboard')} />;
  }

  const activeProcesses = processes.filter(p => p.status === 'active').length;
  const pendingProcesses = processes.filter(p => p.status === 'pending').length;
  const completedProcesses = processes.filter(p => p.status === 'completed').length;

  const recentProcesses = processes
    .filter(p => p.lastUpdate)
    .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
    .slice(0, 5);

  const recentClients = clients
    .filter(c => c.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="legal-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sistema Jurídico</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.name}</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('clients')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="legal-gradient w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  <p className="text-sm text-gray-500">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('processes')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="legal-gradient w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{processes.length}</p>
                  <p className="text-sm text-gray-500">Processos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedProcesses}</p>
                  <p className="text-sm text-gray-500">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('manage')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Config</p>
                  <p className="text-sm text-gray-500">Cadastros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeProcesses}</p>
              <p className="text-sm text-gray-500 mt-1">processos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingProcesses}</p>
              <p className="text-sm text-gray-500 mt-1">aguardando ação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedProcesses}</p>
              <p className="text-sm text-gray-500 mt-1">finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
              <CardDescription>Últimas atualizações</CardDescription>
            </CardHeader>
            <CardContent>
              {recentProcesses.length > 0 ? (
                <div className="space-y-4">
                  {recentProcesses.map((process) => {
                    const client = clients.find(c => c.id === process.clientId);
                    return (
                      <div key={process.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{process.title}</p>
                          <p className="text-xs text-gray-500">
                            Cliente: {client?.name || 'Cliente não encontrado'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Atualizado: {new Date(process.lastUpdate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant={
                          process.status === 'active' ? 'default' :
                          process.status === 'pending' ? 'secondary' :
                          process.status === 'completed' ? 'default' : 'destructive'
                        }>
                          {process.status === 'active' ? 'Ativo' :
                           process.status === 'pending' ? 'Pendente' :
                           process.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum processo cadastrado</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimos cadastros</CardDescription>
            </CardHeader>
            <CardContent>
              {recentClients.length > 0 ? (
                <div className="space-y-4">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">CPF: {client.cpf}</p>
                        <p className="text-xs text-gray-500">
                          Cadastrado: {new Date(client.createdAt!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {client.status || 'Ativo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum cliente cadastrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
