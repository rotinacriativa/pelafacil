
import React, { useState } from 'react';
// Added Link to the imports
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { MOCK_PLAYERS } from '../constants';
import { Player } from '../types';

const TeamGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<{ teamA: Player[], teamB: Player[] }>({ teamA: [], teamB: [] });

  const sortTeams = () => {
    // Basic balancing logic
    const sorted = [...MOCK_PLAYERS].sort((a, b) => b.rating - a.rating);
    const a: Player[] = [];
    const b: Player[] = [];

    sorted.forEach((player, index) => {
      if (index % 2 === 0) a.push(player);
      else b.push(player);
    });
    setTeams({ teamA: a, teamB: b });
  };

  const calculateStrength = (team: Player[]) => team.reduce((acc, p) => acc + (p.rating * 20), 0);

  return (
    <Layout>
      <main className="flex-grow w-full max-w-[1024px] mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Gerador de Times</h1>
          <p className="text-text-muted text-base sm:text-lg">Organize uma partida equilibrada com apenas um clique.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <button onClick={sortTeams} className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-text-main text-lg font-bold px-8 py-4 rounded-full shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-2xl">shuffle</span>
            <span>Sortear Times</span>
          </button>
          <div className="w-full md:max-w-md flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Equilíbrio da Partida</span>
              <span className="text-primary">98% (Alto)</span>
            </div>
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-text-main transition-all duration-500" style={{ width: '50%' }}></div>
              <div className="h-full bg-gray-400 transition-all duration-500" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {/* Team A */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border-2 border-transparent hover:border-primary/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">checkroom</span>
                  <h3 className="text-xl font-bold">Time Coletes</h3>
                </div>
                <span className="bg-primary/20 text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase">Time A</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{teams.teamA.length > 0 ? calculateStrength(teams.teamA) : '00'}</span>
                <span className="text-sm font-medium text-text-muted mb-1">Pontos de Força</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {teams.teamA.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 group">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center font-bold text-sm">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Team B */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border-2 border-transparent hover:border-orange-500/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-orange-50 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">accessibility_new</span>
                  <h3 className="text-xl font-bold">Time Camisas</h3>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Time B</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{teams.teamB.length > 0 ? calculateStrength(teams.teamB) : '00'}</span>
                <span className="text-sm font-medium text-text-muted mb-1">Pontos de Força</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {teams.teamB.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 group">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center font-bold text-sm">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-4 pb-6 shadow-2xl z-40">
          <div className="max-w-[1024px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted hidden sm:block">Confira as escalações antes de aprovar a partida.</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <button onClick={sortTeams} className="flex-1 sm:flex-none h-12 px-6 rounded-full border border-gray-300 font-bold hover:bg-gray-50 transition-colors">Re-sortear</button>
              <button onClick={() => navigate('/scoreboard')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary hover:bg-primary-dark text-text-main font-bold shadow-lg transition-all">
                <span className="material-symbols-outlined">check_circle</span>
                Aprovar Times
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TeamGenerator;
