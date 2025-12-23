'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import TopBar from './TopBar';
import { Topic } from '@/types';

const Dashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed, isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        // Restore saved state when switching back to desktop
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved) {
          setSidebarCollapsed(JSON.parse(saved));
        }
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
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* TopBar - Both Mobile and Desktop */}
        <TopBar 
          selectedTopic={selectedTopic}
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden min-h-0">
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
