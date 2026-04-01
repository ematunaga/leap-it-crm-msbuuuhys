-- CREATE CRM TABLES
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trading_name TEXT,
    cnpj TEXT,
    state_registration TEXT,
    headquarters_address TEXT,
    headquarters_city TEXT,
    headquarters_state TEXT,
    headquarters_zip TEXT,
    branches JSONB DEFAULT '[]'::jsonb,
    segment TEXT,
    porte TEXT,
    industry TEXT,
    website TEXT,
    linkedin TEXT,
    phone TEXT,
    email TEXT,
    status TEXT,
    account_tier TEXT,
    account_potential NUMERIC,
    relationship_status TEXT,
    account_health TEXT,
    current_environment TEXT,
    current_vendors JSONB DEFAULT '[]'::jsonb,
    main_pain TEXT,
    strategic_notes TEXT,
    last_interaction_at TIMESTAMPTZ,
    next_action_date TIMESTAMPTZ,
    white_space_notes TEXT,
    account_owner_id UUID,
    account_owner_email TEXT,
    account_owner_name TEXT,
    notes TEXT,
    logo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    position TEXT,
    linkedin TEXT,
    avatar_url TEXT,
    birthday TEXT,
    important_dates JSONB DEFAULT '[]'::jsonb,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    account_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    zip_code TEXT,
    relationship_status TEXT,
    preferred_channel TEXT,
    relationship_strength TEXT,
    communication_style TEXT,
    influence_level_global TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    account_owner_id UUID,
    account_owner_email TEXT,
    account_owner_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    account_name TEXT,
    primary_contact_id UUID,
    primary_contact_name TEXT,
    opportunity_owner_id TEXT,

    value NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'BRL',
    value_usd NUMERIC,
    dollar_rate NUMERIC,
    sale_type TEXT,
    mrr_value NUMERIC,
    modality TEXT,
    commission_percent NUMERIC,
    partner TEXT,
    solution_type TEXT,
    stage TEXT,
    expected_close_date TIMESTAMPTZ,
    source TEXT,
    priority TEXT,

    identified_pain TEXT,
    business_impact TEXT,
    decision_criteria TEXT,
    decision_process TEXT,
    budget_status TEXT,
    authority_status TEXT,
    timing_status TEXT,

    champion_status TEXT,
    champion_contact_id UUID,
    economic_buyer_status TEXT,
    economic_buyer_contact_id UUID,
    decision_maker_status TEXT,
    decision_maker_contact_id UUID,

    temperature TEXT,
    win_probability NUMERIC,
    risk_level TEXT,
    next_step TEXT,
    next_step_date TIMESTAMPTZ,
    last_interaction_at TIMESTAMPTZ,
    last_interaction_summary TEXT,
    days_in_stage NUMERIC,
    stage_updated_at TIMESTAMPTZ,
    status_follow_up TEXT,
    is_overdue BOOLEAN DEFAULT false,

    main_competitor_id TEXT,
    main_competitor_name TEXT,
    competitive_position TEXT,

    client_budget NUMERIC,
    budget_margin NUMERIC,
    total_cost NUMERIC,
    fator_leapit NUMERIC,
    product_type TEXT,
    icms_hardware_percent NUMERIC,
    ipi_percent NUMERIC,
    iss_hardware_percent NUMERIC,
    icms_software_percent NUMERIC,
    pis_cofins_percent NUMERIC,
    iss_software_percent NUMERIC,
    seller_commission_percent NUMERIC,
    net_margin_percent NUMERIC,
    distributor TEXT,

    deal_registration BOOLEAN DEFAULT false,
    loss_reason TEXT,
    loss_reason_detail TEXT,
    forecast_category TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id TEXT,
    owner_email TEXT,
    owner_name TEXT,

    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    account_name TEXT,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    contact_name TEXT,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    opportunity_title TEXT,
    lead_id TEXT,

    type TEXT,
    channel TEXT,
    subject TEXT NOT NULL,
    summary TEXT,
    details TEXT,

    outcome TEXT,
    engagement_level TEXT,

    interaction_at TIMESTAMPTZ,
    scheduled_date TIMESTAMPTZ,
    next_step_date TIMESTAMPTZ,

    status TEXT,
    priority TEXT,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    is_overdue BOOLEAN DEFAULT false,

    duration_minutes NUMERIC,
    location TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,

    objections TEXT,
    customer_signals TEXT,
    next_step TEXT,

    source_entity TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    notes TEXT,

    related_to TEXT,
    related_id TEXT,
    date TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.access_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    status TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    role TEXT,
    profile_id UUID REFERENCES public.access_profiles(id) ON DELETE SET NULL,
    avatar_url TEXT,
    status TEXT,
    origin TEXT,
    sync_status TEXT,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    status TEXT,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    strength TEXT,
    weakness TEXT,
    win_rate TEXT
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    mrr NUMERIC,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT
);

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

