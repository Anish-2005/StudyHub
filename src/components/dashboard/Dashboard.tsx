'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import TopBar from '../layout/TopBar';
import { Topic } from '@/types';

const Dashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed, isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        const saved = localStorage.getItem('sidebarCollapsed');
        setSidebarCollapsed(saved ? JSON.parse(saved) : false);
        setShowMobileSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar((prev) => !prev);
      return;
    }

    setSidebarCollapsed((prev) => !prev);
  };

  const handleTopicSelect = (topic: Topic | null) => {
    setSelectedTopic(topic);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <div className="motion-fade-up h-full w-full p-0 md:p-5">
      <div className="app-shell motion-delay-1 relative flex h-full overflow-hidden">
        {isMobile && showMobileSidebar && (
          <button
            aria-label="Close sidebar overlay"
            className="motion-fade-up absolute inset-0 z-30 bg-secondary-50/65 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        <div
          className={`
            ${isMobile ? 'absolute left-0 top-0 z-40 h-full' : 'relative h-full'}
            ${isMobile && !showMobileSidebar ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}
            transition-all duration-300 ease-out
          `}
        >
          <Sidebar
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
            collapsed={sidebarCollapsed && !isMobile}
            onToggleCollapse={toggleSidebar}
            isMobile={isMobile}
          />
        </div>

        <div className="motion-fade-up motion-delay-2 flex min-w-0 flex-1 flex-col">
          <TopBar
            selectedTopic={selectedTopic}
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
            onSearch={setSearchQuery}
          />

          <div className="min-h-0 flex-1 overflow-hidden">
            <MainContent
              selectedTopic={selectedTopic}
              onTopicSelect={handleTopicSelect}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


