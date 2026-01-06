import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useManageRequests } from '../hooks/useManageRequests';

const ManageRequests: React.FC = () => {
  const { requests, loading, approveRequest, declineRequest } = useManageRequests();
  const [filter, setFilter] = useState<'all' | 'new' | 'pending' | 'history'>('all');

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
    return `Há ${Math.floor(diff / 86400)} dias`;
  };

  return (
    <Layout>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#111812] dark:text-white">Gerenciar Solicitações</h2>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl">
            Administre os pedidos de entrada nas partidas dos seus grupos. Aprove ou recuse novos jogadores com facilidade.
          </p>
        </div>

        {/* Alert Box */}
        {requests.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-800/50 rounded-full shrink-0">
              <span className="material-symbols-outlined text-yellow-700 dark:text-yellow-400">notifications_active</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-100">Existem novas solicitações pendentes</h3>
              <p className="text-yellow-800 dark:text-yellow-200/80 text-sm">
                Você tem <strong>{requests.length} {requests.length === 1 ? 'novo pedido' : 'novos pedidos'}</strong> de jogadores querendo entrar. Revise-os abaixo.
              </p>
            </div>
            {/* <button className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 whitespace-nowrap">
                            Marcar como lidas
                        </button> */}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'Todas', icon: 'view_list' },
            { id: 'new', label: 'Novas', icon: 'fiber_new' },
            { id: 'pending', label: 'Pendentes', icon: 'schedule' },
            { id: 'history', label: 'Histórico', icon: 'history' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${filter === tab.id
                ? 'bg-primary text-[#102212] shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30'
                : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-[#2a3c2d] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#223625]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={`${request.match_id}-${request.user_id}`} className="group bg-white dark:bg-surface-dark rounded-xl p-5 shadow-md shadow-orange-100/50 dark:shadow-none hover:shadow-lg border-2 border-orange-300 dark:border-orange-500/50 transition-all duration-300 flex flex-col sm:flex-row gap-5 relative overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-400 to-transparent opacity-20 dark:opacity-40 pointer-events-none"></div>

                  {/* Avatar Column */}
                  <div className="w-full sm:w-32 h-32 shrink-0 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                    {request.profile?.avatar_url ? (
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${request.profile.avatar_url}")` }}></div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-400">
                        <span className="text-white font-bold text-3xl opacity-80">{request.profile?.name?.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[12px]">fiber_new</span> NOVO
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-[#111812] dark:text-white leading-tight line-clamp-1">Solicitante: {request.profile?.name}</h3>
                        <span className="text-orange-500 dark:text-orange-400 font-bold text-xs whitespace-nowrap ml-2">{getTimeAgo(request.created_at)}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                          <span className="line-clamp-1" title={request.match?.group?.name || request.match?.location}>
                            Para: {request.match?.group?.name ? request.match.group.name : `Partida em ${request.match?.location}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="material-symbols-outlined text-[18px] text-gray-400">sports_score</span>
                          <span className="truncate">Posição: {request.profile?.position || 'Não informada'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2a3c2d] grid grid-cols-2 gap-3">
                      <button
                        onClick={() => approveRequest(request.user_id, request.match_id)}
                        className="bg-primary hover:bg-[#11d820] text-[#102212] font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm shadow-primary/20"
                      >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        Aprovar
                      </button>
                      <button
                        onClick={() => declineRequest(request.user_id, request.match_id)}
                        className="bg-white dark:bg-[#223625] hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 border border-gray-200 dark:border-[#2a3c2d] font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        Recusar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4 text-gray-400">
                <div className="size-24 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg dark:text-gray-300">Tudo limpo por aqui!</p>
                  <p className="text-sm">Não há novas solicitações pendentes.</p>
                </div>
                <button
                  className="mt-4 text-primary font-bold text-sm hover:underline"
                  onClick={() => setFilter('history')}
                >
                  Ver histórico de aprovações
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button className="text-gray-500 dark:text-gray-400 font-medium hover:text-primary transition-colors flex items-center gap-2">
            Carregar solicitações antigas
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default ManageRequests;