-- ENABLE ROW LEVEL SECURITY FOR ALL TABLES
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_all" ON public.%I;', t);
    EXECUTE format('CREATE POLICY "authenticated_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- INSERT SEED DATA
DO $$
DECLARE
    a1 UUID := '11111111-1111-1111-1111-111111111111';
    a2 UUID := '22222222-2222-2222-2222-222222222222';
    c1 UUID := '33333333-3333-3333-3333-333333333333';
    c2 UUID := '44444444-4444-4444-4444-444444444444';
    o1 UUID := '55555555-5555-5555-5555-555555555555';
    o2 UUID := '66666666-6666-6666-6666-666666666666';
    p1 UUID := '77777777-7777-7777-7777-777777777777';
    u1 UUID := '88888888-8888-8888-8888-888888888888';
    act1 UUID := '99999999-9999-9999-9999-999999999999';
BEGIN
    -- Ensure Auth User exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ematunaga@gmail.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
        VALUES (u1, '00000000-0000-0000-0000-000000000000', 'ematunaga@gmail.com', crypt('securepassword123', gen_salt('bf')), 'authenticated', 'authenticated', NOW(), NOW(), '', '', '', '', '', '', '', '');
    ELSE
        SELECT id INTO u1 FROM auth.users WHERE email = 'ematunaga@gmail.com' LIMIT 1;
    END IF;

    -- Profiles
    INSERT INTO public.access_profiles (id, name, type, status, permissions)
    VALUES (p1, 'Administrador Global', 'sistema', 'ativo', '{"dashboard": {"visualizar": true}}'::jsonb)
    ON CONFLICT (id) DO NOTHING;

    -- App Users
    INSERT INTO public.app_users (id, name, email, role, profile_id, status, origin, sync_status)
    VALUES (u1, 'Admin LeapIT', 'ematunaga@gmail.com', 'Administrador Global', p1, 'ativo', 'crm', 'synced')
    ON CONFLICT (id) DO NOTHING;

    -- Accounts
    INSERT INTO public.accounts (id, name, segment, porte, account_tier, status, account_health, relationship_status, logo)
    VALUES
    (a1, 'Stark Industries', 'industria', '10001+', 'ouro', 'ativa', 'saudavel', 'estabelecido', 'https://img.usecurling.com/i?q=stark&shape=fill&color=azure'),
    (a2, 'Wayne Enterprises', 'servico', '10001+', 'platina', 'ativa', 'saudavel', 'estabelecido', 'https://img.usecurling.com/i?q=wayne&shape=fill&color=black')
    ON CONFLICT (id) DO NOTHING;

    -- Contacts
    INSERT INTO public.contacts (id, account_id, name, position, email, phone, influence_level_global, relationship_strength)
    VALUES
    (c1, a1, 'Tony Stark', 'CEO', 'tony@stark.com', '11999999999', 'alto', 'forte'),
    (c2, a1, 'Pepper Potts', 'COO', 'pepper@stark.com', '11999999998', 'alto', 'forte')
    ON CONFLICT (id) DO NOTHING;

    -- Opportunities
    INSERT INTO public.opportunities (id, account_id, title, value, currency, sale_type, modality, partner, stage, temperature, next_step, next_step_date, expected_close_date)
    VALUES
    (o1, a1, 'Migração ERP Global', 2500000, 'BRL', 'one_shot', 'revenda', 'aws', 'proposta_enviada', 'quente', 'Aprovação do Board', NOW() + interval '10 days', NOW() + interval '30 days'),
    (o2, a2, 'Auditoria de Segurança', 500000, 'USD', 'recorrente', 'agenciamento', 'fortinet', 'qualificacao', 'morna', 'Demo técnica', NOW() + interval '2 days', NOW() + interval '15 days')
    ON CONFLICT (id) DO NOTHING;

    -- Opportunity Stakeholders
    INSERT INTO public.opportunity_stakeholders (id, opportunity_id, account_id, contact_id, contact_name, role, influence_level, stance, is_champion, is_decision_maker)
    VALUES
    (gen_random_uuid(), o1, a1, c1, 'Tony Stark', 'decision_maker', 'alto', 'favoravel', true, true)
    ON CONFLICT (id) DO NOTHING;

    -- Activities
    INSERT INTO public.activities (id, account_id, opportunity_id, subject, summary, type, channel, status, scheduled_date)
    VALUES
    (act1, a1, o1, 'Apresentação da proposta', 'Apresentação comercial e técnica da proposta.', 'meeting', 'reuniao_online', 'concluida', NOW() - interval '1 day')
    ON CONFLICT (id) DO NOTHING;

END $$;
