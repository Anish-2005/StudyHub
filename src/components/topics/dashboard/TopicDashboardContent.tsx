'use client';

import React, { useRef, useCallback, useMemo } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const completedTasks = tasks.filter(task => task.completed);
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());

  const handleContentTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleContentTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onTabSwipe('right');
      } else {
        onTabSwipe('left');
      }
    }
  }, [onTabSwipe]);

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      {/* Mobile Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="md:hidden absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200"
          style={{
            height: `${pullDistance}px`,
            opacity: pullDistance / 60,
          }}
        >
          <div
            className="text-primary-500 dark:text-vscode-accent"
            style={{
              transform: `rotate(${pullDistance * 3.6}deg)`,
              transition: 'transform 0.1s'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      )}

      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="md:hidden absolute top-4 left-0 right-0 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-secondary-800 rounded-full px-4 py-2 shadow-lg flex items-center space-x-2 animate-fade-in">
            <div className="animate-spin">
              <svg className="w-4 h-4 text-primary-500 dark:text-vscode-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Mobile: Single scrollable container with swipe */}
      <div
        className="md:hidden h-full"
        onTouchStart={handleContentTouchStart}
        onTouchEnd={handleContentTouchEnd}
      >
        {activeTab === 'overview' && (
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ paddingTop: pullDistance > 0 ? `${pullDistance}px` : '0' }}
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
          <TopicTasksTab tasks={tasks} topic={topic} />
        )}

        {activeTab === 'reminders' && (
          <TopicRemindersTab reminders={reminders} topic={topic} />
        )}

        {activeTab === 'notes' && (
          <TopicNotesTab notes={notes} topic={topic} onDeleteNote={onDeleteNote} />
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      {!isPublicView && (
        <button
          onClick={onCreateTask}
          className="md:hidden fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-vscode-accent dark:via-vscode-accent dark:to-vscode-accent/90 text-white rounded-2xl shadow-2xl shadow-primary-500/50 dark:shadow-vscode-accent/50 flex items-center justify-center transition-all duration-300 active:scale-90 hover:shadow-3xl"
          style={{ boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.6)' }}
          aria-label="Add new task"
        >
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </button>
      )}

      {/* Desktop: Split layout with scrollable content */}
      <div className="hidden md:block h-full">
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
          <TopicTasksTab tasks={tasks} topic={topic} />
        )}

        {activeTab === 'reminders' && (
          <TopicRemindersTab reminders={reminders} topic={topic} />
        )}

        {activeTab === 'notes' && (
          <TopicNotesTab notes={notes} topic={topic} onDeleteNote={onDeleteNote} />
        )}
      </div>
    </div>
  );
};

export default TopicDashboardContent;