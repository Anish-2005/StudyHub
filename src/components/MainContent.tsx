'use client';

import React, { useState, useEffect } from 'react';
import { Topic, Task, Reminder } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TopicDashboard from './TopicDashboard';
import AllTopicsView from './AllTopicsView';

interface MainContentProps {
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedTopic,
  onTopicSelect,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribes: (() => void)[] = [];

    // Subscribe to tasks - simplified query without composite indexes
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
        reminderDate: doc.data().reminderDate?.toDate(),
      })) as Task[];

      // Filter by topic and sort client-side to avoid composite indexes
      const filteredTasks = selectedTopic
        ? tasksData
            .filter(task => task.topicId === selectedTopic.id)
            .sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              return b.createdAt.getTime() - a.createdAt.getTime();
            })
        : tasksData.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.getTime() - a.createdAt.getTime();
          });

      setTasks(filteredTasks);
    });

    unsubscribes.push(unsubscribeTasks);

    // Subscribe to reminders - simplified query without composite indexes
    const remindersQuery = query(
      collection(db, 'reminders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeReminders = onSnapshot(remindersQuery, (snapshot) => {
      const remindersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Reminder[];

      // Filter by topic and sort client-side to avoid composite indexes
      const filteredReminders = selectedTopic
        ? remindersData
            .filter(reminder => reminder.topicId === selectedTopic.id)
            .sort((a, b) => {
              if (!a.date || !b.date) return 0;
              return a.date.getTime() - b.date.getTime();
            })
        : remindersData.sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return a.date.getTime() - b.date.getTime();
          });

      setReminders(filteredReminders);
      setLoading(false);
    });

    unsubscribes.push(unsubscribeReminders);

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [user, selectedTopic]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-vscode-bg min-h-0">
        <div className="text-center p-6">
          <div className="w-8 h-8 border-2 border-vscode-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-vscode-text font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-vscode-bg min-h-0 overflow-hidden h-full">
      {selectedTopic ? (
        <TopicDashboard 
          topic={selectedTopic}
          tasks={tasks}
          reminders={reminders}
        />
      ) : (
        <AllTopicsView 
          tasks={tasks}
          reminders={reminders}
          onTopicSelect={onTopicSelect}
        />
      )}
    </div>
  );
};

export default MainContent;
