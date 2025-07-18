import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vscode-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-vscode-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-vscode-text mb-4">Topic Not Found</h2>
        <p className="text-vscode-text/70 mb-8 max-w-md">
          The topic you're looking for doesn't exist or is not public.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
