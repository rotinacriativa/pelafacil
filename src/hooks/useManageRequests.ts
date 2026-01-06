import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { MatchPlayer, Profile } from '../types';

export interface ExtendedRequest extends MatchPlayer {
    profile: Profile;
    match: {
        id: string;
        location: string;
        date_time: string;
        group?: {
            name: string;
        };
    };
}

export function useManageRequests() {
    const { session } = useAuth();
    const [requests, setRequests] = useState<ExtendedRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchRequests();
        }
    }, [session]);

    async function fetchRequests() {
        try {
            setLoading(true);

            // 1. Get groups owned by user
            const { data: groups } = await supabase
                .from('groups')
                .select('id')
                .eq('owner_id', session?.user.id);

            if (!groups?.length) {
                setRequests([]);
                return;
            }

            const groupIds = groups.map(g => g.id);

            // 2. Get matches for these groups
            const { data: matches } = await supabase
                .from('matches')
                .select('id')
                .in('group_id', groupIds)
                .eq('status', 'scheduled');

            if (!matches?.length) {
                setRequests([]);
                return;
            }

            const matchIds = matches.map(m => m.id);

            // 3. Get pending requests for these matches
            const { data, error } = await supabase
                .from('match_players')
                .select(`
                    *,
                    match:matches(id, location, date_time, group:groups(name))
                `)
                .in('match_id', matchIds)
                .eq('status', 'requested')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data as any || []);

        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(requestId: string, matchId: string, status: 'approved' | 'declined') {
        try {
            const { error } = await supabase
                .from('match_players')
                .update({ status })
                .eq('user_id', requestId) // In match_players, user_id is the PK part 1
                .eq('match_id', matchId); // PK part 2

            if (error) throw error;

            // Remove from local state
            setRequests(prev => prev.filter(r => !(r.user_id === requestId && r.match_id === matchId)));
            return true;
        } catch (error) {
            console.error(`Error ${status} request:`, error);
            return false;
        }
    }

    return {
        requests,
        loading,
        approveRequest: (uid: string, mid: string) => handleAction(uid, mid, 'approved'),
        declineRequest: (uid: string, mid: string) => handleAction(uid, mid, 'declined'),
        refetch: fetchRequests
    };
}
