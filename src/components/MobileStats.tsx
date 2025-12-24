'use client';

import React from 'react';
import { Task, Topic } from '@/types';

interface MobileStatsProps {
  topics: Topic[];
  pendingTasks: Task[];
  completedTasks: Task[];
}

const MobileStats: React.FC<MobileStatsProps> = ({
  topics,
  pendingTasks,
  completedTasks,
}) => {
  return (
    <div className="flex justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary-100">{topics.length}</div>
          <div className="text-xs text-secondary-400">Topics</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-warning-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary-100">{pendingTasks.length}</div>
          <div className="text-xs text-secondary-400">Pending</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-success-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary-900 dark:text-secondary-100">{completedTasks.length}</div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">Done</div>
        </div>
      </div>
    </div>
  );
};

export default MobileStats;