'use client';

import React from 'react';

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
  return (
    <div className={`inline-flex items-center ${compact ? 'gap-2' : 'gap-3'} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="StudyHub logo"
        className="shrink-0"
      >
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#F8FAFC" stroke="#DBE2EA" strokeWidth="1.3" />
        <path
          d="M32 20C27 17 21 17 16 20V44C21 41 27 41 32 44"
          fill="none"
          stroke="#111827"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 20C37 17 43 17 48 20V44C43 41 37 41 32 44"
          fill="none"
          stroke="#111827"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M32 20V44" stroke="#111827" strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="46" cy="18" r="2.5" fill="#FF5F3A" />
      </svg>

      {withWordmark && (
        <div className={`min-w-0 ${textClassName}`}>
          <p className="truncate text-lg font-semibold tracking-[-0.01em] text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
            StudyHub
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyHubLogo;
