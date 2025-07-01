import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth, Process } from '@/contexts/AuthContext';
import { ProcessForm } from './ProcessForm';
import { ProcessCard } from './ProcessCard';
import { ProcessUpdateDialog } from './ProcessUpdateDialog';
import { ProcessFilter } from './ProcessFilter';
import { toast } from '@/hooks/use-toast';

export function ProcessManagement({ onBack }: { onBack: () => void }) {
  const { processes, clients, addProcess, updateProcess, addProcessUpdate, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Filtrar processos conforme busca e status
  const filteredProcesses = processes.filter(process => {
    if (process.deleted) return false; // Ignorar excluídos, se houver flag deleted
    const client = clients.find(c => c.id === process.clientId);
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      process.title.toLowerCase().includes(lowerSearch) ||
      process.processNumber.toLowerCase().includes(lowerSearch) ||
      client?.name.toLowerCase().includes(lowerSearch) ||
      client?.cpf.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Abrir diálogo de edição e setar processo selecionado
  const openEditDialog = (process: Process) => {
    setSelectedProcess(process);
    setIsEditDialogOpen(true);
  };

  // Abrir diálogo de atualização (novas atualizações do processo)
  const openUpdateDialog = (process: Process) => {
    setSelectedProcess(process);
    setIsUpdateDialogOpen(true);
  };

  // Excluir processo (aqui removendo do estado via updateProcess com flag deleted)
  const deleteProcess = (id: string) => {
    updateProcess(id, { deleted: true });
    toast({
      title: 'Processo excluído',
      description: 'O processo foi removido com sucesso.',
    });
  };

  // Atualizar status do processo
  const updateProcessStatus = (id: string, newStatus: Process['status']) => {
    updateProcess(id, { status: newStatus });
  };

  // Submissão do formulário (adicionar ou editar)
  const handleFormSubmit = (formData: Process) => {
    if (isEditDialogOpen && selectedProcess) {
      updateProcess(selectedProcess.id, formData);
      toast({ title: 'Processo atualizado', description: 'Alterações salvas com sucesso.' });
    } else {
      addProcess(formData);
      toast({ title: 'Processo cadastrado', description: 'Novo processo adicionado.' });
    }
    // Fechar diálogos e limpar seleção
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProcess(null);
  };

  // Fechar formulários e limpar estado
  const handleCloseForm = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProcess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessForm
        isOpen={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseForm();
        }}
        onSubmit={handleFormSubmit}
        user={user}
        clients={clients}
        initialData={isEditDialogOpen ? selectedProcess || undefined : undefined}
      />

      <ProcessUpdateDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedProcess(null);
          setIsUpdateDialogOpen(open);
        }}
        process={selectedProcess}
        user={user}
        onSubmit={(update) => {
          if (selectedProcess) {
            addProcessUpdate(selectedProcess.id, update);
            toast({ title: 'Atualização adicionada', description: 'Nova atualização adicionada ao processo.' });
          }
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProcessFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddNew={() => {
            setSelectedProcess(null);
            setIsAddDialogOpen(true);
          }}
          onBack={onBack}
        />

        <div className="grid gap-4 mt-6">
          {filteredProcesses.length === 0 ? (
            <Card className="py-8 text-center text-gray-500">Nenhum processo encontrado</Card>
          ) : (
            filteredProcesses.map(process => {
              const client = clients.find(c => c.id === process.clientId);
              return (
                <ProcessCard
                  key={process.id}
                  process={process}
                  client={client}
                  onStatusChange={(newStatus) => updateProcessStatus(process.id, newStatus)}
                  onAddUpdate={() => openUpdateDialog(process)}
                  onEdit={() => openEditDialog(process)}
                  onDelete={() => deleteProcess(process.id)}
                />
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
