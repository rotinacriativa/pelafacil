import React from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    inviteLink?: string;
    groupName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    inviteLink = "pelada.app/convite/quarta-feira-fut",
    groupName = "seu grupo"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-xl shadow-2xl p-6 md:p-8 border border-[#e5eadd] dark:border-[#2a3e2c] animate-in zoom-in-95 duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 hover:text-red-500 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="mb-6 size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em] mb-2 text-[#111812] dark:text-white">
                            Convide a Galera
                        </h2>
                        <p className="text-text-secondary text-sm md:text-base font-normal leading-relaxed max-w-xs mx-auto">
                            Envie este link para pedirem entrada em <strong>{groupName}</strong>.
                        </p>
                    </div>

                    <div className="w-full mb-6">
                        <label className="flex flex-col w-full">
                            <span className="text-xs font-bold pb-2 ml-1 text-text-secondary uppercase tracking-wider">Link de Convite</span>
                            <div className="flex w-full items-stretch rounded-xl shadow-sm bg-background-light dark:bg-slate-800 border border-[#dbe6dc] dark:border-[#2a3e2c] overflow-hidden group focus-within:ring-2 ring-primary transition-all">
                                <input
                                    className="flex-1 bg-transparent h-12 px-4 font-medium outline-none truncate text-[#111812] dark:text-white"
                                    readOnly
                                    value={inviteLink}
                                />
                                <button className="flex items-center justify-center px-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-secondary cursor-pointer transition-colors border-l border-[#dbe6dc] dark:border-[#2a3e2c]">
                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                </button>
                            </div>
                        </label>
                    </div>

                    <button className="w-full h-12 rounded-full bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-[#111812] font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mb-6">
                        <span className="material-symbols-outlined filled">share</span>
                        <span>Compartilhar Link</span>
                    </button>

                    <div className="relative w-full flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#f0f4f0] dark:border-[#2a3e2c]"></div></div>
                        <div className="relative bg-white dark:bg-surface-dark px-4"><p className="text-text-secondary text-xs font-bold uppercase tracking-widest">Ou envie por</p></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] font-bold transition-colors text-sm">
                            <span className="material-symbols-outlined text-[18px]">chat</span><span>WhatsApp</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] dark:text-[#33aadd] font-bold transition-colors text-sm">
                            <span className="material-symbols-outlined text-[18px]">send</span><span>Telegram</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
