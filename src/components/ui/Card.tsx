
import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all overflow-hidden';

    const variants = {
        default: 'bg-surface-light dark:bg-surface-dark shadow-sm',
        outlined: 'bg-transparent border border-slate-200 dark:border-slate-700',
        elevated: 'bg-surface-light dark:bg-surface-dark shadow-md hover:shadow-lg',
        glass: 'bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/20',
    };

    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
