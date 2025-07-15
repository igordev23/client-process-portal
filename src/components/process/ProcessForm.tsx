
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
    tipos_crime,
    comarcas_varas,
    situacoes_prisionais,
    addTipoCrime,
    addComarcaVara,
    addSituacaoPrisional
  } = useAuth();

  const [formData, setFormData] = useState<Omit<Process, 'situacao_prisional_id' | 'comarca_vara_id' | 'tipo_crime_id'> & {
    situacao_prisional_id: number;
    comarca_vara_id: number;
    tipo_crime_id: number;
  }>({
    id: '',
    client_id: '',
    process_number: '',
    title: '',
    status: 'pending',
    start_date: '',
    last_update: '',
    description: '',
    lawyer: user?.name || '',
    updates: [],
    situacao_prisional_id: 0,
    comarca_vara_id: 0,
    tipo_crime_id: 0,
  });

  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        ...initialData,
        client_id: String(initialData.client_id ?? ''),
        situacao_prisional_id: Number(initialData.situacao_prisional_id ?? 0),
        comarca_vara_id: Number(initialData.comarca_vara_id ?? 0),
        tipo_crime_id: Number(initialData.tipo_crime_id ?? 0),
        start_date: initialData.start_date?.slice(0, 10) || '',
      });
    } else {
      setFormData({
        id: '',
        client_id: '',
        process_number: '',
        title: '',
        status: 'pending',
        start_date: '',
        last_update: '',
        description: '',
        lawyer: user?.name || '',
        updates: [],
        situacao_prisional_id: 0,
        comarca_vara_id: 0,
        tipo_crime_id: 0,
      });
    }
  }, [isOpen, initialData?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.situacao_prisional_id || !formData.comarca_vara_id || !formData.tipo_crime_id) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit({
      ...formData,
      last_update: formData.start_date
    });
    onOpenChange(false);
  };

  // Garantir que as listas nunca sejam undefined
  const situacoesPrisionaisOptions = (situacoes_prisionais || []).map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.name }
  );
  
  const tipoCrimesOptions = (tipos_crime || []).map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.name }
  );
  
  const comarcasVarasOptions = (comarcas_varas || []).map((item: any, index: number) =>
    typeof item === 'string'
      ? { id: index, name: item }
      : { id: item.id, name: item.name }
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
                value={formData.client_id}
                onChange={(value) => setFormData({ ...formData, client_id: value })}
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
              id="process_number"
              placeholder="Número do Processo"
              value={formData.process_number}
              onChange={(e) => setFormData({ ...formData, process_number: e.target.value })}
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
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
              value={formData.situacao_prisional_id}
              onChange={(value) => setFormData({ ...formData, situacao_prisional_id: value })}
              options={situacoesPrisionaisOptions}
              onAdd={addSituacaoPrisional}
            />

            <SelectWithAdd
              label="Comarca / Vara"
              value={formData.comarca_vara_id}
              onChange={(value) => setFormData({ ...formData, comarca_vara_id: value })}
              options={comarcasVarasOptions}
              onAdd={addComarcaVara}
            />

            <SelectWithAdd
              label="Tipo de Crime"
              value={formData.tipo_crime_id}
              onChange={(value) => setFormData({ ...formData, tipo_crime_id: value })}
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
