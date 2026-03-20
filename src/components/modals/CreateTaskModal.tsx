'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Task, Topic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
      const topicsData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
      })) as Topic[];
      setTopics(topicsData.sort((a, b) => a.name.localeCompare(b.name)));
    };

    fetchTopics();
  }, [user]);

  const selectedTopicName = useMemo(() => {
    if (!topicId) return '';
    const topic = topics.find((item) => item.id === topicId);
    return topic?.name || 'Selected Topic';
  }, [topicId, topics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.topicId) return;

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

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
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-2 motion-fade-up sm:items-center sm:p-6">
      <div className="surface motion-scale-in max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-secondary-700/70 bg-secondary-900/95 px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-secondary-100 md:text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
                Create Task
              </h2>
              <p className="text-xs text-secondary-400">Define priority, timing, and context in one step.</p>
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
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="Add details"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Topic *</label>
              {topicId ? (
                <div className="rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100">
                  {selectedTopicName || 'Selected topic'}
                </div>
              ) : (
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">Select topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 focus:border-primary-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Due Date</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Reminder</label>
              <input
                type="datetime-local"
                value={formData.reminderDate}
                onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary-400">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 px-3 py-2.5 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              placeholder="topic, chapter-3, practice"
            />
            <p className="mt-1 text-xs text-secondary-500">Separate tags with commas.</p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-secondary-700/70 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

