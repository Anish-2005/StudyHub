'use client';

import React from 'react';
import { Task } from '@/types';
import TaskList from '../tasks/TaskList';

interface AllTopicsTasksTabProps {
  tasks: Task[];
}

const AllTopicsTasksTab: React.FC<AllTopicsTasksTabProps> = ({ tasks }) => {
  return (
    <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">All Tasks</h2>
          <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">Track and manage your study tasks across all topics</p>
        </div>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default AllTopicsTasksTab;