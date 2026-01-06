import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { Profile } from '../types';

export interface GroupMember extends Profile {
    role: 'admin' | 'member';
    joined_at: string;
}

export function useGroupMembers() {
    const { session } = useAuth();
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchMembers();
        }
    }, [session]);

    async function fetchMembers() {
        try {
            setLoading(true);

            // 1. Find the user's primary group (owned by them)
            // For MVP, we assume the user manages their own group.
            const { data: groups } = await supabase
                .from('groups')
                .select('id')
                .eq('owner_id', session?.user.id)
                .limit(1);

            if (!groups?.length) {
                setMembers([]);
                return;
            }

            const groupId = groups[0].id;

            // 2. Fetch members of this group
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    role,
                    joined_at,
                    user:profiles (
                        id,
                        name,
                        avatar_url,
                        position,
                        rating
                    )
                `)
                .eq('group_id', groupId);

            if (error) throw error;

            // Flatten structure
            const formattedMembers: GroupMember[] = data.map((item: any) => ({
                id: item.user.id,
                name: item.user.name,
                avatar_url: item.user.avatar_url,
                position: item.user.position || 'Meia', // Default fallback
                rating: item.user.rating || 5.0,
                role: item.role,
                joined_at: item.joined_at
            }));

            setMembers(formattedMembers);

        } catch (error) {
            console.error('Error fetching group members:', error);
        } finally {
            setLoading(false);
        }
    }

    async function removeMember(memberId: string) {
        // Logic to remove from group_members
        // For now, let's implemented a basic delete
        try {
            const { data: groups } = await supabase
                .from('groups')
                .select('id')
                .eq('owner_id', session?.user.id)
                .limit(1);

            if (!groups?.length) return;
            const groupId = groups[0].id;

            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('user_id', memberId);

            if (error) throw error;

            setMembers(prev => prev.filter(m => m.id !== memberId));
            return true;
        } catch (error) {
            console.error('Error removing member', error);
            return false;
        }
    }

    return { members, loading, removeMember, refetch: fetchMembers };
}
