import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

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
  
  // Estado para modal confirmação exclusão
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

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

    try {
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
      toast({ title: 'Adicionado com sucesso!', variant: 'success' });
      setEditValue('');
    } catch {
      toast({
        title: 'Erro ao adicionar',
        description: 'Não foi possível adicionar o item.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (editId === null || !editValue.trim()) return;

    try {
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
      toast({ title: 'Editado com sucesso!', variant: 'success' });
      setEditId(null);
      setEditValue('');
    } catch {
      toast({
        title: 'Erro ao editar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveConfirmed = async () => {
    if (idToDelete === null) return;
    try {
      switch (activeTab) {
        case 'tipoCrime':
          await removeTipoCrime(idToDelete);
          break;
        case 'comarcaVara':
          await removeComarcaVara(idToDelete);
          break;
        case 'situacaoPrisional':
          await removeSituacaoPrisional(idToDelete);
          break;
      }
      toast({ title: 'Removido com sucesso!', variant: 'success' });
      setIdToDelete(null);
    } catch {
      toast({
        title: 'Não foi possível remover',
        description:
          'Este item está vinculado a um ou mais processos. Atualize ou remova os processos antes de excluir.',
        variant: 'destructive',
      });
      setIdToDelete(null);
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
              setEditValue('');
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
          {/* Campo de novo item - só aparece se não estiver editando */}
          {editId === null && (
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Novo item..."
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAdd}>Adicionar</Button>
            </div>
          )}

          {/* Lista de itens */}
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
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditId(item.id);
                        setEditValue(item.name);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setIdToDelete(item.id)}
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

      {/* Modal simples de confirmação */}
      {idToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirma exclusão?</h3>
            <p className="mb-6">Tem certeza que deseja excluir este item?</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIdToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRemoveConfirmed}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
