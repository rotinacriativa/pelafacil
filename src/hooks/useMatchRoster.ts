import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { PlayerForBalancing } from '../utils/teamBalancer';

export function useMatchRoster(matchId: string | undefined) {
    const [roster, setRoster] = useState<PlayerForBalancing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (matchId) {
            fetchRoster();
        }
    }, [matchId]);

    async function fetchRoster() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('match_players')
                .select(`
                    match_id,
                    user_id,
                    status,
                    team,
                    is_paid,
                    profile:profiles (
                        name,
                        position,
                        rating,
                        avatar_url
                    )
                `)
                .eq('match_id', matchId)
                .eq('status', 'approved');

            if (error) throw error;

            // Map to Flat Structure
            const formatted: PlayerForBalancing[] = data.map((item: any) => ({
                match_id: item.match_id,
                user_id: item.user_id,
                status: item.status,
                team: item.team,
                is_paid: item.is_paid,
                // Flatten Profile
                name: item.profile?.name || 'Jogador',
                position: item.profile?.position || 'Linha',
                rating: item.profile?.rating || 5.0,
                profile: item.profile
            }));

            setRoster(formatted);

        } catch (err: any) {
            console.error('Error fetching roster:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { roster, loading, error, refetch: fetchRoster };
}
