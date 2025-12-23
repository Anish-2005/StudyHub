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
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      description: 'Study subjects'
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      description: `${completionRate}% completion rate`
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      description: 'Need attention'
    },
    {
      label: 'Reminders',
      value: totalReminders,
      icon: '🔔',
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
              <div className="text-3xl font-bold text-secondary-100">{stat.value}</div>
              <div className="text-sm font-medium text-secondary-400">{stat.label}</div>
            </div>
          </div>

          <div className="text-sm text-secondary-500">{stat.description}</div>

          {/* Progress bar for completion rate */}
          {stat.label === 'Tasks Completed' && totalTasks > 0 && (
            <div className="mt-4">
              <div className="w-full bg-secondary-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="text-xs text-secondary-500 mt-1">{completionRate}% complete</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudyStats;