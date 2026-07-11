import type { User } from '@supabase/supabase-js';

/**
 * Lista de e-mails autorizados a acessar o Painel Admin IA.
 * Para adicionar/remover admins, edite este array.
 *
 * SEGURANÇA: esta é uma checagem apenas de UI. Para proteger dados de fato,
 * use RLS no Supabase referenciando uma tabela `user_roles` (recomendado).
 */
const ADMIN_EMAILS: string[] = [
  'toledo.digital01@gmail.com',
];

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
