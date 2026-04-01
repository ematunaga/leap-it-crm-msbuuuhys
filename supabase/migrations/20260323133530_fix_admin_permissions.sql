DO $$
DECLARE
  v_admin_profile_id uuid;
  v_user_count int;
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

  -- 2. Ensure ematunaga@gmail.com is in app_users and has this profile
  INSERT INTO public.app_users (id, name, email, role, profile_id, status, origin)
  SELECT id, COALESCE(raw_user_meta_data->>'name', 'Admin LeapIT'), email, 'Administrador', v_admin_profile_id, 'ativo', 'CRM'
  FROM auth.users
  WHERE email = 'ematunaga@gmail.com'
  ON CONFLICT (id) DO UPDATE 
  SET profile_id = EXCLUDED.profile_id, role = 'Administrador';
  
  -- 3. Also ensure any user in app_users with this email gets the profile (fallback)
  UPDATE public.app_users 
  SET profile_id = v_admin_profile_id, role = 'Administrador'
  WHERE email = 'ematunaga@gmail.com';

  -- 4. If there's a user without a profile and they are the only user or the oldest user, make them admin to prevent lockout
  SELECT count(*) INTO v_user_count FROM public.app_users;
  IF v_user_count > 0 THEN
    UPDATE public.app_users 
    SET profile_id = v_admin_profile_id, role = 'Administrador'
    WHERE profile_id IS NULL AND id IN (
      SELECT id FROM public.app_users ORDER BY created_at ASC LIMIT 1
    );
  END IF;

END $$;
