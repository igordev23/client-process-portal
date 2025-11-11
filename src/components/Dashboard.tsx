import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { ClientManagement } from './ClientManagement';
import { ProcessManagement } from './process/ProcessManagement';
import { ManageEntities } from './ManageEntities';
import { fixEncodingManual } from '@/utils/fixEncodingManual';
import { toSnakeCase } from '@/utils/caseConverter';
import { Menu, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { localStorageDriver } from '@/components/storage_service/localStorageDriver';
// Logo placeholder - will use SVG icon
import fotoperfil from "@/assets/fotoperfil.jpg";
import legalControlLogo from "@/assets/legalcontrollogo.jpg";

const tabs = ['dashboard', 'clients', 'processes', 'manage'] as const;
type TabType = typeof tabs[number];

export function Dashboard() {
const { user, logout, clients, processes } = useAuth();
const filteredProcesses = processes.filter(p => !(p as any).deleted);
const [activeTab, setActiveTab] = useState<TabType>('dashboard');
const [isMenuOpen, setIsMenuOpen] = useState(false);
const isMobile = useIsMobile();

// ✅ Persiste a aba atual no localStorage
useEffect(() => {
  // Restaura aba salva ao carregar
  const savedTab = localStorageDriver.getItem<TabType>('activeTab', 'dashboard');
  savedTab.then(tab => setActiveTab(tab));
}, []);

useEffect(() => {
  // Salva aba atual quando mudar
  localStorageDriver.setItem('activeTab', activeTab);
}, [activeTab]);

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

const [totalProcesses, setTotalProcesses] = useState(0);
const [activeProcesses, setActiveProcesses] = useState(0);
const [pendingProcesses, setPendingProcesses] = useState(0);
const [completedProcesses, setCompletedProcesses] = useState(0);

useEffect(() => {
  setTotalProcesses(filteredProcesses.length);
  setActiveProcesses(filteredProcesses.filter(p => p.status === 'active').length);
  setPendingProcesses(filteredProcesses.filter(p => p.status === 'pending').length);
  setCompletedProcesses(filteredProcesses.filter(p => p.status === 'completed').length);
}, [filteredProcesses]);

if (activeTab === 'clients') {
  return <ClientManagement onBack={() => setActiveTab('dashboard')} />;
}

if (activeTab === 'processes') {
  return <ProcessManagement onBack={() => setActiveTab('dashboard')} />;
}

if (activeTab === 'manage') {
  return <ManageEntities onBack={() => setActiveTab('dashboard')} />;
}

return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <img 
  src={fotoperfil} 
  alt="Foto de Perfil" 
  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
/>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Dr. Advogado</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Sistema Jurídico</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isMobile && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {fixEncodingManual(user?.name)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="text-sm"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
            
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 pt-6">
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <img 
                        src={legalControlLogo} 
                        alt="legalControlLogo" 
                        className="w-8 h-8"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {fixEncodingManual(user?.name)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role === 'admin' ? 'Administrador' : 'Funcionário'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className={`py-3 px-4 text-left rounded-lg transition-colors ${
                        activeTab === 'dashboard'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('clients');
                        setIsMenuOpen(false);
                      }}
                      className={`py-3 px-4 text-left rounded-lg transition-colors ${
                        activeTab === 'clients'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Clientes
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('processes');
                        setIsMenuOpen(false);
                      }}
                      className={`py-3 px-4 text-left rounded-lg transition-colors ${
                        activeTab === 'processes'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Processos
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('manage');
                        setIsMenuOpen(false);
                      }}
                      className={`py-3 px-4 text-left rounded-lg transition-colors ${
                        activeTab === 'manage'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Configurações
                    </button>
                    
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Navigation - Hidden on mobile */}
    {!isMobile && (
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('clients' as TabType)}
              className={`py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab('processes' as TabType)}
              className={`py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'processes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Processos
            </button>
            <button
              onClick={() => setActiveTab('manage' as TabType)}
              className={`py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configurações de Cadastro
            </button>
          </div>
        </div>
      </nav>
    )}

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

      {/* Recent Processes and Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
<CardHeader>
  <CardTitle>Processos Recentes</CardTitle>
  <CardDescription>
    Últimos processos atualizados
  </CardDescription>
</CardHeader>
<CardContent>
  {filteredProcesses.length === 0 ? (
    <p className="text-center text-gray-500">Nenhum processo encontrado.</p>
  ) : (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {filteredProcesses.slice(0, 4).map((process, index) => {
        const client = clients.find(c => c.id === process.clientId);
        return (
          <div key={process.id || `process-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{process.title}</h4>
              <p className="text-xs text-gray-500">{client?.name}</p>
              <p className="text-xs text-gray-400">{process.processnumber}</p>
            </div>
            <div className="flex sm:flex-col sm:text-right justify-between sm:justify-end items-center sm:items-end">
              <Badge className={`text-xs ${getStatusColor(process.status)}`}>
                {getStatusText(process.status)}
              </Badge>
              <p className="text-xs text-gray-400 sm:mt-1">
                {new Date(process.lastupdate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )}
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
  {clients.length === 0 ? (
    <p className="text-center text-gray-500">Nenhum cliente encontrado.</p>
  ) : (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {clients.slice(0, 4).map((client, index) => (
        <div key={client.id || `client-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{client.name}</h4>
            <p className="text-xs text-gray-500">{client.cpf}</p>
            <p className="text-xs text-gray-400 truncate">{client.email}</p>
          </div>
          <div className="flex sm:flex-col sm:text-right justify-between sm:justify-end items-center sm:items-end">
            <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {client.accesskey}
            </p>
            <p className="text-xs text-gray-400 sm:mt-1">
              {new Date(client.createdat).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</CardContent>
</Card>

      </div>
    </main>
  </div>
);
}