'use client';

import React, { useState, useEffect } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from './TaskList';
import ReminderList from './ReminderList';
import StatsCard from './StatsCard';

interface AllTopicsViewProps {
  tasks: Task[];
  reminders: Reminder[];
  onTopicSelect: (topic: Topic | null) => void;
}

const AllTopicsView: React.FC<AllTopicsViewProps> = ({
  tasks,
  reminders,
  onTopicSelect,
}) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reminders'>('overview');

  useEffect(() => {
    if (!user) return;

    // Simplified query without orderBy to avoid composite index
    const q = query(
      collection(db, 'topics'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Topic[];

      // Sort client-side to avoid composite index requirement
      topicsData.sort((a, b) => {
        if (!a.updatedAt || !b.updatedAt) return 0;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });

      setTopics(topicsData);
    });

    return () => unsubscribe();
  }, [user]);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());
  const overdueReminders = reminders.filter(reminder => !reminder.completed && reminder.date < new Date());

  const stats = [
    {
      title: 'Total Topics',
      value: topics.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'vscode-blue',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'vscode-warning',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'vscode-success',
    },
    {
      title: 'Upcoming Reminders',
      value: upcomingReminders.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 3v4a1 1 0 001 1h4m-5-6H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-5-6z" />
        </svg>
      ),
      color: 'vscode-accent',
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
  ] as const;

return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden" style={{ fontFamily: 'Segoe UI', fontWeight: 400 }}>
      {/* Header */}
      <div className="border-b border-vscode-border bg-vscode-sidebar flex-shrink-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-vscode-text">
              Study<span className="text-vscode-accent">Hub</span> Dashboard
            </h1>
            <div className="text-sm font-medium text-vscode-text/50">
              Welcome back, {user?.displayName || 'User'}!
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-vscode-bg rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md font-medium text-sm transition-all touch-target ${
                  activeTab === tab.id
                    ? 'bg-vscode-accent text-white'
                    : 'text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active'
                }`}
              >
                <span className="whitespace-nowrap">{tab.name}</span>
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-vscode-active text-vscode-text/50'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Topics */}
                <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-vscode-text mb-4">
                    Recent Topics
                  </h3>
                  {topics.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-sm font-medium text-vscode-text/50">No topics yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topics.slice(0, 5).map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => onTopicSelect(topic)}
                          className="w-full text-left p-3 rounded hover:bg-vscode-active transition-colors group touch-target"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: topic.color }}></div>
                            <div className="mr-3 flex-shrink-0" style={{ color: topic.color }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-vscode-text group-hover:text-vscode-accent transition-colors truncate">
                                {topic.name}
                              </div>
                              <div className="text-xs text-vscode-text/50 truncate">
                                {topic.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-vscode-text mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-vscode-accent/10 border border-vscode-accent/30 rounded hover:bg-vscode-accent/20 transition-colors group touch-target">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-vscode-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-vscode-text">Create New Topic</div>
                          <div className="text-xs text-vscode-text/50">Start organizing your studies</div>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-3 bg-vscode-success/10 border border-vscode-success/30 rounded hover:bg-vscode-success/20 transition-colors touch-target">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-vscode-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-vscode-text">Add Task</div>
                          <div className="text-xs text-vscode-text/50">Track your progress</div>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-3 bg-vscode-warning/10 border border-vscode-warning/30 rounded hover:bg-vscode-warning/20 transition-colors touch-target">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-vscode-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-vscode-text">Set Reminder</div>
                          <div className="text-xs text-vscode-text/50">Never miss important dates</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {(pendingTasks.length > 0 || upcomingReminders.length > 0) && (
                <div className="mt-4 sm:mt-6 bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-vscode-text mb-4">
                    Recent Activity
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {pendingTasks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-vscode-text/70 mb-3">Recent Tasks</h4>
                        <div className="space-y-2">
                          {pendingTasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="p-3 bg-vscode-bg rounded border border-vscode-border">
                              <div className="text-sm font-medium text-vscode-text truncate">{task.title}</div>
                              <div className="text-xs text-vscode-text/50">
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {upcomingReminders.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-vscode-text/70 mb-3">Upcoming Reminders</h4>
                        <div className="space-y-2">
                          {upcomingReminders.slice(0, 3).map((reminder) => (
                            <div key={reminder.id} className="p-3 bg-vscode-bg rounded border border-vscode-border">
                              <div className="text-sm font-medium text-vscode-text truncate">{reminder.title}</div>
                              <div className="text-xs text-vscode-text/50">
                                {reminder.date.toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6 mobile-scroll-container">
            <TaskList tasks={tasks} />
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6 mobile-scroll-container">
            <ReminderList reminders={reminders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTopicsView;
