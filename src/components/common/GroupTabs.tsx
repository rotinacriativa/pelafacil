import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface GroupTabsProps {
    groupId: string;
    isAdmin?: boolean;
}

const GroupTabs: React.FC<GroupTabsProps> = ({ groupId, isAdmin = false }) => {
    const location = useLocation();

    const tabs = [
        { label: 'Painel', icon: 'grid_view', path: `/groups/${groupId}` },
        { label: 'Jogadores', icon: 'groups', path: `/groups/${groupId}/roster` },
        ...(isAdmin ? [{ label: 'Configurações', icon: 'settings', path: `/groups/${groupId}/settings` }] : []),
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex gap-1 -mb-px">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-muted dark:text-gray-400 hover:text-primary hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default GroupTabs;
