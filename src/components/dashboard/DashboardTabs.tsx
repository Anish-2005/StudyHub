'use client';

import React from 'react';

interface Tab {
  id: string;
  name: string;
  count: number | null;
}

interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isHeaderMinimized: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isHeaderMinimized,
}) => {
  return (
    <div className={`flex space-x-1 sm:space-x-2 bg-secondary-100 dark:bg-secondary-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-secondary-200 dark:border-secondary-700/50 transition-all duration-300 ${
      isHeaderMinimized ? 'md:p-1' : 'p-1 sm:p-2'
    }`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 touch-target ${
            isHeaderMinimized ? 'md:px-3 md:py-2 md:text-xs' : 'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm'
          } ${
            activeTab === tab.id
              ? 'bg-primary-500 text-white shadow-lg'
              : 'text-secondary-700 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-700/50'
          }`}
        >
          <span className="whitespace-nowrap">{tab.name}</span>
          {tab.count !== null && tab.count > 0 && (
            <span className={`ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold transition-all duration-300 ${
              isHeaderMinimized ? 'md:px-1.5 md:py-0.5 md:text-xs' : 'px-1 sm:px-2 py-0.5 sm:py-1 text-xs'
            } ${
              activeTab === tab.id
                ? 'bg-secondary-900/20 dark:bg-white/20 text-secondary-900 dark:text-white'
                : 'bg-secondary-700 dark:bg-secondary-300 text-secondary-300 dark:text-secondary-700'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;