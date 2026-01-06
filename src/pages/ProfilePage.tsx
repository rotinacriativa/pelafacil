
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

type ProfileTab = 'personal' | 'preferences' | 'notifications' | 'security';

import { supabase } from '../lib/supabase';

/* ... imports ... */
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAcgmO3HjVs3LG8kmX8RtT9cNYG2HE8jfT-tR4WZT6bvTlOkanGFTi4YGbi_1Fx-sGQya8sBtsDuNcWM9YJ2vXi5FzMH4Hmjr-5o-ASj45BoapfxAhzlSYgUyptTUhQfwmVib4Kl_ZubfFJOHy3g0FOax9VCT7wYA-kdIn5PYTfeVGQNhdHMEStTcHqQIDLceaakZ6dzOxdpN4ZwBVWWju_Kk2yL0Mk4wbDpHx7t1X0Ks8OvHxtHCVgi-n7gAfBFNoqnh-gtPG_jEM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Meia');
  const [frequency, setFrequency] = useState('Semanal');
  const [foot, setFoot] = useState('Destro');
  const [level, setLevel] = useState('Amador / Lazer');

  const stats = [
    { label: 'Jogos', value: '0', icon: 'stadium' },
    { label: 'Gols', value: '0', icon: 'sports_soccer' },
    { label: 'MVPs', value: '0', icon: 'emoji_events' },
  ];

  // Fetch Profile Data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; // Should be handled by PrivateRoute, but safety check

      try {
        // Set basic auth data
        setEmail(user.email || '');

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          // If profile doesn't exist (edge case), we might want to create it or just ignore
          console.error('Error fetching profile:', error);
        }

        if (profile) {
          setName(profile.name || '');
          setProfileImage(profile.avatar_url || profileImage);
          setPosition(profile.position || 'Meia');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Celular</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Posição Favorita</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option>Goleiro</option>
                  <option>Zagueiro</option>
                  <option>Lateral</option>
                  <option>Meia</option>
                  <option>Atacante</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Preferências de Jogo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Pé Dominante</label>
                <div className="flex gap-2">
                  {['Destro', 'Canhoto', 'Ambidestro'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFoot(option)}
                      className={`flex-1 h-12 rounded-xl font-bold transition-all border ${foot === option
                        ? 'border-primary bg-primary/10 text-primary-dark shadow-sm ring-1 ring-primary/50'
                        : 'border-slate-200 dark:border-slate-700 text-text-muted hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Nível Competitivo</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option>Amador / Lazer</option>
                  <option>Intermediário</option>
                  <option>Avançado / Pro</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-text-muted">Frequência Desejada</label>
                <div className="flex flex-wrap gap-2">
                  {['Semanal', 'Bi-semanal', 'Mensal', 'Reserva'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${frequency === freq
                        ? 'border-primary bg-primary/10 text-primary-dark shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-text-muted hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Notificações</h3>
            <div className="flex flex-col gap-4">
              {[
                { title: 'Convites para Jogos', desc: 'Receba avisos quando um novo jogo for agendado.', icon: 'sports_soccer' },
                { title: 'Lembretes de Pagamento', desc: 'Alertas sobre mensalidades ou avulsos pendentes.', icon: 'payments' },
                { title: 'Resultados e Rankings', desc: 'Resumo da pelada e atualização de artilharia.', icon: 'analytics' },
              ].map((item, i) => (
                <div key={item.title} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm dark:text-white">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${i < 2 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${i < 2 ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Segurança</h3>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted">Senha Atual</label>
                <input type="password" placeholder="••••••••" className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-muted">Nova Senha</label>
                  <input type="password" placeholder="Mínimo 8 caracteres" className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-muted">Confirmar Senha</label>
                  <input type="password" placeholder="Repita a nova senha" className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark dark:text-white outline-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm dark:text-white">Autenticação em duas etapas</p>
                    <p className="text-xs text-text-muted">Adicione uma camada extra de proteção.</p>
                  </div>
                  <button className="text-primary font-bold text-sm">Configurar</button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const getButtonClass = (tab: ProfileTab) =>
    `flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border ${activeTab === tab
      ? 'bg-primary/10 text-primary-dark dark:text-primary border-primary/20'
      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-text-muted dark:text-gray-300 border-transparent'
    }`;

  return (
    <Layout>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 flex flex-col gap-8">
        <section className="bg-surface-light dark:bg-surface-dark rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative">
            <div className="size-32 md:size-40 rounded-full border-4 border-primary p-1 shadow-xl overflow-hidden">
              <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profileImage})` }}></div>
            </div>
            <button
              onClick={handleImageClick}
              className="absolute bottom-2 right-2 size-10 bg-primary text-text-main rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-surface-dark hover:scale-110 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-primary/20 text-primary-dark dark:text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Lenda da Várzea</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white mb-2">{name}</h2>
            <p className="text-text-muted dark:text-gray-400 font-medium mb-6">Membro desde Agosto de 2023</p>

            <div className="flex gap-4 md:gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="flex flex-col items-center md:items-start">
                  <span className="text-2xl font-black dark:text-white leading-none mb-1">{stat.value}</span>
                  <div className="flex items-center gap-1 text-text-muted text-xs font-bold uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 flex flex-col gap-2">
            <button onClick={() => setActiveTab('personal')} className={getButtonClass('personal')}>
              <span className={`material-symbols-outlined ${activeTab === 'personal' ? 'icon-filled' : ''}`}>person</span>
              Dados Pessoais
            </button>
            <button onClick={() => setActiveTab('preferences')} className={getButtonClass('preferences')}>
              <span className={`material-symbols-outlined ${activeTab === 'preferences' ? 'icon-filled' : ''}`}>settings</span>
              Preferências
            </button>
            <button onClick={() => setActiveTab('notifications')} className={getButtonClass('notifications')}>
              <span className={`material-symbols-outlined ${activeTab === 'notifications' ? 'icon-filled' : ''}`}>notifications</span>
              Notificações
            </button>
            <button onClick={() => setActiveTab('security')} className={getButtonClass('security')}>
              <span className={`material-symbols-outlined ${activeTab === 'security' ? 'icon-filled' : ''}`}>security</span>
              Segurança
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all mt-4">
              <span className="material-symbols-outlined">logout</span>
              Sair da Conta
            </button>
          </aside>

          <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-8 min-h-[400px]">
            {renderContent()}

            <div className="flex flex-col gap-4 pt-4 mt-auto">
              <button className="h-14 bg-primary text-text-main font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">save</span>
                Salvar Alterações
              </button>
              <button onClick={() => navigate('/dashboard')} className="h-14 text-text-muted font-bold hover:underline transition-all">
                Descartar mudanças
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProfilePage;
