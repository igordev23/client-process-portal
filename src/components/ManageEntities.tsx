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

  const getCurrentList = () => {
    switch (activeTab) {
      case 'tipoCrime':
        return tipoCrimes;
      case 'comarcaVara':
        return comarcasVaras;
      case 'situacaoPrisional':
        return situacoesPrisionais;
    }
  };

  const filteredList = getCurrentList().filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditValue(filteredList[index]); // pegar da lista filtrada
  };

  const saveEdit = () => {
    if (editIndex === null || editValue.trim() === '') return;

    const originalIndex = getCurrentList().indexOf(filteredList[editIndex]);

    switch (activeTab) {
      case 'tipoCrime':
        editTipoCrime(getCurrentList()[originalIndex], editValue.trim());
        break;
      case 'comarcaVara':
        editComarcaVara(getCurrentList()[originalIndex], editValue.trim());
        break;
      case 'situacaoPrisional':
        editSituacaoPrisional(getCurrentList()[originalIndex], editValue.trim());
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Configurações de Cadastro</h2>
        <Button variant="outline" onClick={onBack}>Dashboard</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeTab === 'tipoCrime' ? 'default' : 'outline'}
          onClick={() => {
            setActiveTab('tipoCrime');
            setEditIndex(null);
            setSearchTerm(''); // limpa busca ao trocar
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
                    <Button
                      variant="outline"
                      onClick={() => setEditIndex(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">{item}</span>
                    <Button size="sm" onClick={() => startEditing(i)}>Editar</Button>
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
