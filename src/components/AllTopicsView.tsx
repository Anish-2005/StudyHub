'use client';

import React, { useState, useEffect } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from './TaskList';
import ReminderList from './ReminderList';
import StudyStats from './StudyStats';

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
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-secondary-900 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="border-b border-secondary-700/50 bg-secondary-800/50 backdrop-blur-xl flex-shrink-0 relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
                StudyHub Dashboard
              </h1>
              <p className="text-secondary-400 font-medium">
                Welcome back, {user?.displayName || 'Student'}! Ready to conquer your studies?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Study Stats */}
          <StudyStats topics={topics} tasks={tasks} reminders={reminders} />

          {/* Tabs */}
          <div className="flex space-x-2 bg-secondary-800/50 backdrop-blur-sm rounded-xl p-2 border border-secondary-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 touch-target ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.name}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-secondary-700 text-secondary-300'
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
      <div className="flex-1 overflow-hidden min-h-0 relative z-10">
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Recent Topics */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Recent Topics
                  </h3>
                  <p className="card-description">Your latest study subjects</p>
                </div>

                {topics.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-secondary-200 mb-2">No topics yet</h4>
                    <p className="text-secondary-400 mb-6 max-w-sm mx-auto">Start your learning journey by creating your first study topic</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.slice(0, 6).map((topic, index) => (
                      <button
                        key={topic.id}
                        onClick={() => onTopicSelect(topic)}
                        className="card group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: topic.color + '20', color: topic.color }}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-xs text-secondary-500 font-medium">
                            {topic.updatedAt.toLocaleDateString()}
                          </div>
                        </div>

                        <h4 className="font-semibold text-secondary-100 mb-2 group-hover:text-primary-300 transition-colors">
                          {topic.name}
                        </h4>
                        <p className="text-sm text-secondary-400 line-clamp-2">
                          {topic.description || 'No description available'}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: topic.color }}
                            ></div>
                            <span className="text-xs text-secondary-500 capitalize">{topic.icon}</span>
                          </div>
                          <svg className="w-4 h-4 text-secondary-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title flex items-center">
                      <svg className="w-5 h-5 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Actions
                    </h3>
                    <p className="card-description">Jump into your studies</p>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full btn-ghost justify-start group">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-500/20 transition-colors">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200">Create New Topic</div>
                        <div className="text-sm text-secondary-500">Start organizing your studies</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group">
                      <div className="w-10 h-10 bg-success-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-success-500/20 transition-colors">
                        <svg className="w-5 h-5 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200">Add Task</div>
                        <div className="text-sm text-secondary-500">Track your progress</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group">
                      <div className="w-10 h-10 bg-warning-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-warning-500/20 transition-colors">
                        <svg className="w-5 h-5 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200">Set Reminder</div>
                        <div className="text-sm text-secondary-500">Never miss important dates</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                {(pendingTasks.length > 0 || upcomingReminders.length > 0) && (
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Recent Activity
                      </h3>
                      <p className="card-description">Stay on top of your tasks</p>
                    </div>

                    <div className="space-y-4">
                      {pendingTasks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-secondary-300 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Pending Tasks ({pendingTasks.length})
                          </h4>
                          <div className="space-y-2">
                            {pendingTasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="p-3 bg-secondary-800/50 rounded-lg border border-secondary-700/50">
                                <div className="font-medium text-secondary-200 text-sm">{task.title}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    task.priority === 'high' ? 'bg-accent-500/20 text-accent-300' :
                                    task.priority === 'medium' ? 'bg-warning-500/20 text-warning-300' :
                                    'bg-secondary-700 text-secondary-400'
                                  }`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </span>
                                  {task.dueDate && (
                                    <span className="text-xs text-secondary-500">
                                      Due {task.dueDate.toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {upcomingReminders.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-secondary-300 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 3v4a1 1 0 001 1h4m-5-6H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-5-6z" />
                            </svg>
                            Upcoming Reminders ({upcomingReminders.length})
                          </h4>
                          <div className="space-y-2">
                            {upcomingReminders.slice(0, 3).map((reminder) => (
                              <div key={reminder.id} className="p-3 bg-secondary-800/50 rounded-lg border border-secondary-700/50">
                                <div className="font-medium text-secondary-200 text-sm">{reminder.title}</div>
                                <div className="text-xs text-secondary-500 mt-1">
                                  {reminder.date.toLocaleDateString()} at {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-secondary-100 mb-2">All Tasks</h2>
                <p className="text-secondary-400">Track and manage your study tasks across all topics</p>
              </div>
              <TaskList tasks={tasks} />
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-secondary-100 mb-2">All Reminders</h2>
                <p className="text-secondary-400">Stay on top of important dates and deadlines</p>
              </div>
              <ReminderList reminders={reminders} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTopicsView;
