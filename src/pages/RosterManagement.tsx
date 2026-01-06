
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ShareModal from '../components/features/ShareModal';
import { MOCK_PLAYERS } from '../constants';
import { Player, PlayerPosition, PlayerStatus } from '../types';

const RosterManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Goleiro' | 'Meia' | 'Atacante'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [players, setPlayers] = useState<Player[]>(() =>
    MOCK_PLAYERS.filter(p => ['Mensalista', 'Convidado', 'Organizador'].includes(p.status))
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: 'Meia' as PlayerPosition,
    status: 'Mensalista' as PlayerStatus,
    rating: 4.0,
    avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCategory = (position: string) => {
    if (position === 'Goleiro') return 'Goleiro';
    if (['Meia', 'Meio-Campo', 'Meia-atacante'].includes(position)) return 'Meia';
    if (position === 'Atacante') return 'Atacante';
    return 'Outros';
  };

  // Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesFilter = activeFilter === 'Todos' || getCategory(player.position) === activeFilter;
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm, players]);

  const counts = useMemo(() => {
    return {
      Todos: players.length,
      Goleiro: players.filter(p => getCategory(p.position) === 'Goleiro').length,
      Meia: players.filter(p => getCategory(p.position) === 'Meia').length,
      Atacante: players.filter(p => getCategory(p.position) === 'Atacante').length,
    };
  }, [players]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const playerToAdd: Player = {
      ...newPlayer,
      id: Math.random().toString(36).substr(2, 9),
      paid: false
    };
    setPlayers([playerToAdd, ...players]);
    setIsAddModalOpen(false);
    showToast(`${playerToAdd.name} foi adicionado ao elenco!`);
    setNewPlayer({
      name: '',
      position: 'Meia',
      status: 'Mensalista',
      rating: 4.0,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    });
  };

  const removePlayer = (id: string) => {
    const playerToRemove = players.find(p => p.id === id);
    if (playerToRemove && window.confirm(`Deseja remover ${playerToRemove.name} do elenco?`)) {
      setPlayers(players.filter(p => p.id !== id));
      showToast(`${playerToRemove.name} removido com sucesso.`);
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
              onClick={() => setIsAddModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-text-main font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">person_add</span>
              Adicionar Manualmente
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
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player.id} className="group flex items-center justify-between p-3 md:p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="size-14 rounded-full bg-cover bg-center bg-gray-200 border-2 border-slate-100 dark:border-slate-800" style={{ backgroundImage: `url(${player.avatar})` }}></div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-text-main text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-white flex items-center gap-0.5 shadow-sm">
                      <span className="material-symbols-outlined !text-[10px] icon-filled">star</span> {player.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold leading-tight">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">{player.position}</span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase hidden sm:inline-block tracking-widest">• {player.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex size-10 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => removePlayer(player.id)} className="flex size-10 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"><span className="material-symbols-outlined">person_remove</span></button>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black dark:text-white tracking-tight">Novo Jogador</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Adicione um novo craque ao elenco</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted ml-1">Nome do Jogador</label>
                <input
                  required
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  placeholder="Ex: Neymar Jr."
                  className="h-14 px-5 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-muted ml-1">Posição</label>
                  <select
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value as PlayerPosition })}
                    className="h-14 px-5 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Goleiro">Goleiro</option>
                    <option value="Zagueiro">Zagueiro</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Meia">Meia</option>
                    <option value="Meio-Campo">Meio-Campo</option>
                    <option value="Meia-atacante">Meia-atacante</option>
                    <option value="Atacante">Atacante</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-muted ml-1">Vínculo</label>
                  <select
                    value={newPlayer.status}
                    onChange={(e) => setNewPlayer({ ...newPlayer, status: e.target.value as PlayerStatus })}
                    className="h-14 px-5 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Mensalista">Mensalista</option>
                    <option value="Avulso">Avulso</option>
                    <option value="Convidado">Convidado</option>
                    <option value="Organizador">Organizador</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-text-muted">Nível Técnico (Rating)</label>
                  <span className="text-primary font-black">{newPlayer.rating.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer({ ...newPlayer, rating: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <span>Perninha</span>
                  <span>Craque</span>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-primary text-text-main font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Confirmar Craque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </Layout>
  );
};

export default RosterManagement;
