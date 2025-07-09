import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | { name: string })[];
  onAdd: (newValue: string) => void;
}

export function SelectWithAdd({
  label,
  value,
  onChange,
  options,
  onAdd
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [search, setSearch] = useState("");

  // Extrai o texto de cada opção
  const getLabel = (option: string | { name: string }) =>
    typeof option === "string" ? option : option.name;

  // Lista de strings únicas para o Select
  const normalizedOptions = useMemo(() => {
    const labels = options.map(getLabel);
    return [...new Set(labels)];
  }, [options]);

  // Filtra com base no texto
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    return normalizedOptions.filter((opt) =>
      opt.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [normalizedOptions, search]);

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (trimmed && !normalizedOptions.includes(trimmed)) {
      onAdd(trimmed);
      onChange(trimmed);
      setNewOption("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => (
                  <SelectItem key={i} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  Nenhum resultado
                </div>
              )}
            </div>
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              +
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Adicionar {label}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder={`Nova ${label.toLowerCase()}`}
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewOption("");
                    setDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={
                    !newOption.trim() ||
                    normalizedOptions.includes(newOption.trim())
                  }
                  className="legal-gradient text-white"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
