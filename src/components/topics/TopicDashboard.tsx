'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from '../tasks/TaskList';
import ReminderList from '../reminders/ReminderList';
import NoteList from '../notes/NoteList';
import CreateTaskModal from '../modals/CreateTaskModal';
import CreateReminderModal from '../modals/CreateReminderModal';
import CreateNoteModal from '../modals/CreateNoteModal';
import ShareModal from '../modals/ShareModal';
import toast from 'react-hot-toast';

interface TopicDashboardProps {
  topic: Topic;
  tasks: Task[];
  reminders: Reminder[];
  isPublicView?: boolean;
}

const TopicDashboard: React.FC<TopicDashboardProps> = ({
  topic,
  tasks,
  reminders,
  isPublicView = false,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reminders' | 'notes'>('overview');
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateReminderModal, setShowCreateReminderModal] = useState(false);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Subscribe to notes for this topic
  useEffect(() => {
    if (!user) return;

    // Use simple query with only userId, then filter by topicId client-side
    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Note[];

      // Filter by topicId and sort client-side to avoid composite index requirement
      const topicNotes = notesData
        .filter(note => note.topicId === topic.id)
        .sort((a, b) => {
          if (!a.updatedAt || !b.updatedAt) return 0;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });

      setNotes(topicNotes);
    });

    return () => unsubscribe();
  }, [user, topic.id]);

  // Handle creating tasks
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        topicId: topic.id,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      toast.success('Task created successfully!');
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

  // Handle creating reminders
  const handleCreateReminder = async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        topicId: topic.id,
        userId: user.uid,
        date: Timestamp.fromDate(reminderData.date),
        createdAt: Timestamp.fromDate(new Date()),
      });

      toast.success('Reminder created successfully!');
      setShowCreateReminderModal(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder. Please try again.');
    }
  };

  // Handle creating notes
  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      toast.success('Note created successfully!');
      setShowCreateNoteModal(false);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  };

  // Handle deleting notes
  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  // Handle privacy toggle
  const handleTogglePrivacy = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'topics', topic.id), {
        isPublic: !topic.isPublic,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      toast.success(`Topic is now ${!topic.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast.error('Failed to update privacy setting');
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Pull to refresh functionality
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current || isRefreshing) return;
    
    const touch = e.touches[0];
    const scrollTop = scrollContainerRef.current.scrollTop;
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = Math.abs(touch.clientX - touchStartX.current);
    
    // Only trigger pull-to-refresh if at top and vertical swipe
    if (scrollTop === 0 && deltaY > 0 && deltaX < 30) {
      e.preventDefault();
      const distance = Math.min(deltaY * 0.5, 100);
      setPullDistance(distance);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      // Simulate refresh - in real app, refetch data
      setTimeout(() => {
        setIsRefreshing(false);
        toast.success('Refreshed!', { duration: 1500, icon: '✨' });
      }, 1500);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing]);

  // Tab swipe gesture
  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
    { id: 'notes', name: 'Notes', count: notes.length },
  ] as const;

  const handleTabSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  }, [activeTab, tabs]);

  const handleContentTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleContentTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleTabSwipe('right');
      } else {
        handleTabSwipe('left');
      }
    }
  }, [handleTabSwipe]);

  const getTopicIcon = (icon: string) => {
    const icons: { [key: string]: JSX.Element } = {
      book: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      code: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      science: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      math: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      language: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      default: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };

    return icons[icon] || icons.default;
  };

  return (
    <div className="flex flex-col h-full md:overflow-hidden">
      {/* Mobile Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="md:hidden absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200"
          style={{ 
            height: `${pullDistance}px`,
            opacity: pullDistance / 60,
          }}
        >
          <div 
            className="text-primary-500 dark:text-vscode-accent"
            style={{
              transform: `rotate(${pullDistance * 3.6}deg)`,
              transition: 'transform 0.1s'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      )}

      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="md:hidden absolute top-4 left-0 right-0 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-secondary-800 rounded-full px-4 py-2 shadow-lg flex items-center space-x-2 animate-fade-in">
            <div className="animate-spin">
              <svg className="w-4 h-4 text-primary-500 dark:text-vscode-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-secondary-200 dark:border-vscode-border bg-gradient-to-b from-white to-secondary-50/50 dark:from-vscode-sidebar dark:to-vscode-sidebar md:flex-shrink-0">
        <div className="p-3 md:p-4">
          {/* Topic Info */}
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <div 
              className="p-2 md:p-3 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
            >
              <div className="w-6 h-6 md:w-8 md:h-8">
                {getTopicIcon(topic.icon)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-lg md:text-xl font-bold text-secondary-900 dark:text-vscode-text truncate">
                  {topic.name}
                </h1>
                {!isPublicView && (
                  <div className="flex items-center space-x-2">
                    {/* Privacy Toggle */}
                    <button
                      onClick={handleTogglePrivacy}
                      className={`p-1.5 rounded-md transition-colors ${
                        topic.isPublic 
                          ? 'bg-success-500/10 text-success-600 dark:text-success-400' 
                          : 'bg-secondary-300 dark:bg-gray-400/10 text-secondary-600 dark:text-gray-400'
                      }`}
                      title={topic.isPublic ? 'Public - Anyone can view' : 'Private - Only you can view'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {topic.isPublic ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        )}
                      </svg>
                    </button>
                    
                    {/* Share Button */}
                    {topic.isPublic && (
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="p-1.5 rounded-md bg-primary-500/10 dark:bg-vscode-accent/10 text-primary-600 dark:text-vscode-accent hover:bg-primary-500/20 dark:hover:bg-vscode-accent/20 transition-colors"
                        title="Share topic"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                {isPublicView && (
                  <span className="px-2 py-1 bg-success-500/10 text-success-600 dark:text-success-400 text-xs font-mono rounded">
                    Public
                  </span>
                )}
              </div>
              <div className="text-xs md:text-sm text-secondary-500 dark:text-vscode-text/50">
                {completionPercentage}% Complete • {tasks.length} Tasks • {reminders.length} Reminders
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mb-3 md:mb-4">
              <div className="w-full bg-secondary-200 dark:bg-vscode-bg rounded-full h-1.5 md:h-2">
                <div 
                  className="h-1.5 md:h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${completionPercentage}%`,
                    backgroundColor: topic.color 
                  }}
                />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="relative">
            {/* Tab indicator for swipe */}
            <div className="md:hidden absolute -bottom-1 left-0 right-0 flex justify-center space-x-1 pb-1">
              {tabs.map((tab, index) => (
                <div 
                  key={tab.id}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    activeTab === tab.id ? 'w-8 bg-primary-500 dark:bg-vscode-accent' : 'w-1.5 bg-secondary-300 dark:bg-secondary-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex space-x-1 bg-secondary-100 dark:bg-vscode-bg rounded-lg p-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-md font-mono text-xs md:text-sm transition-all whitespace-nowrap touch-target active:scale-95 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 dark:bg-vscode-accent text-white shadow-lg shadow-primary-500/30'
                    : 'text-secondary-700 dark:text-vscode-text/70 hover:text-secondary-900 dark:hover:text-vscode-text hover:bg-secondary-200 dark:hover:bg-vscode-active'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-secondary-300 dark:bg-vscode-active text-secondary-700 dark:text-vscode-text/50'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {/* Mobile: Single scrollable container with swipe */}
        <div 
          className="md:hidden h-full"
          onTouchStart={handleContentTouchStart}
          onTouchEnd={handleContentTouchEnd}
        >
          {activeTab === 'overview' && (
            <div 
              ref={scrollContainerRef}
              className="h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ paddingTop: pullDistance > 0 ? `${pullDistance}px` : '0' }}
            >
              <div className="p-4 space-y-4">
                  {/* Recent Tasks */}
                  <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-vscode-accent dark:to-vscode-accent/90 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">Tasks</h3>
                            <p className="text-xs text-white/80">Recent activity</p>
                          </div>
                        </div>
                        {tasks.length > 0 && (
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-sm font-bold text-white">{tasks.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {tasks.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-secondary-100 dark:bg-vscode-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-secondary-400 dark:text-vscode-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-secondary-500 dark:text-vscode-text/50">No tasks yet</p>
                          <p className="text-xs text-secondary-400 dark:text-vscode-text/30 mt-1">Create your first task to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {tasks.slice(0, 5).map((task, index) => (
                            <div 
                              key={task.id} 
                              className="group bg-secondary-50 dark:bg-vscode-bg rounded-2xl p-3 active:scale-98 transition-all duration-200"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                                    task.completed ? 'bg-success-500/20' : 
                                    task.priority === 'high' ? 'bg-red-500/20' :
                                    task.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                                  }`}>
                                    {task.completed ? (
                                      <svg className="w-3 h-3 text-success-600 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full ${
                                        task.priority === 'high' ? 'bg-red-500' :
                                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                      }`} />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium leading-snug ${
                                    task.completed ? 'line-through text-secondary-400 dark:text-vscode-text/40' : 'text-secondary-900 dark:text-vscode-text'
                                  }`}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                      task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                                      task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                                      'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                    }`}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                    {task.tags && task.tags.length > 0 && (
                                      <span className="text-xs text-secondary-400 dark:text-vscode-text/40">•</span>
                                    )}
                                    {task.tags && task.tags.slice(0, 1).map(tag => (
                                      <span key={tag} className="text-xs text-secondary-500 dark:text-vscode-text/50 truncate">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Reminders */}
                  <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-warning-500 to-orange-500 dark:from-vscode-warning dark:to-orange-500/90 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">Reminders</h3>
                            <p className="text-xs text-white/80">Coming up</p>
                          </div>
                        </div>
                        {upcomingReminders.length > 0 && (
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-sm font-bold text-white">{upcomingReminders.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {upcomingReminders.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-secondary-100 dark:bg-vscode-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-secondary-400 dark:text-vscode-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-secondary-500 dark:text-vscode-text/50">No reminders set</p>
                          <p className="text-xs text-secondary-400 dark:text-vscode-text/30 mt-1">Add reminders to stay on track</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {upcomingReminders.slice(0, 5).map((reminder, index) => (
                            <div 
                              key={reminder.id} 
                              className="group bg-secondary-50 dark:bg-vscode-bg rounded-2xl p-3 active:scale-98 transition-all duration-200"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-5 h-5 rounded-lg bg-warning-500/20 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-secondary-900 dark:text-vscode-text leading-snug">
                                    {reminder.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex items-center text-xs text-secondary-500 dark:text-vscode-text/50">
                                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {reminder.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <span className="text-secondary-300 dark:text-vscode-text/30">•</span>
                                    <div className="flex items-center text-xs text-secondary-500 dark:text-vscode-text/50">
                                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Study Insights */}
                  <div className="bg-white dark:bg-vscode-sidebar rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 p-5">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-success-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-secondary-900 dark:text-white">Progress</h3>
                        <p className="text-xs text-secondary-500 dark:text-vscode-text/50">Your stats</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-vscode-accent/10 dark:to-vscode-accent/5 rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-vscode-accent mb-0.5">
                          {Math.ceil((new Date().getTime() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs font-medium text-primary-600/70 dark:text-vscode-accent/70">Days</div>
                      </div>
                      <div className="bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-500/10 dark:to-success-500/5 rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-0.5">
                          {completedTasks.length}
                        </div>
                        <div className="text-xs font-medium text-success-600/70 dark:text-success-400/70">Completed</div>
                      </div>
                      <div className="bg-gradient-to-br from-warning-50 to-warning-100/50 dark:from-warning-500/10 dark:to-warning-500/5 rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-0.5">
                          {upcomingReminders.length}
                        </div>
                        <div className="text-xs font-medium text-warning-600/70 dark:text-warning-400/70">Pending</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg">
              <div className="sticky top-0 z-10 p-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-vscode-accent dark:to-vscode-accent/90 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-white">All Tasks</h2>
                    <p className="text-xs text-white/80">{topic.name}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm font-bold text-white">{tasks.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <TaskList tasks={tasks} />
              </div>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg">
              <div className="sticky top-0 z-10 p-4 bg-gradient-to-r from-warning-500 to-orange-500 dark:from-vscode-warning dark:to-orange-500/90 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-white">All Reminders</h2>
                    <p className="text-xs text-white/80">{topic.name}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm font-bold text-white">{reminders.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <ReminderList reminders={reminders} />
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg">
              <div className="sticky top-0 z-10 p-4 bg-gradient-to-r from-success-500 to-emerald-500 dark:from-vscode-success dark:to-emerald-500/90 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-white">All Notes</h2>
                    <p className="text-xs text-white/80">{topic.name}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm font-bold text-white">{notes.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <NoteList notes={notes} onDelete={handleDeleteNote} />
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button (Mobile Only) */}
        {!isPublicView && (
          <>
            <button
              onClick={() => setShowActionSheet(true)}
              className="md:hidden fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-vscode-accent dark:via-vscode-accent dark:to-vscode-accent/90 text-white rounded-2xl shadow-2xl shadow-primary-500/50 dark:shadow-vscode-accent/50 flex items-center justify-center transition-all duration-300 active:scale-90 hover:shadow-3xl"
              style={{ boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.6)' }}
              aria-label="Add new item"
            >
              <div className="relative">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </button>

            {/* Action Sheet (Mobile Bottom Sheet) */}
            {showActionSheet && (
              <div 
                className="md:hidden fixed inset-0 z-50 animate-fade-in"
                onClick={() => setShowActionSheet(false)}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 rounded-t-3xl shadow-2xl animate-slide-up-sheet"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
                  </div>
                  
                  <div className="p-6 pb-8">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">Create New</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">Choose what you'd like to add to {topic.name}</p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowCreateTaskModal(true);
                          setShowActionSheet(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-vscode-accent/10 dark:to-vscode-accent/5 border border-primary-200 dark:border-vscode-accent/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
                      >
                        <div className="w-12 h-12 bg-primary-500 dark:bg-vscode-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-active:scale-90 transition-transform">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-secondary-900 dark:text-white">New Task</div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">Add a task to track</div>
                        </div>
                        <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          setShowCreateReminderModal(true);
                          setShowActionSheet(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-warning-50 to-warning-100/50 dark:from-vscode-warning/10 dark:to-vscode-warning/5 border border-warning-200 dark:border-vscode-warning/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
                      >
                        <div className="w-12 h-12 bg-warning-500 dark:bg-vscode-warning rounded-xl flex items-center justify-center shadow-lg shadow-warning-500/30 group-active:scale-90 transition-transform">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-secondary-900 dark:text-white">New Reminder</div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">Set a reminder</div>
                        </div>
                        <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          setShowCreateNoteModal(true);
                          setShowActionSheet(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-success-50 to-success-100/50 dark:from-vscode-success/10 dark:to-vscode-success/5 border border-success-200 dark:border-vscode-success/20 rounded-2xl hover:shadow-md transition-all duration-200 active:scale-98 touch-target group"
                      >
                        <div className="w-12 h-12 bg-success-500 dark:bg-vscode-success rounded-xl flex items-center justify-center shadow-lg shadow-success-500/30 group-active:scale-90 transition-transform">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-secondary-900 dark:text-white">New Note</div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">Write a note</div>
                        </div>
                        <svg className="w-5 h-5 text-secondary-400 dark:text-secondary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => setShowActionSheet(false)}
                      className="w-full mt-4 py-3.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium rounded-2xl hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors touch-target"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Desktop: Split layout with scrollable content */}
        <div className="hidden md:block h-full">
          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
              <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <div className="bg-secondary-50 dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
                    Recent Tasks
                  </h3>
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No tasks yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="p-2 bg-white dark:bg-vscode-bg rounded border border-secondary-200 dark:border-vscode-border">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              task.completed ? 'bg-success-500 dark:bg-vscode-success' : 
                              task.priority === 'high' ? 'bg-accent-500 dark:bg-red-400' :
                              task.priority === 'medium' ? 'bg-warning-500 dark:bg-yellow-400' : 'bg-success-500 dark:bg-green-400'
                            }`}></div>
                            <div className="flex-1">
                              <div className={`text-sm font-mono ${
                                task.completed ? 'line-through text-secondary-400 dark:text-vscode-text/50' : 'text-secondary-900 dark:text-vscode-text'
                              }`}>
                                {task.title}
                              </div>
                              <div className="text-xs text-vscode-text/50">
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Reminders */}
                <div className="bg-white dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
                    Upcoming Reminders
                  </h3>
                  {upcomingReminders.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No upcoming reminders</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {upcomingReminders.slice(0, 5).map((reminder) => (
                        <div key={reminder.id} className="p-2 bg-white dark:bg-vscode-bg rounded border border-secondary-200 dark:border-vscode-border">
                          <div className="text-sm font-mono text-secondary-900 dark:text-vscode-text">{reminder.title}</div>
                          <div className="text-xs text-secondary-500 dark:text-vscode-text/50">
                            {reminder.date.toLocaleDateString()} at {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Study Insights */}
              <div className="mt-6 bg-secondary-50 dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
                <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
                  Study Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-primary-600 dark:text-vscode-accent mb-1">
                      {Math.ceil((new Date().getTime() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm font-mono text-secondary-600 dark:text-vscode-text/70">Days studying</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-success-600 dark:text-vscode-success mb-1">
                      {completedTasks.length}
                    </div>
                    <div className="text-sm font-mono text-secondary-600 dark:text-vscode-text/70">Tasks completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-warning-600 dark:text-vscode-warning mb-1">
                      {upcomingReminders.length}
                    </div>
                    <div className="text-sm font-mono text-secondary-600 dark:text-vscode-text/70">Upcoming reminders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="p-4 border-b border-secondary-200 dark:border-vscode-border bg-white dark:bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-vscode-text">Tasks for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="px-4 py-2 bg-primary-500 dark:bg-vscode-accent text-white font-medium rounded-md hover:bg-primary-600 dark:hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            </div>
            <TaskList tasks={tasks} />
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="p-4 border-b border-secondary-200 dark:border-vscode-border bg-white dark:bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-vscode-text">Reminders for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateReminderModal(true)}
                    className="px-4 py-2 bg-primary-500 dark:bg-vscode-accent text-white font-medium rounded-md hover:bg-primary-600 dark:hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Add Reminder</span>
                  </button>
                )}
              </div>
            </div>
            <ReminderList reminders={reminders} />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full overflow-y-auto p-6 mobile-scroll-container">
            <div className="p-4 border-b border-secondary-200 dark:border-vscode-border bg-white dark:bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-vscode-text">Notes for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateNoteModal(true)}
                    className="px-4 py-2 bg-primary-500 dark:bg-vscode-accent text-white font-medium rounded-md hover:bg-primary-600 dark:hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Note</span>
                  </button>
                )}
              </div>
            </div>
            <NoteList notes={notes} onDelete={handleDeleteNote} />
          </div>
        )}
        </div>
      </div>

      {/* Modals */}
      {!isPublicView && (
        <>
          {showCreateTaskModal && (
            <CreateTaskModal
              onClose={() => setShowCreateTaskModal(false)}
              onSubmit={handleCreateTask}
              topicId={topic.id}
            />
          )}

          {showCreateReminderModal && (
            <CreateReminderModal
              onClose={() => setShowCreateReminderModal(false)}
              onSubmit={handleCreateReminder}
              topicId={topic.id}
            />
          )}

          {showCreateNoteModal && (
            <CreateNoteModal
              onClose={() => setShowCreateNoteModal(false)}
              onSubmit={handleCreateNote}
              topicId={topic.id}
            />
          )}

          {showShareModal && (
            <ShareModal
              topic={{
                name: topic.name,
                isPublic: topic.isPublic,
              }}
              username={user?.displayName || ''}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TopicDashboard;
