
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SuccessModal from '../components/features/SuccessModal';

const ExploreMatches: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const matches = [
    {
      id: '1',
      title: 'Pelada dos Amigos - Terça',
      badge: 'Últimas vagas',
      badgeColor: 'bg-red-500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7XPrHQSjMS6-kdUc5TX6zNPapaM7uR_kRoOBJqsMDCWlR7B-br8OZO02Ofs65LUbiNI5FmG2D_VI1-m0HZvQ18XA-Hlt6tgZPbpqadvG4iP3k_ZawDShBJRb_QeNHq0zo5PjH-sSCB4fqgbTrqv6I78-3ESTaaJzL4gQV_Eqz6fihTV55t5wmqORu2JHd1-6df1ZjhlO_Y81uGVpwonK4I2h8u2NlPDaeR4rzH8vnPEzdS-n8K1BEXvVtMlKkI6tE34KRCz24tw',
      vagas: '1 vaga',
      genero: 'Masculino',
      data: 'Hoje, 14 Out',
      hora: '19:00',
      local: 'Arena Soccer, Centro',
      preco: 'R$ 25,00',
      action: 'Solicitar',
      actionType: 'primary'
    },
    {
      id: '2',
      title: 'Fut 5 Semanal - Misto',
      badge: 'Popular',
      badgeColor: 'bg-yellow-400 text-black',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB4ApnM8NFATWGhdhCby_AZS3Xr67M8NGWFOMrIJhKaJWFAkasCqLPWAM06K7UvLTwE9VAw9i94st3lZP0DpmFvNsBaY6wgUqpV2R4vfqV5OsZ9jczKZHEjMdsjqCYnsCMPm8Qvsf975-C4jZ1DhjSFEBRx9aZeEPaVoj6y0w3ztQUGPIKtLUZbbOLtY7yiNgMSO3IqosbR_xqUDKatEu5Y-jTila_VW4Tndenj6Xb2XQMKY8iG3Buzd7fy_hlbVw37KrB6QSYoI',
      vagas: '4 vagas',
      genero: 'Misto',
      data: 'Amanhã, 15 Out',
      hora: '20:30',
      local: 'Quadra da Barra, Barra',
      preco: 'R$ 20,00',
      action: 'Ver Detalhes',
      actionType: 'secondary'
    },
    {
      id: '3',
      title: 'Guerreiras da Bola FC',
      badge: null,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVi32XSG8mO2FWHHQNcgA3-_P9vbi6QjNMy2MM_6N0d73UHCgGJLozR6b5jdJlhTqeabcOGjUH7O4V7ZVfTVVunlnbMYOG2DCFvYn2fEUuQpA3ZBRMq9-JooyDzsYzK9koCJW-qyuqR_rq-kZgcWg3nXYsjHOXQebQWO8J_pEJSlLQZUPFwrZksEB08NJRW_u9KX_5LddaJ4YS9m9wPfdRIQmcjn_duMPcRuZlGCQJiz-OUCRdwilOW6tP0WbvbfXjjAGcjJb41ic',
      vagas: '2 vagas',
      genero: 'Feminino',
      data: 'Quarta, 16 Out',
      hora: '18:00',
      local: 'Clube Central, Centro',
      preco: 'R$ 15,00',
      action: 'Solicitar',
      actionType: 'primary'
    },
    {
      id: '4',
      title: 'Pelada de Domingo',
      badge: null,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz3uRSlsStibUUeJx1qtY5f-fWz7uKanyII9qOWMg-XURb1bwn2wWwbf_wnirjLvkCRYyZEwQkkA4yVuLz6AfF2Fuqmczj2WS8dI2h3jE4QeMSkOojjc2-yESTsVHxbsHSGMY6zSFvyqHXQL3D0QTgrMThnQbQCOUBNkrMeWB0iutaXr_XSFomx0XpN8uZ1diybhGF8pgTsRXnp8liZDQ2rpb2j0-ufIk3EtwgquFY9OAoG86c7mGkTYI3kGMcyTpzPdg2I3Mb9qY',
      vagas: '5+ vagas',
      genero: 'Masculino',
      data: 'Domingo, 20 Out',
      hora: '09:00',
      local: 'Arena Norte, Zona Norte',
      preco: 'R$ 30,00',
      action: 'Ver Detalhes',
      actionType: 'secondary'
    },
    {
      id: '5',
      title: 'Liga dos Veteranos',
      badge: 'Cheio',
      badgeColor: 'bg-red-500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT-dc-XfpYYcHnEeGqnuvtLmxe-bFnKpTSd84qZWEcaED_EEt9zBnKzKC4OT5ktTbdStaYja9igbCS9zYHvBte8-xgETt6M7X1V46sr4AJjGJOHknJKA7j1zWx6kewe3tzZHgtKFaRAKLMJFS0YqWwoqN8WTjz39uaVq-VsVRjfXZfkV4Qn-xcrXpkmnWFG5n_TZI5zQck8S-p-U8jq4UjjsIs99WANmKXkcgCm0l-gFuKJxVlgbOgB6j66GcXDkuF9HHLHv47B0',
      vagas: 'Lista de Espera',
      genero: 'Masculino',
      data: 'Quinta, 17 Out',
      hora: '21:00',
      local: 'CT Galaxy, Zona Sul',
      preco: 'R$ 35,00',
      action: 'Entrar na Fila',
      actionType: 'muted'
    },
    {
      id: '6',
      title: 'Treino Funcional + Jogo',
      badge: null,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM2QM6bn8VT_ATI0CqFuL5O25yYnw1Y1iEWqAEb71n4DJvmfW1yDHnm10843bCl9OE355sMArhpi1drMKoM0XM8q5AlAUWyy5sqfKnDloAUhZ9hvNH4zy16CzXIdEbPHiWGHUWM4koW2Cv-4YQnBHN9tRhbut0yZZMs72MJmgOTfZBRt1l83JYFyb6LrKyg-tSo2r28J8RnC4VtQbv7TAOFnbI6YjXgy3mOZu804ke7DGgKtMcr4_heKkawujZXI1R0NqWMtFJTEA',
      vagas: '8 vagas',
      genero: 'Misto',
      data: 'Sábado, 19 Out',
      hora: '08:30',
      local: 'Parque Ibirapuera',
      preco: 'Grátis',
      action: 'Solicitar',
      actionType: 'primary'
    }
  ];

  const handleAction = (match: typeof matches[0]) => {
    if (match.action === 'Solicitar') {
      // Show success modal
      setIsSuccessModalOpen(true);
    } else {
      navigate(`/match/${match.id}`);
    }
  };

  return (
    <Layout>

      <main className="flex-1 flex flex-col items-center w-full px-4 md:px-10 py-8 md:py-12">
        <div className="w-full max-w-6xl flex flex-col gap-10">

          {/* Hero Section */}
          <section className="flex flex-col items-center gap-6 text-center w-full">
            <div className="flex flex-col gap-3 max-w-2xl">
              <h1 className="text-text-main dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight border-none pb-0">
                Encontre sua próxima partida
              </h1>
              <p className="text-text-secondary dark:text-gray-400 text-lg font-normal">
                Busque jogos abertos perto de você e garanta sua vaga no time.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="flex flex-col h-14 w-full shadow-lg rounded-xl transition-all focus-within:ring-2 ring-primary">
                <div className="flex w-full flex-1 items-stretch rounded-xl bg-slate-100 dark:bg-surface-dark overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="text-text-secondary dark:text-gray-400 flex items-center justify-center pl-5 pr-2">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input className="flex w-full min-w-0 flex-1 bg-transparent border-none text-text-main dark:text-white placeholder:text-text-secondary dark:placeholder:text-gray-500 px-2 text-base font-normal focus:outline-none focus:ring-0" placeholder="Buscar por nome do grupo, local ou data..." />
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-3 flex-wrap justify-center w-full">
              {['Data: Hoje', 'Local: Perto de mim', 'Nível: Casual', 'Tipo: Society', 'Preço'].map((filter) => (
                <button key={filter} className="group flex h-9 items-center gap-x-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:bg-primary/20 dark:hover:bg-primary/20 hover:border-primary pl-4 pr-3 transition-all shadow-sm">
                  <span className="text-text-main dark:text-white text-sm font-medium">{filter}</span>
                  <span className="material-symbols-outlined text-text-main dark:text-white text-[20px]">keyboard_arrow_down</span>
                </button>
              ))}
            </div>
          </section>

          {/* Results Grid */}
          <section className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-text-main dark:text-white text-xl font-bold">Jogos Disponíveis</h3>
              <span className="text-text-secondary dark:text-gray-400 text-sm font-medium">Mostrando {matches.length} resultados</span>
            </div>

            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <div key={match.id} className="group flex flex-col rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-primary/50 transition-all overflow-hidden">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-48 h-48 sm:h-auto relative">
                        <img
                          src={match.image}
                          alt={match.title}
                          className="w-full h-full object-cover"
                        />
                        {match.badge && (
                          <div className={`absolute top-3 left-3 ${match.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
                            {match.badge}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col p-5 grow justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold flex items-center gap-1 ${match.vagas === '1 vaga' ? 'text-primary' : 'text-text-secondary'}`}>
                              <span className="material-symbols-outlined text-[16px]">group</span> {match.vagas}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-text-secondary dark:text-gray-400 text-sm">{match.genero}</span>
                          </div>
                          <h3 className="text-text-main dark:text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{match.title}</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-secondary dark:text-gray-300 text-sm">
                              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                              <span>{match.data}</span>
                              <span className="text-gray-300 dark:text-gray-600">|</span>
                              <span className="material-symbols-outlined text-[18px]">schedule</span>
                              <span>{match.hora}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary dark:text-gray-300 text-sm">
                              <span className="material-symbols-outlined text-[18px]">location_on</span>
                              <span>{match.local}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-text-main dark:text-white font-black text-xl tracking-tight">{match.preco}</span>
                          <button
                            onClick={() => handleAction(match)}
                            className={`text-sm font-bold py-2.5 px-6 rounded-full transition-all active:scale-95 shadow-sm ${match.actionType === 'primary'
                              ? 'bg-primary text-text-main hover:bg-primary-hover shadow-primary/20'
                              : match.actionType === 'secondary'
                                ? 'bg-primary/20 text-text-main dark:text-white hover:bg-primary/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-text-muted hover:bg-slate-200'
                              }`}
                          >
                            {match.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">sentiment_dissatisfied</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-text-main dark:text-white">Nenhum jogo encontrado</h3>
                  <p className="text-gray-500 dark:text-gray-400">Tente buscar por outro termo ou ajuste os filtros.</p>
                </div>
              </div>
            )}

            {/* Load More */}
            <div className="flex justify-center mt-10">
              <button className="flex items-center gap-2 text-text-main dark:text-white font-bold hover:text-primary transition-colors group">
                Carregar mais jogos
                <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">expand_more</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Branded */}
      <footer className="w-full px-4 lg:px-40 py-10 flex justify-center bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 mt-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined">sports_soccer</span>
            </div>
            <span className="text-lg font-black dark:text-white tracking-tight">Pelada App</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-text-secondary dark:text-gray-400">
            <a className="hover:text-primary transition-colors" href="#">Sobre</a>
            <a className="hover:text-primary transition-colors" href="#">Funcionalidades</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
          </div>
        </div>
      </footer>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </Layout>
  );
};

export default ExploreMatches;
