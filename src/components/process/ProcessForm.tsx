import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectWithSearch } from '@/components/ui/SelectWithSearch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Process } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { SelectWithAdd } from '@/components/ui/SelectWithAdd';
import {
  Dialog as InnerDialog,
  DialogContent as InnerDialogContent,
  DialogHeader as InnerDialogHeader,
  DialogTitle as InnerDialogTitle,
  DialogDescription as InnerDialogDescription,
} from '@/components/ui/dialog';
import { ClientDialogForm } from '@/components/ui/ClientDialogForm';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (process: Process) => void;
  clients: { id: string; name: string; cpf: string }[];
  user: { name: string } | null;
  initialData?: Process;
}

export function ProcessForm({
  isOpen,
  onOpenChange,
  onSubmit,
  clients,
  user,
  initialData
}: Props) {
  const {
    tipoCrimes,
    comarcasVaras,
    situacoesPrisionais,
    addTipoCrime,
    addComarcaVara,
    addSituacaoPrisional
  } = useAuth();

  const [formData, setFormData] = useState<Omit<Process, 'situacaoPrisionalId' | 'comarcaVaraId' | 'tipoCrimeId'> & {
    situacaoPrisionalId: number;
    comarcaVaraId: number;
    tipoCrimeId: number;
  }>({
    id: '',
    clientId: '',
    processNumber: '',
    title: '',
    status: 'pending',
    startDate: '',
    lastUpdate: '',
    description: '',
    lawyer: user?.name || '',
    updates: [],
    situacaoPrisionalId: 0,
    comarcaVaraId: 0,
    tipoCrimeId: 0,
  });

  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  useEffect(() => {
  if (!isOpen) return;

  if (initialData) {
    setFormData({
      ...initialData,
      clientId: String(initialData.clientId ?? ''),
      situacaoPrisionalId: Number(initialData.situacaoPrisionalId ?? 0),
      comarcaVaraId: Number(initialData.comarcaVaraId ?? 0),
      tipoCrimeId: Number(initialData.tipoCrimeId ?? 0),
      startDate: initialData.startDate?.slice(0, 10) || '',
    });
  } else {
    setFormData({
      id: '',
      clientId: '',
      processNumber: '',
      title: '',
      status: 'pending',
      startDate: '',
      lastUpdate: '',
      description: '',
      lawyer: user?.name || '',
      updates: [],
      situacaoPrisionalId: 0,
      comarcaVaraId: 0,
      tipoCrimeId: 0,
    });
  }
}, [isOpen, initialData?.id]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.situacaoPrisionalId || !formData.comarcaVaraId || !formData.tipoCrimeId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit({
      ...formData,
      lastUpdate: formData.startDate
    });
    onOpenChange(false);
  };

  const situacoesPrisionaisOptions = situacoesPrisionais.map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.nome ?? item.name }
  );
  const tipoCrimesOptions = tipoCrimes.map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.nome ?? item.name }
  );
  const comarcasVarasOptions = comarcasVaras.map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.nome ?? item.name }
  );

  return (
    <>
      <InnerDialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <InnerDialogContent className="sm:max-w-[425px]">
          <InnerDialogHeader>
            <InnerDialogTitle>Cadastrar Novo Cliente</InnerDialogTitle>
            <InnerDialogDescription>
              Preencha os dados do novo cliente. Ele será adicionado à lista.
            </InnerDialogDescription>
          </InnerDialogHeader>
          <ClientDialogForm onSuccess={() => setClientDialogOpen(false)} />
        </InnerDialogContent>
      </InnerDialog>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Editar Processo' : 'Cadastrar Novo Processo'}</DialogTitle>
            <DialogDescription>
              {initialData
                ? 'Altere os dados do processo conforme necessário.'
                : 'Preencha os dados do processo jurídico'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <SelectWithSearch
                label="Cliente"
                value={formData.clientId}
                onChange={(value) => setFormData({ ...formData, clientId: value })}
                options={clients.map((client) => ({
                  id: client.id,
                  label: `${client.name} - ${client.cpf}`,
                }))}
              />
              <Button
                type="button"
                variant="link"
                className="text-blue-600 text-sm p-0 h-auto"
                onClick={() => setClientDialogOpen(true)}
              >
                + Novo Cliente
              </Button>
            </div>

            <Input
              id="processNumber"
              placeholder="Número do Processo"
              value={formData.processNumber}
              onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
              required
            />

            <Input
              id="title"
              placeholder="Título do Processo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Process['status']) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="active">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <Input
              id="lawyer"
              placeholder="Advogado Responsável"
              value={formData.lawyer}
              onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
              required
            />

            <Textarea
              placeholder="Descrição do processo"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <SelectWithAdd
              label="Situação Prisional"
              value={formData.situacaoPrisionalId}
              onChange={(value) => setFormData({ ...formData, situacaoPrisionalId: value })}
              options={situacoesPrisionaisOptions}
              onAdd={addSituacaoPrisional}
            />

            <SelectWithAdd
              label="Comarca / Vara"
              value={formData.comarcaVaraId}
              onChange={(value) => setFormData({ ...formData, comarcaVaraId: value })}
              options={comarcasVarasOptions}
              onAdd={addComarcaVara}
            />

            <SelectWithAdd
              label="Tipo de Crime"
              value={formData.tipoCrimeId}
              onChange={(value) => setFormData({ ...formData, tipoCrimeId: value })}
              options={tipoCrimesOptions}
              onAdd={addTipoCrime}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 legal-gradient text-white">
                {initialData ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
