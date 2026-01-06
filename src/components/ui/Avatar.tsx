import React from 'react';

interface AvatarProps {
    src?: string | null;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    bordered?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    className = '',
    bordered = false
}) => {
    const sizeClasses = {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-xl',
        '2xl': 'size-24 text-2xl',
    };

    const borderClass = bordered ? 'border-2 border-white dark:border-slate-800 shadow-sm' : '';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    if (!src) {
        return (
            <div
                className={`rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 flex-shrink-0 ${sizeClasses[size]} ${borderClass} ${className}`}
                title={alt}
            >
                {getInitials(alt)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full object-cover flex-shrink-0 bg-slate-200 ${sizeClasses[size]} ${borderClass} ${className}`}
        />
    );
};

export default Avatar;
