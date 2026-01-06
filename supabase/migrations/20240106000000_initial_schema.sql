-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS (Extends Supabase Auth)
-- Public profiles for every user
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    position TEXT CHECK (position IN ('Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante')),
    rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GROUPS (A "Pelada" group)
CREATE TABLE public.groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 0 for 8),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GROUP MEMBERS (Many-to-Many)
CREATE TABLE public.group_members (
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- 4. MATCHES (Partidas)
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    date_time TIMESTAMPTZ NOT NULL,
    max_players INTEGER DEFAULT 24,
    price_per_person DECIMAL(10,2) DEFAULT 0.00,
    status TEXT CHECK (status IN ('scheduled', 'finished', 'canceled')) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MATCH ROSTER & REQUESTS (Lista de Presença / Solicitações)
-- Handles functionality for: RosterManagement, ManageRequests, UserRequests, FinancialPage (is_paid)
CREATE TABLE public.match_players (
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('requested', 'approved', 'declined', 'waitlist')) DEFAULT 'requested',
    team TEXT CHECK (team IN ('A', 'B', 'C', 'D')) DEFAULT NULL, -- For TeamGenerator
    is_paid BOOLEAN DEFAULT FALSE, -- For FinancialPage
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (match_id, user_id)
);

-- 6. STATS (Future: StatsPage / Scoreboard)
-- Detailed stats per player per match
CREATE TABLE public.match_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    rating DECIMAL(2,1), -- Performance rating for that specific match
    mvp BOOLEAN DEFAULT FALSE
);

-- 7. FINANCIAL TRANSACTIONS (Future: Advanced Financials)
-- If we need to track expenses (field rental, equipment) separate from player payments
CREATE TABLE public.financial_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Simplified for MVP)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;

-- Basic Policy: Everything readable by authenticated users for now (Open community feel)
-- In production, we would tighten this to "only group members can see group matches"
CREATE POLICY "Public Read Access" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON public.groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public Read Access" ON public.matches FOR SELECT USING (auth.role() = 'authenticated');

-- Triggers for User Profile Creation
-- Automatically creates a profile entry when a new user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
