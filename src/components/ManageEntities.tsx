import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Entity = { id: number; name: string };
type EntityType = 'tipoCrime' | 'comarcaVara' | 'situacaoPrisional';

export function ManageEntities({ onBack }: { onBack: () => void }) {
  const {
    tipoCrimes,
    comarcasVaras,
    situacoesPrisionais,
    addTipoCrime,
    removeTipoCrime,
    editTipoCrime,
    addComarcaVara,
    removeComarcaVara,
    editComarcaVara,
    addSituacaoPrisional,
    removeSituacaoPrisional,
    editSituacaoPrisional,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<EntityType>('tipoCrime');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getCurrentList = (): Entity[] => {
    switch (activeTab) {
      case 'tipoCrime':
        return tipoCrimes || [];
      case 'comarcaVara':
        return comarcasVaras || [];
      case 'situacaoPrisional':
        return situacoesPrisionais || [];
    }
  };

  const filteredList = getCurrentList().filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleAdd = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    switch (activeTab) {
      case 'tipoCrime':
        await addTipoCrime(trimmed);
        break;
      case 'comarcaVara':
        await addComarcaVara(trimmed);
        break;
      case 'situacaoPrisional':
        await addSituacaoPrisional(trimmed);
        break;
    }
    setEditValue('');
  };

  const handleSave = async () => {
    if (editId === null || !editValue.trim()) return;

    switch (activeTab) {
      case 'tipoCrime':
        await editTipoCrime(editId, editValue.trim());
        break;
      case 'comarcaVara':
        await editComarcaVara(editId, editValue.trim());
        break;
      case 'situacaoPrisional':
        await editSituacaoPrisional(editId, editValue.trim());
        break;
    }

    setEditId(null);
    setEditValue('');
  };

  const handleRemove = async (id: number) => {
    switch (activeTab) {
      case 'tipoCrime':
        await removeTipoCrime(id);
        break;
      case 'comarcaVara':
        await removeComarcaVara(id);
        break;
      case 'situacaoPrisional':
        await removeSituacaoPrisional(id);
        break;
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
        {(['tipoCrime', 'comarcaVara', 'situacaoPrisional'] as EntityType[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => {
              setActiveTab(tab);
              setEditId(null);
              setSearchTerm('');
            }}
          >
            {tab === 'tipoCrime'
              ? 'Tipos de Crime'
              : tab === 'comarcaVara'
              ? 'Comarcas / Varas'
              : 'Situações Prisionais'}
          </Button>
        ))}
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
          {/* Novo item */}
          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Novo item..."
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={editId === null ? handleAdd : handleSave}>
              {editId === null ? 'Adicionar' : 'Salvar'}
            </Button>
            {editId !== null && (
              <Button variant="outline" onClick={() => setEditId(null)}>
                Cancelar
              </Button>
            )}
          </div>

          {/* Lista atual */}
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                {editId === item.id ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSave}>Salvar</Button>
                    <Button variant="outline" onClick={() => setEditId(null)}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">{item.name}</span>
                    <Button size="sm" onClick={() => {
                      setEditId(item.id);
                      setEditValue(item.name);
                    }}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(item.id)}
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
