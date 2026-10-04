-- =========================================================
-- ACADEMIC RESEARCH ASSESSMENT DATABASE SCHEMA
-- Supabase PostgreSQL tables & Row Level Security (RLS) policies
-- =========================================================

-- 1. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    age INT NOT NULL,
    sex TEXT NOT NULL,
    academic_major TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    daily_screen_time NUMERIC(4, 1) NOT NULL,
    weekly_lab_clinical_hours NUMERIC(4, 1) NOT NULL,
    vas_score INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NDI RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.ndi_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    section_number INT NOT NULL,
    section_name TEXT NOT NULL,
    selected_option_index INT,
    is_applicable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DASS RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.dass_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    score INT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ERGONOMIC RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.ergonomic_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    laptop_score INT NOT NULL,
    posture_score INT NOT NULL,
    breaks_score INT NOT NULL,
    chair_score INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CALCULATED RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    
    -- NDI
    ndi_score INT NOT NULL,
    ndi_max_score INT NOT NULL,
    ndi_percentage NUMERIC(5, 1) NOT NULL,
    ndi_severity TEXT NOT NULL,
    
    -- DASS-21 Depression
    depression_raw INT NOT NULL,
    depression_score INT NOT NULL,
    depression_percentage NUMERIC(5, 1) NOT NULL,
    depression_severity TEXT NOT NULL,
    
    -- DASS-21 Anxiety
    anxiety_raw INT NOT NULL,
    anxiety_score INT NOT NULL,
    anxiety_percentage NUMERIC(5, 1) NOT NULL,
    anxiety_severity TEXT NOT NULL,
    
    -- DASS-21 Stress
    stress_raw INT NOT NULL,
    stress_score INT NOT NULL,
    stress_percentage NUMERIC(5, 1) NOT NULL,
    stress_severity TEXT NOT NULL,
    
    -- Ergonomics
    ergo_score INT NOT NULL,
    ergo_max_score INT NOT NULL,
    ergo_percentage NUMERIC(5, 1) NOT NULL,
    ergo_severity TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndi_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dass_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ergonomic_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous participants to insert new submissions
CREATE POLICY "Allow public insert for participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for ndi" ON public.ndi_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for dass" ON public.dass_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for ergo" ON public.ergonomic_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for results" ON public.assessment_results FOR INSERT WITH CHECK (true);

-- Allow authenticated admins full select / read access
CREATE POLICY "Allow admin read participants" ON public.participants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin read ndi" ON public.ndi_responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin read dass" ON public.dass_responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin read ergo" ON public.ergonomic_responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin read results" ON public.assessment_results FOR SELECT USING (auth.role() = 'authenticated');
