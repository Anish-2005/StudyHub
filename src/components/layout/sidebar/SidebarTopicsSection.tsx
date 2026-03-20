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
    <div className="motion-fade-up motion-delay-1 flex h-full flex-col">
      <div className="border-b border-secondary-700/70 px-4 py-4 md:px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="panel-title">Navigation</h2>
          <button
            onClick={onCreateTopic}
            className="touch-target motion-lift rounded-lg border border-secondary-700 bg-secondary-800/60 px-2.5 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100"
            title="Create Topic"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onTopicSelect(null)}
          className={`motion-lift w-full rounded-xl border px-3 py-3 text-left transition-colors ${
            !selectedTopic
              ? 'border-primary-500/50 bg-primary-500/10 text-primary-200'
              : 'border-secondary-700 bg-secondary-800/55 text-secondary-200 hover:border-secondary-600 hover:bg-secondary-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="icon-pill h-9 w-9">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v1H8V5z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold">All Topics</p>
              <p className="text-xs text-secondary-400">Portfolio overview</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mobile-scroll-container flex-1 px-3 py-3">
        {loading && (
          <div className="flex h-24 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        )}

        {!loading && topics.length === 0 && (
          <div className="surface-soft motion-scale-in mx-2 mt-2 p-5 text-center">
            <p className="text-sm font-semibold text-secondary-200">No topics yet</p>
            <p className="mt-1 text-xs text-secondary-400">Create your first topic to start organizing.</p>
            <button onClick={onCreateTopic} className="btn-primary mt-4 w-full">
              Create Topic
            </button>
          </div>
        )}

        {!loading && topics.length > 0 && (
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className="motion-fade-up"
                style={{ animationDelay: `${Math.min(index * 35, 220)}ms` }}
              >
                <TopicItem
                  topic={topic}
                  isSelected={selectedTopic?.id === topic.id}
                  onSelect={() => onTopicSelect(topic)}
                  onDelete={() => onDeleteTopic(topic.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarTopicsSection;

