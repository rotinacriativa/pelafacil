
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export interface Player {
    id: string;
    name: string;
    position: string;
    rating?: number;
    avatar?: string;
    is_active?: boolean;
}

export function usePlayers() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .order('name');

            if (error) throw error;
            setPlayers(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { players, loading, error, refetch: fetchPlayers };
}
