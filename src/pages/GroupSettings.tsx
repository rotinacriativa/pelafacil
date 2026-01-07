
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useGroupMembers } from '../hooks/useGroupMembers';
import { useAuth } from '../contexts/AuthContext';

const GroupSettings: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { groups, refreshGroups, updateGroup } = useGroups();
    const { members, refreshMembers, updateMember } = useGroupMembers(groupId);

    // Find dynamic group data
    const group = groups.find(g => g.id === groupId);

    // Edit Modal State
    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [editForm, setEditForm] = useState<{ position: string | null; rating: number }>({ position: null, rating: 5.0 });

    useEffect(() => {
        if (editingMember) {
            setEditForm({
                position: editingMember.profile.position,
                rating: editingMember.profile.rating || 5.0
            });
        }
    }, [editingMember]);

    const getPositionStyle = (position: string | null) => {
        switch (position) {
            case 'Goleiro': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
            case 'Zagueiro': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'Lateral': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'Meio-campo': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'Atacante': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
        }
    };

    // Filter state
    const [filter, setFilter] = useState('Todos');

    const filteredMembers = members.filter(m => {
        if (filter === 'Todos') return true;
        // Simple mapping: 'Goleiros' -> 'Goleiro, etc.
        if (filter === 'Goleiros') return m.profile.position === 'Goleiro';
        if (filter === 'Defensores') return ['Zagueiro', 'Lateral'].includes(m.profile.position || '');
        if (filter === 'Meias') return m.profile.position === 'Meio-campo';
        if (filter === 'Atacantes') return m.profile.position === 'Atacante';
        return true;
    });

    // Local state for Rules (Description)
    const [rules, setRules] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (groups.length === 0) refreshGroups();
    }, [refreshGroups, groups.length]);

    useEffect(() => {
        if (group) {
            setRules(group.description || '');
            if (group.role !== 'admin') {
                navigate(`/groups/${groupId}`);
            }
        }
    }, [group, navigate, groupId]);

    const handleSaveRules = async () => {
        if (!group) return;
        setIsSaving(true);
        await updateGroup(group.id, { description: rules });
        setIsSaving(false);
        // Optional: toast success
    };

    if (!group) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased text-text-main dark:text-white transition-colors duration-200 min-h-screen flex flex-col overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-surface-light dark:border-surface-dark px-4 lg:px-10 py-3">
                <div className="mx-auto flex max-w-[1280px] items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[32px]">sports_soccer</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-text-main dark:text-white">Pelada App</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center gap-8 px-8">
                        <nav className="flex items-center gap-6">
                            <Link className="text-sm font-medium hover:text-primary transition-colors text-text-main dark:text-gray-300" to="/dashboard">Meus Grupos</Link>
                            <Link className="text-sm font-medium text-primary" to="#">Jogadores</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors text-text-main dark:text-gray-300" to="/explore">Jogos</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4 justify-end">
                        <button className="flex size-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined text-text-main dark:text-white text-[20px]">notifications</span>
                        </button>
                        <div
                            onClick={() => navigate('/profile')}
                            className="size-10 rounded-full bg-cover bg-center border-2 border-surface-light dark:border-surface-dark cursor-pointer"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMqkmXjGa05H4bbvD2-S2soL4vVJCTfqVD87w8jxICD0yCs4Gh1sa_a2da7KJ45CHHn52JxkzUC8qYDM5hSo3i1wBhHQH75Az-FUWUGCOLZtXk7pSZ1c0QbVu-m7ZwXpTj_VBBdtsWJnon9m7FFFtUtBLDKVPFfRV3fMFAAy4i_tUR6Mlfw8LJN8hRQ8-zy2aokPPLBR6rahvcyw1QaL5GhIw7j7KjLeHCQVY9aJ1trxo_80BSkdQ2emUzOtvn1Yduw7cE0n0KBOs")' }}>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1024px] mx-auto px-4 py-8 md:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">{group.name}</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-base">Organize o elenco de jogadores e defina as regras da pelada.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/groups/${groupId}`)}
                            className="h-12 px-6 rounded-full bg-white dark:bg-surface-dark text-text-main dark:text-white font-bold text-sm hover:brightness-95 transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            <span>Voltar</span>
                        </button>
                        <button className="h-12 px-6 rounded-full bg-primary hover:bg-primary-hover text-text-main font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                            <span className="hidden sm:inline">Convidar</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm border border-surface-light dark:border-surface-dark">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary dark:text-gray-500">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="w-full h-12 rounded-xl bg-surface-light dark:bg-surface-dark border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#2a3c2e] focus:ring-0 pl-10 text-text-main dark:text-white placeholder-text-secondary dark:placeholder-gray-500 font-medium transition-all" placeholder="Buscar jogador por nome ou posição..." type="text" />
                                </div>
                                <button className="h-12 px-6 rounded-xl bg-surface-light hover:bg-gray-200 dark:bg-surface-dark dark:hover:bg-surface-dark/80 text-text-main dark:text-gray-300 font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0">
                                    <span className="material-symbols-outlined text-text-secondary">person_add</span>
                                    Adicionar Manualmente
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button onClick={() => setFilter('Todos')} className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors ${filter === 'Todos' ? 'bg-primary text-text-main' : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200'}`}>Todos ({members.length})</button>
                            <button onClick={() => setFilter('Goleiros')} className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'Goleiros' ? 'bg-primary text-text-main' : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200'}`}>Goleiros ({members.filter(m => m.profile.position === 'Goleiro').length})</button>
                            <button onClick={() => setFilter('Defensores')} className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'Defensores' ? 'bg-primary text-text-main' : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200'}`}>Defensores ({members.filter(m => ['Zagueiro', 'Lateral'].includes(m.profile.position || '')).length})</button>
                            <button onClick={() => setFilter('Meias')} className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'Meias' ? 'bg-primary text-text-main' : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200'}`}>Meias ({members.filter(m => m.profile.position === 'Meio-campo').length})</button>
                            <button onClick={() => setFilter('Atacantes')} className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'Atacantes' ? 'bg-primary text-text-main' : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200'}`}>Atacantes ({members.filter(m => m.profile.position === 'Atacante').length})</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {filteredMembers.map((member) => (
                                <div key={member.user_id} className="group flex items-center justify-between p-3 md:p-4 bg-card-light dark:bg-card-dark rounded-xl border border-surface-light dark:border-surface-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div
                                                className="size-14 rounded-full bg-cover bg-center bg-gray-200"
                                                style={{ backgroundImage: `url("${member.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.profile.name)}&background=random&color=fff`}")` }}
                                            >
                                            </div>
                                            {(member.profile.rating && member.profile.rating > 0) && (
                                                <div className={`absolute -bottom-1 -right-1 ${member.profile.rating >= 4.5 ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-surface-dark'} text-text-main ${member.profile.rating < 4.5 ? 'dark:text-gray-300' : ''} text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-white dark:border-card-dark flex items-center gap-0.5`}>
                                                    <span className="material-symbols-outlined !text-[10px]">star</span> {member.profile.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-text-main dark:text-white text-base font-bold leading-tight flex items-center gap-2">
                                                {member.profile.name}
                                                {member.role === 'admin' && (
                                                    <span className="material-symbols-outlined text-xs text-primary" title="Admin">shield_person</span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {member.profile.position ? (
                                                    <span className={`${getPositionStyle(member.profile.position)} text-xs font-bold px-2 py-0.5 rounded-md`}>
                                                        {member.profile.position}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-text-secondary dark:text-gray-500 italic">Sem posição</span>
                                                )}
                                                {/* Mocked status for now */}
                                                <span className="text-xs text-text-secondary dark:text-gray-500 hidden sm:inline-block">• Membro</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingMember(member)}
                                            className="flex size-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-light dark:hover:bg-surface-dark dark:text-gray-400 transition-colors"
                                            title="Editar Jogador"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button className="flex size-10 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Remover Jogador">
                                            <span className="material-symbols-outlined">person_remove</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-surface-light dark:border-surface-dark shadow-sm sticky top-24">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">gavel</span>
                                </div>
                                <h3 className="font-bold text-lg text-text-main dark:text-white">Regras do Grupo</h3>
                            </div>
                            <p className="text-sm text-text-secondary dark:text-gray-400 mb-4 leading-relaxed">Defina as regras da pelada para que todos os membros estejam cientes.</p>
                            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveRules(); }}>
                                <div>
                                    <label className="sr-only" htmlFor="rules">Regras</label>
                                    <textarea
                                        className="w-full rounded-xl bg-surface-light dark:bg-surface-dark border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-text-main dark:text-white placeholder-text-secondary dark:placeholder-gray-500 text-sm leading-relaxed p-4 min-h-[300px] resize-none scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                        id="rules"
                                        value={rules}
                                        onChange={(e) => setRules(e.target.value)}
                                        placeholder="Digite as regras da pelada aqui..."
                                    ></textarea>
                                </div>
                                <button
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-text-main font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={isSaving}
                                >
                                    <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
                                    {isSaving ? 'Salvando...' : 'Salvar Regras'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-8 @container">
                    <div className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark p-8 md:p-12 text-center">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary text-4xl">groups</span>
                            </div>
                            <div className="space-y-2 max-w-lg">
                                <h2 className="text-2xl md:text-3xl font-black text-text-main dark:text-white">Faltam jogadores para fechar o time?</h2>
                                <p className="text-text-secondary dark:text-gray-300">Envie um link direto no grupo do WhatsApp para que seus amigos entrem automaticamente.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (group?.invite_code) {
                                        const url = `${window.location.origin}/join/${group.invite_code}`;
                                        navigator.clipboard.writeText(url);
                                        // Simple alert for MVP, ideally use a toast
                                        alert('Link copiado: ' + url);
                                    }
                                }}
                                className="w-full max-w-sm h-14 rounded-full bg-primary hover:bg-primary-hover text-text-main font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95 flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined">link</span>
                                Copiar Link de Convite
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Member Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-2xl border border-surface-light dark:border-surface-dark animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Editar Jogador</h3>
                            <button
                                onClick={() => setEditingMember(null)}
                                className="size-8 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-text-main dark:text-white mb-2">Posição</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante'].map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setEditForm(prev => ({ ...prev, position: pos }))}
                                            className={`h-10 rounded-xl text-sm font-bold border transition-all ${editForm.position === pos
                                                ? 'bg-primary border-primary text-text-main'
                                                : 'bg-transparent border-surface-light dark:border-surface-dark text-text-secondary dark:text-gray-400 hover:border-primary/50'
                                                }`}
                                        >
                                            {pos}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-main dark:text-white mb-2">Nota (0 - 5)</label>
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-text-main dark:text-white">{editForm.rating.toFixed(1)}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`material-symbols-outlined ${star <= Math.round(editForm.rating) ? 'text-yellow-400 icon-filled' : 'text-gray-300 dark:text-gray-600'}`}>star</span>
                                            ))}
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={editForm.rating}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                                        className="w-full accent-primary h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    if (!editingMember) return;
                                    await updateMember(editingMember.user_id, {
                                        position: editForm.position,
                                        rating: editForm.rating
                                    });
                                    setEditingMember(null);
                                }}
                                className="mt-4 w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-text-main font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">save</span>
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSettings;
