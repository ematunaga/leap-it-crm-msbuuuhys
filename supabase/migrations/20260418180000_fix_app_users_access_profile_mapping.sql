-- FASE 1.5: Correção do Mapeamento app_users -> access_profiles
-- Data: 2026-04-18
-- Objetivo: Corrigir o campo access_profile_id para mapear corretamente role->access_profiles

-- Adiciona coluna access_profile_id se não existir
ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS access_profile_id UUID;

-- Remove a tentativa de renomear coluna profile_id da migration anterior (que causou erro)
-- A coluna 'role' já existe e continua existindo

-- Mapeia os valores de role para access_profile_id baseado nos perfis existentes
-- SDR -> perfil SDR
UPDATE public.app_users
SET access_profile_id = (
  SELECT id FROM public.access_profiles
  WHERE name = 'SDR (Sales Development Rep)'
  LIMIT 1
)
WHERE role = 'sdr';

-- Admin -> perfil Administrador Global
UPDATE public.app_users
SET access_profile_id = (
  SELECT id FROM public.access_profiles  
  WHERE name = 'Administrador Global'
  LIMIT 1
)
WHERE role = 'admin';

-- Gestor -> perfil Gestor Comercial
UPDATE public.app_users
SET access_profile_id = (
  SELECT id FROM public.access_profiles
  WHERE name = 'Gestor Comercial'
  LIMIT 1
)
WHERE role = 'gestor';

-- Atualiza hook useRBAC para usar access_profile_id ao invés de apenas role
COMMENT ON COLUMN public.app_users.access_profile_id IS 'Referência para access_profiles - usado pelo hook useRBAC';

DO $$
BEGIN
  RAISE NOTICE 'Mapeamento role -> access_profile_id concluído!';
  RAISE NOTICE 'Usuários SDR agora mapeados para perfil SDR com permissões limitadas';
END $$;
