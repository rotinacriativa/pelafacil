
import { Player, Match, Group } from './types';

export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    position: 'Zagueiro',
    status: 'Mensalista',
    rating: 5.0,
    avatar: 'https://i.pravatar.cc/150?u=1',
    paid: true
  },
  {
    id: '2',
    name: 'André Santos',
    position: 'Meia',
    status: 'Organizador',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=2',
    paid: true
  },
  {
    id: '3',
    name: 'Felipe Costa',
    position: 'Atacante',
    status: 'Avulso',
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/150?u=3',
    paid: false
  },
  {
    id: '4',
    name: 'Lucas Mendes',
    position: 'Goleiro',
    status: 'Mensalista',
    rating: 4.2,
    avatar: 'https://i.pravatar.cc/150?u=4',
    paid: true
  },
  {
    id: '5',
    name: 'Rafael Lima',
    position: 'Lateral',
    status: 'Avulso',
    rating: 4.0,
    avatar: 'https://i.pravatar.cc/150?u=5',
    paid: false
  },
  {
    id: '6',
    name: 'Bruno Oliveira',
    position: 'Zagueiro',
    status: 'Mensalista',
    rating: 4.3,
    avatar: 'https://i.pravatar.cc/150?u=6',
    paid: true
  },
  {
    id: '7',
    name: 'Thiago Rocha',
    position: 'Meio-Campo',
    status: 'Mensalista',
    rating: 3.8,
    avatar: 'https://i.pravatar.cc/150?u=7',
    paid: true
  },
  {
    id: '8',
    name: 'Gabriel Souza',
    position: 'Atacante',
    status: 'Convidado',
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=8',
    paid: false
  },
  {
    id: '9',
    name: 'Matheus Pereira',
    position: 'Meia-atacante',
    status: 'Avulso',
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=9',
    paid: true
  },
  {
    id: '10',
    name: 'Rodrigo Alves',
    position: 'Goleiro',
    status: 'Mensalista',
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=10',
    paid: true
  },
  {
    id: '11',
    name: 'Marcos Vinicius',
    position: 'Lateral',
    status: 'Mensalista',
    rating: 3.5,
    avatar: 'https://i.pravatar.cc/150?u=11',
    paid: true
  },
  {
    id: '12',
    name: 'Daniel Ferreira',
    position: 'Zagueiro',
    status: 'Avulso',
    rating: 4.1,
    avatar: 'https://i.pravatar.cc/150?u=12',
    paid: false
  },
  {
    id: '13',
    name: 'Eduardo Martins',
    position: 'Meia',
    status: 'Mensalista',
    rating: 4.4,
    avatar: 'https://i.pravatar.cc/150?u=13',
    paid: true
  },
  {
    id: '14',
    name: 'Vitor Hugo',
    position: 'Atacante',
    status: 'Mensalista',
    rating: 3.9,
    avatar: 'https://i.pravatar.cc/150?u=14',
    paid: true
  },
  {
    id: '15',
    name: 'Leonardo Silva',
    position: 'Meio-Campo',
    status: 'Avulso',
    rating: 4.2,
    avatar: 'https://i.pravatar.cc/150?u=15',
    paid: false
  },
  {
    id: '16',
    name: 'Hugo Barbosa',
    position: 'Lateral',
    status: 'Convidado',
    rating: 3.7,
    avatar: 'https://i.pravatar.cc/150?u=16',
    paid: false
  },
  {
    id: '17',
    name: 'Samuel Lima',
    position: 'Meia-atacante',
    status: 'Mensalista',
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/150?u=17',
    paid: true
  },
  {
    id: '18',
    name: 'Igor Gomes',
    position: 'Zagueiro',
    status: 'Avulso',
    rating: 4.0,
    avatar: 'https://i.pravatar.cc/150?u=18',
    paid: true
  },
  {
    id: '19',
    name: 'Renan Castro',
    position: 'Goleiro',
    status: 'Avulso',
    rating: 3.9,
    avatar: 'https://i.pravatar.cc/150?u=19',
    paid: false
  },
  {
    id: '20',
    name: 'Murilo Costa',
    position: 'Meia',
    status: 'Mensalista',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=20',
    paid: true
  }
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    date: '14/11',
    time: '19:30',
    location: 'Arena Soccer - Campo 3',
    address: 'Rua das Flores, 123, Centro',
    price: 25.00,
    slots: 18,
    filledSlots: 12,
    status: 'Confirmando'
  },
  {
    id: 'm2',
    date: '12 NOV',
    time: '20:00',
    location: 'Arena Jardim',
    address: 'Rua das Flores, 123',
    price: 20.00,
    slots: 18,
    filledSlots: 18,
    status: 'Finalizado',
    mvp: 'João Silva',
    score: { teamA: 5, teamB: 4 }
  }
];

export const CURRENT_GROUP: Group = {
  id: 'g1',
  name: 'Peladeiros de Terça',
  modality: 'Society',
  city: 'São Paulo, SP',
  description: 'Grupo focado em diversão e amizade. Nivelamento médio.'
};
