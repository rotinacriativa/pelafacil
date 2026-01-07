import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 text-sm mb-4">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <span className="material-symbols-outlined text-gray-400 text-base">chevron_right</span>
                    )}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-text-muted dark:text-gray-400 hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-text-main dark:text-white font-medium">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
