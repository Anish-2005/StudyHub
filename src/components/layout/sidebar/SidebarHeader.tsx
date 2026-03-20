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
    <div className="border-b border-secondary-700/70 px-4 py-4 md:px-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-secondary-500">Study OS</p>
            <h1 className="text-lg font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              StudyHub
            </h1>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className="touch-target rounded-lg border border-secondary-700 bg-secondary-800/60 px-2.5 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100"
          title={isMobile ? 'Close Sidebar' : 'Collapse Sidebar'}
        >
          {isMobile ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      <UserMenu />
    </div>
  );
};

export default SidebarHeader;

