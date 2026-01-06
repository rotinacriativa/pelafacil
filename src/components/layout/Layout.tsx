
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { usePendingRequestsCount } from '../../hooks/usePendingRequestsCount';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pendingCount = usePendingRequestsCount();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col transition-colors duration-200">
            <header className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10 py-3">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">sports_soccer</span>
                        </div>
                        <h1 className="text-text-main dark:text-white text-xl font-black tracking-tight leading-none">Pelada App</h1>
                    </Link>
                    <div className="hidden md:flex flex-1 justify-end items-center gap-6 lg:gap-8">
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link className={`${isActive('/dashboard') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/dashboard">Início</Link>
                            <Link className={`${isActive('/explore') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/explore">Explorar</Link>
                            <Link className={`${isActive('/roster') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/roster">Jogadores</Link>
                            <Link
                                className={`${isActive('/requests') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'} relative`}
                                to="/requests"
                            >
                                Aprovações
                                {pendingCount > 0 && (
                                    <span className="absolute -top-2 -right-3 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                            <Link className={`${isActive('/generator') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/generator">Sorteio</Link>
                            {/* <Link className={`${isActive('/scoreboard') ? 'text-primary font-bold' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/scoreboard">Placar</Link> */}
                            <Link className={`${isActive('/stats') ? 'text-primary font-bold ' : 'text-text-main dark:text-gray-200 hover:text-primary transition-colors'}`} to="/stats">Estatísticas</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/schedule-match')}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-text-main px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                Nova Partida
                            </button>
                            <img
                                onClick={() => navigate('/profile')}
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcgmO3HjVs3LG8kmX8RtT9cNYG2HE8jfT-tR4WZT6bvTlOkanGFTi4YGbi_1Fx-sGQya8sBtsDuNcWM9YJ2vXi5FzMH4Hmjr-5o-ASj45BoapfxAhzlSYgUyptTUhQfwmVib4Kl_ZubfFJOHy3g0FOax9VCT7wYA-kdIn5PYTfeVGQNhdHMEStTcHqQIDLceaakZ6dzOxdpN4ZwBVWWju_Kk2yL0Mk4wbDpHx7t1X0Ks8OvHxtHCVgi-n7gAfBFNoqnh-gtPG_jEM"
                                alt="Perfil"
                                className="size-10 rounded-full object-cover border-2 border-primary cursor-pointer hover:scale-105 transition-transform"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
};

export default Layout;
