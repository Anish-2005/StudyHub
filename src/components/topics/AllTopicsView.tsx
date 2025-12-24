'use client';

import React, { useState, useEffect } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from '../tasks/TaskList';
import ReminderList from '../reminders/ReminderList';
import StudyStats from '../ui/StudyStats';
import PomodoroTimer from '../ui/PomodoroTimer';
import DashboardHeader from '../dashboard/DashboardHeader';
import MobileStats from '../dashboard/MobileStats';
import DashboardTabs from '../dashboard/DashboardTabs';

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

  // Filter topics based on search query
  const filteredTopics = searchQuery
    ? topics.filter(topic =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.icon.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  // Handle header minimization on scroll (desktop only)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = (e: Event) => {
      // Only minimize on desktop (not mobile)
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Reset to not minimized on mobile
        if (isHeaderMinimized) {
          setIsHeaderMinimized(false);
        }
        return;
      }

      // Throttle scroll events for better performance
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const target = e.target as HTMLElement;
        const scrollTop = target.scrollTop || window.scrollY || document.documentElement.scrollTop;

        // Desktop threshold
        const threshold = 100;
        const shouldMinimize = scrollTop > threshold;

        // Only update state if it actually changed to prevent unnecessary re-renders
        if (shouldMinimize !== isHeaderMinimized) {
          setIsHeaderMinimized(shouldMinimize);
        }
      }, 16); // 60fps updates
    };

    // Listen to scroll events
    const scrollTargets = [
      document.querySelector('.mobile-scroll-container'),
      window,
    ];

    scrollTargets.forEach(target => {
      if (target) {
        target.addEventListener('scroll', handleScroll, { passive: true });
      }
    });

    // Also check on resize to reset state if switching to mobile
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isHeaderMinimized) {
        setIsHeaderMinimized(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      scrollTargets.forEach(target => {
        if (target) {
          target.removeEventListener('scroll', handleScroll);
        }
      });
      window.removeEventListener('resize', handleResize);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isHeaderMinimized]);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
  ];

