'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="surface-soft flex items-center gap-3 px-4 py-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <p className="text-sm text-secondary-200">Loading StudyHub...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

