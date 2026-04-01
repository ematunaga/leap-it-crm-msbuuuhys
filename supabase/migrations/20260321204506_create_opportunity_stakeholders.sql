CREATE TABLE IF NOT EXISTS public.opportunity_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL,
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  contact_name TEXT,
  role TEXT NOT NULL,
  influence_level TEXT,
  seniority_level TEXT,
  stance TEXT,
  access_level TEXT,
  is_champion BOOLEAN DEFAULT false,
  is_economic_buyer BOOLEAN DEFAULT false,
  is_decision_maker BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP POLICY IF EXISTS "authenticated_all" ON public.opportunity_stakeholders;
CREATE POLICY "authenticated_all" ON public.opportunity_stakeholders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.opportunity_stakeholders ENABLE ROW LEVEL SECURITY;
