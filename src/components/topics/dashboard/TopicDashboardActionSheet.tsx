'use client';

import React from 'react';

interface TopicDashboardActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  onCreateReminder: () => void;
  onCreateNote: () => void;
  topicName: string;
}

const TopicDashboardActionSheet: React.FC<TopicDashboardActionSheetProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  onCreateReminder,
  onCreateNote,
  topicName,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      label: 'New Task',
      detail: 'Track a concrete action',
      onClick: onCreateTask,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      ),
    },
    {
      label: 'New Reminder',
      detail: 'Schedule a timed alert',
      onClick: onCreateReminder,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'New Note',
      detail: 'Capture quick context',
      onClick: onCreateNote,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-secondary-700 bg-secondary-900 px-4 pb-6 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-secondary-700" />
        <h3 className="text-lg font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Add to {topicName}
        </h3>
        <p className="mb-4 mt-1 text-sm text-secondary-400">Choose what you want to create.</p>

        <div className="space-y-2.5">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className="touch-target surface-soft flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="icon-pill h-9 w-9">{action.icon}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-secondary-100">{action.label}</span>
                <span className="block text-xs text-secondary-400">{action.detail}</span>
              </span>
              <svg className="h-4 w-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="btn-secondary mt-4 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TopicDashboardActionSheet;

