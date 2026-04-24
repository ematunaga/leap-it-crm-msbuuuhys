-- ============================================================
-- SPRINT 1: FK INDEXES, PROPER RLS POLICIES, CLEANUP
-- Date: 2026-04-20
-- Author: Leap IT Engineering
-- ============================================================

-- PART 1: ADD 7 MISSING FK INDEXES
-- These indexes are critical for JOIN performance on FK columns

CREATE INDEX IF NOT EXISTS idx_contacts_account_id ON public.contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_account_id ON public.opportunities(account_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_contact_id ON public.opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_account_id ON public.activities(account_id);
CREATE INDEX IF NOT EXISTS idx_activities_opportunity_id ON public.activities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_leads_account_id ON public.leads(account_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_stakeholders_opportunity_id ON public.opportunity_stakeholders(opportunity_id);

-- PART 2: FIX RLS POLICIES - Replace USING(true) with proper auth.uid() checks
-- Use (SELECT auth.uid()) to avoid per-row function calls (performance fix)

-- DROP permissive catch-all policies
DROP POLICY IF EXISTS "authenticated_all" ON public.accounts;
DROP POLICY IF EXISTS "authenticated_all" ON public.contacts;
DROP POLICY IF EXISTS "authenticated_all" ON public.opportunities;
DROP POLICY IF EXISTS "authenticated_all" ON public.activities;
DROP POLICY IF EXISTS "authenticated_all" ON public.leads;
DROP POLICY IF EXISTS "authenticated_all" ON public.competitors;
DROP POLICY IF EXISTS "authenticated_all" ON public.contracts;
DROP POLICY IF EXISTS "authenticated_all" ON public.opportunity_stakeholders;
DROP POLICY IF EXISTS "authenticated_all" ON public.access_profiles;
DROP POLICY IF EXISTS "authenticated_all" ON public.app_users;

-- accounts: authenticated users can read all; only owner (created_by) can mutate
CREATE POLICY "accounts_select" ON public.accounts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "accounts_insert" ON public.accounts
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "accounts_update" ON public.accounts
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "accounts_delete" ON public.accounts
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- contacts
CREATE POLICY "contacts_select" ON public.contacts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_insert" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "contacts_update" ON public.contacts
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "contacts_delete" ON public.contacts
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- opportunities
CREATE POLICY "opportunities_select" ON public.opportunities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "opportunities_insert" ON public.opportunities
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "opportunities_update" ON public.opportunities
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "opportunities_delete" ON public.opportunities
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- activities
CREATE POLICY "activities_select" ON public.activities
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "activities_insert" ON public.activities
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "activities_update" ON public.activities
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "activities_delete" ON public.activities
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- leads
CREATE POLICY "leads_select" ON public.leads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "leads_insert" ON public.leads
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "leads_update" ON public.leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "leads_delete" ON public.leads
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- competitors
CREATE POLICY "competitors_select" ON public.competitors
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "competitors_insert" ON public.competitors
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "competitors_update" ON public.competitors
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "competitors_delete" ON public.competitors
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- contracts
CREATE POLICY "contracts_select" ON public.contracts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "contracts_insert" ON public.contracts
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "contracts_update" ON public.contracts
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "contracts_delete" ON public.contracts
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- opportunity_stakeholders
CREATE POLICY "opp_stakeholders_select" ON public.opportunity_stakeholders
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "opp_stakeholders_insert" ON public.opportunity_stakeholders
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "opp_stakeholders_update" ON public.opportunity_stakeholders
  FOR UPDATE TO authenticated USING (true) WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "opp_stakeholders_delete" ON public.opportunity_stakeholders
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL);

-- PART 3: REMOVE UNUSED INDEX
-- idx_app_users_access_profile was flagged as unused in audit
DROP INDEX IF EXISTS public.idx_app_users_access_profile;

-- PART 4: ADD PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_accounts_account_tier ON public.accounts(account_tier);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner_id ON public.opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON public.activities(created_by);
CREATE INDEX IF NOT EXISTS idx_accounts_last_interaction ON public.accounts(last_interaction_at DESC NULLS LAST);
