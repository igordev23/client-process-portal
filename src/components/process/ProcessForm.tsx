// src/components/process/ProcessForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger as InnerDialogTrigger
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

  const [formData, setFormData] = useState<Process & {
    situacaoPrisional: string;
    comarcaVara: string;
    tipoCrime: string;
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
    situacaoPrisional: '',
    comarcaVara: '',
    tipoCrime: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        situacaoPrisional: (initialData as any).situacaoPrisional || '',
        comarcaVara: (initialData as any).comarcaVara || '',
        tipoCrime: (initialData as any).tipoCrime || '',
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
        situacaoPrisional: '',
        comarcaVara: '',
        tipoCrime: '',
      });
    }
  }, [initialData, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, lastUpdate: formData.startDate });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
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
      situacaoPrisional: '',
      comarcaVara: '',
      tipoCrime: '',
    });
  };
const [clientDialogOpen, setClientDialogOpen] = useState(false);

 return (
  <>
    {/* Modal do Cliente fora do formulário */}
    <InnerDialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
      <InnerDialogContent className="sm:max-w-[425px]">
        <InnerDialogHeader>
          <InnerDialogTitle>Cadastrar Novo Cliente</InnerDialogTitle>
          <InnerDialogDescription>
            Preencha os dados do novo cliente. Ele será adicionado à lista.
          </InnerDialogDescription>
        </InnerDialogHeader>
        <ClientDialogForm
          onSuccess={() => {
            setClientDialogOpen(false);
            // Opcional: atualizar a lista de clientes após cadastro
          }}
        />
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="clientId">Cliente</Label>
              <Button
                type="button"
                variant="link"
                className="text-blue-600 text-sm p-0 h-auto"
                onClick={() => setClientDialogOpen(true)}
              >
                + Novo Cliente
              </Button>
            </div>

            <Select
              value={formData.clientId}
              onValueChange={(value) => setFormData({ ...formData, clientId: value })}
            >
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
              onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Processo</Label>
            <Input
              id="title"
              placeholder="Ex: Ação de Revisão de Benefício"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Process['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
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
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lawyer">Advogado Responsável</Label>
            <Input
              id="lawyer"
              value={formData.lawyer}
              onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição detalhada do processo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <SelectWithAdd
            label="Situação Prisional"
            value={formData.situacaoPrisional}
            onChange={(value) => setFormData({ ...formData, situacaoPrisional: value })}
            options={situacoesPrisionais}
            onAdd={addSituacaoPrisional}
          />

          <SelectWithAdd
            label="Comarca / Vara"
            value={formData.comarcaVara}
            onChange={(value) => setFormData({ ...formData, comarcaVara: value })}
            options={comarcasVaras}
            onAdd={addComarcaVara}
          />

          <SelectWithAdd
            label="Tipo de Crime"
            value={formData.tipoCrime}
            onChange={(value) => setFormData({ ...formData, tipoCrime: value })}
            options={tipoCrimes}
            onAdd={addTipoCrime}
          />

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
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
