'use client';

import React from 'react';
import UserMenu from '../../ui/UserMenu';

interface SidebarHeaderProps {
  onToggleCollapse: () => void;
  isMobile: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onToggleCollapse,
  isMobile,
}) => {
  return (
    <div className="p-6 border-b border-secondary-700/50 bg-gradient-to-r from-secondary-800/50 to-secondary-800/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            StudyHub
          </h1>
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-2 text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50 rounded-lg transition-all duration-200 touch-target"
            title="Collapse Sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
        {isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-2 text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50 rounded-lg transition-all duration-200 touch-target"
            title="Close Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <UserMenu />
    </div>
  );
};

export default SidebarHeader;