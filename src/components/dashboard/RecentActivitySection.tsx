'use client';

import React from 'react';
import { Task, Reminder, Topic } from '@/types';

interface RecentActivitySectionProps {
  pendingTasks: Task[];
  upcomingReminders: Reminder[];
  topics: Topic[];
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  pendingTasks,
  upcomingReminders,
  topics,
}) => {
  if (pendingTasks.length === 0 && upcomingReminders.length === 0) {
    return null;
  }

  return (
    <div className="card card-mobile my-4 sm:my-6">
      <div className="card-header">
        <h3 className="card-title flex items-center">
          <svg className="w-4 h-4 md:w-3 md:h-3 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Recent Activity
        </h3>
        <p className="card-description">Stay on top of your tasks and reminders</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {pendingTasks.length > 0 && (
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-secondary-200 mb-3 sm:mb-4 flex items-center">
              <div className="w-2 h-2 bg-warning-400 rounded-full mr-3"></div>
              Pending Tasks ({pendingTasks.length})
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="group p-3 sm:p-4 bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800/60 dark:to-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700/30 hover:border-secondary-300 dark:hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm sm:text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
                        {task.title}
                      </h5>
                      {task.description && (
                        <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                      task.priority === 'high' ? 'bg-accent-500/20 text-accent-600 dark:text-accent-300 border border-accent-500/30' :
                      task.priority === 'medium' ? 'bg-warning-500/20 text-warning-600 dark:text-warning-300 border border-warning-500/30' :
                      'bg-secondary-200 dark:bg-secondary-700/50 text-secondary-600 dark:text-secondary-400 border border-secondary-300 dark:border-secondary-600/30'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {task.dueDate && (
                      <div className="flex items-center text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due {task.dueDate.toLocaleDateString()}
                      </div>
                    )}
                    <div className="text-xs text-secondary-500 dark:text-secondary-500">
                      {(() => {
                        const topic = topics.find(t => t.id === task.topicId);
                        return topic ? `in ${topic.name}` : '';
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingReminders.length > 0 && (
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-secondary-200 mb-3 sm:mb-4 flex items-center">
              <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
              Upcoming Reminders ({upcomingReminders.length})
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {upcomingReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="group p-3 sm:p-4 bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800/60 dark:to-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700/30 hover:border-secondary-300 dark:hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
                      {reminder.title}
                    </h5>
                    <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 ml-2"></div>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-secondary-400">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {reminder.date.toLocaleDateString()} at {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivitySection;