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
        onClick={() => setShowMenu((prev) => !prev)}
        className="touch-target flex w-full items-center rounded-lg border border-secondary-700 bg-secondary-800/55 p-2 transition-colors hover:bg-secondary-800"
      >
        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-500 text-sm font-semibold text-white">
          {user?.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName || 'User'} width={32} height={32} className="h-8 w-8 rounded-full" />
          ) : (
            <span>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-secondary-100">{user?.displayName || 'User'}</p>
          <p className="truncate text-xs text-secondary-400">{user?.email}</p>
        </div>

        <svg
          className={`h-4 w-4 text-secondary-500 transition-transform ${showMenu ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-label="Close user menu" onClick={() => setShowMenu(false)} />
          <div className="surface absolute bottom-full left-0 right-0 z-20 mb-2 p-1.5">
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="touch-target flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary-100 hover:bg-secondary-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

