-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS (Extends Supabase Auth)
-- Public profiles for every user
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    position TEXT CHECK (position IN ('Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante')),
    rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GROUPS (A "Pelada" group)
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT, -- Field/Venue location
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 0 for 8),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GROUP MEMBERS (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.group_members (
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- 4. MATCHES (Partidas)
CREATE TABLE IF NOT EXISTS public.matches (
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
CREATE TABLE IF NOT EXISTS public.match_players (
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
CREATE TABLE IF NOT EXISTS public.match_stats (
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
CREATE TABLE IF NOT EXISTS public.financial_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 8. TEAM GENERATOR (Phase 2)
CREATE TABLE IF NOT EXISTS public.match_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    team_number INTEGER NOT NULL CHECK (team_number IN (1, 2)),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.match_team_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_team_id UUID REFERENCES public.match_teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_team_id, player_id)
);

-- 9. FINANCIAL (Phase 3: MVP)
CREATE TABLE IF NOT EXISTS public.match_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    description TEXT,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id) -- Constraint: Only one expense record per match for MVP
);

CREATE TABLE IF NOT EXISTS public.match_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('PENDING', 'PAID')) DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    UNIQUE(match_id, player_id)
);

-- RLS POLICIES (Simplified for MVP)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_payments ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES: Publicly visible so users can find each other
DROP POLICY IF EXISTS "Public Profiles" ON public.profiles;
CREATE POLICY "Public Profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. GROUPS: Visible to members only (Privacy)
DROP POLICY IF EXISTS "Group Members View" ON public.groups;
CREATE POLICY "Group Members View" ON public.groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = id AND gm.user_id = auth.uid()
  )
);
-- Allow users to see groups they own even if not in members (though they should be)
DROP POLICY IF EXISTS "Owner View" ON public.groups;
CREATE POLICY "Owner View" ON public.groups FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
CREATE POLICY "Authenticated users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. GROUP MEMBERS: Visible to other members
-- Helper function to bypass RLS for membership check (Fixes infinite recursion)
CREATE OR REPLACE FUNCTION public.is_member_of(_group_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = _group_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Members View Members" ON public.group_members;
CREATE POLICY "Members View Members" ON public.group_members FOR SELECT USING (
  -- I can see my own membership
  user_id = auth.uid()
  OR
  -- I can see others if I am a member (using secure function)
  public.is_member_of(group_id)
);

-- Add Insert Policy (Group Owner can add members, including themselves)
DROP POLICY IF EXISTS "Owner Add Members" ON public.group_members;
CREATE POLICY "Owner Add Members" ON public.group_members FOR INSERT WITH CHECK (
  EXISTS (
     SELECT 1 FROM public.groups 
     WHERE id = group_id 
     AND owner_id = auth.uid()
  )
);

-- 4. MATCHES: Visible ONLY to group members
DROP POLICY IF EXISTS "Members View Matches" ON public.matches;
CREATE POLICY "Members View Matches" ON public.matches FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_id AND gm.user_id = auth.uid()
  )
);

-- 5. MATCH PLAYERS (Roster): Visible to group members
DROP POLICY IF EXISTS "Members View Roster" ON public.match_players;
CREATE POLICY "Members View Roster" ON public.match_players FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = (SELECT group_id FROM public.matches WHERE id = match_players.match_id) 
    AND gm.user_id = auth.uid()
  )
);

-- Allow Group Owner to update roster (e.g. approve requests, mark as paid)
DROP POLICY IF EXISTS "Owner Update Roster" ON public.match_players;
CREATE POLICY "Owner Update Roster" ON public.match_players FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.groups g ON g.id = m.group_id
    WHERE m.id = match_players.match_id
    AND g.owner_id = auth.uid()
  )
);

-- 8. TEAM GENERATOR (Phase 2)
DROP POLICY IF EXISTS "Members View Teams" ON public.match_teams;
CREATE POLICY "Members View Teams" ON public.match_teams FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_teams.match_id AND gm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owner Manage Teams" ON public.match_teams;
CREATE POLICY "Owner Manage Teams" ON public.match_teams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.groups g ON g.id = m.group_id
    WHERE m.id = match_teams.match_id AND g.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Members View Team Players" ON public.match_team_players;
CREATE POLICY "Members View Team Players" ON public.match_team_players FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.match_teams mt
    JOIN public.matches m ON m.id = mt.match_id
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE mt.id = match_team_players.match_team_id AND gm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owner Manage Team Players" ON public.match_team_players;
CREATE POLICY "Owner Manage Team Players" ON public.match_team_players FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.match_teams mt
    JOIN public.matches m ON m.id = mt.match_id
    JOIN public.groups g ON g.id = m.group_id
    WHERE mt.id = match_team_players.match_team_id AND g.owner_id = auth.uid()
  )
);

-- 9. FINANCIAL (Phase 3: MVP)
-- Expenses: Group Members View, Admin Edit
DROP POLICY IF EXISTS "Members View Expenses" ON public.match_expenses;
CREATE POLICY "Members View Expenses" ON public.match_expenses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_expenses.match_id AND gm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owner Manage Expenses" ON public.match_expenses;
CREATE POLICY "Owner Manage Expenses" ON public.match_expenses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.groups g ON g.id = m.group_id
    WHERE m.id = match_expenses.match_id AND g.owner_id = auth.uid()
  )
);

