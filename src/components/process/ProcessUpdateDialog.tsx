
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Process } from '@/types/auth.types';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  process: Process | null;
  user: { name: string } | null;
  onSubmit: (update: { date: string; description: string; author: string }) => void;
  initialData?: Process['updates'][number];
  onDelete?: () => void;
}

export function ProcessUpdateDialog({
  isOpen,
  onOpenChange,
  process,
  user,
  onSubmit,
  initialData,
  onDelete,
}: Props) {
  const [updateData, setUpdateData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    author: user?.name || '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setUpdateData({
          date: initialData.date,
          description: initialData.description,
          author: initialData.author,
        });
      } else {
        setUpdateData({
          date: new Date().toISOString().split('T')[0],
          description: '',
          author: user?.name || '',
        });
      }
    }
  }, [isOpen, user, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(updateData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Atualização' : 'Adicionar Atualização'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? `Edite a atualização do processo: ${process?.title}`
              : `Adicione uma nova atualização ao processo: ${process?.title}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-date">Data</Label>
            <Input
              id="update-date"
              type="date"
              value={updateData.date}
              onChange={(e) =>
                setUpdateData({ ...updateData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-author">Autor</Label>
            <Input
              id="update-author"
              value={updateData.author}
              onChange={(e) =>
                setUpdateData({ ...updateData, author: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-description">Descrição da Atualização</Label>
            <Textarea
              id="update-description"
              placeholder="Descreva a atualização do processo..."
              value={updateData.description}
              onChange={(e) =>
                setUpdateData({ ...updateData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-2 pt-4 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>

            {initialData && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (
                    confirm('Deseja realmente excluir esta atualização?')
                  ) {
                    onDelete();
                    onOpenChange(false);
                  }
                }}
                className="flex-1"
              >
                Excluir
              </Button>
            )}

            <Button type="submit" className="flex-1 legal-gradient text-white">
              {initialData ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
