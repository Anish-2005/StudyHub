'use client';

import React, { useState, useEffect } from 'react';
import { Task, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CreateTaskModalProps {
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  topicId?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onSubmit, topicId }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    topicId: topicId || '',
    dueDate: '',
    reminderDate: '',
    tags: '',
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
    if (!formData.title.trim() || !formData.topicId) return;

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      reminderDate: formData.reminderDate ? new Date(formData.reminderDate) : undefined,
      topicId: formData.topicId,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-vscode-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-semibold text-vscode-text">Create New Task</h2>
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
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              placeholder="What needs to be done?"
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
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-vscode-text/70 mb-2">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-vscode-text/70 mb-2">
                Reminder
              </label>
              <input
                type="datetime-local"
                value={formData.reminderDate}
                onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-mono text-vscode-text/70 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-mono focus:outline-none focus:border-vscode-accent transition-colors"
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-vscode-text/50 mt-1 font-mono">
              Separate tags with commas
            </p>
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
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