-- Payments: Admin Manages ALL, User Views OWN
DROP POLICY IF EXISTS "Owner Manage Payments" ON public.match_payments;
CREATE POLICY "Owner Manage Payments" ON public.match_payments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.groups g ON g.id = m.group_id
    WHERE m.id = match_payments.match_id AND g.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "User View Own Payments" ON public.match_payments;
CREATE POLICY "User View Own Payments" ON public.match_payments FOR SELECT USING (
  player_id = auth.uid()
);
-- Allow users to see all payments for transparency (optional, but requested in chat)
DROP POLICY IF EXISTS "User View All Payments" ON public.match_payments;
CREATE POLICY "User View All Payments" ON public.match_payments FOR SELECT USING (
     EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_payments.match_id AND gm.user_id = auth.uid()
  )
);

-- Automatically creates a profile entry when a new user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Drop trigger if exists to avoid error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Trigger to invalidate teams if a player leaves or status changes (e.g. approved -> decline)
CREATE OR REPLACE FUNCTION public.invalidate_match_teams()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        DELETE FROM public.match_teams WHERE match_id = OLD.match_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.status = 'approved' AND NEW.status != 'approved') THEN
             DELETE FROM public.match_teams WHERE match_id = NEW.match_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_match_player_change ON public.match_players;
CREATE TRIGGER on_match_player_change
  AFTER DELETE OR UPDATE ON public.match_players
  FOR EACH ROW EXECUTE PROCEDURE public.invalidate_match_teams();


-- LOGIC: Recalculate Payments Function
CREATE OR REPLACE FUNCTION public.recalculate_match_payments(target_match_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_amount NUMERIC;
    v_player_count INTEGER;
    v_share_amount NUMERIC;
    r RECORD;
BEGIN
    -- 1. Get Expense
    SELECT total_amount INTO v_total_amount 
    FROM public.match_expenses 
    WHERE match_id = target_match_id;

    -- If no expense, do nothing or cleanup?
    -- If no expense, we shouldn't have payments? strict MVP: leave as is or clear.
    -- Let's just return if no expense.
    IF v_total_amount IS NULL THEN
        RETURN;
    END IF;

    -- 2. Good Old Count
    SELECT COUNT(*) INTO v_player_count
    FROM public.match_players
    WHERE match_id = target_match_id AND status = 'approved';

    -- IF 0 PLAYERS: we must clear all payments for consistency
    IF v_player_count = 0 THEN
        DELETE FROM public.match_payments WHERE match_id = target_match_id;
        RETURN;
    END IF;

    -- 3. Calculate Share
    v_share_amount := v_total_amount / v_player_count;

    -- 4. Sync Payments
    -- A. Remove payments for players who are NO LONGER approved
    DELETE FROM public.match_payments 
    WHERE match_id = target_match_id 
    AND player_id NOT IN (
        SELECT user_id FROM public.match_players WHERE match_id = target_match_id AND status = 'approved'
    );

    -- B. Upsert payments for APPROVED players
    -- We want to preserve 'PAID' status if possible.
    FOR r IN (SELECT user_id FROM public.match_players WHERE match_id = target_match_id AND status = 'approved') LOOP
        INSERT INTO public.match_payments (match_id, player_id, amount, status)
        VALUES (target_match_id, r.user_id, v_share_amount, 'PENDING')
        ON CONFLICT (match_id, player_id) DO UPDATE
        SET amount = v_share_amount; -- Update amount, keep status
    END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- TRIGGER 1: On Expense Change -> Recalc
CREATE OR REPLACE FUNCTION public.trig_recalc_on_expense() RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.recalculate_match_payments(NEW.match_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_expense_change ON public.match_expenses;
CREATE TRIGGER on_expense_change
AFTER INSERT OR UPDATE ON public.match_expenses
FOR EACH ROW EXECUTE PROCEDURE public.trig_recalc_on_expense();


-- TRIGGER 2: On Roster Change -> Recalc
CREATE OR REPLACE FUNCTION public.trig_recalc_on_roster() RETURNS TRIGGER AS $$
DECLARE
    tgt_match_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        tgt_match_id := OLD.match_id;
    ELSE
        tgt_match_id := NEW.match_id;
    END IF;

    PERFORM public.recalculate_match_payments(tgt_match_id);
    RETURN NULL; -- After trigger, return ignored
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_roster_change_financial ON public.match_players;
CREATE TRIGGER on_roster_change_financial
AFTER INSERT OR UPDATE OR DELETE ON public.match_players
FOR EACH ROW EXECUTE PROCEDURE public.trig_recalc_on_roster();

-- 10. FIXES (Applied manually via Chat)

-- Allow Admins to Manage Matches (Fixes 42501 permission denied)
CREATE POLICY "Admins Create Matches" ON public.matches FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

CREATE POLICY "Admins Update Matches" ON public.matches FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

CREATE POLICY "Admins Delete Matches" ON public.matches FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

-- Allow Members to Join Matches (Fixes "Pedir Vaga" permission denied)
CREATE POLICY "Members Join Match" ON public.match_players FOR INSERT WITH CHECK (
  user_id = auth.uid() -- Can only add self
  AND
  EXISTS ( -- Must be member of the group
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_id
    AND gm.user_id = auth.uid()
  )
);

-- Allow Admins to Add Players to Matches
CREATE POLICY "Admins Add Players" ON public.match_players FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

