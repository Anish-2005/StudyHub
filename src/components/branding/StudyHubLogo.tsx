'use client';

import React, { useId } from 'react';

interface StudyHubLogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  textClassName?: string;
  compact?: boolean;
}

const StudyHubLogo: React.FC<StudyHubLogoProps> = ({
  size = 40,
  withWordmark = true,
  className = '',
  textClassName = '',
  compact = false,
}) => {
  const id = useId().replace(/:/g, '');
  const gradId = `studyhub-grad-${id}`;
  const shadeId = `studyhub-shade-${id}`;

  return (
    <div className={`inline-flex items-center ${compact ? 'gap-2' : 'gap-3'} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 68 68"
        role="img"
        aria-label="StudyHub logo"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="8" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff7f5d" />
            <stop offset="1" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id={shadeId} x1="14" y1="14" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fffdf8" stopOpacity="0.96" />
            <stop offset="1" stopColor="#f0ebe2" stopOpacity="0.96" />
          </linearGradient>
        </defs>

        <rect x="4" y="4" width="60" height="60" rx="18" fill={`url(#${gradId})`} />
        <path d="M16 21c6-3.8 13.4-3.8 19.4 0v21.2c-6-3.8-13.4-3.8-19.4 0V21z" fill={`url(#${shadeId})`} />
        <path d="M32.6 21c6-3.8 13.4-3.8 19.4 0v21.2c-6-3.8-13.4-3.8-19.4 0V21z" fill="#fff7ef" />
        <path d="M34 20.5v22" stroke="#ffd4c6" strokeWidth="1.3" />
        <circle cx="46.2" cy="26.4" r="2.8" fill="#ff5f3a" />
      </svg>

      {withWordmark && (
        <div className={`min-w-0 ${textClassName}`}>
          <p className="text-[11px] uppercase tracking-[0.22em] text-secondary-500">Study Suite</p>
          <p className="truncate text-lg font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
            StudyHub
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyHubLogo;
