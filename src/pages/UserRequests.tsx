import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMyRequests } from '../hooks/useMyRequests';
import { formatDate, formatTime } from '../utils/format';

type RequestStatus = 'Todos' | 'Pendentes' | 'Aprovadas' | 'Recusadas';

const UserRequests: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<RequestStatus>('Todos');
  const { requests, loading } = useMyRequests();

  // Helper to map DB status to UI status
  const mapStatus = (dbStatus: string) => {
    switch (dbStatus) {
      case 'approved': return 'Aprovada';
      case 'declined': return 'Recusada';
      default: return 'Pendente';
    }
  };

  const filteredRequests = requests.filter(req => {
    const uiStatus = mapStatus(req.status);
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Pendentes') return uiStatus === 'Pendente';
    if (activeFilter === 'Aprovadas') return uiStatus === 'Aprovada';
    if (activeFilter === 'Recusadas') return uiStatus === 'Recusada';
    return true;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111812] dark:text-white font-display min-h-screen flex flex-col antialiased transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-[#f0f4f0] dark:border-[#1f3322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl icon-filled">sports_soccer</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-[#111812] dark:text-white">PeladaApp</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" to="/explore">Buscar Jogos</Link>
              <Link className="text-sm font-black text-primary border-b-2 border-primary pb-0.5" to="/my-requests">Meus Pedidos</Link>
              <Link className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" to="/profile">Perfil</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer shadow-sm"
              >
                <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7dzPug1ov8pzk17xTD1F5jqMOZ_F9BqwTYSOKCPmbwfYcy2FBKCfyxkF_T3fcGXNcnQEEt-BnO5RfXJFerkAX3VyXrkF3FdWeeV6L4UccPsf9HNErkB4Yj0Jkr8bJC56aiVzToWZmP5FpmXFXXzNgilYsbYrSEzoOd3qotDK83A__rtSUWaA7EdoBF8krDhKlSlmr-5PigG-DKQPZAQ9Udo683hoEZLMdjTZV2ALira7smqXn4DEHJusDDmdgKgf_HFRH5eP7D2k" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Heading */}
        <div className="mb-10">
          <h2 className="text-4xl font-black tracking-tight mb-3">Meus Pedidos</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
            Acompanhe o status das suas solicitações para entrar nas peladas. Gerencie suas aprovações e jogos pendentes.
          </p>
        </div>

        {/* Filters (Chips) */}
        <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {(['Todos', 'Pendentes', 'Aprovadas', 'Recusadas'] as RequestStatus[]).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeFilter === filter
                  ? 'bg-primary text-[#102212] shadow-xl shadow-primary/20'
                  : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-[#2a3c2d] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#223625]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {filter === 'Todos' ? 'view_list' : filter === 'Pendentes' ? 'schedule' : filter === 'Aprovadas' ? 'check_circle' : 'cancel'}
              </span>
              {filter}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredRequests.map(request => {
              const uiStatus = mapStatus(request.status);
              // Fallback image based on ID parity simple hash
              const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDm13Wo24W9E7GWnWn6pIAYJTas0ntGVJmOxUoGr8O5hY5maJY4KKRR9yoLfAKzrvig1NtFd74OxU4LhL4UiE1ma0Ez44AB9nmX7LvdmnmmgEEDevY0-Iv3q_7ty88aox9jutcHv-KfbV5C4ufyqJZhM4VIhW2i5MAkLtIcoRihi2trhESB7N4Mhys8t2A_O9HsdY-47wJqUpIuVL7GmOUUPEnN3PfoOFQXGOrGc3p54iMWOXLyKzLVZ1_N_63C06Uabi8u-kK0120";

              return (
                <div
                  key={request.match_id}
                  className={`group bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm hover:shadow-2xl border-2 border-transparent hover:border-primary/20 transition-all duration-500 flex flex-col sm:flex-row gap-6 ${uiStatus === 'Recusada' ? 'opacity-80 grayscale-[0.5]' : ''}`}
                >
                  <div className="w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden relative shadow-inner">
                    <img
                      alt="Match Location"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={fallbackImage}
                    />
                    <div className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md ${uiStatus === 'Aprovada' ? 'bg-primary text-[#102212]' :
                        uiStatus === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      <span className="material-symbols-outlined text-[14px] icon-filled">
                        {uiStatus === 'Aprovada' ? 'check' : uiStatus === 'Pendente' ? 'schedule' : 'block'}
                      </span>
                      {uiStatus.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-[#111812] dark:text-white leading-tight group-hover:text-primary transition-colors">
                          Partida em {request.match.location.split('-')[0]}
                        </h3>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-bold font-mono">#{request.match_id.slice(0, 4)}</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                          <span className={`material-symbols-outlined text-[20px] ${uiStatus === 'Aprovada' ? 'text-primary' : 'text-gray-400'}`}>calendar_month</span>
                          <span>{formatDate(request.match.date_time)} às {formatTime(request.match.date_time)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                          <span className={`material-symbols-outlined text-[20px] ${uiStatus === 'Aprovada' ? 'text-primary' : 'text-gray-400'}`}>location_on</span>
                          <span className="truncate">{request.match.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2a3c2d]">
                      {uiStatus === 'Aprovada' ? (
                        <button
                          onClick={() => navigate(`/match/${request.match_id}`)}
                          className="w-full bg-primary hover:bg-[#11d820] text-[#102212] font-black py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                          Ver Detalhes
                        </button>
                      ) : uiStatus === 'Pendente' ? (
                        <button
                          className="w-full bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 border-2 border-red-50 dark:border-red-900/30 transition-all active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[20px]">cancel</span>
                          Cancelar Solicitação
                        </button>
                      ) : (
                        <button className="w-full bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                          Remover da Lista
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-24 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
              <span className="material-symbols-outlined text-5xl">inventory_2</span>
            </div>
            <h3 className="text-2xl font-black mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">Você não tem solicitações com este status no momento.</p>
          </div>
        )}

        {/* Pagination / Load More */}
        {filteredRequests.length > 10 && (
          <div className="mt-16 flex justify-center">
            <button className="group text-gray-500 dark:text-gray-400 font-black hover:text-primary transition-colors flex items-center gap-3 py-4 px-8 rounded-full hover:bg-gray-50 dark:hover:bg-surface-dark">
              Carregar mais solicitações
              <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer Branded */}
      <footer className="w-full px-4 lg:px-40 py-12 flex justify-center bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 mt-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined icon-filled">sports_soccer</span>
            </div>
            <span className="text-lg font-black dark:text-white tracking-tight">Pelada App</span>
          </div>
          <div className="flex gap-10 text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            <a className="hover:text-primary transition-colors" href="#">Sobre</a>
            <a className="hover:text-primary transition-colors" href="#">Funcionalidades</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRequests;
