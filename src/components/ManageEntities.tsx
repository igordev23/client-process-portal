import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function ManageEntities({ onBack }: { onBack: () => void }) {
  const {
    tipoCrimes,
    removeTipoCrime,
    editTipoCrime,
    comarcasVaras,
    removeComarcaVara,
    editComarcaVara,
    situacoesPrisionais,
    removeSituacaoPrisional,
    editSituacaoPrisional,
  } = useAuth();

  type EntityType = 'tipoCrime' | 'comarcaVara' | 'situacaoPrisional';

  const [activeTab, setActiveTab] = useState<EntityType>('tipoCrime');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sempre retorna um array (pode ser vazio)
  const getCurrentList = (): string[] => {
  let list: unknown[] = [];
  switch (activeTab) {
    case 'tipoCrime':
      list = tipoCrimes || [];
      break;
    case 'comarcaVara':
      list = comarcasVaras || [];
      break;
    case 'situacaoPrisional':
      list = situacoesPrisionais || [];
      break;
  }
  // Filtra só strings, elimina valores inválidos
  return list.filter((item): item is string => typeof item === 'string');
};

const filteredList = getCurrentList().filter((item) => {
  if (typeof item !== 'string') return false;
  return item.toLowerCase().includes(searchTerm.toLowerCase());
});


  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditValue(filteredList[index]);
  };

  const saveEdit = () => {
    if (editIndex === null) return;

    const trimmedValue = editValue.trim();
    if (trimmedValue === '') return;

    const currentList = getCurrentList();

    // Encontra índice original para atualizar no array correto
    // ATENÇÃO: Se houver duplicatas, sempre atualiza a primeira ocorrência
    const originalItem = filteredList[editIndex];
    const originalIndex = currentList.indexOf(originalItem);

    if (originalIndex === -1) {
      // Item não encontrado na lista original (pode ocorrer em casos extremos)
      setEditIndex(null);
      setEditValue('');
      return;
    }

    switch (activeTab) {
      case 'tipoCrime':
        editTipoCrime(currentList[originalIndex], trimmedValue);
        break;
      case 'comarcaVara':
        editComarcaVara(currentList[originalIndex], trimmedValue);
        break;
      case 'situacaoPrisional':
        editSituacaoPrisional(currentList[originalIndex], trimmedValue);
        break;
    }
    setEditIndex(null);
    setEditValue('');
  };

  const handleRemove = (value: string) => {
    switch (activeTab) {
      case 'tipoCrime':
        removeTipoCrime(value);
        break;
      case 'comarcaVara':
        removeComarcaVara(value);
        break;
      case 'situacaoPrisional':
        removeSituacaoPrisional(value);
        break;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'tipoCrime':
        return 'Tipos de Crime';
      case 'comarcaVara':
        return 'Comarcas / Varas';
      case 'situacaoPrisional':
        return 'Situações Prisionais';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Configurações de Cadastro</h2>
        <Button variant="outline" onClick={onBack}>
          Dashboard
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeTab === 'tipoCrime' ? 'default' : 'outline'}
          onClick={() => {
            setActiveTab('tipoCrime');
            setEditIndex(null);
            setSearchTerm('');
          }}
        >
          Tipos de Crime
        </Button>
        <Button
          variant={activeTab === 'comarcaVara' ? 'default' : 'outline'}
          onClick={() => {
            setActiveTab('comarcaVara');
            setEditIndex(null);
            setSearchTerm('');
          }}
        >
          Comarcas / Varas
        </Button>
        <Button
          variant={activeTab === 'situacaoPrisional' ? 'default' : 'outline'}
          onClick={() => {
            setActiveTab('situacaoPrisional');
            setEditIndex(null);
            setSearchTerm('');
          }}
        >
          Situações Prisionais
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredList.length > 0 ? (
            filteredList.map((item, i) => (
              <div key={item} className="flex items-center gap-2">
                {editIndex === i ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={saveEdit}>Salvar</Button>
                    <Button variant="outline" onClick={() => setEditIndex(null)}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">{item}</span>
                    <Button size="sm" onClick={() => startEditing(i)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(item)}
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Nenhum item encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
