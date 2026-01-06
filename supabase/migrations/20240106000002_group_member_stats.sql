-- Add group-specific position and rating to group_members
ALTER TABLE public.group_members 
ADD COLUMN IF NOT EXISTS position TEXT CHECK (position IN ('Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante')),
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0;

-- Update RLS to allow owners/admins to update these columns
-- (Existing policies might cover this, but best to be sure owners can update members)
-- We'll rely on the existing "Owner Add Members" and generic update policies if they exist, 
-- or ensure we have a policy for updating members.

-- Let's check existing policies in initial_schema.sql. 
-- "Owner Add Members" is INSERT only.
-- "Members View Members" is SELECT.
-- We need a policy for UPDATE.

CREATE POLICY "Owner Update Members" ON public.group_members FOR UPDATE USING (
  EXISTS (
     SELECT 1 FROM public.groups 
     WHERE id = group_id 
     AND owner_id = auth.uid()
  )
);

-- Also allow admins? Logic says yes, but let's stick to Owner/Admin role check if possible.
-- The policy above checks if the auth user is the OWNER of the GROUP.
-- If we want "Admins" (role='admin' in group_members) to also update:

CREATE POLICY "Admins Update Members" ON public.group_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);
