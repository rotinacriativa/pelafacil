
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { MOCK_PLAYERS } from '../constants';

const FinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const [playersData, setPlayersData] = useState(() =>
    MOCK_PLAYERS.map(player => ({
      ...player,
      isPaid: player.paid ?? false
    }))
  );

  const handleMarkAsPaid = (id: string) => {
    setPlayersData(prev => prev.map(p =>
      p.id === id ? { ...p, isPaid: true } : p
    ));
  };

  const stats = useMemo(() => {
    const paidCount = playersData.filter(p => p.isPaid).length;
    const totalCount = playersData.length;
    const percentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
    const totalArrecadado = paidCount * 25;
    const meta = totalCount * 25;
    return { paidCount, totalCount, percentage, totalArrecadado, meta };
  }, [playersData]);

  const filteredList = useMemo(() => {
    if (filter === 'all') return playersData;
    if (filter === 'paid') return playersData.filter(p => p.isPaid);
    return playersData.filter(p => !p.isPaid);
  }, [filter, playersData]);

  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Gestão Financeira</h1>
            <p className="text-text-muted text-base">Controle quem já pagou a partida de 14/11.</p>
          </div>
          <button className="bg-primary text-text-main font-bold h-12 px-6 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined">receipt_long</span>
            Relatório Completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Arrecadado</p>
            <p className="text-3xl font-black text-primary tracking-tighter">R$ {stats.totalArrecadado.toFixed(2)}</p>
            <p className="text-xs text-text-muted mt-1">Meta: R$ {stats.meta.toFixed(2)}</p>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Pagos</p>
            <p className="text-3xl font-black dark:text-white tracking-tighter">{stats.paidCount} <span className="text-lg text-text-muted">/ {stats.totalCount}</span></p>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Pendente</p>
            <p className="text-3xl font-black text-accent-warning tracking-tighter">R$ {(stats.meta - stats.totalArrecadado).toFixed(2)}</p>
            <p className="text-xs text-text-muted mt-1">{stats.totalCount - stats.paidCount} jogadores restantes</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold dark:text-white">Lista de Pagadores</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-xs font-bold">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full transition-all ${filter === 'all' ? 'bg-primary text-text-main shadow-sm' : 'text-text-muted'}`}>Todos</button>
              <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-full transition-all ${filter === 'pending' ? 'bg-accent-warning text-white shadow-sm' : 'text-text-muted'}`}>Pendentes</button>
              <button onClick={() => setFilter('paid')} className={`px-4 py-2 rounded-full transition-all ${filter === 'paid' ? 'bg-green-500 text-white shadow-sm' : 'text-text-muted'}`}>Pagos</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredList.map(player => (
              <div key={player.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm" style={{ backgroundImage: `url(${player.avatar})` }}></div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-white">{player.name}</h4>
                    <p className="text-xs text-text-muted">{player.position} • {player.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-sm dark:text-white">R$ 25,00</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${player.isPaid ? 'bg-primary/10 text-primary' : 'bg-accent-warning/10 text-accent-warning'}`}>
                      {player.isPaid ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </div>
                  {!player.isPaid && (
                    <button
                      onClick={() => handleMarkAsPaid(player.id)}
                      className="size-10 rounded-full bg-primary text-text-main flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shadow-primary/20"
                      title="Registrar Pagamento"
                    >
                      <span className="material-symbols-outlined icon-filled">payments</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default FinancialPage;
