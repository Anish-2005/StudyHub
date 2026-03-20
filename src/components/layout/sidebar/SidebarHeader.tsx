'use client';

import React from 'react';
import StudyHubLogo from '@/components/branding/StudyHubLogo';
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
    <div className="motion-fade-up border-b border-secondary-700/90 px-4 py-4 md:px-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <StudyHubLogo size={40} />

        <button
          onClick={onToggleCollapse}
          className="touch-target motion-lift rounded-xl border border-secondary-700 bg-secondary-900 px-2.5 text-secondary-300 transition-colors hover:bg-secondary-800 hover:text-secondary-100"
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
