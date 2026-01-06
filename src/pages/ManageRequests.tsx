
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

interface RequestItem {
  id: string;
  name: string;
  avatar: string;
  date: string;
  timeLabel: string;
}

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0qjRG64OqIFmSiCw3Fi5pBUzsjemVTAWwk8FCfupBhmUxA-dmTeNbIKj-aULj4UwmNJ4uxJUtl6CTSzvHi8FdS7-XwYQtw4g6883B8bExgT23T84Td4mDiiQeTsgjLnOOpbhNFzb72JXWN3p6zl6NyfBet30xF-RswkQugCukS5zyIZKb0UezHJ6d56AZQDXgh9V7JOt-ilhVpj4T2mf0Z50XRaAhr2auJ86-8tJd2cAi8CXE1lL7KZW_r0NXQDTekEMpdRR4SU8',
    date: 'Solicitado em: 12/05/2024',
    timeLabel: 'calendar_today',
  },
  {
    id: '2',
    name: 'Carlos Ferreira',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtA2GuPySimoo6vsfn7SVpPnTtmxxPv0kEvjlFaN-0eVVjqKfapyMxeymesVE3Jbw_Flidw0BxTMIAn4aoITjN1D600GETSF_fN1J7TVRACQZABwFh7REqDVAAZwt8p5uwuPsyKZ7BT6uTJnG0C_9qead6pM5BzxYD9fByPSUlVNA1Wm_1DYVkKBNbgb3ZGcvaov6peBeEC6j4vNbLyomml3pesucXs6PLEkUKil9oTpI9dx-K0mQ3XjZJl5hzDaTHunPR2JPGClc',
    date: 'Há 2 horas',
    timeLabel: 'schedule',
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOXhs_4W3uX8JZ717qvDvFnS-rLEkSOnhKrSYJNbICJ6gpofMgvy75ZVkKXa-7wDu5-9r8YdCgMqYPa-VMi1K31s4CQHejR9mSBKT77brQA40NZFD7i460IMvuSKLtChW1JdLwH6GAWVxyuvI_sHikZrxUCIs7kI-Bq6jVHimJEv4hCBfSYTiFa7Wv8yr3G-WYPRGByHtPKwQ7WLG2Otx-qV2D_IMqeZ0tk4Ql-CtprUaPj6cdyTrVVncxfGnUiOlu2kNhB9GdsWI',
    date: 'Solicitado em: 10/05/2024',
    timeLabel: 'calendar_today',
  },
  {
    id: '4',
    name: 'Felipe Rocha',
    avatar: '', // Use gradient as in original
    date: 'Solicitado em: 09/05/2024',
    timeLabel: 'calendar_today',
  }
];

const ManageRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [approvedCount, setApprovedCount] = useState(12);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setApprovedCount(prev => prev + 1);
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

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
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 rounded-full h-10 px-5 bg-[#f0f4f0] dark:bg-gray-800 text-[#111812] dark:text-gray-200 text-sm font-medium leading-normal hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-[20px]">history</span>
                <span className="truncate">Histórico</span>
              </button>
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
                <p className="text-primary text-sm font-medium leading-normal mb-1">+2 hoje</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#1a2e1d] shadow-sm border border-gray-100 dark:border-white/5 opacity-80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <p className="text-[#111812] dark:text-gray-200 text-base font-medium leading-normal">Aprovados</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111812] dark:text-white tracking-tight text-3xl font-bold leading-tight">{approvedCount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal mb-1">esta semana</p>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Lista de Espera</h3>

            {requests.map((request) => (
              <div key={request.id} className="group flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all hover:shadow-md hover:border-primary/30 animate-in fade-in duration-300">
                <div className="flex flex-1 items-center gap-4">
                  {request.avatar ? (
                    <div
                      className="shrink-0 bg-center bg-no-repeat bg-cover rounded-full size-14 border-2 border-white dark:border-gray-700 shadow-sm"
                      style={{ backgroundImage: `url("${request.avatar}")` }}
                    ></div>
                  ) : (
                    <div className="shrink-0 flex items-center justify-center rounded-full size-14 border-2 border-white dark:border-gray-700 shadow-sm bg-gradient-to-br from-yellow-200 to-orange-400">
                      <span className="text-white font-bold text-xl drop-shadow-md">{request.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight line-clamp-1">{request.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-[#618965]">{request.timeLabel}</span>
                      <p className="text-[#618965] dark:text-gray-400 text-sm font-normal leading-normal">{request.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => handleDecline(request.id)}
                    className="flex-1 md:flex-none h-11 px-6 rounded-full border border-gray-200 dark:border-gray-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    Recusar
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
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
          </div>

          {/* Pagination / Load More */}
          {requests.length > 0 && (
            <div className="flex justify-center mt-6">
              <button className="text-[#111812] dark:text-gray-300 text-sm font-bold hover:underline">
                Carregar mais solicitações
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageRequests;
