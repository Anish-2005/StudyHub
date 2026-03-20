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
  reminders,
  completedTasks,
  upcomingReminders,
  topic,
}) => {
  const daysTracked = Math.max(1, Math.ceil((Date.now() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="mobile-scroll-container h-full px-6 pb-8 pt-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid grid-cols-4 gap-4">
          <article className="surface p-4">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Tasks</p>
            <p className="mt-1 text-2xl font-semibold text-secondary-100">{tasks.length}</p>
          </article>
          <article className="surface p-4">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-success-300">{completedTasks.length}</p>
          </article>
          <article className="surface p-4">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Reminders</p>
            <p className="mt-1 text-2xl font-semibold text-warning-300">{reminders.length}</p>
          </article>
          <article className="surface p-4">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Days Active</p>
            <p className="mt-1 text-2xl font-semibold text-primary-300">{daysTracked}</p>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="surface p-5">
            <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
              Recent Tasks
            </h3>
            <div className="mt-4 space-y-2.5">
              {tasks.slice(0, 6).map((task) => (
                <div key={task.id} className="surface-soft p-3">
                  <p className={`text-sm font-medium ${task.completed ? 'text-secondary-500 line-through' : 'text-secondary-100'}`}>
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-secondary-400">Priority: {task.priority}</p>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-secondary-400">No tasks yet.</p>}
            </div>
          </div>

          <div className="surface p-5">
            <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
              Upcoming Reminders
            </h3>
            <div className="mt-4 space-y-2.5">
              {upcomingReminders.slice(0, 6).map((reminder) => (
                <div key={reminder.id} className="surface-soft p-3">
                  <p className="text-sm font-medium text-secondary-100">{reminder.title}</p>
                  <p className="mt-1 text-xs text-secondary-400">
                    {reminder.date.toLocaleDateString()} at{' '}
                    {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {upcomingReminders.length === 0 && <p className="text-sm text-secondary-400">No reminders scheduled.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TopicOverviewDesktopTab;


