'use client';

import React from 'react';

interface TopicDashboardActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  onCreateReminder: () => void;
  onCreateNote: () => void;
  topicName: string;
}

const TopicDashboardActionSheet: React.FC<TopicDashboardActionSheetProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  onCreateReminder,
  onCreateNote,
  topicName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 rounded-t-3xl shadow-2xl animate-slide-up-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
        </div>

        <div className="p-6 pb-8">
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">Create New</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">Choose what you&apos;d like to add to {topicName}</p>

          <div className="space-y-3">
            <button
              onClick={() => {
                onCreateTask();
                onClose();
              }}
              className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-vscode-accent/10 dark:to-vscode-accent/5 border border-primary-200 dark:border-vscode-accent/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
            >
              <div className="w-12 h-12 bg-primary-500 dark:bg-vscode-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-active:scale-90 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-secondary-900 dark:text-white">New Task</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Add a task to track</div>
              </div>
              <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                onCreateReminder();
                onClose();
              }}
              className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-warning-50 to-warning-100/50 dark:from-vscode-warning/10 dark:to-vscode-warning/5 border border-warning-200 dark:border-vscode-warning/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
            >
              <div className="w-12 h-12 bg-warning-500 dark:bg-vscode-warning rounded-xl flex items-center justify-center shadow-lg shadow-warning-500/30 group-active:scale-90 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-secondary-900 dark:text-white">New Reminder</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Set a reminder</div>
              </div>
              <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                onCreateNote();
                onClose();
              }}
              className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-success-50 to-success-100/50 dark:from-vscode-success/10 dark:to-vscode-success/5 border border-success-200 dark:border-vscode-success/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
            >
              <div className="w-12 h-12 bg-success-500 dark:bg-vscode-success rounded-xl flex items-center justify-center shadow-lg shadow-success-500/30 group-active:scale-90 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-secondary-900 dark:text-white">New Note</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Write a note</div>
              </div>
              <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium rounded-2xl hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors touch-target"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDashboardActionSheet;