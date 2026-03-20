'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from '../tasks/TaskList';
import ReminderList from '../reminders/ReminderList';
import StudyHubLogo from '../branding/StudyHubLogo';

interface AllTopicsViewProps {
  tasks: Task[];
  reminders: Reminder[];
  onTopicSelect: (topic: Topic | null) => void;
  searchQuery?: string;
}

const AllTopicsView: React.FC<AllTopicsViewProps> = ({
  tasks,
  reminders,
  onTopicSelect,
  searchQuery = '',
}) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reminders'>('overview');

  useEffect(() => {
    if (!user) {
      setTopics([]);
      return;
    }

    const q = query(collection(db, 'topics'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        createdAt: entry.data().createdAt?.toDate(),
        updatedAt: entry.data().updatedAt?.toDate(),
      })) as Topic[];

      topicsData.sort((a, b) => {
        const aTime = a.updatedAt?.getTime() ?? 0;
        const bTime = b.updatedAt?.getTime() ?? 0;
        return bTime - aTime;
      });

      setTopics(topicsData);
    });

    return () => unsubscribe();
  }, [user]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTopics = useMemo(() => {
    if (!normalizedQuery) return topics;

    return topics.filter((topic) => {
      const byName = topic.name.toLowerCase().includes(normalizedQuery);
      const byDescription = topic.description?.toLowerCase().includes(normalizedQuery);
      const byIcon = topic.icon.toLowerCase().includes(normalizedQuery);
      return byName || byDescription || byIcon;
    });
  }, [topics, normalizedQuery]);

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const overdueTasks = pendingTasks.filter((task) => task.dueDate && task.dueDate < new Date());
  const upcomingReminders = reminders
    .filter((reminder) => !reminder.completed && reminder.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const tabs: Array<{ id: 'overview' | 'tasks' | 'reminders'; label: string; count: number | null }> = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'tasks', label: 'Tasks', count: tasks.length },
    { id: 'reminders', label: 'Reminders', count: reminders.length },
  ];

  const renderOverview = () => {
    return (
      <div className="mobile-scroll-container h-full px-4 pb-6 pt-5 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl space-y-5 md:space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <article className="surface p-4">
              <p className="text-xs uppercase tracking-wide text-secondary-500">Topics</p>
              <p className="mt-1 text-2xl font-semibold text-secondary-100">{topics.length}</p>
            </article>
            <article className="surface p-4">
              <p className="text-xs uppercase tracking-wide text-secondary-500">Pending Tasks</p>
              <p className="mt-1 text-2xl font-semibold text-warning-300">{pendingTasks.length}</p>
            </article>
            <article className="surface p-4">
              <p className="text-xs uppercase tracking-wide text-secondary-500">Overdue</p>
              <p className="mt-1 text-2xl font-semibold text-accent-300">{overdueTasks.length}</p>
            </article>
            <article className="surface p-4">
              <p className="text-xs uppercase tracking-wide text-secondary-500">Completed</p>
              <p className="mt-1 text-2xl font-semibold text-success-300">{completedTasks.length}</p>
            </article>
          </div>

          <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
            <div className="surface p-4 md:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
                    Topics
                  </h2>
                  <p className="text-sm text-secondary-400">Choose a topic to enter its focused workspace.</p>
                </div>
                <span className="rounded-md bg-secondary-800 px-2.5 py-1 text-xs text-secondary-300">
                  {filteredTopics.length} shown
                </span>
              </div>

              {filteredTopics.length === 0 ? (
                <div className="surface-soft py-10 text-center">
                  <p className="text-sm font-semibold text-secondary-200">
                    {topics.length === 0 ? 'No topics yet' : 'No topics match your search'}
                  </p>
                  <p className="mt-1 text-xs text-secondary-400">
                    {topics.length === 0 ? 'Create a topic from the sidebar to get started.' : 'Try a shorter keyword.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredTopics.slice(0, 8).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => onTopicSelect(topic)}
                      className="surface-soft group w-full text-left transition-colors hover:border-primary-500/45"
                    >
                      <div className="flex items-start justify-between gap-2 p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-secondary-700"
                            style={{ backgroundColor: `${topic.color}24`, color: topic.color }}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-secondary-100 group-hover:text-primary-200">{topic.name}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-secondary-400">{topic.description || 'No description yet.'}</p>
                          </div>
                        </div>

                        <svg className="h-4 w-4 shrink-0 text-secondary-500 group-hover:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <section className="surface p-4 md:p-5">
                <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
                  Next Up
                </h3>
                <p className="mt-1 text-xs text-secondary-400">Immediate items requiring attention.</p>

                <div className="mt-4 space-y-2.5">
                  {pendingTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="surface-soft p-3">
                      <p className="text-sm font-medium text-secondary-100">{task.title}</p>
                      <p className="mt-1 text-xs text-secondary-400">
                        {task.dueDate ? `Due ${task.dueDate.toLocaleDateString()}` : 'No due date'}
                      </p>
                    </div>
                  ))}

                  {pendingTasks.length === 0 && <p className="text-sm text-secondary-400">No pending tasks.</p>}
                </div>
              </section>

              <section className="surface p-4 md:p-5">
                <h3 className="text-base font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
                  Upcoming Reminders
                </h3>
                <p className="mt-1 text-xs text-secondary-400">Time-based commitments coming soon.</p>

                <div className="mt-4 space-y-2.5">
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
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-secondary-700/90 bg-secondary-950/85 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StudyHubLogo size={34} withWordmark={false} compact />
            <div>
            <h1 className="text-xl font-semibold text-secondary-100 md:text-2xl" style={{ fontFamily: 'var(--font-sora)' }}>
              Workspace
            </h1>
            <p className="text-sm text-secondary-400">Professional planning across all topics.</p>
            </div>
          </div>

          <div className="surface p-1">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`touch-target rounded-lg px-3 py-2 text-xs font-semibold transition-colors md:px-4 md:text-sm ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && <span className="ml-1.5 text-[11px] opacity-80">{tab.count}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {activeTab === 'overview' && renderOverview()}

        {activeTab === 'tasks' && (
          <div className="h-full">
            <TaskList tasks={tasks} />
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full">
            <ReminderList reminders={reminders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTopicsView;


