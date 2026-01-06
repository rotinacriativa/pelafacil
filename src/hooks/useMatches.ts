import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Match } from '../types';

export function useMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [nextMatch, setNextMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    async function fetchMatches() {
        try {
            setLoading(true);

            // Fetch upcoming matches
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('date_time', { ascending: true }); // Get closest dates first

            if (error) throw error;

            const fetchedMatches = (data as Match[]) || [];
            setMatches(fetchedMatches);

            // Find the first match that is scheduled
            const upcoming = fetchedMatches.find(m => m.status === 'scheduled');
            setNextMatch(upcoming || null);

        } catch (err: any) {
            console.error('Error fetching matches:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { matches, nextMatch, loading, error, refetch: fetchMatches };
}
