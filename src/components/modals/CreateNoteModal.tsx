'use client';

import React, { useState } from 'react';
import { Note } from '@/types';

interface CreateNoteModalProps {
  onClose: () => void;
  onSubmit: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  topicId: string;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ onClose, onSubmit, topicId }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    onSubmit({
      title: formData.title.trim(),
      content: formData.content.trim(),
      topicId,
      tags: formData.tags,
    });
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!trimmedTag || formData.tags.includes(trimmedTag)) {
      setTagInput('');
      return;
    }

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-2 motion-fade-up sm:items-center sm:p-6">
      <div className="surface motion-scale-in max-h-[92vh] w-full max-w-3xl overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-secondary-700/70 bg-secondary-900/95 px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-secondary-100 md:text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
                Create Note
              </h2>
              <p className="text-xs text-secondary-400">Capture key concepts, examples, and summaries.</p>
            </div>
            <button
              onClick={onClose}
              className="touch-target motion-lift rounded-md border border-secondary-700 bg-secondary-800 px-2.5 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100"
              title="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="e.g. Differentiation rules summary"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="Write your note"
              rows={8}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                className="flex-1 rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
                placeholder="Type a tag and press Enter"
              />
              <button type="button" onClick={() => addTag(tagInput)} className="btn-secondary">
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-primary-500/35 bg-primary-500/10 px-2 py-1 text-xs text-primary-200">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-primary-300 hover:text-primary-100">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="surface-soft p-3">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Preview</p>
            <p className="mt-1 text-sm font-semibold text-secondary-100">{formData.title || 'Note title'}</p>
            <p className="mt-1 line-clamp-3 text-xs text-secondary-400">{formData.content || 'Note content preview'}</p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-secondary-700/70 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;

