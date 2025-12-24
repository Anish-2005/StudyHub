'use client';

import React from 'react';
import { Task } from '@/types';
import TaskList from '../tasks/TaskList';

interface TopicTasksTabProps {
  tasks: Task[];
  topic: { name: string };
}

const TopicTasksTab: React.FC<TopicTasksTabProps> = ({ tasks, topic }) => {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg">
        <div className="sticky top-0 z-10 p-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-vscode-accent dark:to-vscode-accent/90 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">All Tasks</h2>
              <p className="text-xs text-white/80">{topic.name}</p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-sm font-bold text-white">{tasks.length}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <TaskList tasks={tasks} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block h-full overflow-y-auto p-6 mobile-scroll-container">
        <div className="p-4 border-b border-secondary-200 dark:border-vscode-border bg-white dark:bg-vscode-sidebar mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-vscode-text">Tasks for {topic.name}</h2>
            <button className="px-4 py-2 bg-primary-500 dark:bg-vscode-accent text-white font-medium rounded-md hover:bg-primary-600 dark:hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>
        <TaskList tasks={tasks} />
      </div>
    </>
  );
};

export default TopicTasksTab;