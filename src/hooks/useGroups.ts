
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Group {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    invite_code: string;
    created_at: string;
    role?: 'admin' | 'member'; // Augmented from join
}

export function useGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        if (!user) {
            setGroups([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch groups where the user is a member
            const { data, error } = await supabase
                .from('group_members')
                .select(`
          role,
          group:groups (
            id,
            name,
            description,
            owner_id,
            invite_code,
            created_at
          )
        `)
                .eq('user_id', user.id);

            if (error) throw error;

            // Transform data to flat Group objects
            const formattedGroups: Group[] = (data || [])
                .map((item: any) => ({
                    ...item.group,
                    role: item.role,
                }))
                .sort((a: Group, b: Group) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

            setGroups(formattedGroups);
        } catch (err: any) {
            console.error('Error fetching groups:', err);
            setError(err.message || 'Erro ao carregar grupos.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return { groups, loading, error, refreshGroups: fetchGroups };
}
