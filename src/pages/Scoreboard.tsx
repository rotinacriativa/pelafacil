
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
// import { MOCK_PLAYERS } from '../constants';
// import { Player } from '../types';

interface MatchEvent {
  id: string;
  type: 'goal';
  scorerId: string;
  assistId?: string;
  team: 'A' | 'B';
  time: string;
}

import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';

interface DatabasePlayer {
  user_id: string;
  team: 'A' | 'B' | null;
  profile: {
    id: string;
    name: string;
    position: string | null;
    avatar_url: string | null;
  };
}

const Scoreboard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { matches, loading: matchesLoading } = useMatches(); // Use the hook

  // If no match selected, show selection screen
  if (!matchId) {
    return (
      <Layout>
        <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 w-full max-w-4xl mx-auto gap-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Escolha uma Partida</h1>
          <div className="grid grid-cols-1 w-full gap-4">
            {matches.filter(m => m.status === 'scheduled' || m.status === 'ongoing').map(match => (
              <div key={match.id} onClick={() => navigate(`/match/${match.id}/scoreboard`)} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary cursor-pointer transition-all shadow-sm flex justify-between items-center group">
                <div>
                  <p className="font-bold text-lg dark:text-white">{match.location}</p>
                  <p className="text-sm text-slate-500">{new Date(match.date_time).toLocaleString()}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">arrow_forward_ios</span>
              </div>
            ))}
            {matches.length === 0 && !matchesLoading && (
              <p className="text-center text-slate-500">Nenhuma partida agendada.</p>
            )}
          </div>
        </main>
      </Layout>
    );
  }

  // Timer State...
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [period, setPeriod] = useState<'1' | '2' | 'break'>('1');

  // Match Data State
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<DatabasePlayer[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isMVPModalOpen, setIsMVPModalOpen] = useState(false); // NEW
  const [mvpPlayerId, setMvpPlayerId] = useState<string | null>(null); // NEW
  const [modalType, setModalType] = useState<'A' | 'B' | null>(null);
  const [step, setStep] = useState<'scorer' | 'assist'>('scorer');
  const [tempEvent, setTempEvent] = useState<{ scorer?: DatabasePlayer; assist?: DatabasePlayer }>({});

  // Fetch Players on Mount
  useEffect(() => {
    if (matchId) {
      fetchMatchPlayers();
    }
  }, [matchId]);

  const fetchMatchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('match_players')
        .select(`
                    user_id,
                    team,
                    profile:profiles(id, name, position, avatar_url)
                `)
        .eq('match_id', matchId)
        .in('status', ['confirmed', 'paid']); // Only active players

      if (error) throw error;
      setPlayers(data as any || []);
    } catch (error) {
      console.error('Error fetching scoreboard players:', error);
    } finally {
      setLoading(false);
    }
  };

  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);

  const scoreA = events.filter(e => e.team === 'A').length;
  const scoreB = events.filter(e => e.team === 'B').length;

  // Timer Logic
  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((s) => {
          if (s >= 59) {
            setMinutes((m) => m + 1);
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleGoalClick = (team: 'A' | 'B') => {
    setModalType(team);
    setStep('scorer');
    setTempEvent({});
    setIsModalOpen(true);
  };

  const selectScorer = (player: DatabasePlayer) => {
    setTempEvent({ scorer: player });
    setStep('assist');
  };

  const confirmEvent = (assistPlayer?: DatabasePlayer) => {
    if (!tempEvent.scorer || !modalType) return;

    const newEvent: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'goal',
      scorerId: tempEvent.scorer.user_id,
      assistId: assistPlayer?.user_id,
      team: modalType,
      time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };

    setEvents([newEvent, ...events]);
    setIsModalOpen(false);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setMinutes(0);
    setSeconds(0);
  };

  const handleFullReset = () => {
    handleResetTimer();
    setEvents([]);
    setIsResetModalOpen(false);
  };

  // Save Stats to Database
  const saveMatchData = async () => {
    if (!matchId) return;

    try {
      // Aggregate Stats
      const statsMap = new Map<string, { goals: number; assists: number }>();

      // Initialize all players with 0
      players.forEach(p => {
        statsMap.set(p.user_id, { goals: 0, assists: 0 });
      });

      // Calculate totals
      events.forEach(e => {
        const scorer = statsMap.get(e.scorerId);
        if (scorer) scorer.goals += 1;

        if (e.assistId) {
          const assist = statsMap.get(e.assistId);
          if (assist) assist.assists += 1;
        }
      });

      // Prepare Payload
      const statsPayload = Array.from(statsMap.entries()).map(([userId, stats]) => ({
        match_id: matchId,
        user_id: userId,
        goals: stats.goals,
        assists: stats.assists,
        rating: Number((6.0 + (stats.goals * 1.0) + (stats.assists * 0.5)).toFixed(1)),
        mvp: userId === mvpPlayerId // NEW logic
      }));

      // Insert into match_stats
      const { error: statsError } = await supabase
        .from('match_stats')
        .upsert(statsPayload);

      if (statsError) throw statsError;

      // Update Match Status
      const { error: matchError } = await supabase
        .from('matches')
        .update({ status: 'finished' })
        .eq('id', matchId);

      if (matchError) throw matchError;

      alert('Partida finalizada e craque eleito! 🏆');
      navigate(-1); // Go back

    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Erro ao salvar estatísticas. Tente novamente.');
    }
  };

  const handleFinishMatch = () => {
    if (window.confirm('Deseja finalizar a partida?')) {
      setIsMVPModalOpen(true);
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 w-full max-w-6xl mx-auto gap-12">
        {/* Arena Scoreboard */}
        <section className="w-full">
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex flex-col md:flex-row h-full">
              {/* Team A Side */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-primary/5 to-transparent relative group">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <span className="text-sm font-black text-primary-dark uppercase tracking-[0.2em]">Sem Colete</span>
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-primary text-sm icon-filled">groups</span>
                    <span className="text-[10px] font-black text-primary-dark uppercase">{teamA.length} JOGADORES</span>
                  </div>
                </div>
                <div className="text-[120px] md:text-[160px] font-black text-text-main dark:text-white leading-none tracking-tighter mb-8 tabular-nums">
                  {scoreA}
                </div>
                <button
                  onClick={() => handleGoalClick('A')}
                  className="bg-primary hover:bg-primary-hover text-text-main px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl icon-filled">sports_soccer</span>
                  GOL!
                </button>
                <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-50"></div>
              </div>

              {/* Center Info / Timer Area */}
              <div className="w-full md:w-64 flex flex-col items-center justify-center py-8 md:py-0 border-y md:border-y-0 md:border-x border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="flex flex-col items-center gap-1 mb-8">
                  <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">{period === 'break' ? 'Pausa' : `${period}º Tempo`}</span>
                  <div className="text-4xl md:text-5xl font-black tabular-nums dark:text-white flex items-center">
                    <span>{minutes.toString().padStart(2, '0')}</span>
                    <span className={`text-primary mx-1 ${isActive ? 'animate-pulse' : ''}`}>:</span>
                    <span>{seconds.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`size-14 rounded-full flex items-center justify-center transition-all shadow-md ${isActive ? 'bg-orange-500 text-white' : 'bg-primary text-text-main'}`}
                    >
                      <span className="material-symbols-outlined !text-3xl icon-filled">{isActive ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button
                      onClick={() => setIsResetModalOpen(true)}
                      className="size-14 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-muted flex items-center justify-center hover:text-primary transition-colors"
                      title="Zerar Placar e Tempo"
                    >
                      <span className="material-symbols-outlined !text-2xl">restart_alt</span>
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {['1', 'break', '2'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p as any)}
                        className={`size-8 rounded-full text-[10px] font-black uppercase transition-all ${period === p ? 'bg-text-main text-primary' : 'bg-slate-200 dark:bg-slate-700 text-text-muted'}`}
                      >
                        {p === 'break' ? 'I' : p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team B Side */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-bl from-orange-500/5 to-transparent relative group">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <span className="text-sm font-black text-orange-600 uppercase tracking-[0.2em]">Com Colete</span>
                  <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-orange-600 text-sm icon-filled">groups</span>
                    <span className="text-[10px] font-black text-orange-600 uppercase">{teamB.length} JOGADORES</span>
                  </div>
                </div>
                <div className="text-[120px] md:text-[160px] font-black text-text-main dark:text-white leading-none tracking-tighter mb-8 tabular-nums">
                  {scoreB}
                </div>
                <button
                  onClick={() => handleGoalClick('B')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xl shadow-lg shadow-orange-500/20 transform active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl icon-filled">sports_soccer</span>
                  GOL!
                </button>
                <div className="absolute top-0 right-0 w-2 h-full bg-orange-500 opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Lances da Partida
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{events.length} Eventos</span>
              {events.length > 0 && (
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-[10px] font-black text-red-500 uppercase hover:underline tracking-widest"
                >
                  Limpar Placar
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {events.length > 0 ? (
              events.map((event) => {
                const scorer = players.find(p => p.user_id === event.scorerId);
                const assist = event.assistId ? players.find(p => p.user_id === event.assistId) : null;

                return (
                  <div key={event.id} className="bg-white dark:bg-surface-dark p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className={`size-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm ${event.team === 'A' ? 'bg-primary/20 text-primary-dark' : 'bg-orange-500/20 text-orange-600'}`}>
                        <span className="material-symbols-outlined text-lg mb-0.5 icon-filled">timer</span>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-cover bg-center border-2 border-slate-50 dark:border-slate-700 shadow-sm" style={{ backgroundImage: `url(${scorer?.profile.avatar_url})` }}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl icon-filled">sports_soccer</span>
                            <p className="font-black text-lg dark:text-white">{scorer?.profile.name}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${event.team === 'A' ? 'bg-primary text-text-main' : 'bg-orange-500 text-white'}`}>
                              {event.team === 'A' ? 'Sem Colete' : 'Com Colete'}
                            </span>
                          </div>
                          {assist && (
                            <div className="flex items-center gap-2 mt-1 opacity-70">
                              <span className="material-symbols-outlined text-sm">handshake</span>
                              <p className="text-xs font-bold">Assistência: <span className="dark:text-white">{assist.profile.name}</span></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeEvent(event.id)} className="size-10 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">delete</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center gap-4 text-text-muted">
                <div className="size-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl opacity-20">sports_soccer</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black dark:text-white mb-1">A bola ainda não balançou!</p>
                  <p className="text-sm font-medium">Os gols e assistências aparecerão aqui em tempo real.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                const text = `🏆 *Fim de Jogo! - ${matchId}*\n\n` +
                  `🏁 *Placar Final*\n` +
                  `🎽 Sem Colete ${scoreA} x ${scoreB} Com Colete 👕\n\n` +
                  `⚽ *Gols*\n` +
                  events.map(e => {
                    const p = players.find(p => p.user_id === e.scorerId);
                    return `• ${p?.profile.name || 'Desconhecido'} (${e.team === 'A' ? 'Sem Colete' : 'Com Colete'}) - ${e.time}`;
                  }).join('\n') +
                  `\n\n_Registrado no PeladaApp_`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="group flex items-center gap-3 px-8 py-5 rounded-full bg-[#25D366] text-white font-black text-lg hover:bg-[#128C7E] transition-all shadow-xl active:scale-95"
            >
              <span className="text-2xl">📱</span>
              Compartilhar Resultado
            </button>

            <button
              onClick={handleFinishMatch}
              className="group flex items-center gap-3 px-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              <span className="material-symbols-outlined icon-filled">sports_and_outdoors</span>
              Finalizar Partida
            </button>
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">As estatísticas serão salvas no histórico do grupo</p>
        </div>
      </main>

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black dark:text-white tracking-tight">
                  {step === 'scorer' ? '⚽ Quem marcou?' : '🤝 Assistência?'}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-3 h-3 rounded-full ${modalType === 'A' ? 'bg-primary' : 'bg-orange-500'}`}></span>
                  <p className="text-xs font-black text-text-muted uppercase tracking-widest">
                    {modalType === 'A' ? 'Time Sem Colete' : 'Time Com Colete'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto scrollbar-hide grid grid-cols-1 gap-2">
              {(modalType === 'A' ? teamA : teamB).map((player) => {
                if (step === 'assist' && player.user_id === tempEvent.scorer?.user_id) return null;

                return (
                  <button
                    key={player.user_id}
                    onClick={() => step === 'scorer' ? selectScorer(player) : confirmEvent(player)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="size-14 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-md" style={{ backgroundImage: `url(${player.profile.avatar_url})` }}></div>
                    <div className="flex-1">
                      <p className="font-black text-lg dark:text-white leading-none mb-1 group-hover:text-primary transition-colors">{player.profile.name}</p>
                      <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{player.profile.position || 'Jogador'}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-all text-3xl">add_circle</span>
                  </button>
                );
              })}

              {step === 'assist' && (
                <button
                  onClick={() => confirmEvent()}
                  className="w-full p-5 mt-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-text-muted font-black text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">person_off</span>
                  GOL INDIVIDUAL / SEM ASSISTÊNCIA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MVP Voting Modal */}
      {isMVPModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 text-center">
              <h3 className="text-3xl font-black dark:text-white tracking-tight flex items-center justify-center gap-2">
                <span className="text-4xl">👑</span>
                Quem foi o Craque?
              </h3>
              <p className="text-text-muted mt-2 font-medium">Eleja o melhor jogador da partida para ganhar a medalha de MVP!</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...teamA, ...teamB].map(player => (
                <button
                  key={player.user_id}
                  onClick={() => setMvpPlayerId(player.user_id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${mvpPlayerId === player.user_id
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
                    }`}
                >
                  <div className="size-12 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm" style={{ backgroundImage: `url(${player.profile.avatar_url})` }}></div>
                  <div className="text-left">
                    <p className={`font-bold ${mvpPlayerId === player.user_id ? 'text-primary' : 'dark:text-white'}`}>{player.profile.name}</p>
                    <p className="text-xs text-text-muted uppercase font-bold">{player.team === 'A' ? 'Sem Colete' : 'Com Colete'}</p>
                  </div>
                  {mvpPlayerId === player.user_id && (
                    <span className="material-symbols-outlined text-primary ml-auto icon-filled">check_circle</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={saveMatchData}
                disabled={!mvpPlayerId}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                CONFIRMAR CRAQUE & FINALIZAR
                <span className="material-symbols-outlined icon-filled">emoji_events</span>
              </button>
              <button
                onClick={() => setIsMVPModalOpen(false)}
                className="text-sm font-bold text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center gap-6">
            <div className="size-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-2">
              <span className="material-symbols-outlined text-5xl">warning</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-black dark:text-white tracking-tight">Zerar Placar?</h3>
              <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
                Esta ação apagará todos os gols registrados e resetará o cronômetro. Você tem certeza?
              </p>
            </div>
            <div className="flex flex-col w-full gap-3 mt-4">
              <button
                onClick={handleFullReset}
                className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-lg shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">delete_forever</span>
                Sim, zerar tudo
              </button>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-text-muted font-black text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Scoreboard;
