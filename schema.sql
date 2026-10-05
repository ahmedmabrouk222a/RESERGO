-- Academic Research Assessment & Questionnaire System SQL Schema
-- Copy and paste this script directly into Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Participants & Demographics Table
CREATE TABLE IF NOT EXISTS public.participants (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    age TEXT NOT NULL,
    sex TEXT NOT NULL,
    academic_major TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    daily_screen_time NUMERIC DEFAULT 0,
    weekly_lab_clinical_hours NUMERIC DEFAULT 0,
    vas_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NDI Questionnaire Responses Table
CREATE TABLE IF NOT EXISTS public.ndi_responses (
    id BIGSERIAL PRIMARY KEY,
    participant_id TEXT REFERENCES public.participants(id) ON DELETE CASCADE,
    section_number INT NOT NULL,
    section_name TEXT NOT NULL,
    selected_option_index INT,
    is_applicable BOOLEAN DEFAULT TRUE
);

-- 3. DASS-21 Questionnaire Responses Table
CREATE TABLE IF NOT EXISTS public.dass_responses (
    id BIGSERIAL PRIMARY KEY,
    participant_id TEXT REFERENCES public.participants(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    score INT NOT NULL,
    category TEXT NOT NULL
);

-- 4. Ergonomic Risk Questionnaire Responses Table
CREATE TABLE IF NOT EXISTS public.ergonomic_responses (
    id BIGSERIAL PRIMARY KEY,
    participant_id TEXT REFERENCES public.participants(id) ON DELETE CASCADE,
    laptop_score INT DEFAULT 0,
    posture_score INT DEFAULT 0,
    breaks_score INT DEFAULT 0,
    chair_score INT DEFAULT 0
);

-- 5. Complete Calculated Results Table
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id BIGSERIAL PRIMARY KEY,
    participant_id TEXT REFERENCES public.participants(id) ON DELETE CASCADE,
    ndi_score INT,
    ndi_max_score INT,
    ndi_percentage NUMERIC,
    ndi_severity TEXT,
    depression_raw INT,
    depression_score INT,
    depression_percentage NUMERIC,
    depression_severity TEXT,
    anxiety_raw INT,
    anxiety_score INT,
    anxiety_percentage NUMERIC,
    anxiety_severity TEXT,
    stress_raw INT,
    stress_score INT,
    stress_percentage NUMERIC,
    stress_severity TEXT,
    ergo_score INT,
    ergo_max_score INT,
    ergo_percentage NUMERIC,
    ergo_severity TEXT
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for Anonymous Submissions
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndi_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dass_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ergonomic_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts & selects (Public survey submission & Admin view)
CREATE POLICY "Allow public insert to participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from participants" ON public.participants FOR SELECT USING (true);

CREATE POLICY "Allow public insert to ndi_responses" ON public.ndi_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from ndi_responses" ON public.ndi_responses FOR SELECT USING (true);

CREATE POLICY "Allow public insert to dass_responses" ON public.dass_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from dass_responses" ON public.dass_responses FOR SELECT USING (true);

CREATE POLICY "Allow public insert to ergonomic_responses" ON public.ergonomic_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from ergonomic_responses" ON public.ergonomic_responses FOR SELECT USING (true);

CREATE POLICY "Allow public insert to assessment_results" ON public.assessment_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from assessment_results" ON public.assessment_results FOR SELECT USING (true);
