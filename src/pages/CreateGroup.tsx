
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState('');
  const [uf, setUf] = useState('SC');
  const [cities, setCities] = useState<{ id: number, nome: string }[]>([]);
  const [city, setCity] = useState('');
  const [fieldLocation, setFieldLocation] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [gameMode, setGameMode] = useState('society');
  const [playersPerTeam, setPlayersPerTeam] = useState(7);
  const [description, setDescription] = useState('');

  // Check for edit mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editGroupId = params.get('edit');

    if (editGroupId) {
      setEditMode(true);
      setGroupId(editGroupId);
      loadGroupData(editGroupId);
    }
  }, [location.search]);

  // Load group data for editing
  const loadGroupData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name);
        setDescription(data.description || '');
        setFieldLocation(data.location || '');
        // Note: Other fields like gameMode, playersPerTeam might not be stored
        // If you add those fields to the groups table later, load them here
      }
    } catch (err: any) {
      console.error('Error loading group:', err);
      setError('Erro ao carregar dados do grupo.');
    }
  };

  // Fetch cities when UF changes
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const data = await response.json();
        setCities(data);
        if (data.length > 0) {
          // Default to first city if current city is not in the new list (or simply reset)
          // But if it's the first load, maybe we don't strictly need to select one right away, 
          // but for a smooth UI, let's select the first one or formatted string.
          setCity(`${data[0].nome}, ${uf}`);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [uf]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      setError('Por favor, dê um nome ao seu grupo.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editMode && groupId) {
        // UPDATE existing group
        const { error: updateError } = await supabase
          .from('groups')
          .update({
            name,
            description: description || `${gameMode} - ${city}`,
            location: fieldLocation
          })
          .eq('id', groupId);

        if (updateError) throw updateError;

        // Success feedback
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/groups/${groupId}`);
        }, 2000);
      } else {
        // INSERT new group
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .insert({
            name,
            description: description || `${gameMode} - ${city}`,
            location: fieldLocation,
            owner_id: user.id
          })
          .select()
          .single();

        if (groupError) throw groupError;

        if (!groupData) throw new Error("Erro ao criar grupo retornado nulo.");

        // 2. Add Owner as Member (Admin)
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupData.id,
            user_id: user.id,
            role: 'admin'
          });

        if (memberError) {
          console.error("Error adding admin member:", memberError);
          alert("Grupo criado, mas houve um erro ao te adicionar como membro. Contate o suporte.");
        }

        // Success feedback
        alert('Grupo criado com sucesso 🎉');

        // Redirect to the new group
        navigate(`/groups/${groupData.id}`);
      }
    } catch (err: any) {
      console.error(editMode ? "Error updating group:" : "Error creating group:", err);
      setError(err.message || (editMode ? 'Erro ao atualizar grupo.' : 'Erro ao criar grupo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display min-h-screen flex flex-col transition-colors duration-200">
      <header className="w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[24px]">sports_soccer</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-main-light dark:text-white">Pelada App</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a onClick={() => navigate('/dashboard')} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Início</a>
              <a className="text-sm font-medium text-primary cursor-pointer">Criar Grupo</a>
              <a onClick={() => navigate('/dashboard')} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Meus Jogos</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center size-10 rounded-full bg-background-light dark:bg-background-dark hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                <span className="material-symbols-outlined text-text-main-light dark:text-white">notifications</span>
              </button>
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcgmO3HjVs3LG8kmX8RtT9cNYG2HE8jfT-tR4WZT6bvTlOkanGFTi4YGbi_1Fx-sGQya8sBtsDuNcWM9YJ2vXi5FzMH4Hmjr-5o-ASj45BoapfxAhzlSYgUyptTUhQfwmVib4Kl_ZubfFJOHy3g0FOax9VCT7wYA-kdIn5PYTfeVGQNhdHMEStTcHqQIDLceaakZ6dzOxdpN4ZwBVWWju_Kk2yL0Mk4wbDpHx7t1X0Ks8OvHxtHCVgi-n7gAfBFNoqnh-gtPG_jEM")' }}
                onClick={() => navigate('/profile')}
              >
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-text-main-light dark:text-white">
              {editMode ? 'Editar Grupo' : 'Vamos começar o jogo!'}
            </h1>
            <p className="text-text-sec-light dark:text-text-sec-dark text-lg font-normal">
              {editMode ? 'Atualize as informações do seu grupo.' : 'Crie seu grupo e convoque a galera para a pelada.'}
            </p>
          </div>

          <form className="bg-surface-light dark:bg-surface-dark rounded-[2rem] p-6 sm:p-10 shadow-sm border border-border-light dark:border-border-dark space-y-8" onSubmit={handleCreateGroup}>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-base font-bold text-text-main-light dark:text-white" htmlFor="group-name">
                Nome do Grupo <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light dark:text-text-sec-dark">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <input
                  required
                  id="group-name"
                  className="block w-full pl-12 pr-4 py-4 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-lg"
                  placeholder="Ex: Pelada de Quinta, Amigos do Futebol"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-bold text-text-main-light dark:text-white">
                Modalidade <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    name="game_mode"
                    type="radio"
                    value="society"
                    checked={gameMode === 'society'}
                    onChange={(e) => setGameMode(e.target.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all peer-checked:border-primary peer-checked:bg-primary/10 h-32">
                    <span className="material-symbols-outlined text-4xl mb-2 text-text-sec-light dark:text-text-sec-dark group-hover:text-primary transition-colors peer-checked:text-primary">stadium</span>
                    <span className="font-bold text-text-main-light dark:text-white">Society</span>
                    <span className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium">7 vs 7</span>
                  </div>
                  <div className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined fill-current">check_circle</span>
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    name="game_mode"
                    type="radio"
                    value="field"
                    checked={gameMode === 'field'}
                    onChange={(e) => setGameMode(e.target.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all peer-checked:border-primary peer-checked:bg-primary/10 h-32">
                    <span className="material-symbols-outlined text-4xl mb-2 text-text-sec-light dark:text-text-sec-dark group-hover:text-primary transition-colors peer-checked:text-primary">grass</span>
                    <span className="font-bold text-text-main-light dark:text-white">Campo</span>
                    <span className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium">11 vs 11</span>
                  </div>
                  <div className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined fill-current">check_circle</span>
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    name="game_mode"
                    type="radio"
                    value="futsal"
                    checked={gameMode === 'futsal'}
                    onChange={(e) => setGameMode(e.target.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all peer-checked:border-primary peer-checked:bg-primary/10 h-32">
                    <span className={`material-symbols-outlined text-4xl mb-2 transition-colors ${gameMode === 'futsal' ? 'text-primary' : 'text-text-sec-light dark:text-text-sec-dark group-hover:text-primary'}`}>sports_gymnastics</span>
                    <span className="font-bold text-text-main-light dark:text-white">Futsal</span>
                    <span className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium">5 vs 5</span>
                  </div>
                  <div className={`absolute top-3 right-3 text-primary transition-opacity ${gameMode === 'futsal' ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="material-symbols-outlined fill-current">check_circle</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-base font-bold text-text-main-light dark:text-white">
                  Jogadores por time
                </label>
                <div className="flex items-center justify-between bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-2 h-[60px]">
                  <button onClick={() => setPlayersPerTeam(Math.max(1, playersPerTeam - 1))} className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-surface-dark shadow-sm text-text-main-light dark:text-white hover:bg-gray-50 dark:hover:bg-border-dark transition-colors" type="button">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-xl font-bold text-text-main-light dark:text-white tabular-nums">{playersPerTeam}</span>
                  <button onClick={() => setPlayersPerTeam(playersPerTeam + 1)} className="size-10 flex items-center justify-center rounded-lg bg-primary text-background-dark shadow-sm hover:brightness-110 transition-colors" type="button">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-base font-bold text-text-main-light dark:text-white" htmlFor="arena-name">
                  Nome da Arena Padrão
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light dark:text-text-sec-dark">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 h-[60px] rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-lg"
                    id="arena-name"
                    placeholder="Ex: Arena do Zé"
                    type="text"
                    value={fieldLocation}
                    onChange={(e) => setFieldLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-base font-bold text-text-main-light dark:text-white" htmlFor="state">
                  Estado
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light dark:text-text-sec-dark">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <select
                    className="block w-full pl-12 pr-10 py-4 h-[60px] rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium appearance-none cursor-pointer"
                    id="state"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>

                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-base font-bold text-text-main-light dark:text-white" htmlFor="city">
                  Cidade Principal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sec-light dark:text-text-sec-dark">
                    <span className="material-symbols-outlined">location_city</span>
                  </div>
                  <select
                    className="block w-full pl-12 pr-10 py-4 h-[60px] rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium appearance-none cursor-pointer"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loadingCities}
                  >
                    <option value="" disabled>Selecione</option>
                    {loadingCities ? (
                      <option>Carregando...</option>
                    ) : (
                      cities.map((c) => (
                        <option key={c.id} value={`${c.nome}, ${uf}`}>{c.nome}</option>
                      ))
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-sec-light dark:text-text-sec-dark">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-bold text-text-main-light dark:text-white" htmlFor="description">
                Descrição (Opcional)
              </label>
              <textarea
                className="block w-full p-4 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none font-normal leading-relaxed"
                id="description"
                placeholder="Regras gerais, informações sobre o local, valor da mensalidade ou detalhes do Pix..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-primary hover:bg-[#11d821] text-[#052e0a] font-black text-lg h-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="size-5 border-2 border-[#052e0a] border-t-transparent rounded-full animate-spin" />
                    <span>{editMode ? 'Salvando...' : 'Criando...'}</span>
                  </>
                ) : (
                  <>
                    <span>{editMode ? 'Salvar Alterações' : 'Criar Grupo'}</span>
                    <span className="material-symbols-outlined text-[24px]">{editMode ? 'check' : 'arrow_forward'}</span>
                  </>
                )}
              </button>
              <button
                className="sm:flex-none sm:w-32 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-text-sec-light dark:text-text-sec-dark font-bold text-lg h-14 rounded-full border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all duration-200"
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]">
            <div className="bg-white/20 p-2 rounded-full">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <div>
              <p className="font-bold text-lg">Grupo atualizado com sucesso!</p>
              <p className="text-sm text-green-100">Redirecionando...</p>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full py-6 mt-8 border-t border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-text-sec-light dark:text-text-sec-dark gap-4">
          <p>© 2024 Pelada App. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Termos de Uso</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateGroup;
