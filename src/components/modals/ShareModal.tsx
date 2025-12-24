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
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${topic.name} - StudyHub Topic`,
          text: `Check out my study topic: ${topic.name}`,
          url: publicUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-vscode-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-vscode-text">Share Topic</h3>
            <button
              onClick={onClose}
              className="p-1 text-vscode-text/50 hover:text-vscode-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium text-vscode-text mb-2">{topic.name}</h4>
            <p className="text-sm text-vscode-text/70 mb-4">
              Share this public topic with others. Anyone with the link can view your study progress.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Public Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-sm text-vscode-text font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                    : 'bg-vscode-accent text-white hover:bg-vscode-accent/80'
                }`}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-2 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-vscode-border text-vscode-text/70 font-medium rounded-md hover:bg-vscode-active transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
