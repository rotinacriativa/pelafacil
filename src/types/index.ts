// Consolidated types
export type PlayerPosition = 'Goleiro' | 'Zagueiro' | 'Meio-Campo' | 'Atacante' | 'Lateral' | 'Meia' | 'Meia-atacante';
export type PlayerStatus = 'Mensalista' | 'Avulso' | 'Convidado' | 'Organizador';

export interface Profile {
    id: string;
    name: string;
    avatar_url?: string;
    position?: 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campo' | 'Atacante';
    rating?: number;
}

export interface Match {
    id: string;
    group_id: string;
    location: string;
    date_time: string;
    max_players: number;
    price_per_person: number;
    status: 'scheduled' | 'finished' | 'canceled';
}

export interface MatchPlayer {
    match_id: string;
    user_id: string;
    status: 'requested' | 'approved' | 'declined' | 'waitlist';
    team?: 'A' | 'B' | 'C' | 'D';
    is_paid: boolean;
    profile?: Profile; // Joined data
}

export interface MatchTeam {
    id: string;
    match_id: string;
    team_number: 1 | 2;
    created_at: string;
}

export interface MatchTeamPlayer {
    id: string;
    match_team_id: string;
    player_id: string;
    profile?: Profile; // Joined data
    created_at: string;
}

export interface MatchExpense {
    id: string;
    match_id: string;
    description: string;
    total_amount: number;
    created_by: string;
    created_at: string;
}

export interface MatchPayment {
    id: string;
    match_id: string;
    player_id: string;
    amount: number;
    status: 'PENDING' | 'PAID';
    paid_at?: string;
    profile?: Profile; // Joined data for UI
}

