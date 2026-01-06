
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [playersPerTeam, setPlayersPerTeam] = useState(7);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display min-h-screen flex flex-col transition-colors duration-200">
      <header className="w-full bg-surface-light dark:bg-surface-dark border-b border-[#dbe6dc] dark:border-[#2a402d] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[24px]">sports_soccer</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">Pelada App</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a className="hover:text-primary transition-colors" href="#">Início</a>
              <a className="text-primary" href="#">Criar Grupo</a>
              <a className="hover:text-primary transition-colors" href="#">Meus Jogos</a>
            </nav>
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcgmO3HjVs3LG8kmX8RtT9cNYG2HE8jfT-tR4WZT6bvTlOkanGFTi4YGbi_1Fx-sGQya8sBtsDuNcWM9YJ2vXi5FzMH4Hmjr-5o-ASj45BoapfxAhzlSYgUyptTUhQfwmVib4Kl_ZubfFJOHy3g0FOax9VCT7wYA-kdIn5PYTfeVGQNhdHMEStTcHqQIDLceaakZ6dzOxdpN4ZwBVWWju_Kk2yL0Mk4wbDpHx7t1X0Ks8OvHxtHCVgi-n7gAfBFNoqnh-gtPG_jEM")'}}></div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Vamos começar o jogo!</h1>
            <p className="text-text-sec-light dark:text-text-sec-dark text-lg font-normal">Crie seu grupo e convoque a galera para a pelada.</p>
          </div>

          <form className="bg-surface-light dark:bg-surface-dark rounded-[2rem] p-6 sm:p-10 shadow-sm border border-[#dbe6dc] dark:border-[#2a402d] space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-3">
              <label className="block text-base font-bold">Nome do Grupo <span className="text-primary">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <input required className="block w-full pl-12 pr-4 py-4 rounded-xl border border-[#dbe6dc] dark:border-[#2a402d] bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none font-medium text-lg" placeholder="Ex: Pelada de Quinta, Amigos do Futebol" type="text" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-bold">Modalidade <span className="text-primary">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="cursor-pointer group relative">
                  <input defaultChecked className="peer sr-only" name="game_mode" type="radio" value="society" />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[#dbe6dc] dark:border-[#2a402d] bg-background-light dark:bg-background-dark peer-checked:border-primary peer-checked:bg-primary/10 h-32 transition-all">
                    <span className="material-symbols-outlined text-4xl mb-2 text-text-sec-light group-hover:text-primary">stadium</span>
                    <span className="font-bold">Society</span>
                    <span className="text-xs text-text-sec-light font-medium">7 vs 7</span>
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input className="peer sr-only" name="game_mode" type="radio" value="campo" />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[#dbe6dc] dark:border-[#2a402d] bg-background-light dark:bg-background-dark peer-checked:border-primary peer-checked:bg-primary/10 h-32 transition-all">
                    <span className="material-symbols-outlined text-4xl mb-2 text-text-sec-light group-hover:text-primary">grass</span>
                    <span className="font-bold">Campo</span>
                    <span className="text-xs text-text-sec-light font-medium">11 vs 11</span>
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input className="peer sr-only" name="game_mode" type="radio" value="futsal" />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[#dbe6dc] dark:border-[#2a402d] bg-background-light dark:bg-background-dark peer-checked:border-primary peer-checked:bg-primary/10 h-32 transition-all">
                    <span className="material-symbols-outlined text-4xl mb-2 text-text-sec-light group-hover:text-primary">sports_gymnastics</span>
                    <span className="font-bold">Futsal</span>
                    <span className="text-xs text-text-sec-light font-medium">5 vs 5</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-base font-bold">Jogadores por time</label>
                <div className="flex items-center justify-between bg-background-light dark:bg-background-dark border border-[#dbe6dc] dark:border-[#2a402d] rounded-xl p-2 h-[60px]">
                  <button onClick={() => setPlayersPerTeam(Math.max(1, playersPerTeam - 1))} className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-surface-dark shadow-sm hover:bg-gray-50 transition-colors" type="button">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-xl font-bold tabular-nums">{playersPerTeam}</span>
                  <button onClick={() => setPlayersPerTeam(playersPerTeam + 1)} className="size-10 flex items-center justify-center rounded-lg bg-primary text-background-dark shadow-sm hover:brightness-110 transition-colors" type="button">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-base font-bold">Cidade Principal</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <select className="block w-full pl-12 pr-10 py-4 rounded-xl border border-[#dbe6dc] dark:border-[#2a402d] bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none font-medium appearance-none h-[60px]">
                    <option>São Paulo, SP</option>
                    <option>Rio de Janeiro, RJ</option>
                    <option>Belo Horizonte, MG</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary hover:bg-[#11d821] text-[#052e0a] font-black text-lg h-14 rounded-full shadow-lg transition-all flex items-center justify-center gap-2" type="submit">
                <span>Criar Grupo</span>
                <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
              </button>
              <button onClick={() => navigate(-1)} className="sm:flex-none sm:w-32 bg-transparent hover:bg-gray-100 text-text-sec-light font-bold text-lg h-14 rounded-full border border-transparent transition-all" type="button">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;
