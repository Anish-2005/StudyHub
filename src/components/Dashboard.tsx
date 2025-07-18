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
    <div className="flex h-screen bg-vscode-bg overflow-hidden" style={{ height: '100dvh' }}>
      {/* Mobile Backdrop */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden modal-backdrop"
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-vscode-sidebar border-b border-vscode-border p-4 flex items-center justify-between md:hidden safe-area-inset-top">
            <button
              onClick={toggleSidebar}
              className="p-2 text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active rounded-lg transition-colors touch-target"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-lg font-semibold text-vscode-text">
              {selectedTopic ? selectedTopic.name : 'StudyHub'}
            </h1>
            
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden min-h-0" style={{ height: isMobile ? 'calc(100vh - 64px)' : '100%' }}>
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
