'use client';

import React from 'react';
import { Reminder } from '@/types';

interface ReminderFiltersProps {
  filter: 'all' | 'upcoming' | 'completed';
  onFilterChange: (filter: 'all' | 'upcoming' | 'completed') => void;
  reminders: Reminder[];
}

const ReminderFilters: React.FC<ReminderFiltersProps> = ({
  filter,
  onFilterChange,
  reminders,
}) => {
  const now = new Date();

  const getFilterCount = (filterType: 'all' | 'upcoming' | 'completed') => {
    switch (filterType) {
      case 'all':
        return reminders.length;
      case 'upcoming':
        return reminders.filter(r => !r.completed && r.date > now).length;
      case 'completed':
        return reminders.filter(r => r.completed).length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex space-x-1 bg-vscode-bg rounded-lg p-1 overflow-x-auto">
      {(['all', 'upcoming', 'completed'] as const).map((filterOption) => (
        <button
          key={filterOption}
          onClick={() => onFilterChange(filterOption)}
          className={`flex-shrink-0 px-3 md:px-4 py-2.5 md:py-2 rounded-md font-mono text-xs md:text-sm transition-all capitalize whitespace-nowrap touch-target ${
            filter === filterOption
              ? 'bg-vscode-accent text-white'
              : 'text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active'
          }`}
        >
          {filterOption}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            filter === filterOption
              ? 'bg-secondary-900/20 dark:bg-white/20 text-secondary-900 dark:text-white'
              : 'bg-secondary-300 dark:bg-vscode-active text-secondary-700 dark:text-vscode-text/50'
          }`}>
            {getFilterCount(filterOption)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReminderFilters;