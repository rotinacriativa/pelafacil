import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useMatches } from '../hooks/useMatches';
import { useMatchDetails } from '../hooks/useMatchDetails';
import { useAuth } from '../hooks/useAuth';
import { financialService } from '../services/financialService';
import { MatchExpense, MatchPayment } from '../types';

const FinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: paramMatchId } = useParams<{ id: string }>();
  const { session } = useAuth();

  const { nextMatch } = useMatches();
  const matchId = paramMatchId || nextMatch?.id;

  const { match } = useMatchDetails(matchId);
  const isOwner = match?.group?.owner_id === session?.user?.id;

  const [expense, setExpense] = useState<MatchExpense | null>(null);
  const [payments, setPayments] = useState<MatchPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [costInput, setCostInput] = useState('');
  const [showCostForm, setShowCostForm] = useState(false);

  const loadData = async () => {
    if (!matchId) return;
    setLoading(true);
    try {
      const [exp, pays] = await Promise.all([
        financialService.getExpense(matchId),
        financialService.getPayments(matchId)
      ]);
      setExpense(exp);
      setPayments(pays);
      if (exp) setCostInput(exp.total_amount.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [matchId]);

  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId || !session?.user) return;

    setActionLoading(true);
    try {
      await financialService.upsertExpense(matchId, parseFloat(costInput), session.user.id);
      await loadData();
      setShowCostForm(false);
    } catch (err) {
      alert('Erro ao salvar custo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (paymentId: string, status: 'PENDING' | 'PAID') => {
    if (!isOwner) return;
    // Optimistic Update
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: status === 'PAID' ? 'PENDING' : 'PAID' } : p));

    try {
      await financialService.togglePaymentStatus(paymentId, status);
      // Silent success
    } catch (err) {
      alert('Erro ao atualizar.');
      loadData(); // Revert
    }
  };

  // Calculations
  const totalAmount = expense?.total_amount || 0;
  const collected = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + Number(p.amount), 0);
  const pending = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + Number(p.amount), 0);
  const sharePerPlayer = payments.length > 0 ? payments[0].amount : 0;

  // Render Logic
  if (loading) return (
    <Layout>
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <main className="flex-grow w-full max-w-[1024px] mx-auto px-4 py-8 sm:px-6">
        <header className="mb-8">
          <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Voltar
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Automação Financeira</h1>
              <p className="text-slate-500">{match?.location}</p>
            </div>
            {isOwner && expense && (
              <button
                onClick={() => setShowCostForm(!showCostForm)}
                className="text-primary font-bold text-sm hover:underline"
              >
                {showCostForm ? 'Cancelar Edição' : 'Editar Custo'}
              </button>
            )}
          </div>
        </header>

        {/* Empty State / Create Cost */}
        {(!expense || showCostForm) && (
          <div className="mb-8 bg-white dark:bg-surface-dark p-6 rounded-2xl border border-dashed border-primary/50 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              {expense ? 'Editar Custo da Partida' : 'Definir Custo Total'}
            </h3>
            <form onSubmit={handleSaveCost} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custo Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costInput}
                  onChange={e => setCostInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
              {isOwner ? (
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-primary hover:bg-primary-dark text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
                >
                  {actionLoading ? 'Salvando...' : 'Salvar e Ratear'}
                </button>
              ) : (
                <p className="text-sm text-red-500 font-bold py-3">Apenas o admin define o custo.</p>
              )}
            </form>
            {expense && !showCostForm && <p className="text-xs text-slate-400 mt-2">Isso recalculará o valor para todos os jogadores.</p>}
          </div>
        )}

        {/* Dashboard */}
        {expense && !showCostForm && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Expected */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span className="text-xs font-bold uppercase">Custo Total</span>
                </div>
                <p className="text-3xl font-black text-slate-800 dark:text-white">R$ {Number(totalAmount).toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-1">R$ {Number(sharePerPlayer).toFixed(2)} por jogador</p>
              </div>

              {/* Collected */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                  <span className="material-symbols-outlined">savings</span>
                  <span className="text-xs font-bold uppercase">Pago</span>
                </div>
                <p className="text-3xl font-black text-green-600">R$ {collected.toFixed(2)}</p>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl text-green-500">check_circle</span>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                  <span className="material-symbols-outlined">pending</span>
                  <span className="text-xs font-bold uppercase">A Receber</span>
                </div>
                <p className="text-3xl font-black text-orange-500">R$ {pending.toFixed(2)}</p>
              </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pagamentos ({payments.length})</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.length === 0 && <p className="p-8 text-center text-slate-400">Nenhum jogador aprovado para rateio.</p>}
                {payments.sort((a, b) => a.status === 'PAID' ? 1 : -1).map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                        {p.profile?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{p.profile?.name}</p>
                        <p className="text-xs text-slate-500">R$ {Number(p.amount).toFixed(2)}</p>
                      </div>
                    </div>

                    {isOwner ? (
                      <button
                        onClick={() => handleToggle(p.id, p.status)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${p.status === 'PAID'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        <span className="material-symbols-outlined text-sm">{p.status === 'PAID' ? 'check' : 'radio_button_unchecked'}</span>
                        {p.status === 'PAID' ? 'PAGO' : 'MARCAR PAGO'}
                      </button>
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {p.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
};

export default FinancialPage;
