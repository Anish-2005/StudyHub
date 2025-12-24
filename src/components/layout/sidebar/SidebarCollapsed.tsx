'use client';

import React from 'react';
import { Topic } from '@/types';

interface SidebarCollapsedProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  onToggleCollapse: () => void;
  onCreateTopic: () => void;
  loading: boolean;
  user: any; // Firebase user object
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
    <div className="w-16 bg-secondary-800/95 backdrop-blur-xl border-r border-secondary-700/50 flex flex-col h-full shadow-professional">
      {/* Logo/Expand Button */}
      <div className="p-3 border-b border-secondary-700/50">
        <button
          onClick={onToggleCollapse}
          className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg group"
          title="Expand Sidebar"
        >
          <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>

      {/* All Topics Button */}
      <div className="p-3 border-b border-secondary-700/50">
        <button
          onClick={() => onTopicSelect(null)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group ${
            !selectedTopic
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-secondary-700/50 text-secondary-400 hover:bg-secondary-700 hover:text-secondary-200 hover:scale-110'
          }`}
          title="All Topics"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v1H8V5z" />
          </svg>
        </button>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-2 scrollbar-thin">
        {loading ? (
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : topics.length === 0 ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-secondary-700 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        ) : (
          topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
                selectedTopic?.id === topic.id
                  ? 'bg-primary-500/10 border-2 border-primary-500/50 shadow-lg scale-110'
                  : 'hover:scale-110 hover:shadow-md border-2 border-transparent'
              }`}
              style={{
                backgroundColor: selectedTopic?.id !== topic.id ? topic.color + '20' : undefined
              }}
              title={topic.name}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: topic.color }}
              ></div>
              {selectedTopic?.id === topic.id && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Create Topic Button */}
      <div className="p-3 border-t border-secondary-700/50">
        <button
          onClick={() => {
            onToggleCollapse();
            onCreateTopic();
          }}
          className="w-10 h-10 bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
          title="Create New Topic"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* User Avatar */}
      <div className="p-3 border-t border-secondary-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg">
          <span className="text-white font-bold text-sm">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarCollapsed;