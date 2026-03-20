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
  const completedTasks = tasks.filter((task) => task.completed);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const tabs = useMemo(
    () => [
      { id: 'overview', name: 'Overview', count: null },
      { id: 'tasks', name: 'Tasks', count: tasks.length },
      { id: 'reminders', name: 'Reminders', count: reminders.length },
      { id: 'notes', name: 'Notes', count: notes.length },
    ] as const,
    [tasks.length, reminders.length, notes.length],
  );

  return (
    <header className="border-b border-secondary-700/90 bg-secondary-950/85 px-4 py-4 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="inline-flex h-7 w-7 items-center rounded-md border border-secondary-700"
              style={{ backgroundColor: `${topic.color}25` }}
            >
              <span className="mx-auto h-2.5 w-2.5 rounded-full" style={{ backgroundColor: topic.color }} />
            </span>
            <h1 className="truncate text-xl font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
              {topic.name}
            </h1>
            {isPublicView && <span className="rounded-md bg-success-500/20 px-2 py-0.5 text-xs text-success-200">Public</span>}
          </div>

          <p className="line-clamp-1 text-sm text-secondary-400">{topic.description || 'Topic dashboard'}</p>
          <p className="mt-1 text-xs text-secondary-500">
            {completionPercentage}% complete • {tasks.length} tasks • {reminders.length} reminders
          </p>
        </div>

        {!isPublicView && (
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePrivacy}
              className={`touch-target rounded-lg border px-3 py-2 text-xs font-semibold ${
                topic.isPublic
                  ? 'border-success-500/40 bg-success-500/15 text-success-200'
                  : 'border-secondary-700 bg-secondary-800 text-secondary-300'
              }`}
              title={topic.isPublic ? 'Switch to private' : 'Switch to public'}
            >
              {topic.isPublic ? 'Public' : 'Private'}
            </button>

            {topic.isPublic && (
              <button onClick={onShare} className="btn-secondary text-xs" title="Share topic">
                Share
              </button>
            )}
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-4 h-2 w-full rounded-full bg-secondary-800/80">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      )}

      <div className="mt-4 overflow-x-auto scrollbar-hide">
        <div className="surface inline-flex min-w-full gap-1 p-1 md:min-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`touch-target rounded-lg px-3 py-2 text-xs font-semibold transition-colors md:text-sm ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
              }`}
            >
              {tab.name}
              {tab.count !== null && <span className="ml-1.5 text-[11px] opacity-80">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopicDashboardHeader;


