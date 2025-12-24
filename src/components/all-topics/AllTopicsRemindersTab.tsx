'use client';

import React from 'react';
import { Reminder } from '@/types';
import ReminderList from '../reminders/ReminderList';

interface AllTopicsRemindersTabProps {
  reminders: Reminder[];
}

const AllTopicsRemindersTab: React.FC<AllTopicsRemindersTabProps> = ({ reminders }) => {
  return (
    <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">All Reminders</h2>
          <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">Stay on top of important dates and deadlines</p>
        </div>
        <ReminderList reminders={reminders} />
      </div>
    </div>
  );
};

export default AllTopicsRemindersTab;