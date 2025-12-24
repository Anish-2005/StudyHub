'use client';

import React from 'react';
import { Topic, Task, Reminder } from '@/types';

interface StudyStatsProps {
  topics: Topic[];
  tasks: Task[];
  reminders: Reminder[];
}

const StudyStats: React.FC<StudyStatsProps> = ({ topics, tasks, reminders }) => {
  const totalTopics = topics.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const totalReminders = reminders.length;
  const upcomingReminders = reminders.filter(reminder =>
    reminder.date > new Date()
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Topics',
      value: totalTopics,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      description: 'Study subjects'
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      description: `${completionRate}% completion rate`
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      description: 'Need attention'
    },
    {
      label: 'Reminders',
      value: totalReminders,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 3v4a1 1 0 001 1h4m-5-6H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-5-6z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      description: `${upcomingReminders} upcoming`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              {stat.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">{stat.value}</div>
              <div className="text-sm font-medium text-secondary-600 dark:text-secondary-400">{stat.label}</div>
            </div>
          </div>

          <div className="text-sm text-secondary-500 dark:text-secondary-500">{stat.description}</div>

          {/* Progress bar for completion rate */}
          {stat.label === 'Tasks Completed' && totalTasks > 0 && (
            <div className="mt-4">
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">{completionRate}% complete</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudyStats;