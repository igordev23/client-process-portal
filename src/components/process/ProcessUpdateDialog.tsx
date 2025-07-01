// src/components/process/ProcessUpdateDialog.tsx
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
import { Process } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  process: Process | null;
  user: { name: string } | null;
  onSubmit: (update: { date: string; description: string; author: string }) => void;
}

export function ProcessUpdateDialog({
  isOpen,
  onOpenChange,
  process,
  user,
  onSubmit,
}: Props) {
  const [updateData, setUpdateData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    author: user?.name || '',
  });

  useEffect(() => {
    if (isOpen) {
      setUpdateData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        author: user?.name || '',
      });
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(updateData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Atualização</DialogTitle>
          <DialogDescription>
            Adicione uma nova atualização ao processo: {process?.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-date">Data</Label>
            <Input
              id="update-date"
              type="date"
              value={updateData.date}
              onChange={(e) => setUpdateData({ ...updateData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-author">Autor</Label>
            <Input
              id="update-author"
              value={updateData.author}
              onChange={(e) => setUpdateData({ ...updateData, author: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-description">Descrição da Atualização</Label>
            <Textarea
              id="update-description"
              placeholder="Descreva a atualização do processo..."
              value={updateData.description}
              onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
  );
}
