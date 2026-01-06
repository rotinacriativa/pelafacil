
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
// import { MOCK_PLAYERS, MOCK_MATCHES } from '../constants';
const MOCK_PLAYERS: any[] = [];
const MOCK_MATCHES: any[] = [];

const StatsPage: React.FC = () => {
  const navigate = useNavigate();

  const topScorers = [
    { id: '1', name: 'João Silva', position: 'Atacante', goals: 18, matches: 12, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZW_kwaenCB-DzyTzPEChwf4ScgHQEAUbpX9-wCdFYtASk6TMirrm0ONGAX8DD6IJHFzrel2U9vJ1dx5dHHcPcm9n4SnevCvARn5A_tZbAH44v7pA5bcZKeM8FXgs8OyWGnG6wTwqEDw6Bzz5WpGEp-94-er-qhdisSVqR0PFcgQZbDFTe4X-HQrCc6uaK_rviE5jnu6KVxpufjXsBQMj5D4sl5yxgNaFwLKjwEpBeSJQlN0yZaEUdy5evN0E0bfAahffm32WgHmQ' },
    { id: '2', name: 'Carlos', position: 'Meio-campo', goals: 15, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHm3ojh5ZKv2ddecUPtjoLADK4UasNhEevRQ3udD54Mo1jvpztFpLQsSyyhZCSGUoEApVPbWnYOlDHu5YEpM7GK1HcP49wetuktWtb2rl4vtOLllNT_UKWlGS6mQGRELvjHNA7Wn7sZSuZrZhSKoP_dOOYDaM-jInyVO71XJWgBRmZcWX1FcEoYSJIj9KHb2dNC0TAk17DqR1VAdTmYvEsm5qEY2mst2hbAWgkKHLbtNSJWNg4_H21vFB8W59IT_gPqAFMBeC5KC0' },
    { id: '3', name: 'Felipe', position: 'Lateral', goals: 12, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeFl1gliVWmrddFS2RdIkHuFGDdl1pbLQ0TuSgq94HuFpZQpu_pxipzyYDU5BmgZFxRLd7zfWXiXEfn0bu2n3qjfsO460ZIWJTZRw5RoVMzYJ-RUl4eH4Ygj6QLlJZzg-nAjdCkbw3YbI9ebz9bf0ZuHs0A0qujU2PQeqiJRRhb8F1FC0cKBTAd95sdNulAaEKoeHgkEINSdlvGtRh0XTnZTspsHyPmWb_FSqjKuoXGZ-hbGCODOYHPRq8Tvoi3pvCOaQFcFGR1RA' },
    { id: '4', name: 'André Souza', position: 'Meia-atacante', goals: 10, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsh67QPQK5IPbTHC1a887T7p0SJSwQGxQwq39_Zf_2HkliW1XnJW70xDPpfScAE94cHS86QK87vLBVmSRENJzZpvbo3x_0n9TSSSxaGIClhAQLb5oatC5BaBHCRmXcTAfYxCQqA9ZvkLpx3_JGZqqOLY51RxR7q0r6o3yCyGfGt1aTv-h96xM8HR5cQ9IhpHpzHPiyCbkaLEnYvAujX8yDBY9jlbSeDjiept4rRUzFCVBAShosTZpe81w7rBYdjze-hC7Nj4xY0rs' },
    { id: '5', name: 'Ricardo Oliveira', position: 'Atacante', goals: 8, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_wjWOD02IBUxwlY4oSbe4eBsbQZdC1sEhrR_3CkL6WembG_EivXR2fUH-yF025KVi0aSNriWWWFJ4H_7PF_juSStSOsrz1myd6o2ALiJ8Tha7Ih5XfhoXqRIkw428WPUx6cHZNp1rLW4QBhuffdNHHXpZgFHwF8HjLIR2jCH2QS2ZiZ_S7McPUBMKh4NpSp8KyN-aBymI-Ha1oWZV-dSQZsdo0UVUsVoe0R9I-62Yb2z3mti02jcq1e-lZhwaGP5J7lT1guB1G4s' }
  ];

  const topPresence = [
    { id: '1', name: 'Felipe', position: 'Lateral', games: 24, percent: 100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeFl1gliVWmrddFS2RdIkHuFGDdl1pbLQ0TuSgq94HuFpZQpu_pxipzyYDU5BmgZFxRLd7zfWXiXEfn0bu2n3qjfsO460ZIWJTZRw5RoVMzYJ-RUl4eH4Ygj6QLlJZzg-nAjdCkbw3YbI9ebz9bf0ZuHs0A0qujU2PQeqiJRRhb8F1FC0cKBTAd95sdNulAaEKoeHgkEINSdlvGtRh0XTnZTspsHyPmWb_FSqjKuoXGZ-hbGCODOYHPRq8Tvoi3pvCOaQFcFGR1RA' },
    { id: '2', name: 'João Silva', position: 'Atacante', games: 23, percent: 96, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZW_kwaenCB-DzyTzPEChwf4ScgHQEAUbpX9-wCdFYtASk6TMirrm0ONGAX8DD6IJHFzrel2U9vJ1dx5dHHcPcm9n4SnevCvARn5A_tZbAH44v7pA5bcZKeM8FXgs8OyWGnG6wTwqEDw6Bzz5WpGEp-94-er-qhdisSVqR0PFcgQZbDFTe4X-HQrCc6uaK_rviE5jnu6KVxpufjXsBQMj5D4sl5yxgNaFwLKjwEpBeSJQlN0yZaEUdy5evN0E0bfAahffm32WgHmQ' },
    { id: '3', name: 'Lucas Mendes', position: 'Zagueiro', games: 21, percent: 87, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnN-LJ-mwZ3Epeop-m_hzRt92_I6iybUc4aocqU4Ty6GqNq49N3Ql7_KGsPv9S1En1YosskpC8vAATBPj3SuFsP1OrgnPBGY5THsehUYyFzhF1m1eOxMhAFD_CCJFFuVNIHYnZbGY4ojnGQSiR37ZDtOx4V6rpMZvgIYiddtdlWclK2Ac9NmTPTemtuzvEFy7VJ6wJ7p7Y4VasNbBtky3AB3GiVivl9SodwdcXV1qulimIcQk5_NYLFOSN-rBCRkZYbTkuUFr-zD0' },
    { id: '4', name: 'Carlos', position: 'Meio-campo', games: 19, percent: 79, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHm3ojh5ZKv2ddecUPtjoLADK4UasNhEevRQ3udD54Mo1jvpztFpLQsSyyhZCSGUoEApVPbWnYOlDHu5YEpM7GK1HcP49wetuktWtb2rl4vtOLllNT_UKWlGS6mQGRELvjHNA7Wn7sZSuZrZhSKoP_dOOYDaM-jInyVO71XJWgBRmZcWX1FcEoYSJIj9KHb2dNC0TAk17DqR1VAdTmYvEsm5qEY2mst2hbAWgkKHLbtNSJWNg4_H21vFB8W59IT_gPqAFMBeC5KC0' }
  ];

  const matchPerformanceData = [
    { matchId: 'm1', matchName: 'Arena Soccer (14/11)', player: 'Carlos Silva', goals: 2, assists: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
    { matchId: 'm1', matchName: 'Arena Soccer (14/11)', player: 'André Santos', goals: 1, assists: 3, avatar: 'https://i.pravatar.cc/150?u=2' },
    { matchId: 'm1', matchName: 'Arena Soccer (14/11)', player: 'Felipe Costa', goals: 3, assists: 0, avatar: 'https://i.pravatar.cc/150?u=3' },
    { matchId: 'm2', matchName: 'Arena Jardim (12/11)', player: 'João Silva', goals: 3, assists: 1, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZW_kwaenCB-DzyTzPEChwf4ScgHQEAUbpX9-wCdFYtASk6TMirrm0ONGAX8DD6IJHFzrel2U9vJ1dx5dHHcPcm9n4SnevCvARn5A_tZbAH44v7pA5bcZKeM8FXgs8OyWGnG6wTwqEDw6Bzz5WpGEp-94-er-qhdisSVqR0PFcgQZbDFTe4X-HQrCc6uaK_rviE5jnu6KVxpufjXsBQMj5D4sl5yxgNaFwLKjwEpBeSJQlN0yZaEUdy5evN0E0bfAahffm32WgHmQ' },
    { matchId: 'm2', matchName: 'Arena Jardim (12/11)', player: 'Carlos', goals: 1, assists: 1, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHm3ojh5ZKv2ddecUPtjoLADK4UasNhEevRQ3udD54Mo1jvpztFpLQsSyyhZCSGUoEApVPbWnYOlDHu5YEpM7GK1HcP49wetuktWtb2rl4vtOLllNT_UKWlGS6mQGRELvjHNA7Wn7sZSuZrZhSKoP_dOOYDaM-jInyVO71XJWgBRmZcWX1FcEoYSJIj9KHb2dNC0TAk17DqR1VAdTmYvEsm5qEY2mst2hbAWgkKHLbtNSJWNg4_H21vFB8W59IT_gPqAFMBeC5KC0' },
    { matchId: 'm2', matchName: 'Arena Jardim (05/11)', player: 'André Souza', goals: 2, assists: 0, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsh67QPQK5IPbTHC1a887T7p0SJSwQGxQwq39_Zf_2HkliW1XnJW70xDPpfScAE94cHS86QK87vLBVmSRENJzZpvbo3x_0n9TSSSxaGIClhAQLb5oatC5BaBHCRmXcTAfYxCQqA9ZvkLpx3_JGZqqOLY51RxR7q0r6o3yCyGfGt1aTv-h96xM8HR5cQ9IhpHpzHPiyCbkaLEnYvAujX8yDBY9jlbSeDjiept4rRUzFCVBAShosTZpe81w7rBYdjze-hC7Nj4xY0rs' },
  ];

  return (
    <Layout>
      <div className="flex-1 flex justify-center py-8 px-4 md:px-8">
        <div className="flex flex-col max-w-7xl w-full gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-lg">analytics</span>
                <span>Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Estatísticas da Temporada</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
                Acompanhe o desempenho dos artilheiros, assiduidade e o histórico completo das partidas do seu grupo.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-500 text-xl">calendar_month</span>
                <span className="font-medium text-sm">2024</span>
                <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
              </button>
              <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-xl">share</span>
                <span className="font-bold text-sm">Compartilhar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                  <span className="material-symbols-outlined icon-filled">sports_soccer</span>
                </div>
                <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Gols</p>
                <p className="text-3xl font-black mt-1 group-hover:text-primary transition-colors">342</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg">
                  <span className="material-symbols-outlined">stadium</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Partidas Jogadas</p>
                <p className="text-3xl font-black mt-1 group-hover:text-orange-500 transition-colors">24</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Média Gols/Jogo</p>
                <p className="text-3xl font-black mt-1 group-hover:text-purple-500 transition-colors">14.2</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+2</span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Jogadores Ativos</p>
                <p className="text-3xl font-black mt-1 group-hover:text-emerald-500 transition-colors">32</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Ranking de Artilharia</h2>
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex text-sm font-medium">
                    <button className="px-4 py-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-full text-primary font-bold">Gols</button>
                    <button className="px-4 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium">Presença</button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-yellow-400 shadow-xl shadow-yellow-500/10 flex items-center justify-between overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 via-transparent to-transparent dark:from-yellow-900/20 opacity-60"></div>
                    <div className="absolute -right-6 -bottom-6 text-yellow-500/10 dark:text-yellow-500/5 rotate-12 pointer-events-none">
                      <span className="material-symbols-outlined text-[140px]">emoji_events</span>
                    </div>
                    <div className="flex items-center gap-5 relative z-10 w-full">
                      <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
                        <div className="bg-yellow-400 text-yellow-900 rounded-full p-2 mb-1 shadow-md shadow-yellow-400/30">
                          <span className="material-symbols-outlined text-2xl font-bold block">emoji_events</span>
                        </div>
                        <span className="text-xs font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Top 1</span>
                      </div>
                      <div className="relative flex-shrink-0">
                        <div className="size-16 rounded-full border-4 border-yellow-200 dark:border-yellow-900/50 p-0.5 bg-white dark:bg-slate-800">
                          <div className="w-full h-full rounded-full bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${topScorers[0].avatar})` }}></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded border-2 border-white dark:border-slate-800">MVP</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{topScorers[0].name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">{topScorers[0].position} • {topScorers[0].matches} Partidas</p>
                      </div>
                      <div className="text-right px-2">
                        <span className="block text-4xl font-black text-primary drop-shadow-sm tracking-tight">{topScorers[0].goals}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gols</span>
                      </div>
                    </div>
                  </div>

                  {topScorers.slice(1).map((p, idx) => (
                    <div key={p.id} className={`w-full bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-center justify-between group`}>
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`text-lg font-bold w-10 text-center ${idx === 0 ? 'text-slate-400 italic' : idx === 1 ? 'text-orange-200 italic' : 'text-slate-400'}`}>{idx + 2}</span>
                        <div className="size-10 rounded-full bg-slate-100 bg-cover bg-center flex-shrink-0 shadow-sm" style={{ backgroundImage: `url(${p.avatar})` }}></div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">{p.name}</h3>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">{p.position}</p>
                        </div>
                      </div>
                      <div className="text-right px-4">
                        <span className="block text-lg font-bold text-slate-900 dark:text-white">{p.goals}</span>
                        <span className="text-[10px] text-slate-400 uppercase">Gols</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-primary font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <span>Ver Ranking de Artilharia Completo</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>

              <div className="flex flex-col gap-6 pt-10 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Ranking de Presença</h2>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Em Breve</div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-green-500 shadow-xl shadow-green-500/10 flex items-center justify-between overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-transparent to-transparent dark:from-green-900/20 opacity-60"></div>
                    <div className="absolute -right-6 -bottom-6 text-green-500/10 dark:text-green-500/5 rotate-12 pointer-events-none">
                      <span className="material-symbols-outlined text-[140px]">calendar_month</span>
                    </div>
                    <div className="flex items-center gap-5 relative z-10 w-full">
                      <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
                        <div className="bg-green-500 text-white rounded-full p-2 mb-1 shadow-md shadow-green-500/30">
                          <span className="material-symbols-outlined text-2xl font-bold block">verified</span>
                        </div>
                        <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Top 1</span>
                      </div>
                      <div className="relative flex-shrink-0">
                        <div className="size-16 rounded-full border-4 border-green-200 dark:border-green-900/50 p-0.5 bg-white dark:bg-slate-800">
                          <div className="w-full h-full rounded-full bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${topPresence[0].avatar})` }}></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded border-2 border-white dark:border-slate-800">{topPresence[0].percent}%</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{topPresence[0].name}</h3>
                          <span className="material-symbols-outlined text-green-500 text-lg icon-filled" title="Sempre Presente">bolt</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">{topPresence[0].position} • Assíduo</p>
                      </div>
                      <div className="text-right px-2">
                        <span className="block text-4xl font-black text-green-600 drop-shadow-sm tracking-tight">{topPresence[0].games}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Jogos</span>
                      </div>
                    </div>
                  </div>

                  {topPresence.slice(1).map((p, idx) => (
                    <div key={p.id} className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-800 shadow-sm flex items-center justify-between group transition-all">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-2xl font-black text-slate-300 dark:text-slate-600 italic w-10 text-center">{idx + 2}</span>
                        <div className="size-12 rounded-full bg-slate-100 p-0.5 flex-shrink-0 shadow-sm">
                          <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${p.avatar})` }}></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">{p.name}</h3>
                          <p className="text-xs text-slate-500">{p.position}</p>
                        </div>
                      </div>
                      <div className="text-right px-4">
                        <span className="block text-xl font-bold text-slate-900 dark:text-white">{p.games}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{p.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-xl border border-dashed border-green-300 dark:border-green-700/50 text-center text-green-600 dark:text-green-400 font-bold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2">
                  <span>Ver Ranking de Presença Completo</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Histórico de Partidas</h2>
                <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                  Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <span className="text-xs font-bold text-blue-100 uppercase tracking-wide">PRÓXIMA PELADA • 19 NOV</span>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-bold backdrop-blur-sm">20:00H</span>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Arena Jardim</p>
                      <p className="text-blue-100 text-sm">Rua das Flores, 123</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/match/m1')} className="w-full mt-5 bg-white text-primary font-bold py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm relative z-10 active:scale-95">
                    Confirmar Presença
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-0 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-sm">calendar_month</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">12 NOV 2024</span>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Finalizado</span>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="size-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-black text-sm border-2 border-blue-200 dark:border-blue-800">A</div>
                        <span className="font-bold text-xs text-center text-slate-600 dark:text-slate-300 truncate w-full">Time Azul</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 w-1/3">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">5</span>
                        <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">4</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="size-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-sm border-2 border-slate-200 dark:border-slate-600">B</div>
                        <span className="font-bold text-xs text-center text-slate-600 dark:text-slate-300 truncate w-full">Time Branco</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 py-2 rounded-lg">
                      <span className="material-symbols-outlined text-yellow-500 text-sm icon-filled">emoji_events</span>
                      <span>MVP: <strong>João Silva</strong> (3 gols)</span>
                    </div>
                    <button onClick={() => navigate('/match/m2')} className="w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm flex items-center justify-center gap-2">
                      <span>Ver Detalhes da Partida</span>
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Desempenho Detalhado por Partida</h2>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{matchPerformanceData.length} Registros</span>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Partida</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-muted">Jogador</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Gols</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-muted text-center">Assistências</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {matchPerformanceData.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/match/${row.matchId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-lg">event</span>
                            <span className="font-bold text-sm dark:text-white hover:text-inherit">{row.matchName}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link to="/profile" className="flex items-center gap-3 hover:text-primary transition-colors group">
                            <div className="size-8 rounded-full bg-cover bg-center border border-slate-100 dark:border-slate-700 transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${row.avatar})` }}></div>
                            <span className="font-bold text-sm dark:text-white hover:text-inherit">{row.player}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-dark dark:text-primary font-black text-sm">
                            <span className="material-symbols-outlined text-sm icon-filled">sports_soccer</span>
                            {row.goals}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-black text-sm">
                            <span className="material-symbols-outlined text-sm">settings_input_component</span>
                            {row.assists}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
