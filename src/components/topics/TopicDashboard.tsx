'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Topic, Task, Reminder, Note } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTaskModal from '../modals/CreateTaskModal';
import CreateReminderModal from '../modals/CreateReminderModal';
import CreateNoteModal from '../modals/CreateNoteModal';
import ShareModal from '../modals/ShareModal';
import TopicDashboardHeader from './dashboard/TopicDashboardHeader';
import TopicDashboardActionSheet from './dashboard/TopicDashboardActionSheet';
import TopicDashboardContent from './dashboard/TopicDashboardContent';
import toast from 'react-hot-toast';
import { ShareTab, getTaskShareUrl } from '@/utils/slug';

interface TopicDashboardProps {
  topic: Topic;
  tasks: Task[];
  reminders: Reminder[];
  isPublicView?: boolean;
  initialTab?: ShareTab;
  highlightedTaskId?: string | null;
  shareUsername?: string;
}

const TopicDashboard: React.FC<TopicDashboardProps> = ({
  topic,
  tasks,
  reminders,
  isPublicView = false,
  initialTab = 'overview',
  highlightedTaskId = null,
  shareUsername,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reminders' | 'notes'>(initialTab);
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
  const resolvedShareUsername = shareUsername || user?.displayName || '';

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const notesQuery = query(collection(db, 'notes'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        createdAt: entry.data().createdAt?.toDate(),
        updatedAt: entry.data().updatedAt?.toDate(),
      })) as Note[];

      const topicNotes = notesData
        .filter((note) => note.topicId === topic.id)
        .sort((a, b) => {
          const aTime = a.updatedAt?.getTime() ?? 0;
          const bTime = b.updatedAt?.getTime() ?? 0;
          return bTime - aTime;
        });

      setNotes(topicNotes);
    });

    return () => unsubscribe();
  }, [user, topic.id]);

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

      toast.success('Task created successfully');
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

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

      toast.success('Reminder created successfully');
      setShowCreateReminderModal(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder. Please try again.');
    }
  };

  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      toast.success('Note created successfully');
      setShowCreateNoteModal(false);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  };

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

  const tabs = useMemo(
    () => [
      { id: 'overview', name: 'Overview', count: null },
      { id: 'tasks', name: 'Tasks', count: tasks.length },
      { id: 'reminders', name: 'Reminders', count: reminders.length },
      { id: 'notes', name: 'Notes', count: notes.length },
    ] as const,
    [tasks.length, reminders.length, notes.length],
  );

  const handleTabSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (direction === 'left' && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      } else if (direction === 'right' && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1].id);
      }
    },
    [activeTab, tabs],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = Math.abs(touch.clientX - touchStartX.current);

    if (deltaY <= 0 || deltaX > 60) return;
    setPullDistance(Math.min(90, deltaY * 0.35));
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);

      setTimeout(() => {
        setIsRefreshing(false);
        toast.success('Workspace refreshed');
      }, 1200);
      return;
    }

    setPullDistance(0);
  }, [isRefreshing, pullDistance]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const getTaskShareLink = useCallback(
    (task: Task) => {
      if (!topic.isPublic || !resolvedShareUsername) return null;
      return getTaskShareUrl(resolvedShareUsername, topic.name, task.id);
    },
    [topic.isPublic, topic.name, resolvedShareUsername],
  );

  const taskShareLinkBuilder = topic.isPublic && resolvedShareUsername ? getTaskShareLink : undefined;

  return (
    <div className="motion-fade-up flex h-full flex-col overflow-hidden">
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

      <TopicDashboardContent
        topic={topic}
        tasks={tasks}
        reminders={reminders}
        notes={notes}
        activeTab={activeTab}
        highlightedTaskId={highlightedTaskId}
        getTaskShareLink={taskShareLinkBuilder}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        isPublicView={isPublicView}
        onCreateTask={() => setShowActionSheet(true)}
        onDeleteNote={handleDeleteNote}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTabSwipe={handleTabSwipe}
      />

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
              username={resolvedShareUsername}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TopicDashboard;

