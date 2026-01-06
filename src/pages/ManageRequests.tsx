import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useManageRequests } from '../hooks/useManageRequests';
import { formatDate, formatTime } from '../utils/format';

const ManageRequests: React.FC = () => {
  const { requests, loading, approveRequest, declineRequest } = useManageRequests();
  const [historyCount, setHistoryCount] = useState(0); // Placeholder for now

  return (
    <Layout>
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-40">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1 gap-6">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111812] dark:text-white tracking-tight text-3xl md:text-[32px] font-bold leading-tight border-none pb-0">Solicitações de Entrada</h1>
              <p className="text-[#618965] dark:text-gray-400 text-sm font-normal leading-normal">Gerencie os novos jogadores do seu grupo.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#1a2e1d] shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">group_add</span>
                </div>
                <p className="text-[#111812] dark:text-gray-200 text-base font-medium leading-normal">Pendentes</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111812] dark:text-white tracking-tight text-3xl font-bold leading-tight">{requests.length}</p>
              </div>
            </div>
            {/* 
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#1a2e1d] shadow-sm border border-gray-100 dark:border-white/5 opacity-80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <p className="text-[#111812] dark:text-gray-200 text-base font-medium leading-normal">Aprovados</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111812] dark:text-white tracking-tight text-3xl font-bold leading-tight">{historyCount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal mb-1">teste</p>
              </div>
            </div>
            */}
          </div>

          {/* Requests List */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Lista de Espera</h3>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {requests.map((request) => (
                  <div key={`${request.match_id}-${request.user_id}`} className="group flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all hover:shadow-md hover:border-primary/30 animate-in fade-in duration-300">
                    <div className="flex flex-1 items-center gap-4">
                      {request.profile?.avatar_url ? (
                        <div
                          className="shrink-0 bg-center bg-no-repeat bg-cover rounded-full size-14 border-2 border-white dark:border-gray-700 shadow-sm"
                          style={{ backgroundImage: `url("${request.profile.avatar_url}")` }}
                        ></div>
                      ) : (
                        <div className="shrink-0 flex items-center justify-center rounded-full size-14 border-2 border-white dark:border-gray-700 shadow-sm bg-gradient-to-br from-yellow-200 to-orange-400">
                          <span className="text-white font-bold text-xl drop-shadow-md">
                            {request.profile?.name?.substring(0, 2).toUpperCase() || 'AN'}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col justify-center">
                        <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight line-clamp-1">{request.profile?.name || 'Jogador Anônimo'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-[16px] text-[#618965]">event</span>
                          <p className="text-[#618965] dark:text-gray-400 text-sm font-normal leading-normal">
                            {request.match ? `${formatDate(request.match.date_time)} - ${request.match.location}` : 'Partida desconhecida'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <button
                        onClick={() => declineRequest(request.user_id, request.match_id)}
                        className="flex-1 md:flex-none h-11 px-6 rounded-full border border-gray-200 dark:border-gray-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                        Recusar
                      </button>
                      <button
                        onClick={() => approveRequest(request.user_id, request.match_id)}
                        className="flex-1 md:flex-none h-11 px-6 rounded-full bg-primary hover:bg-[#10c820] text-[#111812] font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                        Aprovar
                      </button>
                    </div>
                  </div>
                ))}

                {requests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">person_search</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Nenhuma solicitação pendente no momento.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageRequests;
