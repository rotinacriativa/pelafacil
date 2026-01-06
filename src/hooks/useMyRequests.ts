import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { MatchPlayer, Match } from '../types';

export interface MyRequest extends MatchPlayer {
    match: Match; // Joined match data
}

export function useMyRequests() {
    const { session } = useAuth();
    const [requests, setRequests] = useState<MyRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchMyRequests();
        }
    }, [session]);

    async function fetchMyRequests() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('match_players')
                .select(`
                    *,
                    match:matches (
                        *
                    )
                `)
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data as any || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }

    return { requests, loading, refetch: fetchMyRequests };
}
