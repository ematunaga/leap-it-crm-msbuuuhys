-- FASE 1: Correção Crítica - Permissões RBAC para SDR, Gestor Comercial e Admin
-- Data: 2026-04-18
-- Objetivo: Corrigir permissões para que SDR não acesse Dashboard, Oportunidades e Pipeline

-- Remove perfis existentes se houver conflito
DELETE FROM public.access_profiles WHERE name IN ('SDR', 'Gestor Comercial', 'Administrador Global');

-- Cria perfil SDR com permissões limitadas
INSERT INTO public.access_profiles (id, name, description, type, status, permissions)
VALUES (
  'sdr-profile-001',
  'SDR',
  'Sales Development Representative - Acesso limitado a Leads e Atividades',
  'sistema',
  'ativo',
  jsonb_build_object(
    'leads', jsonb_build_object(
      'resource', 'leads',
      'actions', jsonb_build_object(
        'view', true,
        'create', true,
        'edit', true,
        'delete', false
      )
    ),
    'atividades', jsonb_build_object(
      'resource', 'atividades',
      'actions', jsonb_build_object(
        'view', true,
        'create', true,
        'edit', true,
        'delete', false
      )
    ),
    'contatos', jsonb_build_object(
      'resource', 'contatos',
      'actions', jsonb_build_object(
        'view', true,
        'create', false,
        'edit', false,
        'delete', false
      )
    )
  )
);

-- Cria perfil Gestor Comercial com permissões amplas
INSERT INTO public.access_profiles (id, name, description, type, status, permissions)
VALUES (
  'gestor-profile-001',
  'Gestor Comercial',
  'Gestor Comercial - Acesso completo a vendas e relatórios',
  'sistema',
  'ativo',
  jsonb_build_object(
    'dashboard', jsonb_build_object(
      'resource', 'dashboard',
      'actions', jsonb_build_object('view', true, 'create', false, 'edit', false, 'delete', false)
    ),
    'contas', jsonb_build_object(
      'resource', 'contas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'contatos', jsonb_build_object(
      'resource', 'contatos',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'leads', jsonb_build_object(
      'resource', 'leads',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'oportunidades', jsonb_build_object(
      'resource', 'oportunidades',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'pipeline', jsonb_build_object(
      'resource', 'pipeline',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', false)
    ),
    'atividades', jsonb_build_object(
      'resource', 'atividades',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'campanhas', jsonb_build_object(
      'resource', 'campanhas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', false)
    ),
    'propostas', jsonb_build_object(
      'resource', 'propostas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', false)
    ),
    'relatorios', jsonb_build_object(
      'resource', 'relatorios',
      'actions', jsonb_build_object('view', true, 'create', false, 'edit', false, 'delete', false)
    ),
    'contratos', jsonb_build_object(
      'resource', 'contratos',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', false)
    )
  )
);

-- Cria perfil Administrador Global com acesso total
INSERT INTO public.access_profiles (id, name, description, type, status, permissions)
VALUES (
  'admin-profile-001',
  'Administrador Global',
  'Administrador Global - Acesso total ao sistema',
  'sistema',
  'ativo',
  jsonb_build_object(
    'dashboard', jsonb_build_object(
      'resource', 'dashboard',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'contas', jsonb_build_object(
      'resource', 'contas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'contatos', jsonb_build_object(
      'resource', 'contatos',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'leads', jsonb_build_object(
      'resource', 'leads',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'oportunidades', jsonb_build_object(
      'resource', 'oportunidades',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'pipeline', jsonb_build_object(
      'resource', 'pipeline',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'atividades', jsonb_build_object(
      'resource', 'atividades',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'campanhas', jsonb_build_object(
      'resource', 'campanhas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'propostas', jsonb_build_object(
      'resource', 'propostas',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'relatorios', jsonb_build_object(
      'resource', 'relatorios',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'contratos', jsonb_build_object(
      'resource', 'contratos',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'concorrentes', jsonb_build_object(
      'resource', 'concorrentes',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    ),
    'configuracoes', jsonb_build_object(
      'resource', 'configuracoes',
      'actions', jsonb_build_object('view', true, 'create', true, 'edit', true, 'delete', true)
    )
  )
);

-- Atualiza referência access_profile_id na tabela app_users
-- REMOVIDO: Tentativa de RENAME COLUMN profile_id causava erro (coluna não existe)
-- A coluna access_profile_id é adicionada pela migration 20260418180000
-- Log de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Perfis RBAC criados com sucesso!';
  RAISE NOTICE 'SDR: Acesso apenas a Leads, Atividades e Contatos (view only)';
  RAISE NOTICE 'Gestor Comercial: Acesso completo a vendas';
  RAISE NOTICE 'Administrador Global: Acesso total';
END $$;
