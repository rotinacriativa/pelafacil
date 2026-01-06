
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <header className="w-full bg-surface-light dark:bg-surface-dark border-b border-[#f0f4f0] dark:border-[#2a4e30] sticky top-0 z-50">
        <div className="px-4 lg:px-40 flex justify-center w-full">
          <div className="flex items-center justify-between w-full max-w-[960px] py-3 lg:px-10">
            <Link to="/dashboard" className="flex items-center gap-2 lg:gap-4 text-[#111812] dark:text-white hover:opacity-80 transition-opacity">
              <div className="size-8 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V44Z" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PelaFacil</h2>
            </Link>
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="hidden sm:flex items-center gap-6">
                <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
                <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors" to="/login">Entrar</Link>
              </div>
              <div className="flex gap-2">
                <Link to="/dashboard" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-[#111812] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity shadow-sm">
                  <span className="truncate">Meu Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full px-4 lg:px-40 py-5 flex justify-center">
          <div className="w-full max-w-[960px]">
            <div className="@container">
              <div className="flex flex-col-reverse lg:flex-row items-center gap-8 py-10 lg:py-16">
                <div className="flex flex-col gap-6 lg:w-1/2 justify-center text-center lg:text-left">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em] text-[#111812] dark:text-white">
                      Organize sua pelada <span className="text-primary block lg:inline">sem bagunça</span>
                    </h1>
                    <h2 className="text-base lg:text-lg font-normal leading-normal text-gray-600 dark:text-gray-300">
                      O jeito mais fácil de convocar o time, sortear equipes equilibradas e marcar o placar. Junte-se a mais de 10.000 boleiros e boleiras.
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                    <Link to="/dashboard" className="flex items-center justify-center rounded-full h-12 px-8 bg-primary text-[#111812] text-base font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform shadow-lg shadow-primary/20 w-full sm:w-auto">
                      <span className="truncate">Acessar meu Dashboard</span>
                    </Link>
                    <Link to="/create-group" className="flex items-center justify-center rounded-full h-12 px-6 bg-white border border-gray-200 dark:bg-transparent dark:border-[#2a4e30] dark:text-white text-[#111812] text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-[#1a2c1e] transition-colors w-full sm:w-auto">
                      <span className="truncate">Criar novo grupo</span>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    ⚽ Grátis para começar • O Dashboard centraliza tudo
                  </p>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="w-full aspect-square lg:aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-[#1a2c1e] bg-center bg-cover overflow-hidden relative shadow-2xl" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBB91JVsrZiME5nUae1bVfWNXETDFc_kI6zTQL3OmcELsBEar55UpBNiaJ1ODaaY96VB8rBzLAV0M5dsnSmpWOsIElCfVY6uvMyQ15H-k0XIx6uZk7XaFBckLob3hZKVjH9XChW1s2lY1K9EM-7513B44sRinEuXX2kjpa6x-wIGMfl5gpUuQudveqP3A90915TXAqDPDkZT4aIHy2wp2ApCcK9MIgKbYw-glfsgGgSfCH-NSvPgAlht6esfM0s4s_UoAzHiUa_jtI")'}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features */}
        <section className="w-full px-4 lg:px-40 py-12 flex justify-center bg-surface-light dark:bg-surface-dark">
          <div className="w-full max-w-[960px]">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight max-w-[720px]">
                  Por que usar o PelaFacil?
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 max-w-[720px]">Chega de confusão no WhatsApp. Tudo o que você precisa para o jogo acontecer em um só lugar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4 rounded-xl border border-[#dbe6dc] dark:border-[#2a4e30] bg-white dark:bg-[#1a2c1e] p-6 hover:shadow-lg transition-shadow">
                  <div className="size-12 rounded-full bg-[#f0f4f0] dark:bg-[#2a4e30] flex items-center justify-center text-[#111812] dark:text-primary">
                    <span className="material-symbols-outlined text-[28px]">groups</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">Times Automáticos</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Sorteio equilibrado baseado nas notas dos jogadores. Ninguém mais reclama de panelinha.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-[#dbe6dc] dark:border-[#2a4e30] bg-white dark:bg-[#1a2c1e] p-6 hover:shadow-lg transition-shadow">
                  <div className="size-12 rounded-full bg-[#f0f4f0] dark:bg-[#2a4e30] flex items-center justify-center text-[#111812] dark:text-primary">
                    <span className="material-symbols-outlined text-[28px]">payments</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">Controle de Pagamento</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Saiba quem pagou e quem está devendo antes da bola rolar. Pix integrado.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-[#dbe6dc] dark:border-[#2a4e30] bg-white dark:bg-[#1a2c1e] p-6 hover:shadow-lg transition-shadow">
                  <div className="size-12 rounded-full bg-[#f0f4f0] dark:bg-[#2a4e30] flex items-center justify-center text-[#111812] dark:text-primary">
                    <span className="material-symbols-outlined text-[28px]">scoreboard</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold leading-tight">Placar e Estatísticas</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Registre os gols, assistências e eleja o craque da partida. Histórico completo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full px-4 lg:px-40 py-10 flex justify-center bg-background-light dark:bg-background-dark border-t border-[#f0f4f0] dark:border-[#2a4e30]">
        <div className="w-full max-w-[960px] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V44Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-lg font-bold dark:text-white">PelaFacil</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a className="hover:text-primary transition-colors" href="#">Sobre</a>
            <a className="hover:text-primary transition-colors" href="#">Funcionalidades</a>
            <a className="hover:text-primary transition-colors" href="#">Preços</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
