'use client';

import React, { useCallback, useRef } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';
import TopicOverviewTab from '../TopicOverviewTab';
import TopicTasksTab from '../TopicTasksTab';
import TopicRemindersTab from '../TopicRemindersTab';
import TopicNotesTab from '../TopicNotesTab';
import TopicOverviewDesktopTab from '../TopicOverviewDesktopTab';

interface TopicDashboardContentProps {
  topic: Topic;
  tasks: Task[];
  reminders: Reminder[];
  notes: Note[];
  activeTab: 'overview' | 'tasks' | 'reminders' | 'notes';
  highlightedTaskId?: string | null;
  getTaskShareLink?: (task: Task) => string | null;
  isRefreshing: boolean;
  pullDistance: number;
  isPublicView: boolean;
  onCreateTask: () => void;
  onDeleteNote: (noteId: string) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTabSwipe: (direction: 'left' | 'right') => void;
}

const TopicDashboardContent: React.FC<TopicDashboardContentProps> = ({
  topic,
  tasks,
  reminders,
  notes,
  activeTab,
  highlightedTaskId = null,
  getTaskShareLink,
  isRefreshing,
  pullDistance,
  isPublicView,
  onCreateTask,
  onDeleteNote,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTabSwipe,
}) => {
  const touchStartX = useRef(0);

  const completedTasks = tasks.filter((task) => task.completed);
  const upcomingReminders = reminders.filter((reminder) => !reminder.completed && reminder.date > new Date());

  const handleContentTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleContentTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const threshold = 100;

      if (Math.abs(deltaX) <= threshold) return;
      onTabSwipe(deltaX > 0 ? 'right' : 'left');
    },
    [onTabSwipe],
  );

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {pullDistance > 0 && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-40 flex items-center justify-center md:hidden"
          style={{ height: `${pullDistance}px`, opacity: Math.min(1, pullDistance / 60) }}
        >
          <span className="rounded-full bg-secondary-900/90 px-3 py-1 text-xs text-secondary-300">Pull to refresh</span>
        </div>
      )}

      {isRefreshing && (
        <div className="absolute left-0 right-0 top-3 z-50 flex justify-center md:hidden">
          <div className="surface-soft flex items-center gap-2 px-3 py-2 text-xs text-secondary-200">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            Refreshing...
          </div>
        </div>
      )}

      <div className="md:hidden h-full" onTouchStart={handleContentTouchStart} onTouchEnd={handleContentTouchEnd}>
        {activeTab === 'overview' && (
          <div
            className="mobile-scroll-container h-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ paddingTop: pullDistance > 0 ? `${pullDistance}px` : undefined }}
          >
            <TopicOverviewTab
              tasks={tasks}
              reminders={reminders}
              completedTasks={completedTasks}
              upcomingReminders={upcomingReminders}
              topic={topic}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <TopicTasksTab
            tasks={tasks}
            topic={topic}
            highlightedTaskId={highlightedTaskId}
            getTaskShareLink={getTaskShareLink}
          />
        )}
        {activeTab === 'reminders' && <TopicRemindersTab reminders={reminders} topic={topic} />}
        {activeTab === 'notes' && <TopicNotesTab notes={notes} topic={topic} onDeleteNote={onDeleteNote} />}
      </div>

      {!isPublicView && (
        <button
          onClick={onCreateTask}
          className="touch-target fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-2xl shadow-primary-500/30 md:hidden"
          aria-label="Create item"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      <div className="hidden h-full md:block">
        {activeTab === 'overview' && (
          <TopicOverviewDesktopTab
            tasks={tasks}
            reminders={reminders}
            completedTasks={completedTasks}
            upcomingReminders={upcomingReminders}
            topic={topic}
          />
        )}

        {activeTab === 'tasks' && (
          <TopicTasksTab
            tasks={tasks}
            topic={topic}
            highlightedTaskId={highlightedTaskId}
            getTaskShareLink={getTaskShareLink}
          />
        )}
        {activeTab === 'reminders' && <TopicRemindersTab reminders={reminders} topic={topic} />}
        {activeTab === 'notes' && <TopicNotesTab notes={notes} topic={topic} onDeleteNote={onDeleteNote} />}
      </div>
    </div>
  );
};

export default TopicDashboardContent;

