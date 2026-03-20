'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Topic } from '@/types';

interface TopBarProps {
  selectedTopic: Topic | null;
  onMenuClick: () => void;
  isMobile: boolean;
  onSearch?: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ selectedTopic, onMenuClick, isMobile, onSearch }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dateText = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch?.(value.trim());
  };

  const pageTitle = selectedTopic ? selectedTopic.name : 'Workspace Overview';
  const pageSubtitle = selectedTopic
    ? selectedTopic.description || 'Topic dashboard'
    : 'Track priorities across all topics';

  return (
    <header className="border-b border-secondary-700/70 bg-secondary-900/85 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="touch-target rounded-lg border border-secondary-700 bg-secondary-800/70 px-2.5 text-secondary-200 hover:bg-secondary-700"
          title="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-secondary-100 md:text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {pageTitle}
          </h1>
          <p className="truncate text-xs text-secondary-400 md:text-sm">{pageSubtitle}</p>
        </div>

        <button
          onClick={() => setShowMobileSearch((prev) => !prev)}
          className="touch-target rounded-lg border border-secondary-700 bg-secondary-800/70 px-2.5 text-secondary-200 hover:bg-secondary-700 md:hidden"
          title="Search"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-xs font-semibold text-secondary-200">{currentTime}</p>
            <p className="text-[11px] text-secondary-500">{dateText}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-800 text-sm font-semibold text-secondary-100">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      <div className="mt-3 hidden md:block">
        <label className="relative block">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-secondary-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search topics, tasks, notes, reminders"
            className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 py-2.5 pl-9 pr-10 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleChange('')}
              className="touch-target absolute inset-y-0 right-1 rounded-md px-2 text-secondary-400 hover:text-secondary-200"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </label>
      </div>

      {isMobile && showMobileSearch && (
        <div className="mt-3 md:hidden">
          <label className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-secondary-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 py-2.5 pl-9 pr-10 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleChange('')}
                className="touch-target absolute inset-y-0 right-1 rounded-md px-2 text-secondary-400 hover:text-secondary-200"
                title="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </label>
        </div>
      )}
    </header>
  );
};

export default TopBar;
