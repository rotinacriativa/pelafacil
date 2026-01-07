import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useMatches } from '../hooks/useMatches';
import { useMatchDetails } from '../hooks/useMatchDetails';
import { useAuth } from '../hooks/useAuth';
import { teamService } from '../services/teamService';
import { MatchTeamPlayer } from '../types';

const TeamGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { nextMatch } = useMatches();
  const matchId = nextMatch?.id;

  const { match } = useMatchDetails(matchId);

  const [team1, setTeam1] = useState<MatchTeamPlayer[]>([]);
  const [team2, setTeam2] = useState<MatchTeamPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasTeams, setHasTeams] = useState(false);

  // Check if current user is the owner of the group
  // match.group.owner_id vs session.user.id
  const isOwner = match?.group?.owner_id === session?.user?.id;

  const loadTeams = async () => {
    if (!matchId) return;
    setLoading(true);
    try {
      const { team1: t1, team2: t2 } = await teamService.getTeams(matchId);
      setTeam1(t1);
      setTeam2(t2);
      setHasTeams(t1.length > 0 || t2.length > 0);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, [matchId]);

  const handleGenerate = async () => {
    if (!matchId) return;
    if (!confirm('Isso irá apagar os times atuais e gerar novos aleatoriamente. Continuar?')) return;

    setGenerating(true);
    try {
      await teamService.generateTeams(matchId);
      await loadTeams(); // Refresh
    } catch (error: any) {
      alert('Erro ao gerar times: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const TeamColumn = ({ title, colorClass, badge, players }: { title: string, colorClass: string, badge: string, players: MatchTeamPlayer[] }) => (
    <div className={`rounded-xl border-2 border-transparent shadow-sm overflow-hidden transition-all bg-white dark:bg-surface-dark ${colorClass}`}>
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-slate-400">({players.length})</span>
        </h3>
        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-white dark:bg-slate-700 shadow-sm">{badge}</span>
      </div>
      <div className="p-4 flex flex-col gap-2 min-h-[200px]">
        {players.length === 0 && <p className="text-center text-slate-400 py-10">Vazio</p>}
        {players.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-10 w-10 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200">
              {p.profile?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{p.profile?.name || 'Desconhecido'}</p>
              <p className="text-xs text-slate-500">{p.profile?.position || 'Jogador'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <main className="flex-grow w-full max-w-[1024px] mx-auto px-4 py-8 sm:px-6">
        {/* Page Heading */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-text-main dark:text-white text-3xl sm:text-4xl font-black tracking-tight mb-2">Gerador de Times</h1>
          <p className="text-text-muted dark:text-gray-400 text-base sm:text-lg">Organize uma partida equilibrada com apenas um clique.</p>
        </div>

        {/* Action Bar & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-text-main text-lg font-bold px-8 py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined text-2xl ${generating ? 'animate-spin' : ''}`}>shuffle</span>
            <span>{generating ? 'Sorteando...' : 'Sortear Times'}</span>
          </button>

          {/* Balance Indicator */}
          <div className="w-full md:max-w-md flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold text-text-main dark:text-white">
              <span>Equilíbrio da Partida</span>
              <span className="text-primary">98% (Alto)</span>
            </div>
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-text-main dark:bg-gray-400 transition-all duration-500" style={{ width: '50%' }}></div>
              <div className="h-full bg-white dark:bg-gray-500 transition-all duration-500" style={{ width: '50%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-text-muted dark:text-gray-500">
              <span>Time A</span>
              <span>Time B</span>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {/* Team A Card */}
          <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border-2 border-transparent hover:border-primary/20 transition-colors shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-[#1a331d] dark:to-[#152a18]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-main dark:text-white">checkroom</span>
                  <h3 className="text-text-main dark:text-white text-xl font-bold">Time Coletes</h3>
                </div>
                <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Time A</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-text-main dark:text-white">
                  {(team1.length * 5)}
                </span>
                <span className="text-sm font-medium text-text-muted dark:text-gray-400 mb-1">Pontos de Força</span>
              </div>
            </div>
            {/* Player List */}
            <div className="p-4 flex flex-col gap-2 min-h-[300px]">
              {team1.length === 0 && <div className="flex items-center justify-center h-full text-text-muted">Nenhum jogador sorteado</div>}
              {team1.map(p => (
                <div key={p.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center text-text-main dark:text-white font-bold text-sm overflow-hidden">
                    {p.profile?.avatar_url ? (
                      <img src={p.profile.avatar_url} alt={p.profile.name} className="w-full h-full object-cover" />
                    ) : (
                      p.profile?.name?.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-main dark:text-white">{p.profile?.name}</p>
                    <p className="text-xs text-text-muted dark:text-gray-400">{p.profile?.position || 'Jogador'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="material-symbols-outlined text-gray-400 text-[18px] cursor-pointer hover:text-primary">swap_vert</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team B Card */}
          <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border-2 border-transparent hover:border-accent/20 transition-colors shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-50 to-white dark:from-[#2a2215] dark:to-[#1a331d]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-main dark:text-white">accessibility_new</span>
                  <h3 className="text-text-main dark:text-white text-xl font-bold">Time Camisas</h3>
                </div>
                <span className="bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Time B</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-text-main dark:text-white">
                  {(team2.length * 5)}
                </span>
                <span className="text-sm font-medium text-text-muted dark:text-gray-400 mb-1">Pontos de Força</span>
              </div>
            </div>
            {/* Player List */}
            <div className="p-4 flex flex-col gap-2 min-h-[300px]">
              {team2.length === 0 && <div className="flex items-center justify-center h-full text-text-muted">Nenhum jogador sorteado</div>}
              {team2.map(p => (
                <div key={p.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center text-text-main dark:text-white font-bold text-sm overflow-hidden">
                    {p.profile?.avatar_url ? (
                      <img src={p.profile.avatar_url} alt={p.profile.name} className="w-full h-full object-cover" />
                    ) : (
                      p.profile?.name?.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-main dark:text-white">{p.profile?.name}</p>
                    <p className="text-xs text-text-muted dark:text-gray-400">{p.profile?.position || 'Jogador'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="material-symbols-outlined text-gray-400 text-[18px] cursor-pointer hover:text-primary">swap_vert</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer Action */}
        <div className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-[1024px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted dark:text-gray-400 hidden sm:block">
              Confira as escalações antes de aprovar a partida.
            </p>
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 sm:flex-none h-12 px-6 rounded-full border border-gray-300 dark:border-gray-600 text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Re-sortear
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary hover:bg-primary-dark text-text-main font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Aprovar Times
              </button>
            </div>
          </div>
        </div>
      </main>

    </Layout >
  );
};

export default TeamGenerator;