return (
    <div className="flex flex-col h-full min-h-0 bg-secondary-50 dark:bg-secondary-900 relative" style={{ touchAction: 'pan-y' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className={`border-b border-secondary-200 dark:border-secondary-700/50 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-xl flex-shrink-0 relative z-10 transition-all duration-300 ${
        isHeaderMinimized ? 'md:py-1' : 'py-1 md:py-2'
      }`} style={{ touchAction: 'none' }}>
        <div className={`transition-all duration-300 ${
          isHeaderMinimized ? 'p-2 sm:p-4 md:p-3' : 'p-2 sm:p-6'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 space-y-2 sm:space-y-0 transition-all duration-300 ${
            isHeaderMinimized ? 'md:mb-2' : 'mb-3 md:mb-6'
          }`}>
            <DashboardHeader user={user} isHeaderMinimized={isHeaderMinimized} />
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                isHeaderMinimized ? 'md:w-8 md:h-8' : 'w-8 h-8 sm:w-12 sm:h-12'
              }`}>
                <svg className={`text-white transition-all duration-300 ${
                  isHeaderMinimized ? 'md:w-4 md:h-4' : 'w-4 h-4 sm:w-6 sm:h-6'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Study Stats - Hide when minimized on desktop, always show on mobile */}
          {!isHeaderMinimized && (
            <div className="transition-all duration-300">
              {/* Mobile compact stats */}
              <div className="block sm:hidden mb-4">
                <MobileStats
                  topics={topics}
                  pendingTasks={pendingTasks}
                  completedTasks={completedTasks}
                />
              </div>

              {/* Desktop full stats */}
              <div className="hidden sm:block">
                <StudyStats topics={topics} tasks={tasks} reminders={reminders} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'tasks' | 'reminders')}
            isHeaderMinimized={isHeaderMinimized}
          />
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
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-200 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-4 h-4 md:w-3 md:h-3 text-secondary-400 dark:text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-200 mb-2">No topics yet</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto px-4">Start your learning journey by creating your first study topic</p>
                  </div>
                ) : filteredTopics.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-200 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-4 h-4 md:w-3 md:h-3 text-secondary-400 dark:text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-200 mb-2">No topics found</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto px-4">Try a different search term</p>
                  </div>
                ) : (
                  <div className="mobile-grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredTopics.slice(0, 6).map((topic, index) => (
                      <button
                        key={topic.id}
                        onClick={() => onTopicSelect(topic)}
                        className="card card-mobile group animate-fade-in text-left hover:shadow-professional-lg hover:scale-105 hover:border-primary-500/30"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div
                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: topic.color + '20', color: topic.color }}
                          >
                            <svg className="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500 font-medium bg-secondary-100 dark:bg-secondary-700/50 px-2 py-1 rounded-md">
                            {topic.updatedAt.toLocaleDateString()}
                          </div>
                        </div>

                        <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm sm:text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
                          {topic.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 leading-relaxed">
                          {topic.description || 'No description available'}
                        </p>

                        <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-secondary-200 dark:border-secondary-700/50 flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full shadow-sm"
                              style={{ backgroundColor: topic.color }}
                            ></div>
                            <span className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500 capitalize font-medium">{topic.icon}</span>
                          </div>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="mobile-grid lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <div className="card card-mobile lg:col-span-2">
                  <div className="card-header">
                    <h3 className="card-title flex items-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 mr-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Actions
                    </h3>
                    <p className="card-description">Jump into your studies</p>
                  </div>

                  <div className="mobile-grid-2 sm:grid sm:grid-cols-1 sm:gap-4">
                    <button className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
                        <svg className="w-4 h-4 sm:w-7 sm:h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Create New Topic</div>
                        <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Start organizing your studies</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-success-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-success-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
                        <svg className="w-4 h-4 sm:w-7 sm:h-7 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Add Task</div>
                        <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Track your progress</div>
                      </div>
                    </button>

                    <button className="w-full btn-ghost justify-start group btn-mobile hover:shadow-md hover:bg-secondary-700/50">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-warning-500/10 rounded-xl flex items-center justify-center mr-3 sm:mr-5 group-hover:bg-warning-500/20 group-hover:scale-110 transition-all duration-200 shadow-sm">
                        <svg className="w-4 h-4 sm:w-7 sm:h-7 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-secondary-900 dark:text-secondary-200 text-sm sm:text-lg mb-0.5 sm:mb-1">Set Reminder</div>
                        <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-500">Never miss important dates</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Pomodoro Timer */}
                <div className="lg:col-span-1 my-4 sm:my-6">
                  <PomodoroTimer />
                </div>

                {/* Recent Activity */}
                {(pendingTasks.length > 0 || upcomingReminders.length > 0) && (
                  <div className="card card-mobile my-4 sm:my-6">
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
                              <div key={task.id} className="group p-3 sm:p-4 bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800/60 dark:to-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700/30 hover:border-secondary-300 dark:hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm sm:text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
                                      {task.title}
                                    </h5>
                                    {task.description && (
                                      <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-2">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                                    task.priority === 'high' ? 'bg-accent-500/20 text-accent-600 dark:text-accent-300 border border-accent-500/30' :
                                    task.priority === 'medium' ? 'bg-warning-500/20 text-warning-600 dark:text-warning-300 border border-warning-500/30' :
                                    'bg-secondary-200 dark:bg-secondary-700/50 text-secondary-600 dark:text-secondary-400 border border-secondary-300 dark:border-secondary-600/30'
                                  }`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {task.dueDate && (
                                    <div className="flex items-center text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Due {task.dueDate.toLocaleDateString()}
                                    </div>
                                  )}
                                  <div className="text-xs text-secondary-500 dark:text-secondary-500">
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
                              <div key={reminder.id} className="group p-3 sm:p-4 bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800/60 dark:to-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700/30 hover:border-secondary-300 dark:hover:border-secondary-600/50 transition-all duration-200 hover:shadow-lg card-mobile">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
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
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">All Tasks</h2>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">Track and manage your study tasks across all topics</p>
              </div>
              <TaskList tasks={tasks} />
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto mobile-spacing sm:p-6 mobile-scroll-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">All Reminders</h2>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">Stay on top of important dates and deadlines</p>
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
