'use client';

import React, { useEffect, useState } from 'react';

type ThemeMode = 'warm' | 'midnight';

const STORAGE_KEY = 'studyhub-theme';
const THEME_TRANSITION_MS = 450;

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.setAttribute('data-theme', theme);
};

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type ThemeTransitionDocument = {
  startViewTransition?: (callback: () => void) => ViewTransitionLike;
};

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const [theme, setTheme] = useState<ThemeMode>('warm');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const initialTheme: ThemeMode = savedTheme === 'midnight' ? 'midnight' : 'warm';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'warm' ? 'midnight' : 'warm';
    setTheme(nextTheme);
    setIsAnimating(true);

    const root = document.documentElement;
    const updateTheme = () => {
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDoc = document as unknown as ThemeTransitionDocument;

    if (typeof transitionDoc.startViewTransition === 'function' && !reducedMotion) {
      const transition = transitionDoc.startViewTransition(updateTheme);
      transition.ready
        .then(() => root.classList.add('theme-changing'))
        .catch(() => {
          // no-op: fallback covered by finished cleanup
        });
      transition.finished.finally(() => {
        root.classList.remove('theme-changing');
      });
    } else {
      root.classList.add('theme-changing');
      updateTheme();
      window.setTimeout(() => root.classList.remove('theme-changing'), THEME_TRANSITION_MS);
    }

    window.setTimeout(() => setIsAnimating(false), THEME_TRANSITION_MS);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`touch-target motion-lift inline-flex items-center justify-center rounded-xl border border-secondary-700 bg-secondary-900 py-2 text-secondary-200 hover:bg-secondary-800 ${
        compact ? 'w-10 px-0' : 'gap-2 px-2.5 pr-3'
      } ${className}`}
      title={theme === 'warm' ? 'Switch to midnight theme' : 'Switch to warm theme'}
      aria-label={theme === 'warm' ? 'Switch to midnight theme' : 'Switch to warm theme'}
    >
      <span
        className={`inline-flex h-4 w-4 items-center justify-center transition-transform duration-500 ${
          isAnimating ? 'rotate-[160deg] scale-90' : 'rotate-0 scale-100'
        }`}
      >
        {theme === 'warm' ? (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646a9 9 0 1011.708 11.708z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728L7.05 7.05m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
      </span>
      {!compact && <span className="text-xs font-semibold">{theme === 'warm' ? 'Midnight' : 'Warm'}</span>}
    </button>
  );
};

export default ThemeToggle;
