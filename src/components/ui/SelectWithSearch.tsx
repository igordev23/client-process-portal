// src/components/ui/SelectWithSearch.tsx
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}

export function SelectWithSearch({ label, value, onChange, options }: Props) {
  const [search, setSearch] = useState("");

  // Filtrar clientes pelo termo digitado
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
            </SelectTrigger>

        <SelectContent className="w-[350px] max-h-[400px]">
  <div className="p-3">
    <Input
      placeholder="Pesquisar..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      autoFocus
      className="w-full"
    />
  </div>

  <div className="max-h-[320px] overflow-y-auto px-3 pb-3">
    {filteredOptions.length > 0 ? (
      filteredOptions.map((option) => (
        <SelectItem key={option.id} value={option.id}>
          {option.label}
        </SelectItem>
      ))
    ) : (
      <div className="p-2 text-sm text-muted-foreground">
        Nenhum resultado encontrado
      </div>
    )}
  </div>
</SelectContent>

      </Select>
    </div>
  );
}
