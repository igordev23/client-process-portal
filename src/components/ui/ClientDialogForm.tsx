// src/components/ui/ClientDialogForm.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  onSuccess?: () => void;
}

export function ClientDialogForm({ onSuccess }: Props) {
  const { addClient } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
  });

  // --- Mesmas funções do ClientManagement ---
  const handleCPFChange = (cpf: string) => {
    cpf = cpf.replace(/\D/g, ''); // só números
    if (cpf.length > 3) cpf = cpf.slice(0, 3) + '.' + cpf.slice(3);
    if (cpf.length > 7) cpf = cpf.slice(0, 7) + '.' + cpf.slice(7);
    if (cpf.length > 11) cpf = cpf.slice(0, 11) + '-' + cpf.slice(11, 13);
    return cpf.slice(0, 14);
  };

  const handlePhoneChange = (phone: string) => {
    phone = phone.replace(/\D/g, '');
    if (phone.length > 0) phone = '(' + phone;
    if (phone.length > 3) phone = phone.slice(0, 3) + ') ' + phone.slice(3);
    if (phone.length > 10) phone = phone.slice(0, 10) + '-' + phone.slice(10, 14);
    return phone.slice(0, 15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    onSuccess?.();
    setFormData({ name: '', cpf: '', email: '', phone: '' }); // reset
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={(e) =>
            setFormData({ ...formData, cpf: handleCPFChange(e.target.value) })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(11) 99999-9999"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: handlePhoneChange(e.target.value) })
          }
          
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="legal-gradient text-white">
          Cadastrar
        </Button>
      </div>
    </form>
  );
}
