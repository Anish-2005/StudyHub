'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reminder, Task, Topic, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ShareTab, decodeTopicFromUrl, decodeUsernameFromUrl } from '@/utils/slug';
import TopicDashboard from '@/components/topics/TopicDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StudyHubLogo from '@/components/branding/StudyHubLogo';

const PublicTopicClient: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usernameParam = params.username as string;
  const topicParam = params.topic as string;
  const username = decodeUsernameFromUrl(usernameParam);
  const topicName = decodeTopicFromUrl(topicParam);
  const tabParam = searchParams.get('tab');
  const taskParam = searchParams.get('task');
  const initialTab: ShareTab =
    tabParam === 'tasks' || tabParam === 'reminders' || tabParam === 'notes'
      ? tabParam
      : 'overview';

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true);
        setError(null);

        const usersQuery = query(collection(db, 'users'), where('displayName', '==', username));
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
          notFound();
          return;
        }

        const userDoc = usersSnapshot.docs[0];
        const userData = {
          uid: userDoc.id,
          ...userDoc.data(),
        } as User;

        const topicsQuery = query(
          collection(db, 'topics'),
          where('userId', '==', userData.uid),
          where('isPublic', '==', true),
        );

        const topicsSnapshot = await getDocs(topicsQuery);
        if (topicsSnapshot.empty) {
          notFound();
          return;
        }

        const matchingTopic = topicsSnapshot.docs.find((entry) => entry.data().name === topicName);
        if (!matchingTopic) {
          notFound();
          return;
        }

        const topicData = {
          id: matchingTopic.id,
          ...matchingTopic.data(),
          createdAt: matchingTopic.data().createdAt?.toDate(),
          updatedAt: matchingTopic.data().updatedAt?.toDate(),
        } as Topic;

        setTopic(topicData);

        const tasksQuery = query(collection(db, 'tasks'), where('topicId', '==', topicData.id));
        const remindersQuery = query(collection(db, 'reminders'), where('topicId', '==', topicData.id));

        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          const tasksData = snapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
            createdAt: entry.data().createdAt?.toDate(),
            updatedAt: entry.data().updatedAt?.toDate(),
            dueDate: entry.data().dueDate?.toDate(),
            reminderDate: entry.data().reminderDate?.toDate(),
          })) as Task[];

          setTasks(tasksData);
        });

        const unsubscribeReminders = onSnapshot(remindersQuery, (snapshot) => {
          const remindersData = snapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
            createdAt: entry.data().createdAt?.toDate(),
            date: entry.data().date?.toDate(),
          })) as Reminder[];

          setReminders(remindersData);
        });

        return () => {
          unsubscribeTasks();
          unsubscribeReminders();
        };
      } catch (err) {
        console.error('Error loading topic:', err);
        setError('Failed to load this public topic.');
      } finally {
        setLoading(false);
      }
    };

    if (username && topicName) {
      loadTopic();
    }
  }, [topicName, username]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-soft w-full max-w-md p-6 text-center">
          <h1 className="text-xl font-semibold text-secondary-100">Error</h1>
          <p className="mt-2 text-sm text-secondary-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    notFound();
    return null;
  }

  const isOwner = user?.uid === topic.userId;

  return (
    <div className="h-screen overflow-hidden" style={{ height: '100dvh' }}>
      <div className="h-full p-0 md:p-4">
        <div className="app-shell h-full overflow-hidden">
          {!isOwner && (
            <div className="border-b border-secondary-700/70 bg-secondary-900/80 px-4 py-3 md:px-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-secondary-300">
                  Viewing public topic by <span className="font-semibold text-secondary-100">{username}</span>
                </p>
                <StudyHubLogo size={28} withWordmark={false} compact />
              </div>
            </div>
          )}

          <div className="h-full">
            <TopicDashboard
              topic={topic}
              tasks={tasks}
              reminders={reminders}
              isPublicView={!isOwner}
              initialTab={initialTab}
              highlightedTaskId={taskParam}
              shareUsername={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTopicClient;
