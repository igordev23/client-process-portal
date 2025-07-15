import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
// ✅ CORRETO — só importa useAuth, que já traz deleteProcess dentro
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

  function normalizeProcessKeys(raw: any): Process {
    return {
      id: raw.id,
      clientId: String(raw.clientid ?? raw.clientId ?? ''),
      processNumber: raw.processnumber ?? raw.processNumber ?? '',
      title: raw.title ?? '',
      status: raw.status ?? 'pending',
      startDate: raw.startdate ?? raw.startDate ?? '',
      lastUpdate: raw.lastupdate ?? raw.lastUpdate ?? '',
      description: raw.description ?? '',
      lawyer: raw.lawyer ?? '',
      updates: raw.updates ?? [],
      situacaoPrisionalId: Number(raw.situacaoprisionalid ?? raw.situacaoPrisionalId ?? 0),
      comarcaVaraId: Number(raw.comarcavaraid ?? raw.comarcaVaraId ?? 0),
      tipoCrimeId: Number(raw.tipocrimeid ?? raw.tipoCrimeId ?? 0),
    };
  }

  const filteredProcesses = processes.filter((process) => {
    if ((process as any).deleted) return false;

    const clientId = (process as any).clientid ?? process.clientId;
    const client = clients.find((c) => String(c.id) === String(clientId));

    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      process.title.toLowerCase().includes(lowerSearch) ||
      process.processNumber.toLowerCase().includes(lowerSearch) ||
      client?.name.toLowerCase().includes(lowerSearch) ||
      client?.cpf.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditDialog = (process: any) => {
    console.log('ProcessManagement - Abrindo diálogo de edição para o processo: ', process);
    const normalizedProcess = normalizeProcessKeys(process);
    setSelectedProcess(normalizedProcess);
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
      await fetchProcesses(); // ✅ reflete nomes atualizados
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
      deleteProcess(id); // ✅ Aqui está certo agora
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
      await fetchProcesses(); // 🔥 recarrega processos para refletir atualização
      toast({ title: 'Atualização editada', description: 'A atualização foi alterada com sucesso.' });
    } else {
      await addProcessUpdate(selectedProcess.id, update);
      await fetchProcesses(); // 🔥 recarrega processos para refletir atualização
      toast({ title: 'Atualização adicionada', description: 'Atualização adicionada ao processo.' });
    }
  }}
  onDeleteUpdate={async (update) => {
  if (confirm('Deseja realmente excluir esta atualização?')) {
    await deleteProcessUpdate(process.id, update.id);
    await fetchProcesses(); // Atualiza a lista para refletir exclusão
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
              const rawClientId = (process as any).clientid ?? process.clientId;
              const clientFromList = clients.find((c) => String(c.id) === String(rawClientId));

              const client =
                clientFromList ??
                ((process as any).clientName
                  ? { name: (process as any).clientName, cpf: '' }
                  : undefined);

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
                    await fetchProcesses(); // Atualiza a lista para refletir a exclusão
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
