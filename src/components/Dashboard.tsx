'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { Topic } from '@/types';

const Dashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleTopicSelect = (topic: Topic | null) => {
    setSelectedTopic(topic);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <div className="flex h-screen bg-secondary-900 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-800/20 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Backdrop */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden modal-backdrop"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'}
        ${isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'z-50' : 'z-0'}
        transition-transform duration-300 ease-in-out
        h-full
      `}>
        <Sidebar
          selectedTopic={selectedTopic}
          onTopicSelect={handleTopicSelect}
          collapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
          showMobileSidebar={showMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-secondary-800/95 backdrop-blur-xl border-b border-secondary-700/50 p-4 flex items-center justify-between md:hidden safe-area-inset-top shadow-lg">
            <button
              onClick={toggleSidebar}
              className="p-3 text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50 rounded-xl transition-all duration-200 touch-target"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg font-bold text-secondary-100">
              {selectedTopic ? selectedTopic.name : 'StudyHub'}
            </h1>

            <div className="w-12" /> {/* Spacer for alignment */}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden min-h-0" style={{ height: isMobile ? 'calc(100vh - 80px)' : '100%' }}>
          <MainContent
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
