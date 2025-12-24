'use client';

import React, { useMemo } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';

interface TopicDashboardHeaderProps {
  topic: Topic;
  tasks: Task[];
  reminders: Reminder[];
  notes: Note[];
  activeTab: 'overview' | 'tasks' | 'reminders' | 'notes';
  onTabChange: (tab: 'overview' | 'tasks' | 'reminders' | 'notes') => void;
  onTogglePrivacy: () => void;
  onShare: () => void;
  isPublicView?: boolean;
}

const TopicDashboardHeader: React.FC<TopicDashboardHeaderProps> = ({
  topic,
  tasks,
  reminders,
  notes,
  activeTab,
  onTabChange,
  onTogglePrivacy,
  onShare,
  isPublicView = false,
}) => {
  const completedTasks = tasks.filter(task => task.completed);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const tabs = useMemo(() => [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
    { id: 'notes', name: 'Notes', count: notes.length },
  ] as const, [tasks.length, reminders.length, notes.length]);

  const getTopicIcon = (icon: string) => {
    const icons: { [key: string]: JSX.Element } = {
      book: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      code: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      science: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      math: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      language: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      default: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };

    return icons[icon] || icons.default;
  };

  return (
    <div className="border-b border-secondary-200 dark:border-vscode-border bg-gradient-to-b from-white to-secondary-50/50 dark:from-vscode-sidebar dark:to-vscode-sidebar md:flex-shrink-0">
      <div className="p-3 md:p-4">
        {/* Topic Info */}
        <div className="flex items-center space-x-3 mb-3 md:mb-4">
          <div
            className="p-2 md:p-3 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
          >
            <div className="w-6 h-6 md:w-8 md:h-8">
              {getTopicIcon(topic.icon)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-lg md:text-xl font-bold text-secondary-900 dark:text-vscode-text truncate">
                {topic.name}
              </h1>
              {!isPublicView && (
                <div className="flex items-center space-x-2">
                  {/* Privacy Toggle */}
                  <button
                    onClick={onTogglePrivacy}
                    className={`p-1.5 rounded-md transition-colors ${
                      topic.isPublic
                        ? 'bg-success-500/10 text-success-600 dark:text-success-400'
                        : 'bg-secondary-300 dark:bg-gray-400/10 text-secondary-600 dark:text-gray-400'
                    }`}
                    title={topic.isPublic ? 'Public - Anyone can view' : 'Private - Only you can view'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {topic.isPublic ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      )}
                    </svg>
                  </button>

                  {/* Share Button */}
                  {topic.isPublic && (
                    <button
                      onClick={onShare}
                      className="p-1.5 rounded-md bg-primary-500/10 dark:bg-vscode-accent/10 text-primary-600 dark:text-vscode-accent hover:bg-primary-500/20 dark:hover:bg-vscode-accent/20 transition-colors"
                      title="Share topic"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {isPublicView && (
                <span className="px-2 py-1 bg-success-500/10 text-success-600 dark:text-success-400 text-xs font-mono rounded">
                  Public
                </span>
              )}
            </div>
            <div className="text-xs md:text-sm text-secondary-500 dark:text-vscode-text/50">
              {completionPercentage}% Complete • {tasks.length} Tasks • {reminders.length} Reminders
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="mb-3 md:mb-4">
            <div className="w-full bg-secondary-200 dark:bg-vscode-bg rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`,
                  backgroundColor: topic.color
                }}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="relative">
          {/* Tab indicator for swipe */}
          <div className="md:hidden absolute -bottom-1 left-0 right-0 flex justify-center space-x-1 pb-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  activeTab === tab.id ? 'w-8 bg-primary-500 dark:bg-vscode-accent' : 'w-1.5 bg-secondary-300 dark:bg-secondary-700'
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-1 bg-secondary-100 dark:bg-vscode-bg rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-md font-mono text-xs md:text-sm transition-all whitespace-nowrap touch-target active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-primary-500 dark:bg-vscode-accent text-white shadow-lg shadow-primary-500/30'
                  : 'text-secondary-700 dark:text-vscode-text/70 hover:text-secondary-900 dark:hover:text-vscode-text hover:bg-secondary-200 dark:hover:bg-vscode-active'
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary-300 dark:bg-vscode-active text-secondary-700 dark:text-vscode-text/50'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDashboardHeader;