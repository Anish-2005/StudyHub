'use client';

import React from 'react';

interface TaskFiltersProps {
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  pendingCount,
  completedCount,
  totalCount,
}) => {
  const filters = [
    { id: 'all' as const, name: 'All Tasks', count: totalCount },
    { id: 'pending' as const, name: 'Pending', count: pendingCount },
    { id: 'completed' as const, name: 'Completed', count: completedCount },
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {filters.map((filterOption) => (
        <button
          key={filterOption.id}
          onClick={() => onFilterChange(filterOption.id)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            filter === filterOption.id
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
          }`}
        >
          {filterOption.name}
          <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
            filter === filterOption.id
              ? 'bg-white/20 text-white'
              : 'bg-secondary-200 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-300'
          }`}>
            {filterOption.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;