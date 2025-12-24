'use client';

import React from 'react';
import { Topic } from '@/types';
import TopicItem from '../../topics/TopicItem';

interface SidebarTopicsSectionProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  onDeleteTopic: (topicId: string) => void;
  onCreateTopic: () => void;
  loading: boolean;
}

const SidebarTopicsSection: React.FC<SidebarTopicsSectionProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
  onDeleteTopic,
  onCreateTopic,
  loading,
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-secondary-700/50 bg-secondary-800/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-secondary-300 uppercase tracking-wider flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Topics
          </h2>
          <button
            onClick={onCreateTopic}
            className="p-2 text-secondary-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all duration-200 touch-target group"
            title="Create New Topic"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onTopicSelect(null)}
          className={`w-full text-left p-4 rounded-xl font-semibold text-sm transition-all duration-200 touch-target group ${
            !selectedTopic
              ? 'bg-primary-500/10 border border-primary-500/30 text-primary-300 shadow-lg glow-primary'
              : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-700/50 border border-transparent'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
              !selectedTopic
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-700 group-hover:bg-secondary-600 text-secondary-400 group-hover:text-secondary-200'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v1H8V5z" />
              </svg>
            </div>
            <div>
              <span className="block font-semibold">All Topics</span>
              <span className="text-xs opacity-70">Overview of everything</span>
            </div>
          </div>
        </button>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-secondary-400">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-secondary-200 mb-2">No topics yet</h3>
            <p className="text-sm text-secondary-400 mb-6 max-w-xs mx-auto">Create your first study topic to get started on your learning journey</p>
            <button
              onClick={onCreateTopic}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-800 shadow-lg hover:shadow-xl touch-target"
            >
              Create Topic
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {topics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic?.id === topic.id}
                onSelect={() => onTopicSelect(topic)}
                onDelete={() => onDeleteTopic(topic.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarTopicsSection;