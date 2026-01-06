
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useMatches } from '../hooks/useMatches';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime } from '../utils/format';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, loading: groupsLoading, refreshGroups } = useGroups();
  const { nextMatch, loading: matchesLoading } = useMatches();

  useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

  // State for selected group
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null);

  // Set default group on load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const activeGroup = groups.find(g => g.id === selectedGroupId) || (groups.length > 0 ? groups[0] : null);

  // Combined loading state
  const isLoading = groupsLoading || (groups.length > 0 && matchesLoading);

  const quickActions = [
    { name: 'Explorar', icon: 'search', path: '/explore', color: 'bg-primary/10 text-primary-dark', desc: 'Encontrar partidas' },
    { name: 'Placar', icon: 'scoreboard', path: '/scoreboard', color: 'bg-primary/10 text-primary-dark', desc: 'Cronômetro e gols' },
    { name: 'Elenco', icon: 'groups', path: '/roster', color: 'bg-orange-100 text-orange-600', desc: 'Gerenciar jogadores' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      </Layout>
    );
  }

  // EMPTY STATE: No Groups
  if (!activeGroup) {
    return (
      <Layout>
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-10 py-12 flex flex-col items-center justify-center text-center gap-6">
          <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-5xl">sports_soccer</span>
          </div>

          <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight">
            Bem-vindo ao Pelada Fácil!
          </h1>
          <p className="text-xl text-text-muted dark:text-gray-400 max-w-lg">
            Você ainda não participa de nenhuma pelada. Crie seu próprio grupo para começar a organizar os jogos.
          </p>

          <button
            onClick={() => navigate('/create-group')}
            className="mt-4 bg-primary hover:bg-[#11d821] text-[#052e0a] font-black text-lg h-14 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Criar Meu Primeiro Grupo</span>
          </button>

          <p className="text-sm text-text-muted dark:text-gray-500 mt-8">
            Ou peça para o administrador do seu grupo te enviar o link de convite.
          </p>
        </div>
      </Layout>
    );
  }

  // ACTIVE STATE: Has Group
  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Grupo Ativo</span>
              {activeGroup.role === 'admin' && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>
              )}
            </div>

            {groups.length > 1 ? (
              <div className="relative group">
                <select
                  value={activeGroup.id}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="appearance-none bg-transparent text-text-main dark:text-white text-3xl md:text-4xl font-black tracking-tight leading-tight pr-10 cursor-pointer outline-none border-b-2 border-transparent hover:border-primary/30 transition-colors w-full md:w-auto"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id} className="text-base text-black">{g.name}</option>
                  ))}
                </select>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none text-text-main dark:text-white">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            ) : (
              <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {activeGroup.name}
              </h2>
            )}

            <p className="text-text-muted dark:text-gray-400 text-base md:text-lg font-normal">Dashboard do Grupo</p>
          </div>
          <button onClick={() => navigate('/roster')} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors bg-white dark:bg-surface-dark px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Configurações</span>
          </button>
        </header>

        {/* Quick Links Section */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.path}
              className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-start text-left relative group overflow-hidden"
            >
              <div className={`size-12 rounded-xl ${action.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 overflow-hidden`}>
                <span className="material-symbols-outlined text-2xl select-none leading-none">{action.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white leading-tight mb-1">{action.name}</h3>
                <p className="text-xs text-text-muted dark:text-gray-400 leading-tight">{action.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">

            {matchesLoading ? (
              <div className="h-64 bg-surface-light dark:bg-surface-dark rounded-2xl animate-pulse flex items-center justify-center">
                <p className="text-text-muted font-bold">Carregando próxima partida...</p>
              </div>
            ) : nextMatch ? (
              <>
                <div className="group relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-lg">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-primary text-text-main text-xs font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm icon-filled">check_circle</span>
                      Confirmando Jogadores
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm13Wo24W9E7GWnWn6pIAYJTas0ntGVJmOxUoGr8O5hY5maJY4KKRR9yoLfAKzrvig1NtFd74OxU4LhL4UiE1ma0Ez44AB9nmX7LvdmnmmgEEDevY0-Iv3q_7ty88aox9jutcHv-KfbV5C4ufyqJZhM4VIhW2i5MAkLtIcoRihi2trhESB7N4Mhys8t2A_O9HsdY-47wJqUpIuVL7GmOUUPEnN3PfoOFQXGOrGc3p54iMWOXLyKzLVZ1_N_63C06Uabi8u-kK0120")' }}></div>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4">
                      <div>
                        <p className="text-primary font-bold text-xs uppercase tracking-wider mb-1">Próxima Partida</p>
                        <h3 className="text-text-main dark:text-white text-3xl font-black leading-tight">
                          {formatDate(nextMatch.date_time)} <span className="text-gray-300 dark:text-gray-600 font-light mx-1">|</span> {formatTime(nextMatch.date_time)}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2 text-text-muted dark:text-gray-400">
                          <span className="material-symbols-outlined text-primary">location_on</span>
                          <div>
                            <p className="font-bold text-text-main dark:text-gray-200">{nextMatch.location}</p>
                            <p className="text-xs">Clique para ver no mapa</p>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Vagas</span>
                            <span className="text-text-main dark:text-white">--/{nextMatch.max_players}</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate(`/match/${nextMatch.id}`)} className="flex-1 group relative overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined mr-2 font-bold">thumb_up</span>
                    <span className="text-text-main text-lg font-bold">Pedir Vaga</span>
                  </button>
                  <button onClick={() => navigate('/generator')} className="flex-1 bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-gray-700 hover:border-primary rounded-xl h-14 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined mr-2">shuffle</span>
                    <span className="text-text-main dark:text-white font-bold text-lg">Sortear Times</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="group relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center gap-4 text-center">
                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                  <span className="material-symbols-outlined text-3xl">event_busy</span>
                </div>
                <h3 className="text-xl font-bold dark:text-white">Nenhuma partida agendada</h3>
                <p className="text-text-muted">Não há jogos marcados no momento. Que tal começar um?</p>
                <button onClick={() => navigate('/schedule-match')} className="bg-primary text-text-main font-bold py-2.5 px-6 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 mt-2">
                  Criar Nova Partida
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main dark:text-white px-2">Estatísticas Rápidas</h3>
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center opacity-70">
              <span className="material-symbols-outlined text-4xl text-slate-300">lock</span>
              <p className="text-sm font-bold text-slate-500">Disponível na Fase 2</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
