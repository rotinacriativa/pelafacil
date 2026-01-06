
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-bold text-text-main dark:text-gray-300 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all text-text-main dark:text-white placeholder:text-slate-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
            {error && <span className="text-red-500 text-xs ml-1 font-medium">{error}</span>}
        </div>
    );
};

export default Input;
