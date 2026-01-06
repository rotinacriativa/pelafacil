-- Enable RLS on match_stats
ALTER TABLE public.match_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Group Members can view stats
-- A user can view stats if they are a member of the group that the match belongs to.
DROP POLICY IF EXISTS "Members View Stats" ON public.match_stats;
CREATE POLICY "Members View Stats" ON public.match_stats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_stats.match_id
    AND gm.user_id = auth.uid()
  )
);

-- Policy: Group Admins/Owners can manage (insert/update/delete) stats
-- A user can manage stats if they are an admin/owner of the group.
DROP POLICY IF EXISTS "Admins Manage Stats" ON public.match_stats;
CREATE POLICY "Admins Manage Stats" ON public.match_stats FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.group_members gm ON gm.group_id = m.group_id
    WHERE m.id = match_stats.match_id
    AND gm.user_id = auth.uid()
    AND (gm.role = 'admin' OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = m.group_id AND g.owner_id = auth.uid()))
  )
);
