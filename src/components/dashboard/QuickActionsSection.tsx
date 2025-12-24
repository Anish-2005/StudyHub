'use client';

import React from 'react';

interface QuickActionsSectionProps {
  onCreateTopic?: () => void;
  onCreateTask?: () => void;
  onCreateReminder?: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onCreateTopic,
  onCreateTask,
  onCreateReminder,
}) => {
  return (
    <div className="card card-mobile lg:col-span-2">
      <div className="card-header">
        <h3 className="card-title flex items-center">
          <svg className="w-4 h-4 sm:w-6 sm:h-6 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h3>
        <p className="card-description">Jump into your studies</p>
      </div>

      <div className="mobile-grid-2 sm:grid sm:grid-cols-1 sm:gap-4">
        <button
          onClick={onCreateTopic}
          className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
            <svg className="w-4 h-4 sm:w-7 sm:h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Create New Topic</div>
            <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Start organizing your studies</div>
          </div>
        </button>

        <button
          onClick={onCreateTask}
          className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-success-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-success-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
            <svg className="w-4 h-4 sm:w-7 sm:h-7 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Add Task</div>
            <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Track your progress</div>
          </div>
        </button>

        <button
          onClick={onCreateReminder}
          className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-warning-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-warning-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
            <svg className="w-4 h-4 sm:w-7 sm:h-7 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Set Reminder</div>
            <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Never miss important dates</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSection;