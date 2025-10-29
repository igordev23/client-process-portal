import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';

interface ProcessUpdate {
  id: number;
  author: string;
  date: string;
  description: string;
}

interface Process {
  id: number;
  title: string;
  processnumber?: string;
  lawyer?: string;
  startdate?: string;
  lastupdate?: string;
  situacaoPrisional?: string;
  situacao_prisional?: string;
  comarcaVara?: string;
  comarca_vara?: string;
  tipoCrime?: string;
  tipo_crime?: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  updates: ProcessUpdate[];
}

interface ProcessCardProps {
  process: Process;
  client?: { name: string; cpf: string };

  onStatusChange: (status: Process['status']) => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditUpdate?: (update: ProcessUpdate) => void;
  onDeleteUpdate?: (update: ProcessUpdate) => void;
  onAddUpdate?: () => void;
}
export function ProcessCard({
  process,
  client,
  onStatusChange,
  onEdit,
  onDelete,
  onEditUpdate,
  onDeleteUpdate,
  onAddUpdate,
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
  
  // detecta se é ISO com horário (contains 'T')
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } else {
    // formato YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
};



  const formatDateUpdate = (dateStr?: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
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
              <p><strong>Processo:</strong> {process.processnumber || '—'}</p>
              <p><strong>Cliente:</strong> {client ? `${client.name} (${client.cpf || '—'})` : '—'}</p>
              <p><strong>Advogado:</strong> {process.lawyer}</p>
              <p><strong>Início:</strong> {formatDate(process.startdate)}</p>
              <p><strong>Última Atualização:</strong> {formatDate(process.lastupdate)}</p>
              <p><strong>Situação Prisional:</strong> {process.situacaoPrisional || process.situacao_prisional || '—'}</p>
              <p><strong>Comarca / Vara:</strong> {process.comarcaVara || process.comarca_vara || '—'}</p>
              <p><strong>Tipo de Crime:</strong> {process.tipoCrime || process.tipo_crime || '—'}</p>
            </div>

            <div className="mt-3">
              <p className="text-sm"><strong>Descrição:</strong></p>
              <p className="text-sm text-gray-600 mt-1">{process.description}</p>
            </div>

            {/* Lista de atualizações limitadas a 4 com scroll */}
            <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
                {process.updates
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // mais recentes primeiro
                .slice(0, 4)
                 // inverte a ordem dos 4 mais recentes
                .map((update) => (
                <div key={update.id} className="bg-gray-50 p-3 rounded-lg relative">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-gray-900">{update.author}</span>
                    <span className="text-xs text-gray-500">{formatDateUpdate(update.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{update.description}</p>

                  <div className="absolute top-8 right-3 flex gap-1">
                    <button onClick={() => onEditUpdate?.(update)}>
                      <Pencil size={16} className="text-gray-500 hover:text-blue-500" />
                    </button>
                    <button onClick={() => onDeleteUpdate?.(update)}>
                      <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full lg:w-auto lg:ml-4">
           <div className="w-full lg:w-48">
  <Select value={process.status} onValueChange={onStatusChange}>
    <SelectTrigger className="w-full h-9 p-0">
      {process.status === "pending" && (
        <div className="w-full h-9 flex items-center justify-center rounded-md bg-yellow-100 text-yellow-800 font-medium">
          Pendente
        </div>
      )}
      {process.status === "active" && (
        <div className="w-full h-9 flex items-center justify-center rounded-md bg-blue-100 text-blue-800 font-medium">
          Em Andamento
        </div>
      )}
      {process.status === "completed" && (
        <div className="w-full h-9 flex items-center justify-center rounded-md bg-green-100 text-green-800 font-medium">
          Concluído
        </div>
      )}
      {process.status === "cancelled" && (
        <div className="w-full h-9 flex items-center justify-center rounded-md bg-red-100 text-red-800 font-medium">
          Cancelado
        </div>
      )}
      {!process.status && <span>Selecione o status</span>}
    </SelectTrigger>

    <SelectContent>
      <SelectItem
        value="pending"
        className="bg-yellow-100 text-yellow-800 focus:bg-yellow-200 focus:text-yellow-900"
      >
        Pendente
      </SelectItem>
      <SelectItem
        value="active"
        className="bg-blue-100 text-blue-800 focus:bg-blue-200 focus:text-blue-900"
      >
        Em Andamento
      </SelectItem>
      <SelectItem
        value="completed"
        className="bg-green-100 text-green-800 focus:bg-green-200 focus:text-green-900"
      >
        Concluído
      </SelectItem>
      <SelectItem
        value="cancelled"
        className="bg-red-100 text-red-800 focus:bg-red-200 focus:text-red-900"
      >
        Cancelado
      </SelectItem>
    </SelectContent>
  </Select>
</div>


            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 w-full lg:w-48">
              <Button variant="secondary" size="sm" onClick={onEdit} className="w-full">
                <span className="hidden sm:inline lg:hidden">Editar</span>
                <span className="sm:hidden lg:inline">Editar Processo</span>
                <Pencil className="w-4 h-4 sm:hidden lg:hidden" />
              </Button>
              <Button variant="outline" size="sm" onClick={onAddUpdate} className="w-full">
                <span className="hidden sm:inline lg:hidden">Atualizar</span>
                <span className="sm:hidden lg:inline">Adicionar Atualização</span>
                <span className="sm:hidden lg:hidden">+</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este processo?')) {
                    onDelete();
                  }
                }}
                className="w-full"
              >
                <span className="hidden sm:inline lg:hidden">Excluir</span>
                <span className="sm:hidden lg:inline">Excluir</span>
                <Trash2 className="w-4 h-4 sm:hidden lg:hidden" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

