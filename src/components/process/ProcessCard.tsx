// src/components/process/ProcessCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Process } from '@/contexts/AuthContext';

interface ProcessCardProps {
  process: Process;
  client?: { name: string; cpf: string };
  onStatusChange: (status: Process['status']) => void;
  onAddUpdate: () => void;
}

export function ProcessCard({ process, client, onStatusChange, onAddUpdate }: ProcessCardProps) {
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
              <p><strong>Processo:</strong> {process.processNumber}</p>
              <p><strong>Cliente:</strong> {client?.name} ({client?.cpf})</p>
              <p><strong>Advogado:</strong> {process.lawyer}</p>
              <p><strong>Início:</strong> {new Date(process.startDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Última Atualização:</strong> {new Date(process.lastUpdate).toLocaleDateString('pt-BR')}</p>

              {/* Novos campos */}
              <p><strong>Situação Prisional:</strong> {process.situacaoPrisional || '—'}</p>
              <p><strong>Comarca / Vara:</strong> {process.comarcaVara || '—'}</p>
              <p><strong>Tipo de Crime:</strong> {process.tipoCrime || '—'}</p>
            </div>

            <div className="mt-3">
              <p className="text-sm"><strong>Descrição:</strong></p>
              <p className="text-sm text-gray-600 mt-1">{process.description}</p>
            </div>

            {process.updates.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Últimas Atualizações:</p>
                <div className="space-y-2">
                  {process.updates.slice(-3).reverse().map((update) => (
                    <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-900">{update.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 lg:ml-4">
            <Select
              value={process.status}
              onValueChange={onStatusChange}
            >
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

            <Button
              variant="outline"
              size="sm"
              onClick={onAddUpdate}
              className="w-full lg:w-48"
            >
              Adicionar Atualização
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
