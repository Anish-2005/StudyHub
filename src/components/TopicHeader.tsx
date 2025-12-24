'use client';

import React from 'react';
import { Topic } from '@/types';

interface TopicHeaderProps {
  topic: Topic;
  onShare?: () => void;
  onCreateTask?: () => void;
  onCreateReminder?: () => void;
  onCreateNote?: () => void;
  isPublicView?: boolean;
}

const TopicHeader: React.FC<TopicHeaderProps> = ({
  topic,
  onShare,
  onCreateTask,
  onCreateReminder,
  onCreateNote,
  isPublicView = false,
}) => {
  return (
    <div className="border-b border-secondary-200 dark:border-secondary-700/50 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-xl flex-shrink-0 relative z-10">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                topic.color === 'primary' ? 'bg-primary-500/10' :
                topic.color === 'secondary' ? 'bg-secondary-500/10' :
                topic.color === 'accent' ? 'bg-accent-500/10' :
                topic.color === 'success' ? 'bg-success-500/10' :
                topic.color === 'warning' ? 'bg-warning-500/10' :
                'bg-secondary-500/10'
              }`}>
                <span className={`text-2xl sm:text-3xl ${
                  topic.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                  topic.color === 'secondary' ? 'text-secondary-600 dark:text-secondary-400' :
                  topic.color === 'accent' ? 'text-accent-600 dark:text-accent-400' :
                  topic.color === 'success' ? 'text-success-600 dark:text-success-400' :
                  topic.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                  'text-secondary-600 dark:text-secondary-400'
                }`}>
                  {topic.icon}
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                  {topic.name}
                </h1>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  topic.color === 'primary' ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300' :
                  topic.color === 'secondary' ? 'bg-secondary-500/20 text-secondary-700 dark:text-secondary-300' :
                  topic.color === 'accent' ? 'bg-accent-500/20 text-accent-700 dark:text-accent-300' :
                  topic.color === 'success' ? 'bg-success-500/20 text-success-700 dark:text-success-300' :
                  topic.color === 'warning' ? 'bg-warning-500/20 text-warning-700 dark:text-warning-300' :
                  'bg-secondary-500/20 text-secondary-700 dark:text-secondary-300'
                }`}>
                  {topic.name}
                </div>
              </div>
            </div>

            {topic.description && (
              <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base mt-2">
                {topic.description}
              </p>
            )}

            <div className="flex items-center space-x-4 mt-3 text-xs sm:text-sm text-secondary-500 dark:text-secondary-500">
              <span>Created {topic.createdAt.toLocaleDateString()}</span>
              <span>•</span>
              <span>Updated {topic.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>

          {!isPublicView && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={onShare}
                className="btn-secondary flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={onCreateTask}
                  className="btn-primary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Task</span>
                </button>

                <button
                  onClick={onCreateReminder}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Reminder</span>
                </button>

                <button
                  onClick={onCreateNote}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicHeader;