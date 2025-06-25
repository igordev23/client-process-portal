
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth, Process } from '@/contexts/AuthContext';

interface ProcessManagementProps {
  onBack: () => void;
}

export function ProcessManagement({ onBack }: ProcessManagementProps) {
  const { processes, clients, addProcess, updateProcess, addProcessUpdate, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    processNumber: '',
    title: '',
    status: 'pending' as Process['status'],
    startDate: '',
    description: '',
    lawyer: user?.name || '',
  });

  const [updateData, setUpdateData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    author: user?.name || '',
  });

  const filteredProcesses = processes.filter(process => {
    const client = clients.find(c => c.id === process.clientId);
    const matchesSearch = 
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.cpf.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const resetForm = () => {
    setFormData({
      clientId: '',
      processNumber: '',
      title: '',
      status: 'pending',
      startDate: '',
      description: '',
      lawyer: user?.name || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProcess({
      ...formData,
      lastUpdate: formData.startDate,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProcess) {
      addProcessUpdate(selectedProcess.id, updateData);
      setIsUpdateDialogOpen(false);
      setUpdateData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        author: user?.name || '',
      });
    }
  };

  const handleStatusChange = (processId: string, newStatus: Process['status']) => {
    updateProcess(processId, { status: newStatus });
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
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Processos</h1>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="legal-gradient text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Processo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Processo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do processo jurídico
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Cliente</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData({...formData, clientId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.cpf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="processNumber">Número do Processo</Label>
                    <Input
                      id="processNumber"
                      placeholder="0000000-00.0000.0.00.0000"
                      value={formData.processNumber}
                      onChange={(e) => setFormData({...formData, processNumber: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Processo</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Ação de Revisão de Benefício"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: Process['status']) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="active">Em Andamento</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lawyer">Advogado Responsável</Label>
                    <Input
                      id="lawyer"
                      value={formData.lawyer}
                      onChange={(e) => setFormData({...formData, lawyer: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição detalhada do processo..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar Processos</CardTitle>
            <CardDescription>
              Busque por título, número do processo, cliente ou CPF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Digite para pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="active">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Process List */}
        <div className="grid gap-4">
          {filteredProcesses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhum processo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredProcesses.map((process) => {
              const client = clients.find(c => c.id === process.clientId);
              return (
                <Card key={process.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{process.title}</h3>
                          <Badge className={`${getStatusColor(process.status)} ml-4`}>
                            {getStatusText(process.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Processo:</strong> {process.processNumber}</p>
                          <p><strong>Cliente:</strong> {client?.name} ({client?.cpf})</p>
                          <p><strong>Advogado:</strong> {process.lawyer}</p>
                          <p><strong>Início:</strong> {new Date(process.startDate).toLocaleDateString('pt-BR')}</p>
                          <p><strong>Última Atualização:</strong> {new Date(process.lastUpdate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm"><strong>Descrição:</strong></p>
                          <p className="text-sm text-gray-600 mt-1">{process.description}</p>
                        </div>

                        {process.updates.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Últimas Atualizações:</p>
                            <div className="space-y-2">
                              {process.updates.slice(-3).reverse().map((update) => (
                                <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-medium text-gray-900">{update.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(update.date).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{update.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-4">
                        <Select
                          value={process.status}
                          onValueChange={(value: Process['status']) => handleStatusChange(process.id, value)}
                        >
                          <SelectTrigger className="w-full lg:w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="active">Em Andamento</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProcess(process);
                            setIsUpdateDialogOpen(true);
                          }}
                          className="w-full lg:w-48"
                        >
                          Adicionar Atualização
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Atualização</DialogTitle>
            <DialogDescription>
              Adicione uma nova atualização ao processo: {selectedProcess?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-date">Data</Label>
              <Input
                id="update-date"
                type="date"
                value={updateData.date}
                onChange={(e) => setUpdateData({...updateData, date: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="update-author">Autor</Label>
              <Input
                id="update-author"
                value={updateData.author}
                onChange={(e) => setUpdateData({...updateData, author: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="update-description">Descrição da Atualização</Label>
              <Textarea
                id="update-description"
                placeholder="Descreva a atualização do processo..."
                value={updateData.description}
                onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateDialogOpen(false);
                  setUpdateData({
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    author: user?.name || '',
                  });
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 legal-gradient text-white">
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
