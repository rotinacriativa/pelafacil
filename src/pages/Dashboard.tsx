
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useGroups } from '../hooks/useGroups';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../contexts/AuthContext';
import { formatTime } from '../utils/format';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, loading: groupsLoading, refreshGroups } = useGroups();
  const { matches, loading: matchesLoading } = useMatches();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

  const activeGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNextMatch = (groupId: string) => {
    if (!matches) return null;
    return matches
      .filter(m => m.group_id === groupId && m.status === 'scheduled')
      .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];
  };

  const formatWeekday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const isLoading = groupsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (

    <Layout>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111812] dark:text-[#f0f4f0] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Meus Grupos</h1>
            <p className="text-[#618965] dark:text-[#a0cba4] text-base font-normal max-w-lg">Gerencie seus times, confirme presença e fique por dentro das próximas peladas.</p>
          </div>
          <div className="flex flex-wrap w-full md:w-auto gap-3">
            <div className="relative flex-1 md:flex-none md:w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#618965]">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-surface-dark border border-[#e5e9e5] dark:border-[#2f4532] text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-[#618965] text-text-main dark:text-white"
                placeholder="Buscar grupos..."
                type="text"
              />
            </div>
            <button
              onClick={() => navigate('/create-group')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-dark text-[#111812] text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Criar Novo Grupo
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {activeGroups.map((group, index) => {
            const nextMatch = getNextMatch(group.id);
            const isAdmin = group.role === 'admin';
            const randomMembers = Math.floor(Math.random() * 20) + 10;

            return (
              <article
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-xl border border-[#f0f4f0] dark:border-[#1f3522] transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
              >
                {/* Role Badges */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-warning text-[#111812] text-xs font-bold rounded-full shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                      Admin
                    </span>
                  </div>
                )}

                <div className="p-6 pb-4 flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div
                      className="size-16 rounded-full bg-cover bg-center ring-4 ring-[#f0f4f0] dark:ring-[#2f4532]"
                      style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random&color=fff")` }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111812] dark:text-[#f0f4f0] group-hover:text-primary transition-colors line-clamp-1">{group.name}</h3>
                    <p className="text-[#618965] dark:text-[#a0cba4] text-sm font-medium mt-1">
                      {randomMembers} membros • Futebol
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-b border-[#f0f4f0] dark:border-[#1f3522] bg-[#fcfdfc] dark:bg-[#152618] flex-1 flex flex-col justify-center">
                  {nextMatch ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary-dark dark:text-primary">
                          <span className="material-symbols-outlined text-[18px] filled-icon">calendar_today</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#618965] dark:text-[#a0cba4]">Próxima Pelada</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[#111812] dark:text-[#f0f4f0] text-lg font-bold">
                            {capitalize(formatWeekday(nextMatch.date_time))}, {formatTime(nextMatch.date_time)}
                          </p>
                          <p className="text-[#618965] dark:text-[#a0cba4] text-sm truncate max-w-[150px]">{nextMatch.location}</p>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1a2c1e]" src="https://i.pravatar.cc/100?img=11" alt="" />
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1a2c1e]" src="https://i.pravatar.cc/100?img=12" alt="" />
                          <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1a2c1e] bg-[#f0f4f0] dark:bg-[#2f4532] text-[10px] font-bold text-[#618965] dark:text-[#a0cba4]">+12</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="flex items-center justify-center size-8 rounded-full bg-[#f0f4f0] dark:bg-[#2f4532] text-[#618965]">
                          <span className="material-symbols-outlined text-[18px]">event_busy</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#618965] dark:text-[#a0cba4]">Sem jogo agendado</span>
                      </div>
                      <div className="mt-2 pl-11">
                        <p className="text-sm text-[#618965] dark:text-[#a0cba4]">Aguardando marcação do próximo jogo.</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-auto p-4 bg-white dark:bg-surface-dark">
                  <button className="w-full h-10 rounded-full bg-[#f0f4f0] dark:bg-[#2f4532] hover:bg-primary hover:text-[#111812] text-[#111812] dark:text-[#f0f4f0] font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn">
                    {isAdmin ? 'Gerenciar Grupo' : 'Acessar Grupo'}
                    <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">
                      {isAdmin ? 'settings' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}

          {/* Create New Card Placeholder */}
          <button
            onClick={() => navigate('/create-group')}
            className="flex flex-col items-center justify-center gap-4 bg-transparent border-2 border-dashed border-[#ccd5cc] dark:border-[#2f4532] hover:border-primary dark:hover:border-primary rounded-xl min-h-[300px] group transition-all duration-300 hover:bg-white/50 dark:hover:bg-surface-dark/50 cursor-pointer"
          >
            <div className="size-20 rounded-full bg-[#f0f4f0] dark:bg-[#2f4532] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[40px] text-[#618965] dark:text-[#a0cba4] group-hover:text-primary">add</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#111812] dark:text-[#f0f4f0]">Criar Novo Grupo</h3>
              <p className="text-[#618965] dark:text-[#a0cba4] text-sm mt-1">Comece uma nova pelada hoje</p>
            </div>
          </button>
        </div>
      </main>

      {/* Quick Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => navigate('/create-group')}
          className="flex items-center justify-center size-14 rounded-full bg-primary text-[#111812] shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </Layout>
  );

};

export default Dashboard;
