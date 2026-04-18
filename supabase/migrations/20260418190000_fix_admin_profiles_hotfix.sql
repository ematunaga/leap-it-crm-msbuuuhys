-- HOTFIX CRÍTICO: Corrige perfis Admin mapeados incorretamente
-- Problema: Renato Lovisi (admin) foi mapeado para Gestor Comercial ao invés de Administrador Global
-- Causa raiz: Migration anterior usou LIMIT 1 e pegou o perfil errado

-- Primeiro, vamos ver os perfis existentes para debug
DO $$
DECLARE
  admin_profile_id UUID;
  gestor_profile_id UUID;
BEGIN
  -- Busca o ID correto do perfil Administrador Global
  SELECT id INTO admin_profile_id
  FROM public.access_profiles
  WHERE name = 'Administrador Global'
  LIMIT 1;

  -- Atualiza TODOS os usuários com role='admin' para Administrador Global
  UPDATE public.app_users
  SET access_profile_id = admin_profile_id
  WHERE role = 'admin';

  RAISE NOTICE 'Perfil Administrador Global aplicado a todos os usuários admin';
  RAISE NOTICE 'Usuários atualizados: %', (SELECT COUNT(*) FROM app_users WHERE role = 'admin');
END $$;
