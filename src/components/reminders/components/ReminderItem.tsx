'use client';

import React from 'react';
import { Reminder } from '@/types';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (reminderId: string, completed: boolean) => void;
  onDelete: (reminderId: string) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onToggle,
  onDelete,
}) => {
  const now = new Date();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'study':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'review':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-400';
      case 'study': return 'text-green-400';
      case 'review': return 'text-yellow-400';
      default: return 'text-vscode-text/50';
    }
  };

  const isOverdue = (date: Date, completed: boolean) => {
    return !completed && date < now;
  };

  return (
    <div
      className={`p-4 md:p-6 bg-vscode-sidebar border rounded-lg transition-all ${
        reminder.completed
          ? 'border-vscode-border opacity-60'
          : isOverdue(reminder.date, reminder.completed)
          ? 'border-vscode-error bg-vscode-error/5'
          : 'border-vscode-border'
      }`}
    >
      <div className="flex items-start space-x-3 md:space-x-4">
        {/* Checkbox - Mobile Optimized */}
        <button
          onClick={() => onToggle(reminder.id, reminder.completed)}
          className={`mt-1 w-6 h-6 md:w-5 md:h-5 border-2 rounded flex items-center justify-center transition-colors touch-target ${
            reminder.completed
              ? 'bg-vscode-success border-vscode-success text-white'
              : 'border-vscode-border hover:border-vscode-accent'
          }`}
        >
          {reminder.completed && (
            <svg className="w-3 h-3 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Reminder Content - Mobile Optimized */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-start md:justify-between mb-2 md:mb-3">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-1 md:space-y-0">
              <h3 className={`font-mono font-medium text-sm md:text-base ${
                reminder.completed ? 'line-through text-vscode-text/50' : 'text-vscode-text'
              }`}>
                {reminder.title}
              </h3>

              <div className={`flex items-center self-start ${getTypeColor(reminder.type)}`}>
                {getTypeIcon(reminder.type)}
                <span className="text-xs font-mono ml-1 capitalize">{reminder.type}</span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end space-x-2">
              {/* Date Badge - Mobile Optimized */}
              <span className={`px-2 py-1 rounded text-xs font-mono truncate max-w-32 md:max-w-none ${
                isOverdue(reminder.date, reminder.completed)
                  ? 'bg-vscode-error text-white'
                  : reminder.completed
                  ? 'bg-vscode-active text-vscode-text/50'
                  : 'bg-vscode-accent/20 text-vscode-accent'
              }`}>
                {reminder.date.toLocaleDateString()}
                <span className="hidden md:inline">
                  {' '}{reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>

              {/* Actions - Mobile Optimized */}
              <button
                onClick={() => onDelete(reminder.id)}
                className="p-2 md:p-1 text-vscode-text/50 hover:text-vscode-error transition-colors touch-target"
              >
                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Time display for mobile */}
          <div className="md:hidden mb-2">
            <span className="text-xs text-vscode-text/50 font-mono">
              {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {reminder.description && (
            <p className={`text-sm mb-3 leading-relaxed ${
              reminder.completed ? 'text-vscode-text/40' : 'text-vscode-text/70'
            }`}>
              {reminder.description}
            </p>
          )}

          {/* Meta info - Mobile Optimized */}
          <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-xs text-vscode-text/50">
            <span className="font-mono">
              Created {reminder.createdAt.toLocaleDateString()}
            </span>
            {isOverdue(reminder.date, reminder.completed) && (
              <span className="text-vscode-error font-mono font-medium">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderItem;