// Módulos do CRM
export type Module =
  | 'dashboard'
  | 'accounts'
  | 'contacts'
  | 'opportunities'
  | 'activities'
  | 'proposals'
  | 'competitors'
  | 'reports'
  | 'leads'
  | 'campaigns'
  | 'contracts'
  | 'settings'
  | 'admin'

// Ações disponíveis
export type Action =
  | 'visualizar'
  | 'criar'
  | 'editar'
  | 'excluir'
  | 'alterar_financeiro'
  | 'fechar_negocio'
  | 'gerenciar_usuarios'
  | 'gerenciar_papeis'

// Papéis do sistema
export type Role =
  | 'admin'
  | 'gestor_comercial'
  | 'vendedor'
  | 'pre_vendas'
  | 'sdr'
  | 'leitura'

// Tipo de permissão
export type Permission = `${Module}:${Action}` | `${Module}:*`

// Matriz de permissões por papel
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard:*',
    'accounts:*',
    'contacts:*',
    'opportunities:*',
    'activities:*',
    'proposals:*',
    'competitors:*',
    'reports:*',
    'leads:*',
    'campaigns:*',
    'contracts:*',
    'settings:*',
    'admin:*',
  ],

  gestor_comercial: [
    'dashboard:visualizar',
    'accounts:visualizar',
    'accounts:criar',
    'accounts:editar',
    'contacts:visualizar',
    'contacts:criar',
    'contacts:editar',
    'opportunities:visualizar',
    'opportunities:criar',
    'opportunities:editar',
    'opportunities:excluir',
    'opportunities:alterar_financeiro',
    'opportunities:fechar_negocio',
    'activities:visualizar',
    'activities:criar',
    'activities:editar',
    'activities:excluir',
    'proposals:visualizar',
    'proposals:criar',
    'proposals:editar',
    'competitors:visualizar',
    'reports:visualizar',
    'leads:visualizar',
    'leads:criar',
    'leads:editar',
    'campaigns:visualizar',
    'contracts:visualizar',
    'contracts:editar',
  ],

  vendedor: [
    'dashboard:visualizar',
    'accounts:visualizar',
    'accounts:criar',
    'accounts:editar',
    'contacts:visualizar',
    'contacts:criar',
    'contacts:editar',
    'opportunities:visualizar',
    'opportunities:criar',
    'opportunities:editar',
    'opportunities:fechar_negocio',
    'activities:visualizar',
    'activities:criar',
    'activities:editar',
    'proposals:visualizar',
    'proposals:criar',
    'leads:visualizar',
    'leads:criar',
    'contracts:visualizar',
  ],

  pre_vendas: [
    'dashboard:visualizar',
    'accounts:visualizar',
    'contacts:visualizar',
    'opportunities:visualizar',
    'opportunities:editar',
    'activities:visualizar',
    'activities:criar',
    'activities:editar',
    'proposals:visualizar',
    'competitors:visualizar',
    'leads:visualizar',
  ],

  sdr: [
    'dashboard:visualizar',
    'accounts:visualizar',
    'accounts:criar',
    'accounts:editar',
    'contacts:visualizar',
    'contacts:criar',
    'contacts:editar',
    'opportunities:visualizar',
    'opportunities:criar',
    'activities:visualizar',
    'activities:criar',
    'leads:visualizar',
    'leads:criar',
    'leads:editar',
    'campaigns:visualizar',
  ],

  leitura: [
    'dashboard:visualizar',
    'accounts:visualizar',
    'contacts:visualizar',
    'opportunities:visualizar',
    'activities:visualizar',
    'proposals:visualizar',
    'reports:visualizar',
    'leads:visualizar',
    'contracts:visualizar',
  ],
}

// Verifica se um papel tem uma permissão específica
export function hasPermission(
  role: Role,
  module: Module,
  action: Action,
): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? []
  return permissions.some(
    (p) => p === `${module}:${action}` || p === `${module}:*`,
  )
}

// Descrição legível dos papéis (para tela de admin)
export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  gestor_comercial: 'Gestor Comercial',
  vendedor: 'Vendedor',
  pre_vendas: 'Pré-Vendas',
  sdr: 'SDR',
  leitura: 'Somente Leitura',
}