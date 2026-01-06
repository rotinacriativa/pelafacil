import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

export function usePendingRequestsCount() {
    const { session } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (session?.user) {
            fetchCount();
        }
    }, [session]);

    async function fetchCount() {
        try {
            // Get matches created by this user
            const { data: matches } = await supabase
                .from('matches')
                .select('id')
                .eq('status', 'scheduled'); // Only scheduled matches

            if (!matches || matches.length === 0) {
                setCount(0);
                return;
            }

            const matchIds = matches.map(m => m.id);

            // Count pending requests for these matches
            const { count: pendingCount, error } = await supabase
                .from('match_players')
                .select('*', { count: 'exact', head: true })
                .in('match_id', matchIds)
                .eq('status', 'requested');

            if (error) throw error;
            setCount(pendingCount || 0);

        } catch (error) {
            console.error('Error fetching pending count:', error);
        }
    }

    return count;
}
