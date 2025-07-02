import * as XLSX from 'xlsx';
import { Process, Client } from '@/contexts/AuthContext';

export function exportProcessesToExcel(processes: Process[], clients: Client[]) {
  if (processes.length === 0) {
    console.warn("Nenhum processo para exportar.");
    return;
  }

  const data = processes.map(proc => {
    const client = clients.find(c => c.id === proc.clientId);

    const updatesText = (proc.updates || [])
      .map(update => {
        const user = update.author || 'Usuário'; 
        const date = formatDate(update.date);
        return `${user} - ${date}\n${update.description}`;
      })
      .join('\n\n');

    return {
      'Título': proc.title,
      'Status': translateStatus(proc.status),
      'Número do Processo': proc.processNumber,
      'Cliente': `${client?.name || 'Desconhecido'} (${client?.cpf || '-'})`,
      'Advogado': proc.lawyer || '—',
      'Início': formatDate(proc.startDate),
      'Última Atualização': formatDate(proc.lastUpdate),
      'Situação Prisional': proc.situacaoPrisional || '—',
      'Comarca / Vara': proc.comarcaVara || '—',
      'Tipo de Crime': proc.tipoCrime || '—',
      'Descrição': proc.description || '',
      'Últimas Atualizações': updatesText,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajusta largura das colunas baseado no conteúdo
  worksheet['!cols'] = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => (row[key]?.toString()?.length || 0))
    )
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Processos');

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const filename = `processos-${timestamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

function formatDate(value: any): string {
  const date = new Date(value);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

function translateStatus(status: string): string {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'active': return 'Em Andamento';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
}
