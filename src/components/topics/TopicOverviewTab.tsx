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
  const daysTracked = Math.max(1, Math.ceil((Date.now() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-4 p-4">
      <section className="grid grid-cols-2 gap-3">
        <article className="surface p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-secondary-500">Tasks</p>
          <p className="mt-1 text-xl font-semibold text-secondary-100">{tasks.length}</p>
        </article>
        <article className="surface p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-secondary-500">Completed</p>
          <p className="mt-1 text-xl font-semibold text-success-300">{completedTasks.length}</p>
        </article>
        <article className="surface p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-secondary-500">Reminders</p>
          <p className="mt-1 text-xl font-semibold text-warning-300">{reminders.length}</p>
        </article>
        <article className="surface p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-secondary-500">Days Active</p>
          <p className="mt-1 text-xl font-semibold text-primary-300">{daysTracked}</p>
        </article>
      </section>

      <section className="surface p-4">
        <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Recent Tasks
        </h3>
        <div className="mt-3 space-y-2.5">
          {tasks.slice(0, 4).map((task) => (
            <div key={task.id} className="surface-soft p-3">
              <p className={`text-sm font-medium ${task.completed ? 'line-through text-secondary-500' : 'text-secondary-100'}`}>
                {task.title}
              </p>
              <p className="mt-1 text-xs text-secondary-400">Priority: {task.priority}</p>
            </div>
          ))}

          {tasks.length === 0 && <p className="text-sm text-secondary-400">No tasks created yet.</p>}
        </div>
      </section>

      <section className="surface p-4">
        <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Upcoming Reminders
        </h3>
        <div className="mt-3 space-y-2.5">
          {upcomingReminders.slice(0, 4).map((reminder) => (
            <div key={reminder.id} className="surface-soft p-3">
              <p className="text-sm font-medium text-secondary-100">{reminder.title}</p>
              <p className="mt-1 text-xs text-secondary-400">
                {reminder.date.toLocaleDateString()} at{' '}
                {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}

          {upcomingReminders.length === 0 && <p className="text-sm text-secondary-400">No upcoming reminders.</p>}
        </div>
      </section>
    </div>
  );
};

export default TopicOverviewTab;

