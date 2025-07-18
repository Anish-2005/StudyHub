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
    <div className="relative">
      <div
        className={`w-full text-left p-2 rounded font-medium text-sm transition-colors group cursor-pointer ${
          isSelected
            ? 'bg-vscode-accent text-white'
            : 'text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active'
        }`}
      >
        <div 
          onClick={onSelect}
          className="flex items-center justify-between"
        >
          <div className="flex items-center flex-1 min-w-0">
            <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0`} style={{ backgroundColor: topic.color }}></div>
            <div className="mr-2 flex-shrink-0" style={{ color: isSelected ? 'white' : topic.color }}>
              {getTopicIcon(topic.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{topic.name}</div>
              <div className={`text-xs truncate ${isSelected ? 'text-white/70' : 'text-vscode-text/50'}`}>
                {topic.description || 'No description'}
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity touch-target ${
              isSelected ? 'hover:bg-white/20' : 'hover:bg-vscode-border'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
        
        <div 
          onClick={onSelect}
          className={`text-xs mt-1 cursor-pointer ${isSelected ? 'text-white/50' : 'text-vscode-text/40'}`}
        >
          {format(topic.updatedAt, 'MMM d, yyyy')}
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-8 z-20 bg-vscode-sidebar border border-vscode-border rounded-md shadow-lg py-1 min-w-[120px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-vscode-error hover:bg-vscode-active transition-colors touch-target"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopicItem;
