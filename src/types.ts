
export type PlayerPosition = 'Goleiro' | 'Zagueiro' | 'Meio-Campo' | 'Atacante' | 'Lateral' | 'Meia' | 'Meia-atacante';
export type PlayerStatus = 'Mensalista' | 'Avulso' | 'Convidado' | 'Organizador';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  status: PlayerStatus;
  rating: number;
  avatar: string;
  paid?: boolean;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  slots: number;
  filledSlots: number;
  status: 'Confirmando' | 'Finalizado' | 'Pendente';
  mvp?: string;
  score?: {
    teamA: number;
    teamB: number;
  };
}

export interface Group {
  id: string;
  name: string;
  modality: 'Society' | 'Campo' | 'Futsal';
  city: string;
  description?: string;
}
