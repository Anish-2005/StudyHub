'use client';

import React, { useMemo, useState } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTaskModal from '../modals/CreateTaskModal';

interface TaskListProps {
  tasks: Task[];
  topicId?: string;
  topicName?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, topicId, topicName }) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter((task) => !task.completed);
    if (filter === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }, [filter, tasks]);

  const stats = useMemo(() => {
    const pending = tasks.filter((task) => !task.completed).length;
    const completed = tasks.filter((task) => task.completed).length;
    const overdue = tasks.filter((task) => !task.completed && task.dueDate && task.dueDate < new Date()).length;
    return { pending, completed, overdue };
  }, [tasks]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !completed,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const resolvedTopicId = topicId || taskData.topicId;
    if (!resolvedTopicId) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        topicId: resolvedTopicId,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityClass = (priority: Task['priority']) => {
    if (priority === 'high') return 'bg-accent-500/15 text-accent-300 border-accent-500/35';
    if (priority === 'medium') return 'bg-warning-500/15 text-warning-200 border-warning-500/35';
    return 'bg-success-500/15 text-success-200 border-success-500/35';
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="border-b border-secondary-700/70 bg-secondary-900/65 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-secondary-100 md:text-xl" style={{ fontFamily: 'var(--font-sora)' }}>
                Tasks
              </h2>
              <p className="text-sm text-secondary-400">
                {topicName ? `Tracking work in ${topicName}` : 'Track and complete your study actions'}
              </p>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="btn-primary touch-target">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 md:max-w-md">
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Pending</p>
              <p className="text-lg font-semibold text-warning-200">{stats.pending}</p>
            </div>
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Completed</p>
              <p className="text-lg font-semibold text-success-200">{stats.completed}</p>
            </div>
            <div className="surface-soft px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-secondary-500">Overdue</p>
              <p className="text-lg font-semibold text-accent-200">{stats.overdue}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-1.5 rounded-lg border border-secondary-700 bg-secondary-900 p-1">
            {(['all', 'pending', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`touch-target flex-1 rounded-md px-3 py-2 text-xs font-semibold capitalize transition-colors md:text-sm ${
                  filter === filterOption
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-scroll-container flex-1 px-4 py-4 md:px-6 md:py-5">
          {filteredTasks.length === 0 ? (
            <div className="surface-soft mx-auto max-w-2xl py-12 text-center">
              <p className="text-base font-semibold text-secondary-100">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </p>
              <p className="mt-1 text-sm text-secondary-400">
                {filter === 'all' ? 'Create a task to start tracking progress.' : 'Switch filters to view other tasks.'}
              </p>
              {filter === 'all' && (
                <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-5">
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-5xl space-y-3">
              {filteredTasks.map((task) => (
                <article
                  key={task.id}
                  className={`surface p-4 transition-colors ${task.completed ? 'opacity-70' : 'hover:border-primary-500/40'}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`touch-target mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        task.completed
                          ? 'border-success-500 bg-success-500 text-white'
                          : 'border-secondary-600 bg-secondary-800 text-transparent hover:border-primary-500'
                      }`}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className={`text-sm font-semibold md:text-base ${task.completed ? 'line-through text-secondary-500' : 'text-secondary-100'}`}>
                          {task.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="touch-target rounded-md p-1.5 text-secondary-400 hover:bg-accent-500/10 hover:text-accent-300"
                            title="Delete task"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && <p className="mt-1.5 text-sm leading-relaxed text-secondary-400">{task.description}</p>}

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-secondary-500">
                        <span className="rounded-md bg-secondary-800 px-2 py-1">Created {task.createdAt.toLocaleDateString()}</span>
                        {task.dueDate && (
                          <span
                            className={`rounded-md px-2 py-1 ${
                              task.dueDate < new Date() && !task.completed
                                ? 'bg-accent-500/15 text-accent-200'
                                : 'bg-secondary-800'
                            }`}
                          >
                            Due {task.dueDate.toLocaleDateString()}
                          </span>
                        )}
                        {task.tags?.map((tag) => (
                          <span key={tag} className="rounded-md border border-primary-500/35 bg-primary-500/10 px-2 py-1 text-primary-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          topicId={topicId}
        />
      )}
    </>
  );
};

export default TaskList;

