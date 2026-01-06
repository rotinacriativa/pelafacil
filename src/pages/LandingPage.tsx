
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased selection:bg-primary selection:text-text-main overflow-x-hidden transition-colors duration-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-[#e7f3e8] bg-background-light/95 backdrop-blur-sm dark:bg-background-dark/95 dark:border-white/10">
          <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-[1280px]">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-6 text-primary">
                <span className="material-symbols-outlined text-[28px] leading-none">sports_soccer</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PelaFacil</h2>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200" href="#features">Como funciona</a>
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200" href="#benefits">Recursos</a>
              <Link className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200" to="/login">Login</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link className="md:hidden text-sm font-medium hover:text-primary dark:text-gray-200" to="/login">Login</Link>
              <Link to="/create-group" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-[#0fd620] transition-colors text-text-main text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Criar Partida</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="w-full px-4 md:px-10 py-12 md:py-20 max-w-[1280px]">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
              {/* Hero Content */}
              <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
                <div className="flex flex-col gap-4">
                  <h1 className="text-text-main dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
                    Organize sua pelada sem confusão no WhatsApp
                  </h1>
                  <h2 className="text-text-main/80 dark:text-gray-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    O jeito mais rápido de gerenciar listas de presença, times e pagamentos. Foque no jogo, deixe a organização com a gente.
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                  <Link to="/create-group" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#0fd620] text-text-main text-base font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
                    Criar Grupo Grátis
                  </Link>
                  <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#e7f3e8] hover:bg-[#d6ebd8] dark:bg-white/10 dark:hover:bg-white/20 text-text-main dark:text-white text-base font-bold transition-all">
                    <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                    Ver como funciona
                  </button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-text-secondary dark:text-gray-400 mt-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Sem cartão de crédito</span>
                  <span className="mx-2">•</span>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Plano grátis para sempre</span>
                </div>
              </div>
              {/* Hero Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#8fff98] rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div
                  className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[5/4] bg-cover bg-center bg-no-repeat rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPMr0w1jCon_IR9ImcYg9BVFmp7lQyJ77gwo-iOTbMuqBULeq3-HcLgCBzxsTHb6ttAYdf4KKFFwIA77wlXpLgt2oEW_DdjAftne5dxEgqjcs9lCyFnYnx7oPK88pFrpmUiYFnxnkwbVHi1dp-wrI5IRo-KFcNv-tbq79My-jVV6ZIeJcZqAUvYb7B6ncA9nrnDK36NWKtl_f4nXaIGa9iero_BJHsgVSc72RbwggZqjjZY4nF5I9IcP_NSjwv3jfDiuHRx-qqFLs')" }}
                >
                  {/* Floating UI Card Mockup */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-surface-dark/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 hidden sm:block">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">TB</div>
                        <div>
                          <p className="font-bold text-sm text-text-main dark:text-white">Terça da Bola</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Arena Society • 19:30h</p>
                        </div>
                      </div>
                      <span className="bg-primary/20 text-text-main text-xs font-bold px-2 py-1 rounded">Confirmado</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[85%]"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>12 Confirmados</span>
                      <span>2 Vagas restantes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Steps Section */}
          <section id="features" className="w-full bg-[#e7f3e8]/30 dark:bg-white/5 border-y border-[#e7f3e8] dark:border-white/5 py-16 md:py-24">
            <div className="px-4 md:px-10 max-w-[1100px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">Pronto para o jogo em 3 passos</h2>
                <p className="text-text-secondary dark:text-gray-400 max-w-lg mx-auto">Esqueça as planilhas e o bloco de notas. O PelaFacil automatiza tudo.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line for Desktop */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[2px] bg-gray-200 dark:bg-gray-700 -z-10"></div>
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-dark border-2 border-primary/20 group-hover:border-primary shadow-sm flex items-center justify-center mb-6 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary text-3xl">edit_calendar</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">1. Crie a partida</h3>
                  <p className="text-text-secondary dark:text-gray-400 leading-relaxed px-4">Defina local, hora e limite de jogadores em segundos no nosso painel.</p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-dark border-2 border-primary/20 group-hover:border-primary shadow-sm flex items-center justify-center mb-6 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary text-3xl">share</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">2. Envie o link</h3>
                  <p className="text-text-secondary dark:text-gray-400 leading-relaxed px-4">Compartilhe no grupo do WhatsApp. Os jogadores clicam e confirmam na hora.</p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-dark border-2 border-primary/20 group-hover:border-primary shadow-sm flex items-center justify-center mb-6 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary text-3xl">sports_soccer</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">3. Jogue sem stress</h3>
                  <p className="text-text-secondary dark:text-gray-400 leading-relaxed px-4">A lista se organiza sozinha. Lista de espera automática quando lotar.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="w-full px-4 md:px-10 py-16 md:py-24 max-w-[1280px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">Tudo que você precisa</h2>
                <p className="text-lg text-text-secondary dark:text-gray-400">Ferramentas essenciais para quem organiza e para quem joga.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-12 rounded-lg bg-[#e7f3e8] dark:bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined">playlist_add_check</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Lista de Espera</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Acabou as vagas? Quem entrar depois vai para a espera e sobe automaticamente se alguém desistir.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-12 rounded-lg bg-[#e7f3e8] dark:bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined">group_work</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Sorteio de Times</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Ferramenta para equilibrar os times baseada em níveis ou totalmente aleatória. Sem panelinha.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-12 rounded-lg bg-[#e7f3e8] dark:bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Controle Financeiro</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Marque quem já pagou o mensal ou o avulso. Saiba exatamente quanto tem no caixa.</p>
              </div>
              {/* Feature 4 (Coming Soon) */}
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-dashed border-gray-200 dark:border-white/10 relative overflow-hidden group">
                <div className="absolute top-3 right-3 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wide">
                  Em breve
                </div>
                <div className="size-12 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">scoreboard</span>
                </div>
                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-300 mb-2">Placar e Estatísticas</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Registre os gols, assistências e eleja o craque da partida. Gamificação para sua pelada.</p>
              </div>
            </div>
          </section>

          {/* Trust & Final CTA */}
          <section className="w-full bg-[#0d1b0f] text-white py-20 px-4 md:px-10 mt-10 rounded-t-[3rem] md:rounded-t-[4rem] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "radial-gradient(#13ec25 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative max-w-3xl mx-auto text-center z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm mb-8 border border-white/10">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                <span className="text-sm font-medium">Feito por quem joga, para quem joga</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Menos burocracia,<br />mais futebol.</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                Junte-se a milhares de boleiros que já abandonaram a confusão das listas manuais. É grátis, é rápido e funciona.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Link to="/create-group" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary hover:bg-[#0fd620] text-[#0d1b0f] text-lg font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                  Começar Agora
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                Plano gratuito disponível • Não pedimos cartão de crédito
              </p>
            </div>
          </section>
        </main>

        <footer className="bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-white/10 py-12 px-4 md:px-10">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-text-main dark:text-white opacity-80">
              <span className="material-symbols-outlined text-primary">sports_soccer</span>
              <span className="font-bold">PelaFacil</span>
            </div>
            <div className="flex gap-8 text-sm text-text-secondary dark:text-gray-400">
              <a className="hover:text-primary transition-colors" href="#">Termos de Uso</a>
              <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
              <a className="hover:text-primary transition-colors" href="#">Contato</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2023 PelaFacil. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
