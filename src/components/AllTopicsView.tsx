'use client';

import React, { useState, useEffect } from 'react';
import { Task, Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StudyStats from './ui/StudyStats';
import DashboardHeader from './dashboard/DashboardHeader';
import MobileStats from './dashboard/MobileStats';
import DashboardTabs from './dashboard/DashboardTabs';
import AllTopicsOverviewTab from './all-topics/AllTopicsOverviewTab';
import AllTopicsTasksTab from './all-topics/AllTopicsTasksTab';
import AllTopicsRemindersTab from './all-topics/AllTopicsRemindersTab';

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
          <AllTopicsOverviewTab
            topics={topics}
            filteredTopics={filteredTopics}
            pendingTasks={pendingTasks}
            upcomingReminders={upcomingReminders}
            onTopicSelect={onTopicSelect}
          />
        )}

        {activeTab === 'tasks' && (
          <AllTopicsTasksTab tasks={tasks} />
        )}

        {activeTab === 'reminders' && (
          <AllTopicsRemindersTab reminders={reminders} />
        )}
      </div>
    </div>
  );
};

export default AllTopicsView;
