'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTaskModal from '../modals/CreateTaskModal';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

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
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-secondary-500 dark:text-vscode-text/50';
    }
  };

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
    <>
      <div className="h-full flex flex-col">
        {/* Header - Mobile Optimized */}
        <div className="p-4 md:p-8 border-b border-secondary-200 dark:border-secondary-700/50 bg-gradient-to-r from-white to-secondary-50 dark:from-secondary-800 dark:to-secondary-800/50">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-secondary-900 dark:text-secondary-100">Tasks</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full md:w-auto px-4 py-3 md:px-6 md:py-3 bg-primary-500 text-white font-semibold text-sm md:text-base rounded-lg hover:bg-primary-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center touch-target"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Filters - Mobile Optimized */}
          <div className="flex space-x-2 bg-secondary-100 dark:bg-secondary-800/50 rounded-xl p-1.5 md:p-2 overflow-x-auto backdrop-blur-sm border border-secondary-200 dark:border-secondary-700/50">
            {(['all', 'pending', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`flex-shrink-0 px-3 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 capitalize whitespace-nowrap touch-target ${
                  filter === filterOption
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-700/50'
                }`}
              >
                {filterOption}
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  filter === filterOption
                    ? 'bg-white/30 dark:bg-white/20 text-white'
                    : 'bg-secondary-300 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-400'
                }`}>
                  {filterOption === 'all' 
                    ? tasks.length 
                    : filterOption === 'pending' 
                    ? tasks.filter(t => !t.completed).length
                    : tasks.filter(t => t.completed).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List - Mobile Optimized */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary-50/50 dark:bg-transparent">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-base md:text-lg font-mono text-secondary-500 dark:text-vscode-text/50 mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </p>
              <p className="text-sm text-secondary-400 dark:text-vscode-text/30 mb-4 px-4">
                {filter === 'all' ? 'Create your first task to get started' : `Switch to "All" to see all tasks`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-primary-500 text-white font-mono text-sm rounded-md hover:bg-primary-600 transition-colors touch-target"
                >
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-5 max-w-5xl mx-auto">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group p-4 md:p-8 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700/50 rounded-xl md:rounded-2xl transition-all duration-200 hover:shadow-lg hover:border-primary-500/30 dark:hover:border-primary-500/30 ${
                    task.completed ? 'opacity-60' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start space-x-3 md:space-x-5">
                    {/* Checkbox - Mobile Optimized */}
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`mt-1 w-6 h-6 md:w-6 md:h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 touch-target group-hover:scale-110 ${
                        task.completed
                          ? 'bg-success-500 border-success-500 text-white shadow-md'
                          : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Task Content - Mobile Optimized */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 md:mb-4 gap-2">
                        <h3 className={`font-semibold text-sm md:text-lg leading-snug ${
                          task.completed ? 'line-through text-secondary-500 dark:text-secondary-500' : 'text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center justify-between md:justify-end space-x-2 md:space-x-3">
                          {/* Priority - Mobile Optimized */}
                          <div className={`flex items-center px-3 py-1.5 rounded-lg border ${getPriorityColor(task.priority)} ${
                            task.priority === 'high' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' :
                            task.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30' :
                            'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'
                          }`}>
                            {getPriorityIcon(task.priority)}
                            <span className="text-xs md:text-sm font-semibold ml-1.5 capitalize">{task.priority}</span>
                          </div>

                          {/* Actions - Mobile Optimized */}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 md:p-2.5 text-secondary-400 dark:text-secondary-500 hover:text-accent-500 dark:hover:text-accent-400 transition-all duration-200 hover:bg-accent-50 dark:hover:bg-accent-500/10 rounded-lg touch-target"
                          >
                            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm md:text-base mb-3 md:mb-4 leading-relaxed ${
                          task.completed ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-600 dark:text-secondary-400'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Meta info - Mobile Optimized */}
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 md:space-x-6 text-xs md:text-sm text-secondary-500 dark:text-secondary-400 pt-3 md:pt-4 border-t border-secondary-200 dark:border-secondary-700/50">
                        <span className="font-medium flex items-center">
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Created {task.createdAt.toLocaleDateString()}
                        </span>
                        {task.dueDate && (
                          <span className={`font-medium flex items-center ${
                            task.dueDate < new Date() && !task.completed
                              ? 'text-accent-500 dark:text-accent-400'
                              : ''
                          }`}>
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Due {task.dueDate.toLocaleDateString()}
                          </span>
                        )}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                            {task.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30 rounded-lg text-xs md:text-sm font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </>
  );
};

export default TaskList;
