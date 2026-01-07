-- Create match_stats table
CREATE TABLE IF NOT EXISTS public.match_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    rating DECIMAL(2,1),
    mvp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id, user_id)
);

-- Enable RLS
ALTER TABLE public.match_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Access" ON public.match_stats FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Insert" ON public.match_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON public.match_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON public.match_stats FOR DELETE USING (auth.role() = 'authenticated');
