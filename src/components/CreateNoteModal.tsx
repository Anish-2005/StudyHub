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
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-vscode-border sticky top-0 bg-vscode-sidebar z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-vscode-text">Create New Note</h2>
            <button
              onClick={onClose}
              className="p-2 text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active rounded transition-colors touch-target"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Note Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
              placeholder="e.g., Chapter 5 Summary, Important Formulas..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors resize-none touch-target"
              placeholder="Write your note content here..."
              rows={8}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
                placeholder="Add tags (press Enter to add)"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-vscode-accent/20 text-vscode-accent rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-vscode-accent/70 hover:text-vscode-accent"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="border border-vscode-border rounded-md p-3 lg:p-4 bg-vscode-bg">
            <div className="text-sm font-medium text-vscode-text/70 mb-2">Preview:</div>
            <div className="space-y-2">
              <div className="text-sm lg:text-base font-medium text-vscode-text">
                {formData.title || 'Note Title'}
              </div>
              <div className="text-xs lg:text-sm text-vscode-text/70 bg-vscode-sidebar p-2 rounded max-h-32 overflow-y-auto">
                {formData.content || 'Note content will appear here...'}
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-vscode-accent/10 text-vscode-accent rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-vscode-text/70 hover:text-vscode-text transition-colors touch-target order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-vscode-accent text-white font-medium text-sm rounded-md hover:bg-vscode-accent/80 transition-colors touch-target order-1 sm:order-2"
            >
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;
