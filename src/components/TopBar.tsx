'use client';

import React, { useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Real-time search
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700/50 shadow-sm z-30 relative">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16 md:h-20">
        {/* Left Section */}
        <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
          {/* Menu Button - Mobile */}
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-all duration-200 touch-target"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Current Topic/Page Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {selectedTopic ? (
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: selectedTopic.color + '20' }}
                >
                  <div
                    className="w-4 h-4 md:w-5 md:h-5 rounded-full"
                    style={{ backgroundColor: selectedTopic.color }}
                  ></div>
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-xl font-bold text-secondary-900 dark:text-secondary-100 truncate">
                {selectedTopic ? selectedTopic.name : 'StudyHub Dashboard'}
              </h1>
              <p className="text-xs md:text-sm text-secondary-500 dark:text-secondary-400 truncate">
                {selectedTopic ? selectedTopic.description || 'Study topic' : 'Manage your study progress'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          {/* Date & Time - Desktop Only */}
          <div className="hidden lg:flex flex-col items-end mr-2">
            <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              {currentTime}
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400">
              {currentDate}
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:block relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search tasks, topics, notes..."
                  className="w-64 lg:w-80 pl-10 pr-10 py-2 bg-secondary-100 dark:bg-secondary-700/50 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) {
                      setTimeout(() => setShowSearch(false), 150);
                    }
                  }}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      if (onSearch) onSearch('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-all duration-200"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Button - Mobile */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-all duration-200"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            className="relative p-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-all duration-200"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
          </button>

          {/* User Avatar & Name */}
          <div className="flex items-center space-x-3 pl-2 md:pl-4 border-l border-secondary-200 dark:border-secondary-700">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 leading-tight">
                {user?.displayName || 'Student'}
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                {user?.email}
              </div>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md">
              <span className="text-white font-bold text-sm md:text-base">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isMobile && showSearch && (
        <div className="px-4 pb-4 border-t border-secondary-200 dark:border-secondary-700/50 animate-slide-down">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tasks, topics, notes..."
              className="w-full pl-10 pr-10 py-2.5 bg-secondary-100 dark:bg-secondary-700/50 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              autoFocus
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default TopBar;
