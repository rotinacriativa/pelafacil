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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Voltar
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Times da Partida
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {match ? match.location : 'Carregando...'}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-primary hover:bg-primary-dark text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">{hasTeams ? 'refresh' : 'shuffle'}</span>
              {generating ? 'Gerando...' : (hasTeams ? 'Regerar Times' : 'Gerar Times')}
            </button>
          )}
        </div>

        {!match && !loading && (
          <div className="p-10 text-center bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <p className="text-slate-500">Nenhuma partida selecionada.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {!hasTeams ? (
              <div className="p-16 text-center bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">groups</span>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Times não definidos</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {isOwner
                    ? 'Como organizador, você pode gerar os times aleatoriamente baseando-se nos jogadores confirmados.'
                    : 'O organizador ainda não definiu os times para esta partida.'}
                </p>
                {isOwner && (
                  <button onClick={handleGenerate} className="mt-6 text-primary font-bold hover:underline">Gerar Agora</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamColumn
                  title="Time 1"
                  players={team1}
                  badge="Colete"
                  colorClass="hover:border-slate-300 dark:hover:border-slate-600"
                />
                <TeamColumn
                  title="Time 2"
                  players={team2}
                  badge="Sem Colete"
                  colorClass="hover:border-orange-300 dark:hover:border-orange-900"
                />
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
};

export default TeamGenerator;
