'use client';

import React from 'react';
import { User } from '@/types';

interface DashboardHeaderProps {
  user: User | null;
  isHeaderMinimized: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isHeaderMinimized,
}) => {
  return (
    <div>
      <h1 className={`font-bold text-secondary-900 dark:bg-gradient-to-r dark:from-primary-400 dark:to-primary-600 dark:bg-clip-text dark:text-transparent transition-all duration-300 ${
        isHeaderMinimized ? 'md:text-xl' : 'text-lg sm:text-3xl'
      }`}>
        StudyHub Dashboard
      </h1>
      {/* Hide welcome message when minimized on desktop */}
      {!isHeaderMinimized && (
        <p className="hidden sm:block text-secondary-600 dark:text-secondary-400 font-medium transition-all duration-300">
          Welcome back, {user?.displayName || 'Student'}! Ready to conquer your studies?
        </p>
      )}
    </div>
  );
};

export default DashboardHeader;