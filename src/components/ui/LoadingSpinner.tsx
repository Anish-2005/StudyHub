'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-vscode-bg flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-vscode-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-vscode-text text-sm font-mono">Loading StudyHub<span className="loading-dots"></span></p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
