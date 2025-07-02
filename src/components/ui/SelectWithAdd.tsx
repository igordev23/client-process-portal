// src/components/ui/SelectWithAdd.tsx
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onAdd: (newValue: string) => void;
}

export function SelectWithAdd({ label, value, onChange, options, onAdd }: Props) {
  const [newOption, setNewOption] = useState('');

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, i) => (
              <SelectItem key={i} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={() => {
            if (newOption.trim()) {
              onAdd(newOption.trim());
              onChange(newOption.trim());
              setNewOption('');
            }
          }}
        >
          +
        </Button>
      </div>
      <Input
        placeholder={`Novo ${label.toLowerCase()}`}
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
      />
    </div>
  );
}
