'use client';

import React from 'react';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`group p-4 md:p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      task.completed
        ? 'bg-secondary-50 dark:bg-secondary-800/30 border-secondary-200 dark:border-secondary-700/30'
        : 'bg-white dark:bg-secondary-800/60 border-secondary-200 dark:border-secondary-700/50 hover:border-secondary-300 dark:hover:border-secondary-600/50'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id, task.completed)}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-500 dark:hover:border-primary-400'
          }`}
        >
          {task.completed && (
            <svg className="w-4 h-4 m-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-base md:text-lg transition-all duration-200 ${
              task.completed
                ? 'text-secondary-500 dark:text-secondary-400 line-through'
                : 'text-secondary-900 dark:text-secondary-100'
            }`}>
              {task.title}
            </h3>

            {/* Priority Badge */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${
              task.priority === 'high'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/30'
                : task.priority === 'medium'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30'
                : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30'
            }`}>
              {getPriorityIcon(task.priority)}
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm md:text-base mb-3 ${
              task.completed
                ? 'text-secondary-400 dark:text-secondary-500'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}>
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-100 dark:bg-secondary-700/50 text-secondary-700 dark:text-secondary-300 rounded-md text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs md:text-sm text-secondary-500 dark:text-secondary-400">
            <div className="flex items-center space-x-4">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due {task.dueDate.toLocaleDateString()}</span>
                </div>
              )}

              {task.reminderDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Reminder {task.reminderDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;