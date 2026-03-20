'use client';

import React, { useState } from 'react';
import { Topic } from '@/types';

interface CreateTopicModalProps {
  onClose: () => void;
  onSubmit: (topic: Omit<Topic, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#0ea5e9',
    icon: 'book',
    folderPath: '',
    isPublic: false,
  });

  const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#eab308', '#f97316'];

  const icons = [
    { value: 'book', label: 'Book', path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { value: 'code', label: 'Code', path: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { value: 'science', label: 'Science', path: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { value: 'math', label: 'Math', path: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { value: 'language', label: 'Language', path: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
  ];

  const previewIcon = icons.find((item) => item.value === formData.icon) || icons[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const topicName = formData.name.trim();

    onSubmit({
      name: topicName,
      description: formData.description.trim(),
      color: formData.color,
      icon: formData.icon,
      folderPath: formData.folderPath.trim() || `/${topicName.toLowerCase().replace(/\s+/g, '-')}`,
      isPublic: formData.isPublic,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-2 sm:items-center sm:p-6">
      <div className="surface max-h-[94vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-secondary-700/70 bg-secondary-900/95 px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-secondary-100 md:text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
                Create Topic
              </h2>
              <p className="text-xs text-secondary-400">Set up a focused workspace for a subject or goal.</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Topic Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="e.g. Data Structures"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="What will this topic contain?"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Folder Path</label>
            <input
              type="text"
              value={formData.folderPath}
              onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder={`/${formData.name.toLowerCase().replace(/\s+/g, '-') || 'topic-name'}`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-105 ${
                    formData.color === color ? 'border-white' : 'border-secondary-700'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  className={`touch-target rounded-lg border p-2 text-secondary-300 transition-colors ${
                    formData.icon === icon.value
                      ? 'border-primary-500 bg-primary-500/15 text-primary-200'
                      : 'border-secondary-700 bg-secondary-900 hover:bg-secondary-800'
                  }`}
                  title={icon.label}
                >
                  <svg className="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="surface-soft flex items-start gap-3 p-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`mt-0.5 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isPublic ? 'bg-success-500' : 'bg-secondary-600'
              }`}
              aria-label="Toggle public topic"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div>
              <p className="text-sm font-semibold text-secondary-100">{formData.isPublic ? 'Public Topic' : 'Private Topic'}</p>
              <p className="text-xs text-secondary-400">
                {formData.isPublic ? 'Anyone with the link can view this topic.' : 'Only you can view this topic.'}
              </p>
            </div>
          </div>

          <div className="surface-soft p-3">
            <p className="text-xs uppercase tracking-wide text-secondary-500">Preview</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: formData.color }} />
              <span style={{ color: formData.color }}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={previewIcon.path} />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-secondary-100">{formData.name || 'Topic Name'}</p>
                <p className="truncate text-xs text-secondary-400">{formData.description || 'No description yet'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-secondary-700/70 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;

