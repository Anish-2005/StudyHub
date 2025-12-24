'use client';

import React, { useState } from 'react';
import { Topic } from '@/types';
import { format } from 'date-fns';

interface TopicItemProps {
  topic: Topic;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTopicIcon = (icon: string) => {
    const icons: { [key: string]: JSX.Element } = {
      book: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      code: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      science: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      math: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      language: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      default: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };

    return icons[icon] || icons.default;
  };

  return (
    <div className="relative group">
      <div
        className={`w-full text-left p-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer touch-target ${
          isSelected
            ? 'bg-primary-500/10 border border-primary-500/30 text-primary-200 shadow-lg glow-primary'
            : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-700/50 border border-transparent hover:border-secondary-600/50'
        }`}
      >
        <div
          onClick={onSelect}
          className="flex items-center justify-between"
        >
          <div className="flex items-center flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-secondary-700 group-hover:bg-secondary-600 text-secondary-400 group-hover:text-secondary-200'
              }`}
              style={{
                backgroundColor: isSelected ? undefined : topic.color + '20',
                color: isSelected ? undefined : topic.color
              }}
            >
              {getTopicIcon(topic.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-semibold text-base mb-1">{topic.name}</div>
              <div className={`text-xs truncate ${isSelected ? 'text-primary-300/70' : 'text-secondary-400'}`}>
                {topic.description || 'No description'}
              </div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-primary-400/70' : 'text-secondary-500'}`}>
                Updated {format(topic.updatedAt, 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 touch-target ${
              isSelected
                ? 'hover:bg-primary-500/20 text-primary-300'
                : 'hover:bg-secondary-600 text-secondary-400 hover:text-secondary-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-12 z-20 glass-effect rounded-xl shadow-professional-xl py-2 min-w-[140px] border border-secondary-600/50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-accent-400 hover:text-accent-300 hover:bg-accent-500/10 transition-all duration-200 touch-target rounded-lg mx-2"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Topic
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopicItem;
