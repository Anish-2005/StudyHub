'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTaskModal from './CreateTaskModal';

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
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-vscode-text/50';
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
        <div className="p-4 md:p-6 border-b border-vscode-border bg-vscode-sidebar">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
            <h2 className="text-lg md:text-xl font-mono font-semibold text-vscode-text">Tasks</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full md:w-auto px-4 py-3 md:py-2 bg-vscode-accent text-white font-mono text-sm rounded-md hover:bg-vscode-accent/80 transition-colors flex items-center justify-center touch-target"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Filters - Mobile Optimized */}
          <div className="flex space-x-1 bg-vscode-bg rounded-lg p-1 overflow-x-auto">
            {(['all', 'pending', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`flex-shrink-0 px-3 md:px-4 py-2.5 md:py-2 rounded-md font-mono text-xs md:text-sm transition-all capitalize whitespace-nowrap touch-target ${
                  filter === filterOption
                    ? 'bg-vscode-accent text-white'
                    : 'text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active'
                }`}
              >
                {filterOption}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === filterOption
                    ? 'bg-white/20 text-white'
                    : 'bg-vscode-active text-vscode-text/50'
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
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-base md:text-lg font-mono text-vscode-text/50 mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </p>
              <p className="text-sm text-vscode-text/30 mb-4 px-4">
                {filter === 'all' ? 'Create your first task to get started' : `Switch to "All" to see all tasks`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-vscode-accent text-white font-mono text-sm rounded-md hover:bg-vscode-accent/80 transition-colors touch-target"
                >
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 md:p-6 bg-vscode-sidebar border border-vscode-border rounded-lg transition-all ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    {/* Checkbox - Mobile Optimized */}
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`mt-1 w-6 h-6 md:w-5 md:h-5 border-2 rounded flex items-center justify-center transition-colors touch-target ${
                        task.completed
                          ? 'bg-vscode-success border-vscode-success text-white'
                          : 'border-vscode-border hover:border-vscode-accent'
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
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-3">
                        <h3 className={`font-mono font-medium text-sm md:text-base mb-2 md:mb-0 ${
                          task.completed ? 'line-through text-vscode-text/50' : 'text-vscode-text'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center justify-between md:justify-end space-x-2">
                          {/* Priority - Mobile Optimized */}
                          <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span className="text-xs font-mono ml-1 capitalize">{task.priority}</span>
                          </div>

                          {/* Actions - Mobile Optimized */}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 md:p-1 text-vscode-text/50 hover:text-vscode-error transition-colors touch-target"
                          >
                            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm mb-3 leading-relaxed ${
                          task.completed ? 'text-vscode-text/40' : 'text-vscode-text/70'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Meta info - Mobile Optimized */}
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-vscode-text/50">
                        <span className="font-mono">
                          Created {task.createdAt.toLocaleDateString()}
                        </span>
                        {task.dueDate && (
                          <span className={`font-mono ${
                            task.dueDate < new Date() && !task.completed
                              ? 'text-vscode-error'
                              : ''
                          }`}>
                            Due {task.dueDate.toLocaleDateString()}
                          </span>
                        )}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 md:gap-2">
                            {task.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-vscode-active text-vscode-text/70 rounded-full text-xs font-mono"
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
