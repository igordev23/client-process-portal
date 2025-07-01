// src/components/process/ProcessForm.tsx
import React, { useState } from 'react';
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

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (process: Process) => void;
  clients: { id: string; name: string; cpf: string }[];
  user: { name: string } | null;
}

export function ProcessForm({ isOpen, onOpenChange, onSubmit, clients, user }: Props) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, lastUpdate: formData.startDate });
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Processo</DialogTitle>
          <DialogDescription>Preencha os dados do processo jurídico</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
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

          {/* Número do Processo */}
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

          {/* Título */}
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

          {/* Status e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Process['status']) => setFormData({ ...formData, status: value })}>
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

          {/* Advogado */}
          <div className="space-y-2">
            <Label htmlFor="lawyer">Advogado Responsável</Label>
            <Input
              id="lawyer"
              value={formData.lawyer}
              onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
              required
            />
          </div>

          {/* Descrição */}
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

          {/* NOVOS CAMPOS ADICIONADOS */}

          <div className="space-y-2">
            <Label htmlFor="situacaoPrisional">Situação Prisional</Label>
            <Input
              id="situacaoPrisional"
              placeholder="Ex: Preso preventivamente, em liberdade provisória..."
              value={formData.situacaoPrisional}
              onChange={(e) => setFormData({ ...formData, situacaoPrisional: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comarcaVara">Comarca / Vara</Label>
            <Input
              id="comarcaVara"
              placeholder="Informe a comarca ou vara responsável"
              value={formData.comarcaVara}
              onChange={(e) => setFormData({ ...formData, comarcaVara: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoCrime">Tipo de Crime</Label>
            <Input
              id="tipoCrime"
              placeholder="Informe o tipo de crime do processo"
              value={formData.tipoCrime}
              onChange={(e) => setFormData({ ...formData, tipoCrime: e.target.value })}
            />
          </div>

          {/* BOTÕES */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
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
  );
}
