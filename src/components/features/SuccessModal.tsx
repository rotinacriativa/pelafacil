import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    onViewRequests?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title = "Solicitação Enviada!",
    message = "O organizador já recebeu seu pedido. Você será notificado por e-mail ou push assim que for aceito.",
    onViewRequests
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">

                {/* Success Icon with Glow */}
                <div className="mb-6 relative group">
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl transform group-hover:scale-125 transition-transform duration-700 animate-pulse"></div>
                    <div className="relative flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-inner">
                        <span className="material-symbols-outlined text-[48px] font-bold icon-filled">check_circle</span>
                    </div>
                </div>

                <h2 className="text-2xl font-black leading-tight tracking-tight mb-3 text-[#111812] dark:text-white">
                    {title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">
                    {message}
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => {
                            if (onViewRequests) {
                                onViewRequests();
                            } else {
                                navigate('/my-requests');
                            }
                        }}
                        className="w-full flex items-center justify-center h-12 rounded-full bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-[#111812] font-black text-sm shadow-lg shadow-primary/20"
                    >
                        Ver Meus Pedidos
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center h-12 rounded-full bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 font-bold text-sm transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
