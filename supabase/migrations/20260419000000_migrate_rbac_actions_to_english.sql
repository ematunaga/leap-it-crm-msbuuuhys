-- Migration: Rename Portuguese RBAC action keys to English
-- Converts: visualizar->view, criar->create, editar->edit, excluir->delete
-- This aligns the database schema with the frontend use-rbac.ts hook

DO $$
DECLARE
  rec RECORD;
  resource_key TEXT;
  resource_val JSONB;
  new_actions JSONB;
  new_permissions JSONB;
BEGIN
  FOR rec IN SELECT id, permissions FROM public.access_profiles LOOP
    new_permissions := '{}'::jsonb;
    
    FOR resource_key, resource_val IN SELECT * FROM jsonb_each(rec.permissions) LOOP
      new_actions := '{}'::jsonb;
      
      -- visualizar -> view
      IF resource_val ? 'visualizar' THEN
        new_actions := new_actions || jsonb_build_object('view', resource_val->'visualizar');
      ELSIF resource_val ? 'view' THEN
        new_actions := new_actions || jsonb_build_object('view', resource_val->'view');
      END IF;
      
      -- criar -> create
      IF resource_val ? 'criar' THEN
        new_actions := new_actions || jsonb_build_object('create', resource_val->'criar');
      ELSIF resource_val ? 'create' THEN
        new_actions := new_actions || jsonb_build_object('create', resource_val->'create');
      END IF;
      
      -- editar -> edit
      IF resource_val ? 'editar' THEN
        new_actions := new_actions || jsonb_build_object('edit', resource_val->'editar');
      ELSIF resource_val ? 'edit' THEN
        new_actions := new_actions || jsonb_build_object('edit', resource_val->'edit');
      END IF;
      
      -- excluir -> delete
      IF resource_val ? 'excluir' THEN
        new_actions := new_actions || jsonb_build_object('delete', resource_val->'excluir');
      ELSIF resource_val ? 'delete' THEN
        new_actions := new_actions || jsonb_build_object('delete', resource_val->'delete');
      END IF;
      
      new_permissions := new_permissions || jsonb_build_object(resource_key, new_actions);
    END LOOP;
    
    UPDATE public.access_profiles
    SET permissions = new_permissions
    WHERE id = rec.id;
    
  END LOOP;
END $$;
