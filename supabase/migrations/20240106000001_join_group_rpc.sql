
-- RPC Functions for Join Group Flow

-- 1. Get Group by Invite Code (Publicly accessible securely)
-- Returns only basic info if code exists
CREATE OR REPLACE FUNCTION public.get_group_by_invite(invite_code_input TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    owner_name TEXT,
    created_at TIMESTAMPTZ,
    member_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.name,
        g.description,
        p.name as owner_name,
        g.created_at,
        (SELECT COUNT(*) FROM public.group_members gm WHERE gm.group_id = g.id) as member_count
    FROM public.groups g
    JOIN public.profiles p ON p.id = g.owner_id
    WHERE g.invite_code = invite_code_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Join Group via Invite (Authenticated Users only)
CREATE OR REPLACE FUNCTION public.join_group_via_invite(invite_code_input TEXT)
RETURNS UUID AS $$
DECLARE
    target_group_id UUID;
BEGIN
    -- Get group from code
    SELECT id INTO target_group_id
    FROM public.groups
    WHERE invite_code = invite_code_input;

    IF target_group_id IS NULL THEN
        RAISE EXCEPTION 'Invalid invite code';
    END IF;

    -- Check if already a member
    IF EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = target_group_id 
        AND user_id = auth.uid()
    ) THEN
        RETURN target_group_id; -- Already member, just return ID
    END IF;

    -- Insert new member
    INSERT INTO public.group_members (group_id, user_id, role)
    VALUES (target_group_id, auth.uid(), 'member');

    RETURN target_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
