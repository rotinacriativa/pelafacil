
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
      {/* Left Column: Form Section */}
      <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-12 lg:w-1/2 lg:flex-none lg:px-20 xl:px-32 bg-white dark:bg-[#152e18]">
        <div className="flex w-full flex-col max-w-[480px] mx-auto">
          {/* Logo Header */}
          <header className="mb-10 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-3xl">sports_soccer</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-[#111812] dark:text-white">Pelada Fácil</h1>
          </header>
          {/* Page Heading */}
          <div className="mb-8">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111812] dark:text-white mb-3">
              Entre em campo
            </h2>
            <p className="text-[#618965] dark:text-[#a0cfa5] text-lg font-normal leading-normal">
              Organize sua pelada ou encontre um jogo agora.
            </p>
          </div>
          {/* Google Login Button */}
          <div className="mb-6">
            <button onClick={() => navigate('/dashboard')} className="relative flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#f0f4f0] dark:bg-[#2a452d] h-14 px-6 transition-transform active:scale-[0.98] hover:bg-[#e0e6e0] dark:hover:bg-[#355539]">
              <span className="material-symbols-outlined text-[#111812] dark:text-white text-2xl">account_circle</span>
              <span className="text-[#111812] dark:text-white text-base font-bold tracking-wide">Entrar com Google</span>
            </button>
          </div>
          {/* Divider */}
          <div className="relative mb-6 flex items-center py-2">
            <div className="grow border-t border-[#e0e6e0] dark:border-[#2a452d]"></div>
            <span className="mx-4 shrink-0 text-sm text-[#618965] dark:text-[#a0cfa5] font-medium">ou use seu e-mail</span>
            <div className="grow border-t border-[#e0e6e0] dark:border-[#2a452d]"></div>
          </div>
          {/* Input Fields */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <label className="flex flex-col gap-2">
              <span className="text-[#111812] dark:text-white text-sm font-bold ml-1">Nome <span className="text-[#618965] dark:text-[#a0cfa5] font-normal">(opcional para entrar)</span></span>
              <div className="relative">
                <input className="w-full rounded-xl border border-[#dbe6dc] dark:border-[#2a452d] bg-white dark:bg-[#102212] h-14 px-5 text-base text-[#111812] dark:text-white placeholder:text-[#618965] dark:placeholder:text-[#5a7a5e] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Seu nome de craque" type="text" />
              </div>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[#111812] dark:text-white text-sm font-bold ml-1">E-mail ou telefone</span>
              <div className="relative group">
                <input required className="peer w-full rounded-xl border border-[#dbe6dc] dark:border-[#2a452d] bg-white dark:bg-[#102212] h-14 px-5 text-base text-[#111812] dark:text-white placeholder:text-[#618965] dark:placeholder:text-[#5a7a5e] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="exemplo@email.com" type="text" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#618965] dark:text-[#5a7a5e] group-focus-within:text-primary transition-colors">mail</span>
              </div>
            </label>
            <button className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary h-14 px-8 text-[#111812] font-black text-lg tracking-wide hover:bg-[#0fd620] active:scale-[0.98] transition-all shadow-lg shadow-primary/20" type="submit">
              <span>Bora Jogar!</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-[#618965] dark:text-[#a0cfa5]">
              Ainda não tem conta? 
              <Link className="font-bold text-[#111812] dark:text-primary hover:underline decoration-2 underline-offset-4" to="/login">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Column: Visual */}
      <div className="relative hidden lg:block lg:flex-1 bg-background-dark">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-overlay" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVYJS7TZVRTYlvMkZNk6u9Bs_wDxfrSKUsm_-OYGSYh6G9v6gr4NlgiWKWcdZHClMjzWjLpnOBTuLhr0vacIunpJ4K9-mPL_VRzBjxd7pzeZ5E_xf_ooKtbT-I90HBGkvUB47sPmr0QPTsfeYAsQbmMSU1Z2i_aC26gkjXXnrHg8GC5N5LF_ik7zC0ngzMk8M2A2Y0YOHwYBYRa52MV4Yo9Mi87mzK-KZ2XIkPA837_5ptLKxOtVwjwDOjtgx71RNgZJALTGI_NFg')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12 w-full max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 px-4 py-1.5 text-primary">
            <span className="material-symbols-outlined text-sm">star</span>
            <span className="text-xs font-bold uppercase tracking-wider">O App #1 da Varzea</span>
          </div>
          <blockquote className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            "A melhor forma de juntar a galera e garantir que a pelada aconteça toda semana."
          </blockquote>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-4">
              <div className="size-12 rounded-full border-2 border-background-dark bg-gray-300 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCghTkRaTZDHiww67Urzw4VUuGnVnrrIwRLaPfvWwk-8a_BlPhdJUEscrF8j-R3Y1ldR4cpSVIvJCZiFxyWFAgIJq140lbigtMtJrdUx6FT-gtGgvwySOzn1Ix1C0mFbVqznTKSr0u2xisTBz025xiT7ZrRAz8_8R_G68lRF5_uPcVCnfdFY7Tv6PLXq1aS9yYiHdnoCu2HBIiQbh2ssfqYiH0WoWsTcPhUheiRPNiSd49fbbWrAeDpwRpv_9Y45qDQGZiY8GwviMI')"}}></div>
              <div className="size-12 rounded-full border-2 border-background-dark bg-gray-300 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-bRELzzsQJdF4s7lFxAW2ZH1BgJtDaVl0NjsEvl_H6-zfRFRiM9YdFrD0xVk-O7cTn6IvCNMNVKbHV2n6PS-3-IFpiKljNMDivx-51ddCucKAgloUkx9uJBbKzrVWtmUnRdOth1dZHiFLjQ8M5mcJSTh8khiQ76s5sOSbT4yIHm76PjyIv87IansqcwpUABpceUQrfAL-IdTLGB60HPh2R_jFi0VMyf8ySQHzzyJXTmDJdaVg1BFjwFXm1SsP7qFyoLRBlTbtrrM')"}}></div>
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-background-dark bg-primary text-[#111812] font-bold text-sm">
                +2k
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold">Comunidade Ativa</span>
              <span className="text-gray-400 text-sm">Junte-se a milhares de jogadores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
