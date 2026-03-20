'use client';

import React, { useMemo, useState } from 'react';
import { Reminder } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateReminderModal from '../modals/CreateReminderModal';

interface ReminderListProps {
  reminders: Reminder[];
  topicId?: string;
  topicName?: string;
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders, topicId, topicName }) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredReminders = useMemo(() => {
    const now = new Date();
    if (filter === 'upcoming') return reminders.filter((item) => !item.completed && item.date > now);
    if (filter === 'completed') return reminders.filter((item) => item.completed);
    return reminders;
  }, [filter, reminders]);

  const stats = useMemo(() => {
    const completed = reminders.filter((item) => item.completed).length;
    const upcoming = reminders.filter((item) => !item.completed && item.date > new Date()).length;
    const overdue = reminders.filter((item) => !item.completed && item.date < new Date()).length;
    return { completed, upcoming, overdue };
  }, [reminders]);

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'reminders', reminderId), {
        completed: !completed,
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm('Delete this reminder?')) return;

    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleCreateReminder = async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const resolvedTopicId = topicId || reminderData.topicId;
    if (!resolvedTopicId) return;

    try {
      await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        topicId: resolvedTopicId,
        userId: user.uid,
        createdAt: new Date(),
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const getTypeBadge = (type: Reminder['type']) => {
    if (type === 'task') return 'bg-primary-500/15 border-primary-500/35 text-primary-200';
    if (type === 'review') return 'bg-warning-500/15 border-warning-500/35 text-warning-200';
    return 'bg-success-500/15 border-success-500/35 text-success-200';
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="border-b border-secondary-700/70 bg-secondary-900/65 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-secondary-100 md:text-xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Reminders
              </h2>
              <p className="text-sm text-secondary-400">
                {topicName ? `Schedule items for ${topicName}` : 'Track important study deadlines and check-ins'}
              </p>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="btn-primary touch-target">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              New Reminder
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 md:max-w-md">
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Upcoming</p>
              <p className="text-lg font-semibold text-primary-200">{stats.upcoming}</p>
            </div>
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Completed</p>
              <p className="text-lg font-semibold text-success-200">{stats.completed}</p>
            </div>
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Overdue</p>
              <p className="text-lg font-semibold text-accent-200">{stats.overdue}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-1.5 rounded-lg border border-secondary-700 bg-secondary-900 p-1">
            {(['all', 'upcoming', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`touch-target flex-1 rounded-md px-3 py-2 text-xs font-semibold capitalize transition-colors md:text-sm ${
                  filter === filterOption
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-scroll-container flex-1 px-4 py-4 md:px-6 md:py-5">
          {filteredReminders.length === 0 ? (
            <div className="surface-soft mx-auto max-w-2xl py-12 text-center">
              <p className="text-base font-semibold text-secondary-100">
                {filter === 'all' ? 'No reminders yet' : `No ${filter} reminders`}
              </p>
              <p className="mt-1 text-sm text-secondary-400">
                {filter === 'all' ? 'Create a reminder to stay on schedule.' : 'Switch filters to view other reminders.'}
              </p>
              {filter === 'all' && (
                <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-5">
                  Create Reminder
                </button>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-3">
              {filteredReminders.map((reminder) => {
                const isOverdue = !reminder.completed && reminder.date < new Date();

                return (
                  <article
                    key={reminder.id}
                    className={`surface p-4 transition-colors ${
                      reminder.completed
                        ? 'opacity-70'
                        : isOverdue
                          ? 'border-accent-500/55 bg-accent-500/5'
                          : 'hover:border-primary-500/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleReminder(reminder.id, reminder.completed)}
                        className={`touch-target mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          reminder.completed
                            ? 'border-success-500 bg-success-500 text-white'
                            : 'border-secondary-600 bg-secondary-800 text-transparent hover:border-primary-500'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3
                              className={`text-sm font-semibold md:text-base ${
                                reminder.completed ? 'line-through text-secondary-500' : 'text-secondary-100'
                              }`}
                            >
                              {reminder.title}
                            </h3>
                            {reminder.description && <p className="mt-1.5 text-sm text-secondary-400">{reminder.description}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${getTypeBadge(reminder.type)}`}>
                              {reminder.type}
                            </span>
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="touch-target rounded-md p-1.5 text-secondary-400 hover:bg-accent-500/10 hover:text-accent-300"
                              title="Delete reminder"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-secondary-500">
                          <span
                            className={`rounded-md px-2 py-1 ${
                              isOverdue && !reminder.completed
                                ? 'bg-accent-500/15 text-accent-200'
                                : 'bg-secondary-800'
                            }`}
                          >
                            {reminder.date.toLocaleDateString()} at{' '}
                            {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="rounded-md bg-secondary-800 px-2 py-1">
                            Created {reminder.createdAt.toLocaleDateString()}
                          </span>
                          {isOverdue && !reminder.completed && (
                            <span className="rounded-md bg-accent-500/15 px-2 py-1 text-accent-200">Overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateReminderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateReminder}
          topicId={topicId}
        />
      )}
    </>
  );
};

export default ReminderList;
