'use client';

import React, { useState, useEffect } from 'react';
import { Reminder, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CreateReminderModalProps {
  onClose: () => void;
  onSubmit: (reminder: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => void;
  topicId?: string;
}

const CreateReminderModal: React.FC<CreateReminderModalProps> = ({ onClose, onSubmit, topicId }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'study' as 'task' | 'study' | 'review',
    topicId: topicId || '',
  });

  useEffect(() => {
    if (!user) return;

    const fetchTopics = async () => {
      const q = query(collection(db, 'topics'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Topic[];
      setTopics(topicsData);
    };

    fetchTopics();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.topicId) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: new Date(formData.date),
      type: formData.type,
      topicId: formData.topicId,
      completed: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-vscode-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-semibold text-vscode-text">Create New Reminder</h2>
            <button
              onClick={onClose}
              className="p-1 text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-mono text-vscode-text/70 mb-2">
              Reminder Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              placeholder="What do you want to be reminded about?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-vscode-text/70 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors resize-none"
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-vscode-text/70 mb-2">
                Topic *
              </label>
              <select
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
                required
              >
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-vscode-text/70 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              >
                <option value="study">Study Session</option>
                <option value="review">Review</option>
                <option value="task">Task Reminder</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-mono text-vscode-text/70 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              required
            />
          </div>

          {/* Preview */}
          <div className="border border-vscode-border rounded-md p-3 bg-vscode-bg">
            <div className="text-sm font-mono text-vscode-text/70 mb-2">Preview:</div>
            <div className="flex items-center space-x-2">
              <div className={`${
                formData.type === 'study' ? 'text-green-400' :
                formData.type === 'review' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {formData.type === 'study' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  ) : formData.type === 'review' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  )}
                </svg>
              </div>
              <div>
                <div className="text-sm font-mono text-vscode-text">
                  {formData.title || 'Reminder Title'}
                </div>
                <div className="text-xs text-vscode-text/50">
                  {formData.date ? new Date(formData.date).toLocaleString() : 'Select date & time'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-mono text-vscode-text/70 hover:text-vscode-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-vscode-accent text-white font-mono text-sm rounded-md hover:bg-vscode-accent/80 transition-colors"
            >
              Create Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReminderModal;
