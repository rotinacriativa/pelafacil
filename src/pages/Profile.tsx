import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../hooks/useGroups';
import Layout from '../components/layout/Layout';
import { supabase } from '../services/supabase';

interface ProfileData {
    name: string;
    position: string;
    dominant_foot: string;
    shirt_number: number | string;
    level: string; // Not in DB yet, mocking or using metadata? Let's use metadata or local state fallback
    bio: string;
    city: string;
    phone: string;
    avatar_url: string;
}

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const { groups } = useGroups();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Default State
    const [profile, setProfile] = useState<ProfileData>({
        name: user?.user_metadata?.full_name || '',
        position: 'Meio-Campo',
        dominant_foot: 'Destro',
        shirt_number: 10,
        level: 'Avançado',
        bio: 'Jogador casual, gosto de organizar o meio de campo.',
        city: 'São Paulo, SP',
        phone: '(11) 99999-9999',
        avatar_url: user?.user_metadata?.avatar_url || ''
    });

    const [stats, setStats] = useState({
        games: 0,
        goals: 0,
        assists: 0,
        mvp: 0
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('match_stats')
            .select('goals, assists, mvp')
            .eq('user_id', user.id);

        if (data) {
            const games = data.length;
            const goals = data.reduce((acc, curr) => acc + (curr.goals || 0), 0);
            const assists = data.reduce((acc, curr) => acc + (curr.assists || 0), 0);
            const mvp = data.filter(s => s.mvp).length;
            setStats({ games, goals, assists, mvp });
        }
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setProfile({
                    name: data.name || user?.user_metadata?.full_name || '',
                    position: data.position || 'Meio-Campo',
                    dominant_foot: data.dominant_foot || 'Destro',
                    shirt_number: data.shirt_number || 10,
                    level: 'Avançado',
                    bio: data.bio || 'Sem bio.',
                    city: data.city || 'São Paulo, SP',
                    phone: data.phone || '(11) 99999-9999',
                    avatar_url: data.avatar_url || user?.user_metadata?.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você deve selecionar uma imagem para fazer upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: data.publicUrl });
        } catch (error: any) {
            alert(error.message || 'Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updates = {
                id: user.id,
                name: profile.name,
                position: profile.position,
                dominant_foot: profile.dominant_foot,
                shirt_number: Number(profile.shirt_number),
                bio: profile.bio,
                city: profile.city,
                phone: profile.phone,
                updated_at: new Date(),
                avatar_url: profile.avatar_url // Save avatar URL too
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Erro ao salvar perfil: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSaving(false);
        }
    };

    // UI Components for Fields
    const FieldDisplay = ({ label, value, icon }: { label: string, value: string | number, icon?: string }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                {icon && <span className="material-symbols-outlined text-primary text-xl">{icon}</span>}
                {value}
            </div>
        </div>
    );

    return (
        <Layout>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative mb-8 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-[#2a3c2d] overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-[#102212] to-[#1a4023] relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 relative">
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white dark:border-card-dark bg-gray-200 overflow-hidden shadow-lg">
                                    <img
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                        src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                                    />
                                </div>
                                {isEditing && (
                                    <>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="absolute bottom-2 right-2 bg-white dark:bg-[#223625] p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors disabled:opacity-50"
                                            title="Alterar foto"
                                        >
                                            {uploading ? (
                                                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                                            )}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={uploadAvatar}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="inline-flex items-center gap-1.5 self-center md:self-start px-3 py-1 bg-primary/20 text-primary-dark dark:text-primary font-bold text-xs rounded-full uppercase tracking-wider">
                                                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                                                    Modo de Edição
                                                </div>
                                                <input
                                                    value={profile.name}
                                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className="text-3xl font-black text-[#111812] dark:text-white bg-transparent border-b-2 border-primary outline-none w-full md:w-auto"
                                                    placeholder="Seu Nome"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <h1 className="text-3xl font-black text-[#111812] dark:text-white tracking-tight leading-none mb-1">{profile.name}</h1>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Perfil de Jogador</p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-2 text-gray-600 dark:text-gray-400 font-medium text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">mail</span>
                                                {user?.email}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">call</span>
                                                {isEditing ? (
                                                    <input
                                                        value={profile.phone}
                                                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                        className="bg-transparent border-b border-primary outline-none w-32"
                                                    />
                                                ) : profile.phone}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                {isEditing ? (
                                                    <input
                                                        value={profile.city}
                                                        onChange={e => setProfile({ ...profile, city: e.target.value })}
                                                        className="bg-transparent border-b border-primary outline-none w-32"
                                                    />
                                                ) : profile.city}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        {isEditing ? (
                                            <>
                                                <button onClick={fetchProfile} disabled={saving} className="px-6 py-2.5 bg-white dark:bg-[#223625] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-full transition-colors">
                                                    Cancelar
                                                </button>
                                                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-[#102212] font-bold rounded-full transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-[#102212] font-bold rounded-full transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    Editar Perfil
                                                </button>
                                                <button onClick={handleSignOut} className="px-6 py-2.5 bg-white dark:bg-[#223625] border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-full transition-colors flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                                    Sair
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3c2d]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#111812] dark:text-white">
                                <span className="material-symbols-outlined text-primary">badge</span>
                                Ficha do Jogador
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6 leading-snug">
                                Essas informações ajudam a montar times mais equilibrados.
                            </p>
                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Posição Preferida</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <select
                                                value={profile.position}
                                                onChange={e => setProfile({ ...profile, position: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-[#223625] border border-gray-200 dark:border-gray-700 text-[#111812] dark:text-white font-medium rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
                                            >
                                                <option>Goleiro</option>
                                                <option>Zagueiro</option>
                                                <option>Lateral</option>
                                                <option>Meio-campo</option>
                                                <option>Atacante</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold text-slate-800 dark:text-white">{profile.position}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Pé Dominante</label>
                                    {isEditing ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Destro', 'Canhoto'].map(foot => (
                                                <label key={foot} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="foot"
                                                        className="peer sr-only"
                                                        checked={profile.dominant_foot === foot}
                                                        onChange={() => setProfile({ ...profile, dominant_foot: foot })}
                                                    />
                                                    <div className="text-center py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#223625] text-gray-600 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-[#102212] peer-checked:border-primary peer-checked:font-bold transition-all">
                                                        {foot}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-lg font-bold text-slate-800 dark:text-white">{profile.dominant_foot}</div>
                                    )}
                                </div>

                                {/* Nível Técnico (Visual Only for MVP) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nível Técnico</label>
                                        <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">{profile.level}</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#223625] border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} className={`material-symbols-outlined text-3xl ${star <= 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>star</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Camisa Favorita</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={profile.shirt_number}
                                            onChange={e => setProfile({ ...profile, shirt_number: e.target.value })}
                                            className="w-20 bg-gray-50 dark:bg-[#223625] border border-gray-200 dark:border-gray-700 text-center rounded-xl p-2 font-black outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#102212] flex items-center justify-center text-primary font-black text-xl border-2 border-primary shadow-lg">
                                                {profile.shirt_number}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-500">O clássico camisa {profile.shirt_number}</span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* BIO Section */}
                        <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3c2d]">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Sobre</h3>
                            {isEditing ? (
                                <textarea
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-[#223625] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Section (Keep existing or componentize) */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#111812] dark:text-white">
                                <span className="material-symbols-outlined text-primary">bar_chart</span>
                                Estatísticas Pessoais
                            </h2>
                            {stats.games === 0 ? (
                                <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-6 border border-dashed border-gray-300 dark:border-gray-700 text-center">
                                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">query_stats</span>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">Nenhuma estatística ainda</p>
                                    <p className="text-sm text-gray-500 mt-1">Seus números (jogos, gols, assistências) aparecerão aqui automaticamente após você participar de partidas.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-[#2a3c2d] shadow-sm text-center">
                                        <div className="text-3xl font-black text-[#111812] dark:text-white mb-0.5">{stats.games}</div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jogos</div>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-[#2a3c2d] shadow-sm text-center">
                                        <div className="text-3xl font-black text-[#111812] dark:text-white mb-0.5">{stats.goals}</div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gols</div>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-[#2a3c2d] shadow-sm text-center">
                                        <div className="text-3xl font-black text-[#111812] dark:text-white mb-0.5">{stats.assists}</div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assistências</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-yellow-200 dark:border-yellow-800/30 shadow-sm text-center relative overflow-hidden group">
                                        <div className="text-3xl font-black text-orange-600 dark:text-yellow-500 mb-0.5 relative z-10">{stats.mvp}</div>
                                        <div className="text-xs font-bold text-orange-800 dark:text-yellow-600 uppercase tracking-wider relative z-10">MVP (Craque)</div>
                                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl text-orange-500/10 group-hover:scale-110 transition-transform">emoji_events</span>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Groups Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-[#111812] dark:text-white">
                                    <span className="material-symbols-outlined text-primary">groups</span>
                                    Meus Grupos
                                </h2>
                                <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                                    Ver todos
                                </button>
                            </div>
                            <div className="space-y-4">
                                {groups.map((group) => (
                                    <div key={group.id} onClick={() => navigate(`/groups/${group.id}`)} className="cursor-pointer group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#2a3c2d] hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                        <div className="w-full sm:w-24 h-24 shrink-0 rounded-lg overflow-hidden relative grayscale-[10%]">
                                            <div className="w-full h-full bg-surface-light dark:bg-surface-dark flex items-center justify-center text-text-secondary">
                                                <span className="material-symbols-outlined text-4xl">groups</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2">
                                                <h3 className="font-bold text-lg text-[#111812] dark:text-white">{group.name}</h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md mt-1 sm:mt-0 ${group.role === 'admin' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                                    {group.role === 'admin' ? 'Admin' : 'Membro'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{group.description || 'Sem descrição.'}</p>
                                        </div>
                                        <button className="shrink-0 p-2 text-gray-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                                        </button>
                                    </div>
                                ))}
                                {groups.length === 0 && (
                                    <div className="text-center py-10 bg-gray-50 dark:bg-card-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-gray-500 mb-4 font-medium">Você ainda não participa de nenhum grupo.</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button
                                                onClick={() => navigate('/create-group')}
                                                className="px-6 py-2 bg-primary text-[#102212] font-bold rounded-full text-sm hover:brightness-110 transition-all shadow-sm"
                                            >
                                                Criar um Grupo
                                            </button>
                                            <button
                                                onClick={() => navigate('/')}
                                                className="px-6 py-2 bg-white dark:bg-[#223625] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-full text-sm hover:bg-gray-50 dark:hover:bg-[#2a4230] transition-colors"
                                            >
                                                Entrar com Convite
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Profile;
