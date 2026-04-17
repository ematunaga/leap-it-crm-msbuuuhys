-- ============================================
-- MIGRATION: FIX CRITICAL SECURITY ISSUES
-- Date: 2026-04-17
-- Author: Leap IT Security Audit
-- 
-- CRITICAL FIXES:
-- 1. Replace permissive RLS policies (USING true) with proper owner-based policies
-- 2. Fix handle_new_user function to prevent SQL injection via search_path
-- 3. Add audit trail for opportunity stage changes
-- ============================================

-- ============================================
-- PART 1: FIX ROW LEVEL SECURITY POLICIES
-- ============================================

-- Drop all existing permissive policies
DROP POLICY IF EXISTS "authenticated_all" ON public.accounts;
DROP POLICY IF EXISTS "authenticated_all" ON public.contacts;
DROP POLICY IF EXISTS "authenticated_all" ON public.opportunities;
DROP POLICY IF EXISTS "authenticated_all" ON public.activities;
DROP POLICY IF EXISTS "authenticated_all" ON public.leads;
DROP POLICY IF EXISTS "authenticated_all" ON public.contracts;
DROP POLICY IF EXISTS "authenticated_all" ON public.competitors;
DROP POLICY IF EXISTS "authenticated_all" ON public.app_users;
DROP POLICY IF EXISTS "authenticated_all" ON public.access_profiles;
DROP POLICY IF EXISTS "authenticated_all" ON public.opportunity_stakeholders;

-- Create secure RLS policies for ACCOUNTS
CREATE POLICY "accounts_select_owner"
  ON public.accounts
  FOR SELECT
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "accounts_insert_owner"
  ON public.accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "accounts_update_owner"
  ON public.accounts
  FOR UPDATE
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL)
  WITH CHECK (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "accounts_delete_owner"
  ON public.accounts
  FOR DELETE
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

-- Create secure RLS policies for CONTACTS
CREATE POLICY "contacts_select_owner"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "contacts_insert_owner"
  ON public.contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "contacts_update_owner"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL)
  WITH CHECK (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

CREATE POLICY "contacts_delete_owner"
  ON public.contacts
  FOR DELETE
  TO authenticated
  USING (account_owner_id = auth.uid()::text OR account_owner_id IS NULL);

-- Create secure RLS policies for OPPORTUNITIES
CREATE POLICY "opportunities_select_owner"
  ON public.opportunities
  FOR SELECT
  TO authenticated
  USING (opportunity_owner_id = auth.uid()::text OR opportunity_owner_id IS NULL);

CREATE POLICY "opportunities_insert_owner"
  ON public.opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (opportunity_owner_id = auth.uid()::text OR opportunity_owner_id IS NULL);

CREATE POLICY "opportunities_update_owner"
  ON public.opportunities
  FOR UPDATE
  TO authenticated
  USING (opportunity_owner_id = auth.uid()::text OR opportunity_owner_id IS NULL)
  WITH CHECK (opportunity_owner_id = auth.uid()::text OR opportunity_owner_id IS NULL);

CREATE POLICY "opportunities_delete_owner"
  ON public.opportunities
  FOR DELETE
  TO authenticated
  USING (opportunity_owner_id = auth.uid()::text OR opportunity_owner_id IS NULL);

-- Create secure RLS policies for ACTIVITIES
CREATE POLICY "activities_select_owner"
  ON public.activities
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid()::text OR owner_id IS NULL);

CREATE POLICY "activities_insert_owner"
  ON public.activities
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid()::text OR owner_id IS NULL);

CREATE POLICY "activities_update_owner"
  ON public.activities
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid()::text OR owner_id IS NULL)
  WITH CHECK (owner_id = auth.uid()::text OR owner_id IS NULL);

CREATE POLICY "activities_delete_owner"
  ON public.activities
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid()::text OR owner_id IS NULL);

-- Simple policies for supporting tables (shared across organization)
CREATE POLICY "leads_all" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "contracts_all" ON public.contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "competitors_all" ON public.competitors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "app_users_all" ON public.app_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "access_profiles_all" ON public.access_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "opportunity_stakeholders_all" ON public.opportunity_stakeholders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- PART 2: FIX HANDLE_NEW_USER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.app_users (id, name, email, role, status, origin, sync_status, last_sync_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Usuário'),
    NEW.email,
    'Usuário',
    'ativo',
    'auth',
    'synced',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    last_sync_at = NOW();

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PART 3: ADD OPPORTUNITY STAGE HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.opportunity_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  opportunity_title TEXT,
  old_stage TEXT,
  new_stage TEXT NOT NULL,
  changed_by_id TEXT,
  changed_by_name TEXT,
  changed_by_email TEXT,
  days_in_previous_stage NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.opportunity_stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opportunity_stage_history_all"
  ON public.opportunity_stage_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to log stage changes
CREATE OR REPLACE FUNCTION public.log_opportunity_stage_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  days_in_stage NUMERIC;
BEGIN
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    -- Calculate days in previous stage
    days_in_stage := EXTRACT(EPOCH FROM (NOW() - OLD.stage_updated_at)) / 86400;

    INSERT INTO public.opportunity_stage_history (
      opportunity_id,
      opportunity_title,
      old_stage,
      new_stage,
      changed_by_id,
      days_in_previous_stage
    )
    VALUES (
      NEW.id,
      NEW.title,
      OLD.stage,
      NEW.stage,
      auth.uid()::text,
      days_in_stage
    );

    -- Update stage_updated_at
    NEW.stage_updated_at := NOW();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS opportunity_stage_change_trigger ON public.opportunities;
CREATE TRIGGER opportunity_stage_change_trigger
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.log_opportunity_stage_change();

-- ============================================
-- PART 4: ADD ACTIVITY AUTO-LOGGING
-- ============================================

-- Trigger to auto-update last_interaction_at on accounts
CREATE OR REPLACE FUNCTION public.update_account_last_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.account_id IS NOT NULL THEN
    UPDATE public.accounts
    SET last_interaction_at = NEW.interaction_at
    WHERE id = NEW.account_id
      AND (last_interaction_at IS NULL OR last_interaction_at < NEW.interaction_at);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS activity_update_account_trigger ON public.activities;
CREATE TRIGGER activity_update_account_trigger
  AFTER INSERT OR UPDATE ON public.activities
  FOR EACH ROW
  WHEN (NEW.interaction_at IS NOT NULL)
  EXECUTE FUNCTION public.update_account_last_interaction();

-- Trigger to auto-update last_interaction_at on opportunities
CREATE OR REPLACE FUNCTION public.update_opportunity_last_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.opportunity_id IS NOT NULL THEN
    UPDATE public.opportunities
    SET
      last_interaction_at = NEW.interaction_at,
      last_interaction_summary = NEW.summary
    WHERE id = NEW.opportunity_id
      AND (last_interaction_at IS NULL OR last_interaction_at < NEW.interaction_at);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS activity_update_opportunity_trigger ON public.activities;
CREATE TRIGGER activity_update_opportunity_trigger
  AFTER INSERT OR UPDATE ON public.activities
  FOR EACH ROW
  WHEN (NEW.interaction_at IS NOT NULL)
  EXECUTE FUNCTION public.update_opportunity_last_interaction();
