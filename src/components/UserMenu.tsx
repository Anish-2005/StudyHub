'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-full flex items-center p-2 rounded hover:bg-vscode-active transition-colors group"
      >
        <div className="w-8 h-8 bg-vscode-accent rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white font-mono text-sm">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-mono text-vscode-text truncate">
            {user?.displayName || 'User'}
          </div>
          <div className="text-xs text-vscode-text/50 truncate">
            {user?.email}
          </div>
        </div>
        
        <svg
          className={`w-4 h-4 text-vscode-text/50 transition-transform ${
            showMenu ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full left-0 right-0 z-20 bg-vscode-sidebar border border-vscode-border rounded-md shadow-lg py-1 mb-2">
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-mono text-vscode-text hover:bg-vscode-active transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
