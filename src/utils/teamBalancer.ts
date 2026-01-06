import { MatchPlayer, Profile } from '../types';

/**
 * Interface combining MatchPlayer and Profile specific data needed for balancing.
 * In a real scenario, this data usually comes from a join on the database.
 */
export interface PlayerForBalancing extends MatchPlayer {
    rating: number; // 0-10 or 0-5
    position: string; // 'Goleiro', 'Zagueiro', etc.
    name: string;
}

/**
 * Balances a list of players into two teams (A and B) attempting to minimize
 * the total rating difference between the two teams.
 * 
 * Strategy:
 * 1. Separate Goalkeepers (Goleiros) first to ensure 1 per team if possible.
 * 2. Sort remaining players by rating (descending).
 * 3. Use "Snake Draft" distribution (A, B, B, A, A, B...).
 */
export function balanceTeams(players: PlayerForBalancing[]): { teamA: PlayerForBalancing[], teamB: PlayerForBalancing[] } {
    const teamA: PlayerForBalancing[] = [];
    const teamB: PlayerForBalancing[] = [];

    // 1. Separate Goalkeepers
    const goalkeepers = players.filter(p => p.position === 'Goleiro').sort((a, b) => b.rating - a.rating);
    const outfielders = players.filter(p => p.position !== 'Goleiro').sort((a, b) => b.rating - a.rating);

    // Distribute Goalkeepers
    goalkeepers.forEach((gk, index) => {
        if (index % 2 === 0) {
            teamA.push(gk);
        } else {
            teamB.push(gk);
        }
    });

    // 2. Distribute Outfielders (Snake Draft)
    // To decide who starts picking outfielders, check current team sums (or counts), 
    // but Snake Draft usually handles balance well enough.
    // If GKs were uneven (e.g. Team A got the better one), we might want Team B to pick first outfielder.
    // For simplicity: A, B, B, A...

    // Determine starting turn based on GK count to keep numbers even if possible
    let turnA = teamA.length <= teamB.length;

    outfielders.forEach((player, i) => {
        // Snake draft pattern: 0->A, 1->B, 2->B, 3->A, 4->A, 5->B...
        // Indices: 0, 3, 4, 7, 8... go to A
        // Indices: 1, 2, 5, 6, 9... go to B
        const snakeIndex = i % 4;
        const addToA = (snakeIndex === 0 || snakeIndex === 3);

        if (addToA) {
            teamA.push(player);
        } else {
            teamB.push(player);
        }
    });

    return { teamA, teamB };
}

/**
 * Calculates the total rating of a team.
 */
export function calculateTeamRating(team: PlayerForBalancing[]): number {
    return team.reduce((acc, player) => acc + (player.rating || 0), 0);
}

/**
 * Calculates the average rating of a team.
 */
export function calculateTeamAverage(team: PlayerForBalancing[]): string {
    if (team.length === 0) return "0.0";
    return (calculateTeamRating(team) / team.length).toFixed(1);
}
