import { supabase } from './supabase';
import { MatchTeam, MatchTeamPlayer } from '../types';

export const teamService = {
    /**
     * Generates teams for a given match.
     * 1. Fetches approved players.
     * 2. Shuffles them.
     * 3. Splits into 2 balanced-count teams.
     * 4. Deletes existing teams.
     * 5. Inserts new teams and players.
     */
    async generateTeams(matchId: string): Promise<void> {
        // 1. Fetch Approved Players
        const { data: players, error: fetchError } = await supabase
            .from('match_players')
            .select('user_id')
            .eq('match_id', matchId)
            .eq('status', 'approved');

        if (fetchError) throw fetchError;
        if (!players || players.length < 2) {
            throw new Error('Mínimo de 2 jogadores aprovados para gerar times.');
        }

        // 2. Shuffle (Fisher-Yates)
        const shuffled = [...players];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 3. Split
        const mid = Math.ceil(shuffled.length / 2);
        const team1Players = shuffled.slice(0, mid);
        const team2Players = shuffled.slice(mid);

        // 4. Transaction-like Operations
        // Note: Supabase JS client doesn't support complex transactions easily without RPC.
        // For MVP/Phase 2, we will do sequential ops. If it fails, it might leave partial state.
        // Ideally, we wrap this in an RPC function in SQL, but requirement says "Simple".

        // A. Delete existing teams for this match (Cascade will kill players)
        await supabase.from('match_teams').delete().eq('match_id', matchId);

        // B. Create Team 1
        const { data: team1, error: t1Err } = await supabase
            .from('match_teams')
            .insert({ match_id: matchId, team_number: 1 })
            .select()
            .single();
        if (t1Err) throw t1Err;

        // C. Create Team 2
        const { data: team2, error: t2Err } = await supabase
            .from('match_teams')
            .insert({ match_id: matchId, team_number: 2 })
            .select()
            .single();
        if (t2Err) throw t2Err;

        // D. Insert Players
        const t1Inserts = team1Players.map(p => ({
            match_team_id: team1.id,
            player_id: p.user_id
        }));
        const t2Inserts = team2Players.map(p => ({
            match_team_id: team2.id,
            player_id: p.user_id
        }));

        if (t1Inserts.length > 0) {
            const { error: ins1Err } = await supabase.from('match_team_players').insert(t1Inserts);
            if (ins1Err) throw ins1Err;
        }

        if (t2Inserts.length > 0) {
            const { error: ins2Err } = await supabase.from('match_team_players').insert(t2Inserts);
            if (ins2Err) throw ins2Err;
        }
    },

    /**
     * Fetches the generated teams for a match.
     */
    async getTeams(matchId: string): Promise<{ team1: MatchTeamPlayer[], team2: MatchTeamPlayer[] }> {
        // Fetch Teams
        const { data: teams, error: teamsError } = await supabase
            .from('match_teams')
            .select('id, team_number')
            .eq('match_id', matchId);

        if (teamsError) throw teamsError;
        if (!teams || teams.length === 0) return { team1: [], team2: [] };

        // Fetch Players for these teams
        const teamIds = teams.map(t => t.id);
        const { data: players, error: playersError } = await supabase
            .from('match_team_players')
            .select(`
        *,
        profile:profiles(name, position, rating, avatar_url)
      `)
            .in('match_team_id', teamIds);

        if (playersError) throw playersError;

        const t1Id = teams.find(t => t.team_number === 1)?.id;
        const t2Id = teams.find(t => t.team_number === 2)?.id;

        return {
            team1: (players || []).filter(p => p.match_team_id === t1Id) as MatchTeamPlayer[],
            team2: (players || []).filter(p => p.match_team_id === t2Id) as MatchTeamPlayer[]
        };
    }
};
