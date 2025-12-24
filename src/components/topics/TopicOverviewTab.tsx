'use client';

import React from 'react';
import { Task, Reminder } from '@/types';

interface TopicOverviewTabProps {
  tasks: Task[];
  reminders: Reminder[];
  completedTasks: Task[];
  upcomingReminders: Reminder[];
  topic: { createdAt: Date };
}

const TopicOverviewTab: React.FC<TopicOverviewTabProps> = ({
  tasks,
  reminders,
  completedTasks,
  upcomingReminders,
  topic,
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Recent Tasks */}
      <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-vscode-accent dark:to-vscode-accent/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tasks</h3>
                <p className="text-xs text-white/80">Recent activity</p>
              </div>
            </div>
            {tasks.length > 0 && (
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm font-bold text-white">{tasks.length}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-vscode-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-secondary-400 dark:text-vscode-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-secondary-500 dark:text-vscode-text/50">No tasks yet</p>
              <p className="text-xs text-secondary-400 dark:text-vscode-text/30 mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task, index) => (
                <div
                  key={task.id}
                  className="group bg-secondary-50 dark:bg-vscode-bg rounded-2xl p-3 active:scale-98 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                        task.completed ? 'bg-success-500/20' :
                        task.priority === 'high' ? 'bg-red-500/20' :
                        task.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                      }`}>
                        {task.completed ? (
                          <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${
                        task.completed ? 'line-through text-secondary-400 dark:text-vscode-text/40' : 'text-secondary-900 dark:text-vscode-text'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                          'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {task.tags && task.tags.length > 0 && (
                          <span className="text-xs text-secondary-400 dark:text-vscode-text/40">•</span>
                        )}
                        {task.tags && task.tags.slice(0, 1).map(tag => (
                          <span key={tag} className="text-xs text-secondary-500 dark:text-vscode-text/50 truncate">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
        <div className="bg-gradient-to-r from-warning-500 to-orange-500 dark:from-vscode-warning dark:to-orange-500/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reminders</h3>
                <p className="text-xs text-white/80">Coming up</p>
              </div>
            </div>
            {upcomingReminders.length > 0 && (
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm font-bold text-white">{upcomingReminders.length}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-vscode-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-secondary-400 dark:text-vscode-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-secondary-500 dark:text-vscode-text/50">No reminders set</p>
              <p className="text-xs text-secondary-400 dark:text-vscode-text/30 mt-1">Add reminders to stay on track</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingReminders.slice(0, 5).map((reminder, index) => (
                <div
                  key={reminder.id}
                  className="group bg-secondary-50 dark:bg-vscode-bg rounded-2xl p-3 active:scale-98 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-lg bg-warning-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 dark:text-vscode-text leading-snug">
                        {reminder.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center text-xs text-secondary-500 dark:text-vscode-text/50">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {reminder.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <span className="text-secondary-300 dark:text-vscode-text/30">•</span>
                        <div className="flex items-center text-xs text-secondary-500 dark:text-vscode-text/50">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Study Insights */}
      <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-success-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-secondary-900 dark:text-white">Progress</h3>
            <p className="text-xs text-secondary-500 dark:text-vscode-text/50">Your stats</p>
          </div>
        </div>
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
  );
};

export default TopicOverviewTab;