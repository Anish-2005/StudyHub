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
    color: '#007acc',
    icon: 'book',
    folderPath: '',
    isPublic: false,
  });

  const colors = [
    '#007acc', '#4caf50', '#ff9800', '#f44336', '#9c27b0',
    '#e91e63', '#3f51b5', '#00bcd4', '#8bc34a', '#ffc107'
  ];

  const icons = [
    { value: 'book', label: 'Book', svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { value: 'code', label: 'Code', svg: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { value: 'science', label: 'Science', svg: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { value: 'math', label: 'Math', svg: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { value: 'language', label: 'Language', svg: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const topicName = formData.name.trim();

    onSubmit({
      name: topicName,
      description: formData.description.trim(),
      color: formData.color,
      icon: formData.icon,
      folderPath: formData.folderPath.trim() || `/${topicName}`,
      isPublic: formData.isPublic,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" aria-hidden="true" />
      <div
        className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[95vh] overflow-y-auto bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl flex flex-col"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-vscode-border sticky top-0 bg-vscode-sidebar z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-vscode-text">Create New Topic</h2>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 lg:space-y-6 flex-1 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Topic Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
              placeholder="e.g., React Development"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors resize-none touch-target"
              placeholder="Brief description of this topic"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Folder Path
            </label>
            <input
              type="text"
              value={formData.folderPath}
              onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
              placeholder={`/${formData.name || 'topic-name'}`}
            />
            <p className="text-xs text-vscode-text/50 mt-1 font-medium">
              Leave empty to use topic name as folder path
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all touch-target ${
                    formData.color === color
                      ? 'border-white scale-110'
                      : 'border-vscode-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 lg:gap-3">
              {icons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  className={`p-2 lg:p-3 rounded border transition-colors touch-target ${
                    formData.icon === icon.value
                      ? 'border-vscode-accent bg-vscode-accent/20 text-vscode-accent'
                      : 'border-vscode-border hover:border-vscode-accent/50 text-vscode-text/70'
                  }`}
                  title={icon.label}
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.svg} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-3">
              Privacy
            </label>
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.isPublic ? 'bg-green-400' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-vscode-text">
                    {formData.isPublic ? 'Public Topic' : 'Private Topic'}
                  </span>
                  <div className={`p-1 rounded ${
                    formData.isPublic ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {formData.isPublic ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      )}
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-vscode-text/50">
                  {formData.isPublic 
                    ? 'Anyone with the link can view this topic and its content'
                    : 'Only you can view this topic'
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="border border-vscode-border rounded-md p-3 lg:p-4 bg-vscode-bg">
            <div className="text-sm font-medium text-vscode-text/70 mb-2">Preview:</div>
            <div className="flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full mr-2 lg:mr-3 flex-shrink-0" style={{ backgroundColor: formData.color }}></div>
              <div className="mr-2 lg:mr-3 flex-shrink-0" style={{ color: formData.color }}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons.find(i => i.value === formData.icon)?.svg || icons[0].svg} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm lg:text-base font-medium text-vscode-text truncate">
                  {formData.name || 'Topic Name'}
                </div>
                <div className="text-xs lg:text-sm text-vscode-text/50 truncate">
                  {formData.description || 'No description'}
                </div>
              </div>
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
              Create Topic
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Topic Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
              placeholder="e.g., React Development"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors resize-none touch-target"
              placeholder="Brief description of this topic"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Folder Path
            </label>
            <input
              type="text"
              value={formData.folderPath}
              onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
              className="w-full px-3 py-3 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors touch-target"
              placeholder={`/${formData.name || 'topic-name'}`}
            />
            <p className="text-xs text-vscode-text/50 mt-1 font-medium">
              Leave empty to use topic name as folder path
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all touch-target ${
                    formData.color === color
                      ? 'border-white scale-110'
                      : 'border-vscode-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 lg:gap-3">
              {icons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  className={`p-2 lg:p-3 rounded border transition-colors touch-target ${
                    formData.icon === icon.value
                      ? 'border-vscode-accent bg-vscode-accent/20 text-vscode-accent'
                      : 'border-vscode-border hover:border-vscode-accent/50 text-vscode-text/70'
                  }`}
                  title={icon.label}
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.svg} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-vscode-text/70 mb-3">
              Privacy
            </label>
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.isPublic ? 'bg-green-400' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-vscode-text">
                    {formData.isPublic ? 'Public Topic' : 'Private Topic'}
                  </span>
                  <div className={`p-1 rounded ${
                    formData.isPublic ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {formData.isPublic ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      )}
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-vscode-text/50">
                  {formData.isPublic 
                    ? 'Anyone with the link can view this topic and its content'
                    : 'Only you can view this topic'
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="border border-vscode-border rounded-md p-3 lg:p-4 bg-vscode-bg">
            <div className="text-sm font-medium text-vscode-text/70 mb-2">Preview:</div>
            <div className="flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full mr-2 lg:mr-3 flex-shrink-0" style={{ backgroundColor: formData.color }}></div>
              <div className="mr-2 lg:mr-3 flex-shrink-0" style={{ color: formData.color }}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons.find(i => i.value === formData.icon)?.svg || icons[0].svg} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm lg:text-base font-medium text-vscode-text truncate">
                  {formData.name || 'Topic Name'}
                </div>
                <div className="text-xs lg:text-sm text-vscode-text/50 truncate">
                  {formData.description || 'No description'}
                </div>
              </div>
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
              Create Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
