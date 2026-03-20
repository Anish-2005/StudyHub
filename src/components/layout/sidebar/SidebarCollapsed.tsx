'use client';

import React from 'react';
import { Topic, User } from '@/types';
import StudyHubLogo from '@/components/branding/StudyHubLogo';

interface SidebarCollapsedProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  onToggleCollapse: () => void;
  onCreateTopic: () => void;
  loading: boolean;
  user: User | null;
}

const SidebarCollapsed: React.FC<SidebarCollapsedProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
  onToggleCollapse,
  onCreateTopic,
  loading,
  user,
}) => {
  return (
    <aside className="motion-slide-in-left flex h-full w-16 flex-col border-r border-secondary-700/90 bg-secondary-950/95">
      <div className="border-b border-secondary-700/90 p-2.5">
        <button
          onClick={onToggleCollapse}
          className="touch-target motion-lift flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-900 border border-secondary-700 hover:bg-secondary-800"
          title="Expand Sidebar"
        >
          <StudyHubLogo size={22} withWordmark={false} compact />
        </button>
      </div>

      <div className="border-b border-secondary-700/90 p-2.5">
        <button
          onClick={() => onTopicSelect(null)}
          className={`touch-target motion-lift flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
            !selectedTopic
              ? 'border-primary-500/50 bg-primary-500/10 text-primary-200'
              : 'border-secondary-700 bg-secondary-900 text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
          }`}
          title="All Topics"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v1H8V5z" />
          </svg>
        </button>
      </div>

      <div className="mobile-scroll-container flex-1 space-y-2 px-2.5 py-2.5">
        {loading && <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />}

        {!loading &&
          topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic)}
              className={`touch-target motion-lift relative flex h-10 w-10 items-center justify-center rounded-xl border transition-transform hover:scale-105 ${
                selectedTopic?.id === topic.id
                  ? 'border-primary-500/70 bg-primary-500/15'
                  : 'border-secondary-700 bg-secondary-900/80 hover:border-secondary-600'
              }`}
              title={topic.name}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: topic.color }} />
            </button>
          ))}
      </div>

      <div className="border-t border-secondary-700/90 p-2.5">
        <button
          onClick={() => {
            onToggleCollapse();
            onCreateTopic();
          }}
          className="touch-target motion-lift flex h-10 w-10 items-center justify-center rounded-xl border border-secondary-700 bg-secondary-900 text-secondary-200 hover:bg-secondary-800"
          title="Create Topic"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="border-t border-secondary-700/90 p-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-900 text-sm font-semibold text-secondary-100">
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </aside>
  );
};

export default SidebarCollapsed;
