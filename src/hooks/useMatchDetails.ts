import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { Match, Profile } from '../types';

export interface MatchDetailData extends Match {
    group: {
        name: string;
        description: string;
        owner_id: string;
    };
    player_count: number;
    user_status: 'requested' | 'approved' | 'declined' | 'waitlist' | null;
}

export function useMatchDetails(matchId: string | undefined) {
    const { session } = useAuth();
    const [match, setMatch] = useState<MatchDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (matchId) {
            fetchMatchDetails();
        }
    }, [matchId, session]);

    async function fetchMatchDetails() {
        try {
            setLoading(true);

            // 1. Fetch Match + Group Info
            const { data: matchData, error: matchError } = await supabase
                .from('matches')
                .select(`
                    *,
                    group:groups (
                        name,
                        description,
                        owner_id
                    )
                `)
                .eq('id', matchId)
                .single();

            if (matchError) throw matchError;

            // 2. Fetch Player Count (Approved only)
            const { count, error: countError } = await supabase
                .from('match_players')
                .select('*', { count: 'exact', head: true })
                .eq('match_id', matchId)
                .eq('status', 'approved');

            if (countError) throw countError;

            // 3. Fetch Current User Status
            let userStatus = null;
            if (session?.user) {
                const { data: statusData } = await supabase
                    .from('match_players')
                    .select('status')
                    .eq('match_id', matchId)
                    .eq('user_id', session.user.id)
                    .single();

                if (statusData) userStatus = statusData.status;
            }

            setMatch({
                ...matchData,
                player_count: count || 0,
                user_status: userStatus
            } as MatchDetailData);

        } catch (err: any) {
            console.error('Error fetching match details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function requestEntry() {
        if (!session?.user || !matchId) return false;

        try {
            const { error } = await supabase
                .from('match_players')
                .insert({
                    match_id: matchId,
                    user_id: session.user.id,
                    status: 'requested'
                });

            if (error) throw error;

            // Refresh data to show new status
            await fetchMatchDetails();
            return true;

        } catch (err: any) {
            console.error('Error requesting entry:', err);
            alert('Erro ao pedir vaga: ' + err.message);
            return false;
        }
    }

    return { match, loading, error, requestEntry, refetch: fetchMatchDetails };
}
