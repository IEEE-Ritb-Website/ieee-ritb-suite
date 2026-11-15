-- Supabase Schema for Winter of Code (woc-service)
-- Run this in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    tagline TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_desc TEXT NOT NULL,
    long_desc TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    stipend_details JSONB,
    skills JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    coordinator JSONB,
    duration JSONB,
    difficulty TEXT,
    eligibility JSONB,
    application_deadline TIMESTAMPTZ,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Registrations / Applications Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    project_slug TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant JSONB NOT NULL,
    proposal JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_project_participant UNIQUE (project_id, participant_email)
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_registrations_project ON public.registrations(project_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(participant_email);

-- Ensure full access for the anon key across all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all on organizations" ON public.organizations;
CREATE POLICY "Allow anon all on organizations" ON public.organizations FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on projects" ON public.projects;
CREATE POLICY "Allow anon all on projects" ON public.projects FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on registrations" ON public.registrations;
CREATE POLICY "Allow anon all on registrations" ON public.registrations FOR ALL TO anon USING (true) WITH CHECK (true);
