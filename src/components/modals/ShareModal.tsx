'use client';

import React, { useState } from 'react';
import { getTopicPublicUrl } from '@/utils/slug';
import toast from 'react-hot-toast';

interface ShareModalProps {
  topic: {
    name: string;
    isPublic: boolean;
  };
  username: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ topic, username, onClose }) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = getTopicPublicUrl(username, topic.name);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${topic.name} - StudyHub`,
          text: `Check out this public topic: ${topic.name}`,
          url: publicUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Share failed');
        }
      }
      return;
    }

    await handleCopyLink();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/65 p-2 sm:items-center sm:p-6">
      <div className="surface w-full max-w-lg">
        <div className="border-b border-secondary-700/70 px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-secondary-100 md:text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
                Share Topic
              </h3>
              <p className="text-xs text-secondary-400">Public link for {topic.name}</p>
            </div>
            <button
              onClick={onClose}
              className="touch-target rounded-md border border-secondary-700 bg-secondary-800 px-2.5 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100"
              title="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4 md:p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Public URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100"
              />
              <button onClick={handleCopyLink} className={`${copied ? 'btn-secondary' : 'btn-primary'} min-w-[84px]`}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="surface-soft p-3 text-xs text-secondary-400">
            Anyone with this link can view this topic while it is public.
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <button onClick={handleShare} className="btn-primary">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

