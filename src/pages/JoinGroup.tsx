
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GroupPreview {
    id: string;
    name: string;
    description: string;
    owner_name: string;
    created_at: string;
    member_count: number;
}

const JoinGroup: React.FC = () => {
    const { inviteCode } = useParams<{ inviteCode: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [group, setGroup] = useState<GroupPreview | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroupPreview = async () => {
            if (!inviteCode) return;
            try {
                setLoading(true);
                // RPC call to get_group_by_invite
                const { data, error } = await supabase
                    .rpc('get_group_by_invite', { invite_code_input: inviteCode });

                if (error) throw error;

                if (data && data.length > 0) {
                    setGroup(data[0]);
                } else {
                    setError('Convite inválido ou expirado.');
                }
            } catch (err: any) {
                console.error('Error fetching invite:', err);
                setError('Erro ao carregar convite.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupPreview();
    }, [inviteCode]);

    const handleJoin = async () => {
        if (!user) {
            // Redirect to login, ideally preserving the return to this join page
            // For MVP, just go to login
            navigate('/login');
            return;
        }

        if (!group) return;

        try {
            setJoining(true);
            const { data, error } = await supabase
                .rpc('join_group_via_invite', { invite_code_input: inviteCode });

            if (error) throw error;

            // Success, navigate to group dashboard
            // The RPC returns the group ID (data)
            navigate(`/groups/${data}`);
        } catch (err: any) {
            console.error('Error joining group:', err);
            setError(err.message || 'Erro ao entrar no grupo.');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-surface-light dark:border-surface-dark">
                    <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <span className="material-symbols-outlined text-3xl">link_off</span>
                    </div>
                    <h2 className="text-2xl font-black text-text-main dark:text-white mb-2">Ops!</h2>
                    <p className="text-text-secondary dark:text-gray-400 mb-6">{error || 'Convite não encontrado.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full h-12 rounded-xl bg-surface-light dark:bg-surface-dark text-text-main dark:text-gray-300 font-bold hover:brightness-95 transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4 font-display">
            <div className="bg-card-light dark:bg-card-dark p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-surface-light dark:border-surface-dark relative overflow-hidden">
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="size-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
                        <span className="material-symbols-outlined text-[40px]">groups</span>
                    </div>

                    <h1 className="text-xl font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest text-xs mb-2">Você foi convidado para</h1>
                    <h2 className="text-3xl font-black text-text-main dark:text-white mb-4 leading-tight">{group.name}</h2>

                    {group.description && (
                        <p className="text-text-secondary dark:text-gray-400 text-sm mb-6 line-clamp-3 bg-surface-light dark:bg-surface-dark/50 p-4 rounded-xl w-full">
                            "{group.description}"
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-6 w-full mb-8 py-4 border-y border-surface-light dark:border-surface-dark/50">
                        <div className="flex flex-col">
                            <span className="text-xs text-text-secondary dark:text-gray-500 font-medium uppercase tracking-wider">Membros</span>
                            <span className="text-xl font-black text-text-main dark:text-white">{group.member_count}</span>
                        </div>
                        <div className="w-px h-8 bg-surface-light dark:border-surface-dark/50"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-text-secondary dark:text-gray-500 font-medium uppercase tracking-wider">Dono</span>
                            <span className="text-xl font-black text-text-main dark:text-white truncate max-w-[120px]">{group.owner_name}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={joining}
                        className="w-full h-14 rounded-full bg-primary hover:bg-primary-hover text-text-main font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {joining ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Entrando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">login</span>
                                {user ? 'Entrar no Grupo' : 'Entrar (Login Necessário)'}
                            </>
                        )}
                    </button>
                    {!user && (
                        <p className="mt-4 text-xs text-text-secondary dark:text-gray-500">
                            Você será redirecionado para criar uma conta ou fazer login.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinGroup;
