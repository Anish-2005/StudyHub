import React from 'react';
import Link from 'next/link';
import StudyHubLogo from '@/components/branding/StudyHubLogo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-soft w-full max-w-md p-8 text-center">
        <StudyHubLogo size={42} withWordmark={false} compact className="justify-center" />
        <p className="text-xs uppercase tracking-[0.2em] text-secondary-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
          Topic Not Found
        </h1>
        <p className="mt-2 text-sm text-secondary-400">
          The topic doesn&apos;t exist, isn&apos;t public, or the URL is incorrect.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
}
