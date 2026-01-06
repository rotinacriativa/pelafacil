
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SuccessModal from '../components/features/SuccessModal';
import { MOCK_PLAYERS } from '../constants';

const MatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Simulated match data based on the design
  const matchInfo = {
    title: "Pelada dos Amigos - Quinta Feira",
    location: "São Paulo, Zona Sul",
    arena: "Arena Soccer Grass",
    court: "Campo 3 (Sintético)",
    price: "R$ 25,00",
    date: "Quinta, 14 Out",
    time: "20:00 - 22:00",
    slotsLeft: 3,
    modality: "Futebol 7",
    level: "Intermediário",
    type: "Misto"
  };

  const rules = [
    { title: 'Sem Carrinhos', desc: 'Para evitar lesões, carrinhos são estritamente proíbidos.', icon: 'block', color: 'bg-red-100 text-red-600' },
    { title: 'Pagamento Antecipado', desc: 'O pagamento deve ser feito até 2 horas antes do jogo via PIX.', icon: 'payments', color: 'bg-blue-100 text-blue-600' },
    { title: 'Goleiro Mensalista', desc: 'Já temos goleiro fixo, mas aceitamos reservas.', icon: 'sports_handball', color: 'bg-green-100 text-green-700' },
  ];

  const handleRequestEntry = () => {
    // Show success modal instead of navigating
    setIsSuccessModalOpen(true);
  };

  return (
    <Layout>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-5 flex flex-col gap-8">

        {/* Hero Section */}
        <div className="relative w-full rounded-xl md:rounded-3xl min-h-[300px] md:min-h-[380px] overflow-hidden shadow-lg group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPn9EZMizCITsFod0vEAKeE650-R9fQRMIgB8lJMoUjCUg90maM9_43FPt9BgDU2svPLd4HTr9c9WJKGpG4QbpHljE_zCEiN7-6_FK6GJKumJlhkX7sRSo50Vg6WyKxhBdWzUDBdUf2L2eUJXfjd1XTsjSDw7j1KKJuiq7DNint3Rqzua8IxP7k9w-JByJa9VkRf6kbXFBPvB6oSc7AV1GZumu_rmIxBedY8czkYbSCPsHl2uGZ7HK5gYR2S0PV6l2eIlYnpDVt0A")'
            }}
          />

          <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-10">
            <span className="material-symbols-outlined text-primary text-lg icon-filled">verified</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111812] dark:text-white">Grupo Verificado</span>
          </div>

          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-10 flex flex-col items-start">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="bg-primary text-[#111812] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{matchInfo.modality}</span>
              <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{matchInfo.level}</span>
              <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{matchInfo.type}</span>
            </div>
            <h1 className="text-white tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2 border-none pb-0">
              {matchInfo.title}
            </h1>
            <p className="text-gray-200 text-sm md:text-base font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">location_on</span>
              {matchInfo.location}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">

          {/* Left Column: Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* About Section */}
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-gray-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Voltar
              </button>
              <h2 className="text-[#111812] dark:text-white text-2xl font-black leading-tight mb-4 flex items-center gap-3 border-none pb-0">
                <span className="material-symbols-outlined text-primary text-3xl">sports_soccer</span>
                Sobre o Grupo
              </h2>
              <p className="text-[#111812]/80 dark:text-gray-300 text-base leading-relaxed mb-6">
                Nossa pelada acontece toda quinta-feira religiosamente há 3 anos. Somos um grupo focado na diversão e no respeito. Não aceitamos jogadas violentas ou brigas. O objetivo é suar a camisa e dar risada.
              </p>
              <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border-l-4 border-primary">
                <h3 className="text-[#111812] dark:text-white font-bold mb-2">O que buscamos:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estamos procurando jogadores comprometidos para completar o elenco fixo. Preferência para quem joga de zagueiro ou goleiro, mas todas as posições são bem-vindas se tiver bom espírito esportivo.
                </p>
              </div>
            </div>

            {/* Members Preview */}
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#111812] dark:text-white text-xl font-bold leading-tight border-none pb-0">Membros Ativos</h2>
                <span className="text-primary text-sm font-bold cursor-pointer hover:underline">Ver todos</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex -space-x-4">
                  {MOCK_PLAYERS.slice(0, 4).map((player, idx) => (
                    <img
                      key={player.id}
                      alt={player.name}
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-surface-dark object-cover"
                      src={player.avatar}
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-surface-dark bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    +18
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">22 jogadores no grupo</p>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-[#111812] dark:text-white text-xl font-bold leading-tight mb-6 border-none pb-0">Regras Importantes</h2>
              <ul className="space-y-4">
                {rules.map((rule) => (
                  <li key={rule.title} className="flex items-start gap-4 p-3 hover:bg-background-light dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className={`${rule.color} p-2 rounded-lg mt-0.5 flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-xl">{rule.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111812] dark:text-white">{rule.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rule.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-background-light dark:bg-slate-900/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-[#111812] dark:text-white">Próxima Partida</span>
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Confirmada</span>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Detail Items */}
                <div className="space-y-5">
                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">calendar_month</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Quando</p>
                      <p className="text-[#111812] dark:text-white font-bold">{matchInfo.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{matchInfo.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">stadium</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Onde</p>
                      <p className="text-[#111812] dark:text-white font-bold">{matchInfo.arena}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{matchInfo.court}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">attach_money</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Valor</p>
                      <p className="text-[#111812] dark:text-white font-bold">{matchInfo.price}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">por pessoa</p>
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmxKBOnMixLKONtEhPqA8OrE4_cUfXjpSzJQ0_4rOJMlIJhj3bAEfgv-KbEY7aGawtGeyASDAr55G8nlg8EmnhkgQIEKvcRI5Ck5QxsOFEzq1QRSHgzdnDRoZpzLNjnTB767bUylLdq7RwHXpp2Ufd2N-K53sDio8obYPIwg6fhMeU-4-RJgYPA50OAvRQ9q3_tSP2VWhVim7aNvN8nit7FsWAj3LiV5fDtE6J5ATF0oIMFdlYi4rl38DicwXvJmrhw7Y7T78X8Ko")' }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <button className="bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 hover:bg-gray-50 transition-all uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base">near_me</span> Ver Mapa
                    </button>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Vagas disponíveis</span>
                    <span className="font-black text-primary uppercase tracking-wider">{matchInfo.slotsLeft} restantes</span>
                  </div>
                  <button
                    onClick={handleRequestEntry}
                    className="w-full flex items-center justify-center h-14 bg-primary text-[#111812] text-lg font-black rounded-full hover:bg-[#0fdc20] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 active:shadow-none shadow-md shadow-primary/20"
                  >
                    Pedir Vaga
                  </button>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">O organizador aprovará seu pedido em breve.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </Layout>
  );
};

export default MatchDetail;
