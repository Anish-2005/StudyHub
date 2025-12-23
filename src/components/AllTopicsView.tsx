'use client';

import React, { useState, useEffect } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from './TaskList';
import ReminderList from './ReminderList';
import StudyStats from './StudyStats';
import PomodoroTimer from './PomodoroTimer';

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
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

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

  // Handle header minimization on scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = (e: Event) => {
      // Throttle scroll events for better performance
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const target = e.target as HTMLElement;
        const scrollTop = target.scrollTop || window.scrollY || document.documentElement.scrollTop;

        // Lower threshold for mobile devices and more aggressive minimization
        const isMobile = window.innerWidth < 768;
        const threshold = isMobile ? 10 : 100; // Very low threshold for mobile since header is already minimal // Even lower threshold for mobile
        const shouldMinimize = scrollTop > threshold;

        // Only update state if it actually changed to prevent unnecessary re-renders
        if (shouldMinimize !== isHeaderMinimized) {
          setIsHeaderMinimized(shouldMinimize);
        }
      }, 16); // 60fps updates
    };

    // Try multiple scroll targets for better mobile compatibility
    const scrollTargets = [
      document.querySelector('.mobile-scroll-container'),
      window,
      document.documentElement,
      document.body
    ];

    scrollTargets.forEach(target => {
      if (target) {
        target.addEventListener('scroll', handleScroll, { passive: true, capture: false });

        // Also listen for touch events on mobile
        if ('ontouchstart' in window) {
          target.addEventListener('touchmove', handleScroll, { passive: true, capture: false });
        }
      }
    });

    return () => {
      scrollTargets.forEach(target => {
        if (target) {
          target.removeEventListener('scroll', handleScroll);
          if ('ontouchstart' in window) {
            target.removeEventListener('touchmove', handleScroll);
          }
        }
      });
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isHeaderMinimized]);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());

  const stats = [
    {
      title: 'Total Topics',
      value: topics.length,
      icon: (
        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'vscode-blue',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: (
        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'vscode-warning',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length,
      icon: (
        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'vscode-success',
    },
    {
      title: 'Upcoming Reminders',
      value: upcomingReminders.length,
      icon: (
        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 3v4a1 1 0 001 1h4m-5-6H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-5-6z" />
        </svg>
      ),
  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
  ] as const;

return (
    <div className="flex flex-col h-full min-h-0 bg-secondary-900 relative" style={{ touchAction: 'pan-y' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className={`border-b border-secondary-700/50 bg-secondary-800/50 backdrop-blur-xl flex-shrink-0 relative z-10 transition-all duration-300 ${
        isHeaderMinimized ? 'py-1' : 'py-1 md:py-2'
      }`} style={{ touchAction: 'none' }}>
        <div className={`transition-all duration-300 ${
          isHeaderMinimized ? 'p-2 sm:p-4' : 'p-2 sm:p-6'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 space-y-2 sm:space-y-0 transition-all duration-300 ${
            isHeaderMinimized ? 'mb-2' : 'mb-3 md:mb-6'
          }`}>
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent transition-all duration-300 ${
                isHeaderMinimized ? 'text-lg sm:text-2xl' : 'text-lg sm:text-3xl'
              }`}>
                StudyHub Dashboard
              </h1>
              {/* Hide welcome message on mobile, show only on larger screens when not minimized */}
              {!isHeaderMinimized && (
                <p className="hidden sm:block text-secondary-400 font-medium transition-all duration-300">
                  Welcome back, {user?.displayName || 'Student'}! Ready to conquer your studies?
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                isHeaderMinimized ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-12 sm:h-12'
              }`}>
                <svg className={`text-white transition-all duration-300 ${
                  isHeaderMinimized ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-6 sm:h-6'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Study Stats - Show compact version on mobile, full version on larger screens */}
          {!isHeaderMinimized && (
            <div className="transition-all duration-300">
              {/* Mobile compact stats */}
              <div className="block sm:hidden mb-4">
                <div className="flex justify-between items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary-100">{topics.length}</div>
                      <div className="text-xs text-secondary-400">Topics</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-warning-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary-100">{pendingTasks.length}</div>
                      <div className="text-xs text-secondary-400">Pending</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-success-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary-100">{completedTasks.length}</div>
                      <div className="text-xs text-secondary-400">Done</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop full stats */}
              <div className="hidden sm:block">
                <StudyStats topics={topics} tasks={tasks} reminders={reminders} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className={`flex space-x-1 sm:space-x-2 bg-secondary-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-secondary-700/50 transition-all duration-300 ${
            isHeaderMinimized ? 'p-1' : 'p-1 sm:p-2'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 touch-target ${
                  isHeaderMinimized ? 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-xs' : 'px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm'
                } ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.name}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold transition-all duration-300 ${
                    isHeaderMinimized ? 'px-1 py-0.5 text-xs sm:px-1.5 sm:py-0.5 sm:text-xs' : 'px-1 sm:px-2 py-0.5 sm:py-1 text-xs'
                  } ${
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
      <div className="flex-1 min-h-0 relative z-10 gesture-area">
        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
              {/* Recent Topics */}
              <div className="card card-mobile">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <svg className="w-4 h-4 md:w-3 md:h-3 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Recent Topics
                  </h3>
                  <p className="card-description">Your latest study subjects</p>
                </div>

                {topics.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-4 h-4 md:w-3 md:h-3 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-secondary-200 mb-2">No topics yet</h4>
                    <p className="text-secondary-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto px-4">Start your learning journey by creating your first study topic</p>
                  </div>
                ) : (
                  <div className="mobile-grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {topics.slice(0, 6).map((topic, index) => (
                      <button
                        key={topic.id}
                        onClick={() => onTopicSelect(topic)}
                        className="card card-mobile group animate-fade-in text-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: topic.color + '20', color: topic.color }}
                          >
                            <svg className="w-4 h-4 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-xs text-secondary-500 font-medium">
                            {topic.updatedAt.toLocaleDateString()}
                          </div>
                        </div>

                        <h4 className="font-semibold text-secondary-100 text-sm sm:text-base mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                          {topic.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary-400 line-clamp-2">
                          {topic.description || 'No description available'}
                        </p>

                        <div className="mt-3 sm:mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                              style={{ backgroundColor: topic.color }}
                            ></div>
                            <span className="text-xs text-secondary-500 capitalize">{topic.icon}</span>
                          </div>
                          <svg className="w-4 h-4 md:w-3 md:h-3 text-secondary-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="mobile-grid lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Quick Actions */}
                <div className="card card-mobile lg:col-span-2">
                  <div className="card-header">
                    <h3 className="card-title flex items-center">
                      <svg className="w-4 h-4 md:w-3 md:h-3 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Actions
                    </h3>
                    <p className="card-description">Jump into your studies</p>
                  </div>

                  <div className="mobile-grid-2 sm:space-y-3">
                    <button className="w-full btn-ghost justify-start group btn-mobile">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-primary-500/20 transition-colors">
                        <svg className="w-4 h-4 md:w-3 md:h-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200 text-sm sm:text-base">Create New Topic</div>
                        <div className="text-xs sm:text-sm text-secondary-500">Start organizing your studies</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group btn-mobile">
                      <div className="w-10 h-10 bg-success-500/10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-success-500/20 transition-colors">
                        <svg className="w-4 h-4 md:w-3 md:h-3 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200 text-sm sm:text-base">Add Task</div>
                        <div className="text-xs sm:text-sm text-secondary-500">Track your progress</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group btn-mobile">
                      <div className="w-10 h-10 bg-warning-500/10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-warning-500/20 transition-colors">
                        <svg className="w-4 h-4 md:w-3 md:h-3 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-secondary-200 text-sm sm:text-base">Set Reminder</div>
                        <div className="text-xs sm:text-sm text-secondary-500">Never miss important dates</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Pomodoro Timer */}
                <div className="lg:col-span-1">
                  <PomodoroTimer />
                </div>

                {/* Recent Activity */}
                {(pendingTasks.length > 0 || upcomingReminders.length > 0) && (
                  <div className="card card-mobile">
                    <div className="card-header">
                      <h3 className="card-title flex items-center">
                        <svg className="w-4 h-4 md:w-3 md:h-3 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Recent Activity
                      </h3>
                      <p className="card-description">Stay on top of your tasks and reminders</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {pendingTasks.length > 0 && (
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-secondary-200 mb-3 sm:mb-4 flex items-center">
                            <div className="w-2 h-2 bg-warning-400 rounded-full mr-3"></div>
                            Pending Tasks ({pendingTasks.length})
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {pendingTasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="group p-3 sm:p-4 bg-gradient-to-r from-secondary-800/60 to-secondary-800/40 rounded-xl border border-secondary-700/30 hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-secondary-100 text-sm sm:text-base mb-1 group-hover:text-primary-300 transition-colors line-clamp-2">
                                      {task.title}
                                    </h5>
                                    {task.description && (
                                      <p className="text-xs sm:text-sm text-secondary-400 line-clamp-2 mb-2">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                                    task.priority === 'high' ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' :
                                    task.priority === 'medium' ? 'bg-warning-500/20 text-warning-300 border border-warning-500/30' :
                                    'bg-secondary-700/50 text-secondary-400 border border-secondary-600/30'
                                  }`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {task.dueDate && (
                                    <div className="flex items-center text-xs sm:text-sm text-secondary-400">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Due {task.dueDate.toLocaleDateString()}
                                    </div>
                                  )}
                                  <div className="text-xs text-secondary-500">
                                    {(() => {
                                      const topic = topics.find(t => t.id === task.topicId);
                                      return topic ? `in ${topic.name}` : '';
                                    })()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {upcomingReminders.length > 0 && (
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-secondary-200 mb-3 sm:mb-4 flex items-center">
                            <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                            Upcoming Reminders ({upcomingReminders.length})
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {upcomingReminders.slice(0, 3).map((reminder) => (
                              <div key={reminder.id} className="group p-3 sm:p-4 bg-gradient-to-r from-secondary-800/60 to-secondary-800/40 rounded-xl border border-secondary-700/30 hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-secondary-100 text-sm sm:text-base group-hover:text-primary-300 transition-colors line-clamp-2">
                                    {reminder.title}
                                  </h5>
                                  <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 ml-2"></div>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-secondary-400">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
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
          <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-100 mb-2">All Tasks</h2>
                <p className="text-secondary-400 text-sm sm:text-base">Track and manage your study tasks across all topics</p>
              </div>
              <TaskList tasks={tasks} />
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-100 mb-2">All Reminders</h2>
                <p className="text-secondary-400 text-sm sm:text-base">Stay on top of important dates and deadlines</p>
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
