'use client';

import React from 'react';

interface ReminderEmptyStateProps {
  filter: 'all' | 'upcoming' | 'completed';
  onCreateReminder: () => void;
}

const ReminderEmptyState: React.FC<ReminderEmptyStateProps> = ({
  filter,
  onCreateReminder,
}) => {
  return (
    <div className="text-center py-8 md:py-12">
      <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-base md:text-lg font-mono text-vscode-text/50 mb-2">
        {filter === 'all' ? 'No reminders yet' : `No ${filter} reminders`}
      </p>
      <p className="text-sm text-vscode-text/30 mb-4 px-4">
        {filter === 'all' ? 'Create your first reminder to stay organized' : `Switch to "All" to see all reminders`}
      </p>
      {filter === 'all' && (
        <button
          onClick={onCreateReminder}
          className="px-6 py-3 bg-vscode-accent text-white font-mono text-sm rounded-md hover:bg-vscode-accent/80 transition-colors touch-target"
        >
          Create Reminder
        </button>
      )}
    </div>
  );
};

export default ReminderEmptyState;