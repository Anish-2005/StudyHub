'use client';

import React from 'react';

interface TopicTabsProps {
  activeTab: 'overview' | 'tasks' | 'reminders' | 'notes';
  onTabChange: (tab: 'overview' | 'tasks' | 'reminders' | 'notes') => void;
  tasksCount: number;
  remindersCount: number;
  notesCount: number;
}

const TopicTabs: React.FC<TopicTabsProps> = ({
  activeTab,
  onTabChange,
  tasksCount,
  remindersCount,
  notesCount,
}) => {
  const tabs = [
    { id: 'overview' as const, name: 'Overview', count: null },
    { id: 'tasks' as const, name: 'Tasks', count: tasksCount },
    { id: 'reminders' as const, name: 'Reminders', count: remindersCount },
    { id: 'notes' as const, name: 'Notes', count: notesCount },
  ];

  return (
    <div className="flex space-x-1 sm:space-x-2 bg-secondary-100 dark:bg-secondary-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-secondary-200 dark:border-secondary-700/50 p-1 sm:p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 touch-target ${
            activeTab === tab.id
              ? 'bg-primary-500 text-white shadow-lg'
              : 'text-secondary-700 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-700/50'
          }`}
        >
          <span className="whitespace-nowrap">{tab.name}</span>
          {tab.count !== null && tab.count > 0 && (
            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
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

export default TopicTabs;