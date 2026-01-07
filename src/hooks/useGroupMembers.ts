
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// Interface for the joined data
export interface GroupMemberProfile {
    user_id: string;
    role: 'admin' | 'member';
    joined_at: string;
    profile: {
        name: string;
        avatar_url: string | null;
        position: 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campo' | 'Atacante' | null;
        rating: number;
    };
}

export function useGroupMembers(groupId: string | undefined) {
    const [members, setMembers] = useState<GroupMemberProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async () => {
        if (!groupId) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    user_id,
                    role,
                    joined_at,
                    position,
                    rating,
                    profile:profiles (
                        name,
                        avatar_url
                    )
                `)
                .eq('group_id', groupId);

            if (error) throw error;

            console.log('Fetched members:', data); // Debug

            // Cast data to expected shape, handling overrides
            const formattedMembers = data.map((item: any) => ({
                user_id: item.user_id,
                role: item.role,
                joined_at: item.joined_at,
                profile: {
                    name: item.profile.name,
                    avatar_url: item.profile.avatar_url,
                    // Prefer group-specific position/rating, fallback to profile (though we are moving away from profile stats)
                    position: item.position || null, // Default to null if not set in group
                    rating: item.rating || 5.0
                }
            }));

            setMembers(formattedMembers);
        } catch (err: any) {
            console.error('Error fetching group members:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateMember = async (userId: string, updates: { position?: string | null; rating?: number; role?: 'admin' | 'member' }) => {
        if (!groupId) return;
        try {
            const { error } = await supabase
                .from('group_members')
                .update(updates)
                .eq('group_id', groupId)
                .eq('user_id', userId);

            if (error) throw error;
            await fetchMembers(); // Refresh list
        } catch (err: any) {
            console.error('Error updating member:', err);
            throw err;
        }
    };

    const removeMember = async (userId: string) => {
        if (!groupId) return;
        try {
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('user_id', userId);

            if (error) throw error;
            await fetchMembers(); // Refresh list
            return { error: null };
        } catch (err: any) {
            console.error('Error removing member:', err);
            return { error: err.message };
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [groupId]);

    return { members, loading, error, refreshMembers: fetchMembers, updateMember, removeMember };
}
