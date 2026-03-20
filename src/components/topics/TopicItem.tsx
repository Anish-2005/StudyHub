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
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      code: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      science: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      math: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      language: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      default: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };

    return icons[icon] || icons.default;
  };

  return (
    <div className="relative">
      <div
        className={`group motion-lift rounded-xl border p-3 transition-colors ${
          isSelected
            ? 'border-primary-500/50 bg-primary-500/10 text-primary-100'
            : 'border-secondary-700 bg-secondary-800/55 text-secondary-200 hover:border-secondary-600 hover:bg-secondary-800'
        }`}
      >
        <div onClick={onSelect} className="flex cursor-pointer items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-secondary-700"
              style={{ backgroundColor: `${topic.color}22`, color: topic.color }}
            >
              {getTopicIcon(topic.icon)}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{topic.name}</p>
              <p className="mt-0.5 truncate text-xs text-secondary-400">{topic.description || 'No description'}</p>
              <p className="mt-1 text-[11px] text-secondary-500">Updated {format(topic.updatedAt, 'MMM d, yyyy')}</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="touch-target rounded-md px-2 text-secondary-400 opacity-0 transition-opacity hover:text-secondary-200 group-hover:opacity-100"
            title="Topic actions"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>

      {showMenu && (
        <>
          <button
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close topic menu"
            onClick={() => setShowMenu(false)}
          />
          <div className="surface motion-scale-in absolute right-0 top-12 z-20 min-w-[140px] p-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="touch-target flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/10"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Topic
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopicItem;

