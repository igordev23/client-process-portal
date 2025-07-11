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

interface Option {
  id: number;
  name: string;
}

interface Props {
  label: string;
  value: number;
  onChange: (id: number) => void;
  options: Option[];
  onAdd: (newName: string) => void;
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

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [options, search]);

  const selectedLabel = options.find(
    (opt) => String(opt.id) === String(value)
  )?.name;

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (
      trimmed &&
      !options.some(
        (opt) => opt.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      onAdd(trimmed);
      setNewOption("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <div className="flex gap-2">
        <Select value={value.toString()} onValueChange={(val) => onChange(Number(val))}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`}>
              {selectedLabel || `Selecione ${label.toLowerCase()}`}
            </SelectValue>
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
                filteredOptions.map((option) => (
                 <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
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
                    options.some(
                      (opt) =>
                        opt.name.toLowerCase() === newOption.trim().toLowerCase()
                    )
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
