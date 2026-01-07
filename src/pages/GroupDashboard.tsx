import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';
import GroupTabs from '../components/common/GroupTabs';
import { useMatches } from '../hooks/useMatches';
import { useGroups } from '../hooks/useGroups';
import { formatDate, formatTime } from '../utils/format';
import { supabase } from '../lib/supabase';

const GroupDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { groups, loading: groupsLoading } = useGroups();
  const { matches, loading: matchesLoading, refetch: refetchMatches } = useMatches();

  const group = groups.find(g => g.id === groupId);

  // Edit Match State
  const [isEditingMatch, setIsEditingMatch] = React.useState(false);
  const [isSavingMatch, setIsSavingMatch] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    date: '',
    time: '',
    location: ''
  });

  // Find next match for THIS group
  const nextMatch = matches
    .filter(m => m.group_id === groupId && m.status === 'scheduled')
    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];

  const handleEditClick = () => {
    if (!nextMatch) return;
    const dateObj = new Date(nextMatch.date_time);
    setEditForm({
      date: dateObj.toISOString().split('T')[0],
      time: dateObj.toTimeString().slice(0, 5),
      location: nextMatch.location
    });
    setIsEditingMatch(true);
  };

  const handleSaveMatch = async () => {
    if (!nextMatch) return;
    try {
      setIsSavingMatch(true);
      // Combine date and time
      const dateTime = new Date(`${editForm.date}T${editForm.time}:00`).toISOString();

      const { error } = await supabase
        .from('matches')
        .update({
          location: editForm.location,
          date_time: dateTime
        })
        .eq('id', nextMatch.id);

      if (error) throw error;

      await refetchMatches();
      setIsEditingMatch(false);
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Erro ao atualizar partida');
    } finally {
      setIsSavingMatch(false);
    }
  };

  const isLoading = groupsLoading || matchesLoading;

  const quickActions = [
    { name: 'Membros', icon: 'groups', path: `/groups/${groupId}/roster`, color: 'bg-orange-100 text-orange-600', desc: 'Gerenciar jogadores' },
    { name: 'Placar', icon: 'scoreboard', path: '/scoreboard', color: 'bg-primary/10 text-primary-dark', desc: 'Cronômetro e gols' },
    { name: 'Explorar', icon: 'search', path: '/explore', color: 'bg-primary/10 text-primary-dark', desc: 'Encontrar partidas' },
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

  if (!group) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
          <div className="size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main dark:text-white">Grupo não encontrado</h1>
          <p className="text-text-muted">Este grupo não existe ou você não tem acesso a ele.</p>
          <button onClick={() => navigate('/dashboard')} className="text-primary font-bold hover:underline">
            Voltar ao Início
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Grupo Ativo</span>
              {group.role === 'admin' && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>
              )}
            </div>

            <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {group.name}
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-base md:text-lg font-normal">
              {group.description || 'Sem descrição definida.'}
            </p>
          </div>

          {group.role === 'admin' && (
            <button
              onClick={() => navigate(`/groups/${group.id}/settings`)}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors bg-white dark:bg-surface-dark px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Configurações</span>
            </button>
          )}
        </header>

        {/* Quick Links Section */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.path} // Note: Ideally paths should be relative to group or context aware? 
              // Currently global paths like /roster imply "current group" in context. 
              // For MVP we assume global context is set or simple paths work.
              // Ideally /groups/:id/roster - but sticking to simple refactor.
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
            {/* Match Card or Empty State */}
            {!nextMatch ? (
              /* Empty State - No Matches */
              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                  Nenhuma partida criada ainda.
                </h3>
                <p className="text-text-muted dark:text-gray-400 mb-6">
                  Convide a galera e organize o próximo jogo.
                </p>
                <button
                  onClick={() => navigate('/schedule-match')}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-text-main px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Criar primeira partida
                </button>
              </div>
            ) : (
            /* Match Card */
            <article className="relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl">
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
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-primary font-bold text-xs uppercase tracking-wider">Próxima Partida</p>
                          {group.role === 'admin' && (
                            <button
                              onClick={handleEditClick}
                              className="size-6 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
                              title="Editar data/local"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                          )}
                        </div>
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
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Membros</h3>
            <p className="text-text-muted text-sm mb-4">Gerencie seu elenco e convide novos jogadores.</p>
            <button onClick={() => navigate('/roster')} className="w-full py-2 bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-border-dark rounded-lg text-sm font-bold transition-colors">
              Ver todos
            </button>
          </div>
        </div>

      </div>
    </main>
      {/* Edit Match Modal */ }
  {
    isEditingMatch && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-text-main dark:text-white">Editar Partida</h3>
            <button
              onClick={() => setIsEditingMatch(false)}
              className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-text-muted hover:text-text-main transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Data</label>
              <input
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full h-12 rounded-xl bg-gray-50 dark:bg-surface-dark border-transparent focus:border-primary focus:ring-0 text-text-main dark:text-white px-4 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Horário</label>
              <input
                type="time"
                value={editForm.time}
                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                className="w-full h-12 rounded-xl bg-gray-50 dark:bg-surface-dark border-transparent focus:border-primary focus:ring-0 text-text-main dark:text-white px-4 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Local</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Ex: Arena Soccer"
                className="w-full h-12 rounded-xl bg-gray-50 dark:bg-surface-dark border-transparent focus:border-primary focus:ring-0 text-text-main dark:text-white px-4 transition-all"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-surface-dark/50 flex gap-3">
            <button
              onClick={() => setIsEditingMatch(false)}
              className="flex-1 h-12 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveMatch}
              disabled={isSavingMatch}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-text-main font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {isSavingMatch ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    )
  }
    </Layout >
  );
};

export default GroupDashboard;
