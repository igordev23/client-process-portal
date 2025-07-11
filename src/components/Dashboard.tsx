
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientManagement from './ClientManagement';
import { ProcessManagement } from './process/ProcessManagement';
import { ManageEntities } from './ManageEntities';
import { useAuth } from '@/contexts/AuthContext';

type DashboardView = 'home' | 'clients' | 'processes' | 'entities';

interface DashboardProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function Dashboard({ currentView, onViewChange }: DashboardProps) {
  const { user, clients, processes } = useAuth();

  if (currentView === 'clients') {
    return <ClientManagement onBack={() => onViewChange('home')} />;
  }

  if (currentView === 'processes') {
    return <ProcessManagement onBack={() => onViewChange('home')} />;
  }

  if (currentView === 'entities') {
    return <ManageEntities onBack={() => onViewChange('home')} />;
  }

  const activeProcesses = processes.filter(p => p.status === 'active').length;
  const pendingProcesses = processes.filter(p => p.status === 'pending').length;
  const completedProcesses = processes.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard - Sistema Jurídico</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeProcesses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingProcesses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processos Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{completedProcesses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewChange('clients')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Gestão de Clientes
              </CardTitle>
              <CardDescription>
                Cadastre, edite e gerencie os dados dos seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full legal-gradient text-white">
                Acessar Clientes
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewChange('processes')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 0h7l-7 7-7-7h7V4h7z" />
                </svg>
                Gestão de Processos
              </CardTitle>
              <CardDescription>
                Gerencie processos jurídicos e suas atualizações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full legal-gradient text-white">
                Acessar Processos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewChange('entities')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurações
              </CardTitle>
              <CardDescription>
                Gerencie tipos de crime, comarcas e situações prisionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full legal-gradient text-white">
                Acessar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
