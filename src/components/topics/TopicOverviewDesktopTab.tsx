'use client';

import React from 'react';
import { Task, Reminder } from '@/types';

interface TopicOverviewDesktopTabProps {
  tasks: Task[];
  reminders: Reminder[];
  completedTasks: Task[];
  upcomingReminders: Reminder[];
  topic: { createdAt: Date };
}

const TopicOverviewDesktopTab: React.FC<TopicOverviewDesktopTabProps> = ({
  tasks,
  completedTasks,
  upcomingReminders,
  topic,
}) => {
  return (
    <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <div className="bg-secondary-50 dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
            <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
              Recent Tasks
            </h3>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No tasks yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-2 bg-white dark:bg-vscode-bg rounded border border-secondary-200 dark:border-vscode-border">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.completed ? 'bg-success-500 dark:bg-vscode-success' :
                        task.priority === 'high' ? 'bg-accent-500 dark:bg-red-400' :
                        task.priority === 'medium' ? 'bg-warning-500 dark:bg-yellow-400' : 'bg-success-500 dark:bg-green-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className={`text-sm font-mono ${
                          task.completed ? 'line-through text-secondary-400 dark:text-vscode-text/50' : 'text-secondary-900 dark:text-vscode-text'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-vscode-text/50">
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
            <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
              Upcoming Reminders
            </h3>
            {upcomingReminders.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No upcoming reminders</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReminders.slice(0, 5).map((reminder) => (
                  <div key={reminder.id} className="p-2 bg-white dark:bg-vscode-bg rounded border border-secondary-200 dark:border-vscode-border">
                    <div className="text-sm font-mono text-secondary-900 dark:text-vscode-text">
                      {reminder.title}
                    </div>
                    <div className="text-xs text-secondary-500 dark:text-vscode-text/50 mt-1">
                      {reminder.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Study Insights */}
          <div className="bg-white dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
            <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
              Progress
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-vscode-accent/10 dark:to-vscode-accent/5 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-vscode-accent mb-0.5">
                  {Math.ceil((new Date().getTime() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs font-medium text-primary-600/70 dark:text-vscode-accent/70">Days</div>
              </div>
              <div className="bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-500/10 dark:to-success-500/5 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-0.5">
                  {completedTasks.length}
                </div>
                <div className="text-xs font-medium text-success-600/70 dark:text-success-400/70">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-warning-50 to-warning-100/50 dark:from-warning-500/10 dark:to-warning-500/5 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-0.5">
                  {upcomingReminders.length}
                </div>
                <div className="text-xs font-medium text-warning-600/70 dark:text-warning-400/70">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicOverviewDesktopTab;