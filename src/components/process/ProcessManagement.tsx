
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth, Process, ProcessUpdate } from '@/contexts/AuthContext';
import { ProcessForm } from './ProcessForm';
import { ProcessCard } from './ProcessCard';
import { ProcessUpdateDialog } from './ProcessUpdateDialog';
import { ProcessFilter } from './ProcessFilter';
import { toast } from '@/hooks/use-toast';
import { exportProcessesToExcel } from '@/lib/export/processExporter';

export function ProcessManagement({ onBack }: { onBack: () => void }) {
  const {
    processes,
    clients,
    addProcess,
    updateProcess,
    addProcessUpdate,
    updateProcessUpdate,
    deleteProcessUpdate,
    deleteProcess,
    fetchProcesses,
    user,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editUpdate, setEditUpdate] = useState<ProcessUpdate | null>(null);

  const filteredProcesses = processes.filter((process) => {
    const client = clients.find((c) => String(c.id) === String(process.client_id));

    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      process.title.toLowerCase().includes(lowerSearch) ||
      process.process_number.toLowerCase().includes(lowerSearch) ||
      client?.name.toLowerCase().includes(lowerSearch) ||
      client?.cpf.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditDialog = (process: Process) => {
    setSelectedProcess(process);
    setIsEditDialogOpen(true);
  };

  const openUpdateDialog = (process: Process) => {
    setSelectedProcess(process);
    setEditUpdate(null);
    setIsUpdateDialogOpen(true);
  };

  const handleFormSubmit = async (formData: Process) => {
    if (isEditDialogOpen && selectedProcess) {
      await updateProcess(selectedProcess.id, formData);
      await fetchProcesses();
      toast({ title: 'Processo atualizado', description: 'Alterações salvas com sucesso.' });
    } else {
      await addProcess(formData);
      await fetchProcesses();
      toast({ title: 'Processo cadastrado', description: 'Novo processo adicionado.' });
    }

    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProcess(null);
  };

  const handleDeleteProcess = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este processo?')) {
      deleteProcess(id);
      toast({
        title: 'Processo excluído',
        description: 'O processo foi removido com sucesso.',
      });
    }
  };

  const updateProcessStatus = (id: string, newStatus: Process['status']) => {
    updateProcess(id, { status: newStatus });
  };

  const handleCloseForm = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProcess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessForm
        key={isEditDialogOpen ? selectedProcess?.id : 'new'}
        isOpen={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseForm();
        }}
        onSubmit={handleFormSubmit}
        user={user}
        clients={clients}
        initialData={isEditDialogOpen ? selectedProcess : undefined}
      />

      <ProcessUpdateDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProcess(null);
            setEditUpdate(null);
          }
          setIsUpdateDialogOpen(open);
        }}
        process={selectedProcess}
        user={user}
        initialData={editUpdate || undefined}
        onSubmit={async (update) => {
          if (!selectedProcess) return;

          if (editUpdate) {
            await updateProcessUpdate(selectedProcess.id, editUpdate.id, update);
            await fetchProcesses();
            toast({ title: 'Atualização editada', description: 'A atualização foi alterada com sucesso.' });
          } else {
            await addProcessUpdate(selectedProcess.id, update);
            await fetchProcesses();
            toast({ title: 'Atualização adicionada', description: 'Atualização adicionada ao processo.' });
          }
        }}
        onDeleteUpdate={async (update) => {
          if (confirm('Deseja realmente excluir esta atualização?')) {
            await deleteProcessUpdate(selectedProcess!.id, update.id);
            await fetchProcesses();
            toast({ title: 'Atualização excluída', description: 'A atualização foi removida com sucesso.' });
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
          onExport={() => exportProcessesToExcel(filteredProcesses, clients)}
        />

        <div className="grid gap-4 mt-6">
          {filteredProcesses.length === 0 ? (
            <Card className="py-8 text-center text-gray-500">Nenhum processo encontrado</Card>
          ) : (
            filteredProcesses.map((process) => {
              const client = clients.find((c) => String(c.id) === String(process.client_id));

              return (
                <ProcessCard
                  key={process.id}
                  process={process}
                  client={client}
                  onStatusChange={(newStatus) => updateProcessStatus(process.id, newStatus)}
                  onAddUpdate={() => openUpdateDialog(process)}
                  onEdit={() => openEditDialog(process)}
                  onDelete={() => handleDeleteProcess(process.id)}
                  onEditUpdate={(update) => {
                    setSelectedProcess(process);
                    setEditUpdate(update);
                    setIsUpdateDialogOpen(true);
                  }}
                  onDeleteUpdate={async (update) => {
                    if (confirm('Deseja realmente excluir esta atualização?')) {
                      await deleteProcessUpdate(process.id, update.id);
                      await fetchProcesses();
                      toast({ title: 'Atualização excluída', description: 'A atualização foi removida com sucesso.' });
                    }
                  }}
                />
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
