DO $$
DECLARE
  v_admin_profile_id uuid;
BEGIN
  -- 1. Create or find the Administrator profile
  SELECT id INTO v_admin_profile_id FROM public.access_profiles WHERE name = 'Administrador' OR type = 'sistema' LIMIT 1;
  
  IF v_admin_profile_id IS NULL THEN
    v_admin_profile_id := gen_random_uuid();
    INSERT INTO public.access_profiles (id, name, description, type, status, permissions)
    VALUES (
      v_admin_profile_id, 
      'Administrador', 
      'Acesso total ao sistema', 
      'sistema', 
      'ativo', 
      '{}'::jsonb
    );
  END IF;

  -- 2. Ensure targeted emails are in app_users and have this profile
  INSERT INTO public.app_users (id, name, email, role, profile_id, status, origin)
  SELECT id, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)), email, 'Administrador', v_admin_profile_id, 'ativo', 'CRM'
  FROM auth.users
  WHERE email ILIKE 'enio.matunaga@leapit.com.br' OR email ILIKE 'ematunaga@gmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET profile_id = EXCLUDED.profile_id, role = 'Administrador';
  
  -- 3. Also ensure any user in app_users with these emails gets the profile (fallback)
  UPDATE public.app_users 
  SET profile_id = v_admin_profile_id, role = 'Administrador'
  WHERE email ILIKE 'enio.matunaga@leapit.com.br' OR email ILIKE 'ematunaga@gmail.com';

END $$;

-- 4. Set up an insert trigger for new users to be automatically added to app_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_profile_id uuid;
BEGIN
  IF NEW.email ILIKE 'enio.matunaga@leapit.com.br' OR NEW.email ILIKE 'ematunaga@gmail.com' THEN
    SELECT id INTO v_profile_id FROM public.access_profiles WHERE type = 'sistema' LIMIT 1;
  END IF;

  INSERT INTO public.app_users (id, name, email, role, profile_id, status, origin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN v_profile_id IS NOT NULL THEN 'Administrador' ELSE 'Usuário' END,
    v_profile_id,
    'ativo',
    'CRM'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
