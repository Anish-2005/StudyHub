'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Topic, Task, Reminder, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { decodeTopicFromUrl, decodeUsernameFromUrl } from '@/utils/slug';
import TopicDashboard from '@/components/TopicDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PublicTopicPageProps {}

const PublicTopicPage: React.FC<PublicTopicPageProps> = () => {
  const params = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicOwner, setTopicOwner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usernameParam = params.username as string;
  const topicParam = params.topic as string;
  const username = decodeUsernameFromUrl(usernameParam);
  const topicName = decodeTopicFromUrl(topicParam);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading topic for username:', username, 'topicName:', topicName);

        // First, find the user by displayName
        const usersQuery = query(
          collection(db, 'users'),
          where('displayName', '==', username)
        );

        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.empty) {
          console.log('User not found:', username);
          notFound();
          return;
        }

        const userDoc = usersSnapshot.docs[0];
        const userData = {
          uid: userDoc.id,
          ...userDoc.data(),
        } as User;

        console.log('Found user:', userData);
        setTopicOwner(userData);

        // Query public topics by this user
        const topicsQuery = query(
          collection(db, 'topics'),
          where('userId', '==', userData.uid),
          where('isPublic', '==', true)
        );

        const topicsSnapshot = await getDocs(topicsQuery);
        
        if (topicsSnapshot.empty) {
          console.log('No public topics found for user');
          notFound();
          return;
        }

        // Find the topic with matching name
        const matchingTopic = topicsSnapshot.docs.find(doc => {
          const topicData = doc.data();
          return topicData.name === topicName;
        });

        if (!matchingTopic) {
          console.log('Topic not found:', topicName, 'Available topics:', topicsSnapshot.docs.map(doc => doc.data().name));
          notFound();
          return;
        }

        const topicData = {
          id: matchingTopic.id,
          ...matchingTopic.data(),
          createdAt: matchingTopic.data().createdAt?.toDate(),
          updatedAt: matchingTopic.data().updatedAt?.toDate(),
        } as Topic;

        console.log('Found topic:', topicData);
        setTopic(topicData);

        // Load tasks for this topic
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('topicId', '==', topicData.id)
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

          setTasks(tasksData);
        });

        // Load reminders for this topic
        const remindersQuery = query(
          collection(db, 'reminders'),
          where('topicId', '==', topicData.id)
        );

        const unsubscribeReminders = onSnapshot(remindersQuery, (snapshot) => {
          const remindersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            date: doc.data().date?.toDate(),
          })) as Reminder[];

          setReminders(remindersData);
        });

        return () => {
          unsubscribeTasks();
          unsubscribeReminders();
        };

      } catch (error) {
        console.error('Error loading topic:', error);
        setError('Failed to load topic');
      } finally {
        setLoading(false);
      }
    };

    if (username && topicName) {
      loadTopic();
    }
  }, [username, topicName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vscode-bg">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vscode-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vscode-text mb-4">Error</h1>
          <p className="text-vscode-text/70">{error}</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    notFound();
    return null;
  }

  // Check if this is the owner viewing their own topic
  const isOwner = user?.uid === topic.userId;

  return (
    <div className="min-h-screen bg-vscode-bg">
      {/* Public Topic Header */}
      {!isOwner && (
        <div className="bg-vscode-sidebar border-b border-vscode-border">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-vscode-accent/20 text-vscode-accent rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-vscode-text/70">
                  Viewing public topic by <span className="font-semibold text-vscode-text">{username}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Content */}
      <div className="max-w-6xl mx-auto">
        <TopicDashboard 
          topic={topic} 
          tasks={tasks} 
          reminders={reminders}
          isPublicView={!isOwner}
        />
      </div>
    </div>
  );
};

export default PublicTopicPage;
