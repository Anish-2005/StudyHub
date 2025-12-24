'use client';

import React from 'react';
import { Task, Reminder, Topic } from '@/types';
import RecentTopicsSection from './RecentTopicsSection';
import QuickActionsSection from './QuickActionsSection';
import RecentActivitySection from './RecentActivitySection';
import PomodoroTimer from './PomodoroTimer';

interface OverviewContentProps {
  topics: Topic[];
  pendingTasks: Task[];
  upcomingReminders: Reminder[];
  onTopicSelect: (topic: Topic | null) => void;
  onCreateTopic?: () => void;
  onCreateTask?: () => void;
  onCreateReminder?: () => void;
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  topics,
  pendingTasks,
  upcomingReminders,
  onTopicSelect,
  onCreateTopic,
  onCreateTask,
  onCreateReminder,
}) => {
  return (
    <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <RecentTopicsSection
          topics={topics}
          onTopicSelect={onTopicSelect}
        />

        <div className="mobile-grid lg:grid-cols-3 gap-4 sm:gap-6">
          <QuickActionsSection
            onCreateTopic={onCreateTopic}
            onCreateTask={onCreateTask}
            onCreateReminder={onCreateReminder}
          />

          <div className="lg:col-span-1 my-4 sm:my-6">
            <PomodoroTimer />
          </div>

          <RecentActivitySection
            pendingTasks={pendingTasks}
            upcomingReminders={upcomingReminders}
            topics={topics}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;