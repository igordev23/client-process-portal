// src/components/process/ProcessCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Process, ProcessUpdate } from '@/contexts/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

interface ProcessCardProps {
  process: Process;
  client?: { name: string; cpf: string };
  onStatusChange: (status: Process['status']) => void;
  onAddUpdate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditUpdate?: (update: ProcessUpdate) => void;
  onDeleteUpdate?: (update: ProcessUpdate) => void;
}

export function ProcessCard({
  process,
  client,
  onStatusChange,
  onAddUpdate,
  onEdit,
  onDelete,
  onEditUpdate,
  onDeleteUpdate,
}: ProcessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
  };

  // Função para obter o nome da entidade, considerando tanto o nome quanto o ID
  const getEntityName = (entityValue?: string | number, entityName?: string) => {
    if (entityName) return entityName;
    if (!entityValue) return '—';
    return entityValue.toString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{process.title}</h3>
              <Badge className={`${getStatusColor(process.status)} ml-4`}>
                {getStatusText(process.status)}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Processo:</strong> {process.processNumber || (process as any).processnumber || '—'}</p>
              <p><strong>Cliente:</strong> {client ? `${client.name} (${client.cpf || '—'})` : '—'}</p>
              <p><strong>Advogado:</strong> {process.lawyer}</p>
              <p><strong>Início:</strong> {formatDate(process.startDate || (process as any).startdate)}</p>
              <p><strong>Última Atualização:</strong> {formatDate(process.lastUpdate || (process as any).lastupdate)}</p>
              <p><strong>Situação Prisional:</strong> {
                getEntityName(
                  process.situacaoPrisional || (process as any).situacaoprisional,
                  (process as any).situacaoPrisionalName
                )
              }</p>
              <p><strong>Comarca / Vara:</strong> {
                getEntityName(
                  process.comarcaVara || (process as any).comarcavara,
                  (process as any).comarcaVaraName
                )
              }</p>
              <p><strong>Tipo de Crime:</strong> {
                getEntityName(
                  process.tipoCrime || (process as any).tipocrime,
                  (process as any).tipoCrimeName
                )
              }</p>
            </div>
            
            <div className="mt-3">
              <p className="text-sm"><strong>Descrição:</strong></p>
              <p className="text-sm text-gray-600 mt-1">{process.description}</p>
            </div>

            {process.updates && process.updates.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Últimas Atualizações:</p>
                <div className="space-y-2">
                  {process.updates.slice(-3).reverse().map((update) => (
                    <div key={update.id} className="bg-gray-50 p-3 rounded-lg relative">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-900">{update.author}</span>
                        <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{update.description}</p>

                      {(onEditUpdate || onDeleteUpdate) && (
                        <div className="absolute top-8 right-3 flex gap-1">
                          {onEditUpdate && (
                            <button onClick={() => onEditUpdate(update)}>
                              <Pencil size={16} className="text-gray-500 hover:text-blue-500" />
                            </button>
                          )}
                          {onDeleteUpdate && (
                            <button onClick={() => onDeleteUpdate(update)}>
                              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 lg:ml-4">
            <Select value={process.status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="active">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={onAddUpdate} className="w-full lg:w-48">
              Adicionar Atualização
            </Button>

            <Button variant="secondary" size="sm" onClick={onEdit} className="w-full lg:w-48">
              Editar Processo
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este processo?')) {
                  onDelete();
                }
              }}
              className="w-full lg:w-48"
            >
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
