import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Helper interface for Stats
interface PlayerStat {
    userId: string;
    name: string;
    avatarUrl: string;
    position: string;
    goals: number;
    assists: number;
    matches: number;
    mvpCount: number;
}

interface MatchHistory {
    id: string;
    date: string;
    location: string;
    status: string;
    team1_score: number;
    team2_score: number;
    mvp_name?: string;
    mvp_goals?: number;
}

const StatsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Stats State
    const [totalGoals, setTotalGoals] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [avgGoals, setAvgGoals] = useState(0);
    const [activePlayersCount, setActivePlayersCount] = useState(0);

    const [rankings, setRankings] = useState<PlayerStat[]>([]);
    const [matches, setMatches] = useState<MatchHistory[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch Match Stats (Simulating aggregation for now or fetching real data)
            // Ideally this would be a View or a complex RPC in Supabase
            // For MVP, we might fetch raw rows and aggregate client-side if data is small, 
            // or use simple counts.

            // 1. Get raw stats
            const { data: statsData, error: statsError } = await supabase
                .from('match_stats')
                .select(`
                    user_id,
                    goals,
                    assists,
                    rating,
                    match_id,
                    mvp,
                    profiles:user_id (name, avatar_url, position)
                `);

            if (statsError) throw statsError;

            // 2. Get Matches
            const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select('*')
                .eq('status', 'finished')
                .order('date_time', { ascending: false })
                .limit(5);

            if (matchesError) throw matchesError;

            // --- Aggregation Logic ---
            const playersMap = new Map<string, PlayerStat>();

            let gTotal = 0;
            let mTotal = matchesData?.length || 0; // Only finished matches count for stats page logic typically

            // Helper to get MVP for a match (highest rating)
            // This requires fetching stats for specific matches effectively or grouping.
            // For complexity reduction, we process the flat stats list.

            statsData?.forEach((stat: any) => {
                const userId = stat.user_id;
                const profile = stat.profiles;
                const current = playersMap.get(userId) || {
                    userId,
                    name: profile?.name || 'Desconhecido',
                    avatarUrl: profile?.avatar_url,
                    position: profile?.position || 'Jogador',
                    goals: 0,
                    assists: 0,
                    matches: 0, // Needs unique match counting
                    mvpCount: 0
                };

                current.goals += stat.goals || 0;
                current.assists += stat.assists || 0;
                // Match count is tricky with flat list, we'll increment strictly on row presence 
                // assuming 1 row per player per match
                current.matches += 1;

                if (stat.mvp) {
                    current.mvpCount += 1;
                }

                // Track global
                gTotal += stat.goals || 0;

                playersMap.set(userId, current);
            });

            const rankedPlayers = Array.from(playersMap.values()).sort((a, b) => b.goals - a.goals);

            setRankings(rankedPlayers);
            setTotalGoals(gTotal);
            setTotalMatches(mTotal); // This should ideally be count(matches) where status=finished
            setAvgGoals(mTotal > 0 ? Number((gTotal / mTotal).toFixed(1)) : 0);
            setActivePlayersCount(playersMap.size);

            // Format Matches for History
            // Warning: We need team scores. In our current schema, do we have team scores?
            // Checking schema... 'score_team1', 'score_team2' exists in 'matches'.
            setMatches(matchesData?.map((m: any) => ({
                id: m.id,
                date: m.date_time,
                location: m.location,
                status: m.status,
                team1_score: m.score_team1 || 0,
                team2_score: m.score_team2 || 0,
                // MVP logic would require joining match_stats within this query or separate lookup
                mvp_name: 'Calculando...', // Placeholder for MVP logic improvement
                mvp_goals: 0
            })) || []);

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const top3 = rankings.slice(0, 3);
    const restOfRank = rankings.slice(3, 10);

    return (
        <Layout>
            <div className="flex-1 flex justify-center py-8 px-4 md:px-8">
                <div className="flex flex-col max-w-7xl w-full gap-8">
                    {/* Page Heading & Filters */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">analytics</span>
                                <div>Estatísticas</div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">Estatísticas da Temporada</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                                Acompanhe o desempenho dos artilheiros, assiduidade e o histórico completo das partidas do seu grupo.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-slate-500 text-xl">calendar_month</span>
                                <span className="font-medium text-sm">2024</span>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                            </button>
                            <button
                                onClick={async () => {
                                    const shareData = {
                                        title: 'Estatísticas da Temporada - Pelada App',
                                        text: 'Confira as estatísticas da nossa pelada!',
                                        url: window.location.href
                                    };

                                    if (navigator.share) {
                                        try {
                                            await navigator.share(shareData);
                                        } catch (err) {
                                            console.log('Error sharing:', err);
                                        }
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copiado para a área de transferência!');
                                    }
                                }}
                                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl">share</span>
                                <span className="font-bold text-sm">Compartilhar</span>
                            </button>
                        </div>
                    </div>

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                                    <span className="material-symbols-outlined">sports_soccer</span>
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                    +12%
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Gols</p>
                                <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{totalGoals}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg">
                                    <span className="material-symbols-outlined">stadium</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Partidas Jogadas</p>
                                <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{totalMatches}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Média Gols/Jogo</p>
                                <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">{avgGoals}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                    +2
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Jogadores Ativos</p>
                                <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{activePlayersCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid: Ranking & History */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                        {/* Left Col: Rankings (7 cols) */}
                        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ranking de Artilharia</h2>
                                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex text-sm font-medium">
                                    <button className="px-4 py-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-full text-primary">Gols</button>
                                    <button className="px-4 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Presença</button>
                                </div>
                            </div>

                            {/* Podium (Only show if we have enough players) */}
                            {top3.length > 0 && (
                                <div className="flex flex-col sm:flex-row gap-4 items-end justify-center py-6 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-900/10 rounded-2xl">

                                    {/* 2nd Place */}
                                    {top3[1] && (
                                        <div className="flex-1 flex flex-col items-center gap-3 order-2 sm:order-1">
                                            <div className="relative">
                                                <div
                                                    className="size-20 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-cover bg-center shadow-lg"
                                                    style={{ backgroundImage: `url("${top3[1].avatarUrl || 'https://ui-avatars.com/api/?background=random'}")` }}
                                                ></div>
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    #2
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{top3[1].name.split(' ')[0]}</p>
                                                <p className="text-slate-500 text-sm">{top3[1].goals} Gols</p>
                                            </div>
                                            <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded-t-xl mt-2 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-300/50 to-transparent"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 1st Place */}
                                    {top3[0] && (
                                        <div className="flex-1 flex flex-col items-center gap-3 order-1 sm:order-2 z-10">
                                            <span className="material-symbols-outlined text-yellow-500 text-4xl animate-bounce">emoji_events</span>
                                            <div className="relative">
                                                <div
                                                    className="size-28 rounded-full border-4 border-yellow-400 bg-cover bg-center shadow-xl shadow-yellow-500/20"
                                                    style={{ backgroundImage: `url("${top3[0].avatarUrl || 'https://ui-avatars.com/api/?background=random'}")` }}
                                                ></div>
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-sm font-black px-3 py-1 rounded-full shadow-sm">
                                                    #1
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-xl leading-tight text-slate-900 dark:text-white">{top3[0].name}</p>
                                                <p className="text-primary font-bold">{top3[0].goals} Gols</p>
                                            </div>
                                            <div className="w-full h-32 bg-yellow-100 dark:bg-yellow-900/30 rounded-t-xl mt-2 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3rd Place */}
                                    {top3[2] && (
                                        <div className="flex-1 flex flex-col items-center gap-3 order-3">
                                            <div className="relative">
                                                <div
                                                    className="size-20 rounded-full border-4 border-orange-300 dark:border-orange-800 bg-cover bg-center shadow-lg"
                                                    style={{ backgroundImage: `url("${top3[2].avatarUrl || 'https://ui-avatars.com/api/?background=random'}")` }}
                                                ></div>
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    #3
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{top3[2].name.split(' ')[0]}</p>
                                                <p className="text-slate-500 text-sm">{top3[2].goals} Gols</p>
                                            </div>
                                            <div className="w-full h-16 bg-orange-100 dark:bg-orange-900/20 rounded-t-xl mt-2 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-t from-orange-300/30 to-transparent"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ranking List (Rest of Players) */}
                            <div className="flex flex-col gap-3 mt-4">
                                {restOfRank.map((player, index) => (
                                    <div key={player.userId} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 font-bold w-6 text-center">{index + 4}</span>
                                            <div
                                                className="size-10 rounded-full bg-slate-200 bg-cover bg-center"
                                                style={{ backgroundImage: `url("${player.avatarUrl || 'https://ui-avatars.com/api/?background=random'}")` }}
                                            ></div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{player.name}</p>
                                                <p className="text-xs text-slate-500">{player.position}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{player.goals}</p>
                                            <p className="text-xs text-slate-500">gols</p>
                                        </div>
                                    </div>
                                ))}
                                {rankings.length === 0 && (
                                    <div className="text-center py-10 text-slate-500">
                                        Nenhuma estatística registrada ainda.
                                    </div>
                                )}
                            </div>

                            {rankings.length > 10 && (
                                <button className="w-full py-3 text-center text-primary font-bold text-sm hover:underline mt-2">
                                    Ver Ranking Completo
                                </button>
                            )}
                        </div>

                        {/* Right Col: Match History (5 cols) */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Últimas Partidas</h2>
                                <Link to="/matches" className="text-primary text-sm font-bold hover:underline">Ver todas</Link>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Upcoming Match Card (Static for now, could be dynamic) */}
                                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                        <span className="text-xs font-bold text-blue-100 uppercase tracking-wide">PRÓXIMA PELADA</span>
                                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-bold backdrop-blur-sm">AGENDADO</span>
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-2xl">location_on</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Arena Jardim</p>
                                            <p className="text-blue-100 text-sm">Verifique o dashboard</p>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/dashboard')} className="w-full mt-5 bg-white text-primary font-bold py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm relative z-10">
                                        Ir para Dashboard
                                    </button>
                                </div>

                                {/* Match History Cards */}
                                {matches.map((match) => (
                                    <div key={match.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()} • {match.location}
                                            </span>
                                            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded font-bold">FINALIZADO</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col items-center gap-2 flex-1">
                                                <div className="size-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-black text-xl">
                                                    A
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Time A</span>
                                            </div>
                                            <div className="flex flex-col items-center px-4">
                                                <div className="flex items-center gap-3 text-3xl font-black text-slate-800 dark:text-white">
                                                    <span>{match.team1_score}</span>
                                                    <span className="text-slate-300 dark:text-slate-600 text-xl">-</span>
                                                    <span>{match.team2_score}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 flex-1">
                                                <div className="size-12 bg-white border-2 border-slate-100 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-xl">
                                                    B
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Time B</span>
                                            </div>
                                        </div>
                                        {/* MVP Section Placeholder */}
                                        {/* <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-500 text-sm">
                                            <span className="material-symbols-outlined text-base">star</span>
                                            <span>MVP: <strong>João</strong></span>
                                        </div> */}
                                    </div>
                                ))}

                                {matches.length === 0 && (
                                    <p className="text-center text-slate-500 py-4">Nenhuma partida finalizada.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StatsPage;
