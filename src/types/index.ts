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
