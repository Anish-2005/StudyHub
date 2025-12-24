'use client';

import React from 'react';

interface ReminderListHeaderProps {
  onCreateReminder: () => void;
}

const ReminderListHeader: React.FC<ReminderListHeaderProps> = ({
  onCreateReminder,
}) => {
  return (
    <div className="p-4 md:p-6 border-b border-vscode-border bg-vscode-sidebar">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        <h2 className="text-lg md:text-xl font-mono font-semibold text-vscode-text">Reminders</h2>
        <button
          onClick={onCreateReminder}
          className="w-full md:w-auto px-4 py-3 md:py-2 bg-vscode-accent text-white font-mono text-sm rounded-md hover:bg-vscode-accent/80 transition-colors flex items-center justify-center touch-target"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>
    </div>
  );
};

export default ReminderListHeader;