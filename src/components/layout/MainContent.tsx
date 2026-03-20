'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Topic, Task, Reminder } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TopicDashboard from '../topics/TopicDashboard';
import AllTopicsView from '../topics/AllTopicsView';

interface MainContentProps {
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  searchQuery?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedTopic,
  onTopicSelect,
  searchQuery = '',
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setReminders([]);
      setLoading(false);
      return;
    }

    const unsubscribes: (() => void)[] = [];

    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        createdAt: entry.data().createdAt?.toDate(),
        updatedAt: entry.data().updatedAt?.toDate(),
        dueDate: entry.data().dueDate?.toDate(),
        reminderDate: entry.data().reminderDate?.toDate(),
      })) as Task[];

      const filteredTasks = selectedTopic
        ? tasksData.filter((task) => task.topicId === selectedTopic.id)
        : tasksData;

      setTasks(
        filteredTasks.sort((a, b) => {
          const aTime = a.createdAt?.getTime() ?? 0;
          const bTime = b.createdAt?.getTime() ?? 0;
          return bTime - aTime;
        }),
      );
    });

    unsubscribes.push(unsubscribeTasks);

    const remindersQuery = query(collection(db, 'reminders'), where('userId', '==', user.uid));
    const unsubscribeReminders = onSnapshot(remindersQuery, (snapshot) => {
      const remindersData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        date: entry.data().date?.toDate(),
        createdAt: entry.data().createdAt?.toDate(),
      })) as Reminder[];

      const filteredReminders = selectedTopic
        ? remindersData.filter((reminder) => reminder.topicId === selectedTopic.id)
        : remindersData;

      setReminders(
        filteredReminders.sort((a, b) => {
          const aTime = a.date?.getTime() ?? 0;
          const bTime = b.date?.getTime() ?? 0;
          return aTime - bTime;
        }),
      );

      setLoading(false);
    });

    unsubscribes.push(unsubscribeReminders);

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [user, selectedTopic]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    if (!normalizedQuery) return tasks;

    return tasks.filter((task) => {
      const inTitle = task.title.toLowerCase().includes(normalizedQuery);
      const inDescription = task.description?.toLowerCase().includes(normalizedQuery);
      const inTags = task.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      return inTitle || inDescription || inTags;
    });
  }, [tasks, normalizedQuery]);

  const filteredReminders = useMemo(() => {
    if (!normalizedQuery) return reminders;

    return reminders.filter((reminder) => {
      const inTitle = reminder.title.toLowerCase().includes(normalizedQuery);
      const inDescription = reminder.description?.toLowerCase().includes(normalizedQuery);
      return inTitle || inDescription;
    });
  }, [reminders, normalizedQuery]);

  if (loading) {
    return (
      <div className="motion-fade-up flex h-full items-center justify-center bg-secondary-900/60">
        <div className="surface-soft motion-scale-in flex items-center gap-3 px-4 py-3 text-sm text-secondary-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          Syncing workspace...
        </div>
      </div>
    );
  }

  return (
    <section className="motion-fade-up h-full overflow-hidden bg-secondary-900/55">
      {selectedTopic ? (
        <TopicDashboard topic={selectedTopic} tasks={filteredTasks} reminders={filteredReminders} />
      ) : (
        <AllTopicsView
          tasks={filteredTasks}
          reminders={filteredReminders}
          onTopicSelect={onTopicSelect}
          searchQuery={searchQuery}
        />
      )}
    </section>
  );
};

export default MainContent;

