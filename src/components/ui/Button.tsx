
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-text-main hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95',
        secondary: 'bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 active:scale-95',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:scale-95',
        ghost: 'bg-transparent text-text-main dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary active:scale-95',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95',
    };

    const sizes = {
        sm: 'h-8 px-4 text-xs gap-1.5',
        md: 'h-10 px-6 text-sm gap-2',
        lg: 'h-14 px-8 text-lg gap-3',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
                <>
                    {leftIcon && <span className="flex items-center">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex items-center">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
