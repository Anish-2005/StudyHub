'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTaskModal from '../modals/CreateTaskModal';
import CreateReminderModal from '../modals/CreateReminderModal';
import CreateNoteModal from '../modals/CreateNoteModal';
import ShareModal from '../modals/ShareModal';
import TopicDashboardHeader from './dashboard/TopicDashboardHeader';
import TopicDashboardActionSheet from './dashboard/TopicDashboardActionSheet';
import TopicDashboardContent from './dashboard/TopicDashboardContent';
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

  // Tab swipe gesture
  const tabs = useMemo(() => [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'tasks', name: 'Tasks', count: tasks.length },
    { id: 'reminders', name: 'Reminders', count: reminders.length },
    { id: 'notes', name: 'Notes', count: notes.length },
  ] as const, [tasks.length, reminders.length, notes.length]);

  const handleTabSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  }, [activeTab, tabs]);

  // Touch handlers for content component
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
  }, []);

  const handleTouchMove = useCallback((_e: React.TouchEvent) => {
    // Touch handling moved to TopicDashboardContent
  }, []);

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
      {/* Header */}
      <TopicDashboardHeader
        topic={topic}
        tasks={tasks}
        reminders={reminders}
        notes={notes}
        activeTab={activeTab}
        isPublicView={isPublicView}
        onTabChange={setActiveTab}
        onTogglePrivacy={handleTogglePrivacy}
        onShare={() => setShowShareModal(true)}
      />

      {/* Content */}
      <TopicDashboardContent
        topic={topic}
        tasks={tasks}
        reminders={reminders}
        notes={notes}
        activeTab={activeTab}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        isPublicView={isPublicView}
        onCreateTask={() => setShowActionSheet(true)}
        onCreateNote={() => setShowActionSheet(true)}
        onDeleteNote={handleDeleteNote}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTabSwipe={handleTabSwipe}
      />

      {/* Action Sheet */}
      <TopicDashboardActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onCreateTask={() => {
          setShowCreateTaskModal(true);
          setShowActionSheet(false);
        }}
        onCreateReminder={() => {
          setShowCreateReminderModal(true);
          setShowActionSheet(false);
        }}
        onCreateNote={() => {
          setShowCreateNoteModal(true);
          setShowActionSheet(false);
        }}
        topicName={topic.name}
      />

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
