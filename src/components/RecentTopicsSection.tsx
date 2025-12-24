'use client';

import React from 'react';
import { Topic } from '@/types';
import TopicItem from './TopicItem';

interface RecentTopicsSectionProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic | null) => void;
}

const RecentTopicsSection: React.FC<RecentTopicsSectionProps> = ({
  topics,
  onTopicSelect,
}) => {
  return (
    <div className="card card-mobile">
      <div className="card-header">
        <h3 className="card-title flex items-center">
          <svg className="w-4 h-4 md:w-3 md:h-3 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Recent Topics
        </h3>
        <p className="card-description">Your latest study subjects</p>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-200 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-4 h-4 md:w-3 md:h-3 text-secondary-400 dark:text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-200 mb-2">No topics yet</h4>
          <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto px-4">Start your learning journey by creating your first study topic</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topics.slice(0, 6).map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onClick={() => onTopicSelect(topic)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTopicsSection;