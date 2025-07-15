import { User } from '@/types/auth.types';

/**
 * Corrige caracteres corrompidos manualmente em uma string
 */
export function fixEncodingManual(str?: string): string {
  if (!str) return '';
  return str
    .replace(/Æ/g, 'ã')
    .replace(/Ã/g, 'á')
    .replace(/¢/g, 'ç')
    .replace(/Õ/g, 'õ')
    .replace(/©/g, 'é')
    .replace(/Ê/g, 'ê')
    .replace(/Ó/g, 'ó')
    .replace(/Ú/g, 'ú')
    .replace(/Í/g, 'í')
    .replace(/Ô/g, 'ô')
    .replace(/À/g, 'à')
    .replace(/È/g, 'è')
    .replace(/Ì/g, 'ì')
    .replace(/Ù/g, 'ù')
    .replace(/Ñ/g, 'ñ');
}

/**
 * Aplica `fixEncodingManual` em todos os usuários
 */
export function fixUsersEncoding(users: any[]): User[] {
  return users.map(u => ({
    ...u,
    name: fixEncodingManual(u.name),
  }));
}
