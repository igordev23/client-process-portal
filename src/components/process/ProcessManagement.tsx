// src/components/process/ProcessManagement.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, Process } from '@/contexts/AuthContext';
import { ProcessForm } from './ProcessForm';
import { ProcessCard } from './ProcessCard';
import { ProcessUpdateDialog } from './ProcessUpdateDialog';
import { ProcessFilter } from './ProcessFilter';

export function ProcessManagement({ onBack }: { onBack: () => void }) {
  const { processes, clients, addProcess, updateProcess, addProcessUpdate, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={addProcess}
        user={user}
        clients={clients}
      />

      <ProcessUpdateDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        process={selectedProcess}
        user={user}
        onSubmit={(update) => {
          if (selectedProcess) addProcessUpdate(selectedProcess.id, update);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProcessFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddNew={() => setIsAddDialogOpen(true)}
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
                  onStatusChange={(status) => updateProcess(process.id, { status })}
                  onAddUpdate={() => {
                    setSelectedProcess(process);
                    setIsUpdateDialogOpen(true);
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
