'use client';

import React, { useState, useEffect } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskList from './TaskList';
import ReminderList from './ReminderList';
import NoteList from './NoteList';
import CreateTaskModal from './CreateTaskModal';
import CreateReminderModal from './CreateReminderModal';
import CreateNoteModal from './CreateNoteModal';
import ShareModal from './ShareModal';
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

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
    { id: 'notes', name: 'Notes', count: notes.length },
  ] as const;

  return (
    <div className="flex flex-col h-full md:overflow-hidden">
      {/* Header */}
      <div className="border-b border-vscode-border bg-vscode-sidebar md:flex-shrink-0">
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
                <h1 className="text-lg md:text-xl font-bold text-vscode-text truncate">
                  {topic.name}
                </h1>
                {!isPublicView && (
                  <div className="flex items-center space-x-2">
                    {/* Privacy Toggle */}
                    <button
                      onClick={handleTogglePrivacy}
                      className={`p-1.5 rounded-md transition-colors ${
                        topic.isPublic 
                          ? 'bg-green-400/10 text-green-400' 
                          : 'bg-gray-400/10 text-gray-400'
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
                        className="p-1.5 rounded-md bg-vscode-accent/10 text-vscode-accent hover:bg-vscode-accent/20 transition-colors"
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
                  <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs font-mono rounded">
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
          <div className="flex space-x-1 bg-secondary-100 dark:bg-vscode-bg rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-md font-mono text-xs md:text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white dark:bg-vscode-accent dark:text-white'
                    : 'text-secondary-700 dark:text-vscode-text/70 hover:text-secondary-900 dark:hover:text-vscode-text hover:bg-secondary-200 dark:hover:bg-vscode-active'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-secondary-900/20 dark:bg-white/20 text-secondary-900 dark:text-white'
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

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {/* Mobile: Single scrollable container */}
        <div className="md:hidden h-full">
          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto p-4 mobile-scroll-container">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 gap-4">
                  {/* Recent Tasks */}
                  <div className="bg-secondary-50 dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
                    <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
                      Recent Tasks
                    </h3>
                    {tasks.length === 0 ? (
                      <div className="text-center py-6">
                        <svg className="w-10 h-10 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No tasks yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="p-3 bg-vscode-bg rounded border border-vscode-border">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                task.completed ? 'bg-vscode-success' : 
                                task.priority === 'high' ? 'bg-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-mono truncate ${
                                  task.completed ? 'line-through text-vscode-text/50' : 'text-vscode-text'
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
                  <div className="bg-secondary-50 dark:bg-vscode-sidebar border border-secondary-200 dark:border-vscode-border rounded-lg p-4">
                    <h3 className="text-lg font-mono font-semibold text-secondary-900 dark:text-vscode-text mb-4">
                      Upcoming Reminders
                    </h3>
                    {upcomingReminders.length === 0 ? (
                      <div className="text-center py-6">
                        <svg className="w-10 h-10 mx-auto text-secondary-400 dark:text-vscode-text/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-mono text-secondary-500 dark:text-vscode-text/50">No upcoming reminders</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {upcomingReminders.slice(0, 5).map((reminder) => (
                          <div key={reminder.id} className="p-3 bg-vscode-bg rounded border border-vscode-border">
                            <div className="text-sm font-mono text-vscode-text truncate">{reminder.title}</div>
                            <div className="text-xs text-vscode-text/50">
                              {reminder.date.toLocaleDateString()} at {reminder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Study Insights */}
                  <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
                    <h3 className="text-lg font-mono font-semibold text-vscode-text mb-4">
                      Study Insights
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-vscode-accent mb-1">
                          {Math.ceil((new Date().getTime() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs font-mono text-vscode-text/70">Days studying</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-vscode-success mb-1">
                          {completedTasks.length}
                        </div>
                        <div className="text-xs font-mono text-vscode-text/70">Tasks completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-vscode-warning mb-1">
                          {upcomingReminders.length}
                        </div>
                        <div className="text-xs font-mono text-vscode-text/70">Upcoming reminders</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="h-full overflow-y-auto p-4 mobile-scroll-container">
              <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-lg font-semibold text-vscode-text">Tasks for {topic.name}</h2>
                  {!isPublicView && (
                    <button
                      onClick={() => setShowCreateTaskModal(true)}
                      className="w-full px-4 py-3 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center justify-center space-x-2"
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
            <div className="h-full overflow-y-auto p-4 mobile-scroll-container">
              <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-lg font-semibold text-vscode-text">Reminders for {topic.name}</h2>
                  {!isPublicView && (
                    <button
                      onClick={() => setShowCreateReminderModal(true)}
                      className="w-full px-4 py-3 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center justify-center space-x-2"
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
            <div className="h-full overflow-y-auto p-4 mobile-scroll-container">
              <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-lg font-semibold text-vscode-text">Notes for {topic.name}</h2>
                  {!isPublicView && (
                    <button
                      onClick={() => setShowCreateNoteModal(true)}
                      className="w-full px-4 py-3 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center justify-center space-x-2"
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
                        <div key={task.id} className="p-2 bg-vscode-bg rounded border border-vscode-border">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              task.completed ? 'bg-vscode-success' : 
                              task.priority === 'high' ? 'bg-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                            <div className="flex-1">
                              <div className={`text-sm font-mono ${
                                task.completed ? 'line-through text-vscode-text/50' : 'text-vscode-text'
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
                <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
                  <h3 className="text-lg font-mono font-semibold text-vscode-text mb-4">
                    Upcoming Reminders
                  </h3>
                  {upcomingReminders.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-mono text-vscode-text/50">No upcoming reminders</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {upcomingReminders.slice(0, 5).map((reminder) => (
                        <div key={reminder.id} className="p-2 bg-vscode-bg rounded border border-vscode-border">
                          <div className="text-sm font-mono text-vscode-text">{reminder.title}</div>
                          <div className="text-xs text-vscode-text/50">
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
            <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-vscode-text">Tasks for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="px-4 py-2 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
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
            <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-vscode-text">Reminders for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateReminderModal(true)}
                    className="px-4 py-2 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
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
            <div className="p-4 border-b border-vscode-border bg-vscode-sidebar mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-vscode-text">Notes for {topic.name}</h2>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateNoteModal(true)}
                    className="px-4 py-2 bg-vscode-accent text-white font-medium rounded-md hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2"
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
