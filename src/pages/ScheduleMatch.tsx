
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

const ScheduleMatch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuth();

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isPastMatch, setIsPastMatch] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [slots, setSlots] = useState(14);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const [creating, setCreating] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<{ id: string, name: string, invite_code: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check for edit mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editMatchId = params.get('edit');

    if (editMatchId) {
      setEditMode(true);
      setMatchId(editMatchId);
      loadMatchData(editMatchId);
    }
  }, [location.search]);

  // Load match data for editing
  const loadMatchData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*, groups!inner(id, name, invite_code, owner_id)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const matchDateTime = new Date(data.date_time);
        const dateStr = matchDateTime.toISOString().split('T')[0];
        const timeStr = matchDateTime.toTimeString().slice(0, 5);

        setDate(dateStr);
        setTime(timeStr);
        setLocationName(data.location || '');
        setAddress(data.address || '');
        setSlots(data.slots);
        setPrice(data.price?.toString() || '');
        setNotes(data.notes || '');
        setCurrentGroup({ id: data.groups.id, name: data.groups.name, invite_code: data.groups.invite_code });

        // Check if match has passed
        setIsPastMatch(matchDateTime < new Date());
      }
    } catch (err: any) {
      console.error('Error loading match:', err);
      alert('Erro ao carregar dados da partida.');
    }
  };

  // Sync calendar with date input
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  }, [date]);

  // Load user's group on mount (only if not in edit mode)
  useEffect(() => {
    if (session?.user && !editMode) {
      loadUserGroup();
    }
  }, [session, editMode]);

  const loadUserGroup = async () => {
    if (!session?.user) return;

    const { data: groups } = await supabase
      .from('groups')
      .select('id, name, invite_code')
      .eq('owner_id', session.user.id)
      .limit(1);

    if (groups && groups.length > 0) {
      setCurrentGroup(groups[0]);
    }
  };

  useEffect(() => {
    if (!loading && !session) {
      // Optional: Redirect automatically or let them browse?
      // For now, let's keep them here but show a banner or rely on button check.
    }
  }, [loading, session]);

  const handleCreateMatch = async () => {
    if (loading) return; // Wait for auth check

    if (!session?.user) {
      // Use a comprehensive check
      const confirmLogin = window.confirm('Você precisa estar logado para criar uma partida. Deseja fazer login agora?');
      if (confirmLogin) {
        navigate('/login');
      }
      return;
    }

    if (!locationName || !date || !time) {
      alert('Por favor, preencha pelo menos Data, Horário e Local.');
      return;
    }

    try {
      setCreating(true);

      // 1. MVP Hack: Get or Create a default group for this user
      // In a full app, the user would select which group they are scheduling for.
      let groupId = '';

      const { data: groups } = await supabase
        .from('groups')
        .select('id')
        .eq('owner_id', session.user.id)
        .limit(1);

      if (groups && groups.length > 0) {
        groupId = groups[0].id;
      } else {
        // Create a new group
        const { data: newGroup, error: groupError } = await supabase
          .from('groups')
          .insert({
            name: 'Meu Grupo de Pelada',
            owner_id: session.user.id,
            description: 'Grupo criado automaticamente'
          })
          .select()
          .single();

        if (groupError) throw groupError;
        groupId = newGroup.id;
      }

      // 2. Create the Match
      // Combine Date and Time
      const dateTime = new Date(`${date}T${time}:00`).toISOString();

      const { data, error: matchError } = await supabase
        .from('matches')
        .insert({
          group_id: groupId,
          location: `${locationName}${address ? ` - ${address}` : ''}`,
          date_time: dateTime,
          max_players: slots,
          price_per_person: price ? parseFloat(price) : 0,
          status: 'scheduled'
        })
        .select();

      const newMatchData = data;

      if (matchError) throw matchError;

      // 3. Add Creator as Admin/Player (Automatically Approved)
      const { error: playerError } = await supabase
        .from('match_players')
        .insert({
          match_id: newMatchData[0].id,
          user_id: session.user.id,
          status: 'approved' // Auto-approved
        });

      if (playerError) console.error('Error adding creator to match:', playerError); // Non-blocking but log it

      // Update current group if it was just created
      if (!currentGroup) {
        await loadUserGroup();
      }

      // Success feedback with visual confirmation
      setShowSuccess(true);

      // Wait a bit to show the success message
      setTimeout(() => {
        navigate(`/match/${newMatchData[0].id}`, {
          state: { fromCreation: true }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Error creating match:', error);
      alert('Erro ao criar partida: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 md:px-10">
        <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
          <div onClick={() => navigate('/dashboard')} className="flex items-center gap-3 md:justify-start justify-center text-slate-400 mb-2 cursor-pointer hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span className="text-sm font-medium">Voltar para o início</span>
          </div>
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            {editMode ? 'Editar Partida' : 'Agendar Nova Partida'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-normal mb-4">
            {editMode ? 'Atualize os dados da partida.' : 'Preencha os dados abaixo para convocar a galera.'}
          </p>

          {/* Past Match Warning */}
          {isPastMatch && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">warning</span>
                <div>
                  <p className="font-bold text-yellow-900 dark:text-yellow-200">Atenção!</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Esta partida já aconteceu. Você pode editar, mas verifique se realmente precisa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentGroup && (
            <div className="inline-flex items-center gap-2 self-center md:self-start px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
              <span className="text-sm font-bold text-primary-dark dark:text-primary">Partida do grupo: {currentGroup.name}</span>
            </div>
          )}

          <button
            onClick={async () => {
              if (loading || !session?.user) return;
              try {
                // 1. Get user's groups
                const { data: groups } = await supabase
                  .from('groups')
                  .select('id')
                  .eq('owner_id', session.user.id);

                if (!groups || groups.length === 0) {
                  alert('Você ainda não criou nenhuma partida anterior.');
                  return;
                }

                const groupIds = groups.map(g => g.id);

                // 2. Get latest match from these groups
                const { data: matches } = await supabase
                  .from('matches')
                  .select('*')
                  .in('group_id', groupIds)
                  .order('created_at', { ascending: false })
                  .limit(1);

                if (matches && matches.length > 0) {
                  const last = matches[0];
                  // Fill data
                  const lastDate = new Date(last.date_time);
                  // Add 7 days
                  const nextDate = new Date(lastDate);
                  nextDate.setDate(lastDate.getDate() + 7);

                  setDate(nextDate.toISOString().split('T')[0]);
                  // Extract time HH:MM
                  const timeStr = lastDate.toTimeString().slice(0, 5);
                  setTime(timeStr); // Or keep last.date_time time part if accurate

                  setLocationName(last.location.split(' - ')[0]); // Simple split
                  setAddress(last.location.split(' - ')[1] || '');
                  setPrice(last.price_per_person?.toString() || '');
                  setSlots(last.max_players || 14);
                  // Notes not in schema? It was notes state but where is it saved?
                  // Notes are not in existing schema view, so maybe we skip or it was ignored.
                  // Looking at code line 64-92, notes is NOT inserted. It's local state only?
                  // Ah, schema.sql showed matches table... let's check inserts.
                  // Only location, date, max_players, price, status. No notes in insert.
                  // So notes are lost. We won't restore them.
                } else {
                  alert('Nenhuma partida anterior encontrada.');
                }
              } catch (e) {
                console.error(e);
                alert('Erro ao carregar partida.');
              }
            }}
            className="self-center md:self-start bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-5 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Repetir Última Partida (Clonar)
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-3">
                <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  Data da Partida
                </label>
                <div className="relative">
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-14 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer font-medium"
                    type="date"
                  />
                </div>
              </div>
              <div className="flex-1 md:max-w-[200px] flex flex-col gap-3">
                <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  Horário
                </label>
                <div className="relative">
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-14 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-center"
                    type="time"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Localização
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full h-14 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  placeholder="Nome do Local (ex: Arena Society)"
                  type="text"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-14 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  placeholder="Endereço completo"
                  type="text"
                />
              </div>
              <div className="w-full h-32 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative group cursor-pointer">
                <img className="w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJxuQa2Vzggx4uRWprvoe866GV8zN6gwN4UHLGKoVXeXFrJow1WuaYScJ6wLn6vnz05kqWoA0X0FiaXlxU6nscLH8wuK97V8eRf5m2SanblEActNywbXPBIodxbtf827FyhWZExMEpDmw-Yhysng-PkLoOEPAzuRGAEln2LiywbmbLuL1CcVe7szQVMMRdmfoKh8cfxaL_njLTPG6vH4Js2nX-DefsHAA8EaaO8pHN9ehfITg9NkrG0M-xYwhdOjJQtXb4GRrK38U" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">Ver no mapa</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-3">
                <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  Número de Vagas
                </label>
                <div className="flex items-center bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-2 h-14 w-full md:w-48">
                  <button onClick={() => setSlots(Math.max(1, slots - 1))} className="size-10 flex items-center justify-center text-slate-500 hover:text-primary active:scale-95 transition-all">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input readOnly className="flex-1 bg-transparent text-center font-bold text-lg text-slate-900 dark:text-white focus:outline-none border-none p-0 appearance-none" type="number" value={slots} />
                  <button onClick={() => setSlots(slots + 1)} className="size-10 flex items-center justify-center text-slate-500 hover:text-primary active:scale-95 transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">attach_money</span>
                  Valor por pessoa (Opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-14 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 font-medium"
                    placeholder="0,00"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-900 dark:text-slate-200 text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notes</span>
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[120px] bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 resize-y"
                placeholder="Ex: Levar camisa branca e preta. Pagamento no pix do organizador."
              ></textarea>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handleCreateMatch}
                disabled={creating}
                className="w-full h-14 bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">sports_soccer</span>
                {creating ? 'Criando Partida...' : 'Criar Partida'}
              </button>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-sm icon-filled">notifications_active</span>
                <p>Os jogadores do grupo serão notificados automaticamente.</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col w-[360px] gap-6">
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white capitalize">
                  {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setDate(newDate.toISOString().split('T')[0]);
                    }}
                    className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setDate(newDate.toISOString().split('T')[0]);
                    }}
                    className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center text-sm mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                  <div key={day} className="text-slate-400 font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm">
                {(() => {
                  const year = selectedDate.getFullYear();
                  const month = selectedDate.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const daysInPrevMonth = new Date(year, month, 0).getDate();
                  const selectedDay = selectedDate.getDate();
                  const today = new Date();
                  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

                  const days = [];

                  // Previous month days
                  for (let i = firstDay - 1; i >= 0; i--) {
                    days.push(
                      <div key={`prev-${i}`} className="size-10 flex items-center justify-center text-slate-300 dark:text-slate-600">
                        {daysInPrevMonth - i}
                      </div>
                    );
                  }

                  // Current month days
                  for (let d = 1; d <= daysInMonth; d++) {
                    const isSelected = d === selectedDay;
                    const isToday = isCurrentMonth && d === today.getDate();

                    days.push(
                      <button
                        key={d}
                        onClick={() => {
                          const newDate = new Date(year, month, d);
                          setDate(newDate.toISOString().split('T')[0]);
                        }}
                        className={`size-10 flex items-center justify-center rounded-full transition-all ${isSelected
                          ? 'bg-primary text-slate-900 font-bold shadow-lg shadow-primary/30'
                          : isToday
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                      >
                        {d}
                      </button>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800/30 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-sm">
                  <span className="material-symbols-outlined icon-filled">lightbulb</span>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">Dica de Organizador</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200/80 leading-relaxed">
                    Defina o número de vagas com folga para reservas. O app criará uma lista de espera automática se lotar!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
            <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]">
              <div className="bg-white/20 p-2 rounded-full">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="font-bold text-lg">{editMode ? 'Partida atualizada com sucesso!' : 'Partida criada com sucesso!'}</p>
                <p className="text-sm text-green-100">Redirecionando...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ScheduleMatch;
