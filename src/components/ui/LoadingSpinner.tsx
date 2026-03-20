'use client';

import React from 'react';
import StudyHubLogo from '@/components/branding/StudyHubLogo';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-soft flex items-center gap-4 px-5 py-4">
        <StudyHubLogo size={32} withWordmark={false} compact />
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-secondary-100">Loading Workspace</p>
          <p className="text-xs text-secondary-400">Preparing your study dashboard...</p>
        </div>
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
