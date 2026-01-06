
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ShareModal from '../components/features/ShareModal';
import { useGroupMembers, GroupMember } from '../hooks/useGroupMembers';

const RosterManagement: React.FC = () => {
  const navigate = useNavigate();
  const { members, loading, removeMember } = useGroupMembers();

  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Goleiro' | 'Meia' | 'Atacante'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCategory = (position: string) => {
    if (position === 'Goleiro') return 'Goleiro';
    if (['Meia', 'Meio-Campo', 'Meia-atacante', 'Zagueiro', 'Lateral'].includes(position)) return 'Meia'; // Simplified for filter
    if (position === 'Atacante') return 'Atacante';
    return 'Outros';
  };

  const filteredPlayers = useMemo(() => {
    return members.filter(player => {
      const matchesFilter = activeFilter === 'Todos' || getCategory(player.position || '') === activeFilter;
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.position || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm, members]);

  const counts = useMemo(() => {
    return {
      Todos: members.length,
      Goleiro: members.filter(p => getCategory(p.position || '') === 'Goleiro').length,
      Meia: members.filter(p => getCategory(p.position || '') === 'Meia').length,
      Atacante: members.filter(p => getCategory(p.position || '') === 'Atacante').length,
    };
  }, [members]);

  const handleRemovePlayer = async (id: string, name: string) => {
    if (window.confirm(`Deseja remover ${name} do elenco?`)) {
      const success = await removeMember(id);
      if (success) {
        showToast(`${name} removido com sucesso.`);
      } else {
        showToast(`Erro ao remover ${name}.`, 'error');
      }
    }
  };

  const filterButtonClass = (filter: typeof activeFilter) =>
    `whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${activeFilter === filter
      ? 'bg-primary text-text-main shadow-md shadow-primary/20'
      : 'bg-white dark:bg-surface-dark text-text-secondary border border-slate-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
    }`;

  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight tracking-tight">Gerenciar Elenco</h1>
            <p className="text-text-secondary text-base">Organize as posições e o nível técnico do seu time.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="h-12 px-6 rounded-full bg-white dark:bg-surface-dark text-text-main border border-slate-200 dark:border-slate-700 font-bold text-sm flex items-center gap-2 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Voltar</span>
            </button>
            <button onClick={() => setIsShareModalOpen(true)} className="h-12 px-6 rounded-full bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-800 text-text-main dark:text-white font-bold text-sm flex items-center gap-2 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-[20px]">share</span>
              <span className="hidden sm:inline">Convidar</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm mb-6 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 rounded-xl bg-background-light dark:bg-background-dark border-transparent focus:ring-2 focus:ring-primary pl-10 font-medium transition-all"
                placeholder="Buscar jogador por nome ou posição..."
                type="text"
              />
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-text-main font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">group_add</span>
              Convidar Jogadores
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveFilter('Todos')} className={filterButtonClass('Todos')}>Todos ({counts.Todos})</button>
          <button onClick={() => setActiveFilter('Goleiro')} className={filterButtonClass('Goleiro')}>Goleiros ({counts.Goleiro})</button>
          <button onClick={() => setActiveFilter('Meia')} className={filterButtonClass('Meia')}>Meias ({counts.Meia})</button>
          <button onClick={() => setActiveFilter('Atacante')} className={filterButtonClass('Atacante')}>Atacantes ({counts.Atacante})</button>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player.id} className="group flex items-center justify-between p-3 md:p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {player.avatar_url ? (
                      <div className="size-14 rounded-full bg-cover bg-center bg-gray-200 border-2 border-slate-100 dark:border-slate-800" style={{ backgroundImage: `url(${player.avatar_url})` }}></div>
                    ) : (
                      <div className="size-14 rounded-full flex items-center justify-center bg-slate-200 border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                        {player.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-text-main text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-white flex items-center gap-0.5 shadow-sm">
                      <span className="material-symbols-outlined !text-[10px] icon-filled">star</span> {player.rating?.toFixed(1) || '5.0'}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold leading-tight">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">{player.position || 'N/A'}</span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase hidden sm:inline-block tracking-widest">• {player.role === 'admin' ? 'Organizador' : 'Membro'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex size-10 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => handleRemovePlayer(player.id, player.name)} className="flex size-10 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"><span className="material-symbols-outlined">person_remove</span></button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-6xl text-slate-300">person_search</span>
              <p className="text-text-secondary font-medium">Nenhum jogador encontrado com estes critérios.</p>
              <button onClick={() => { setSearchTerm(''); setActiveFilter('Todos'); }} className="text-primary font-bold text-sm hover:underline">Limpar filtros</button>
            </div>
          )}
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <span className="material-symbols-outlined text-2xl">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}
    </Layout>
  );
};

export default RosterManagement;
