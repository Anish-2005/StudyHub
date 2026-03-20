'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Topic } from '@/types';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateTopicModal from '../modals/CreateTopicModal';
import SidebarCollapsed from './sidebar/SidebarCollapsed';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarTopicsSection from './sidebar/SidebarTopicsSection';

interface SidebarProps {
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedTopic,
  onTopicSelect,
  collapsed,
  onToggleCollapse,
  isMobile = false,
}) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTopics([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'topics'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        createdAt: entry.data().createdAt?.toDate(),
        updatedAt: entry.data().updatedAt?.toDate(),
      })) as Topic[];

      setTopics(topicsData.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateTopic = async (topicData: Omit<Topic, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'topics'), {
        ...topicData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      await deleteDoc(doc(db, 'topics', topicId));
      if (selectedTopic?.id === topicId) {
        onTopicSelect(null);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  if (collapsed && !isMobile) {
    return (
      <SidebarCollapsed
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={onTopicSelect}
        onToggleCollapse={onToggleCollapse}
        onCreateTopic={() => setShowCreateModal(true)}
        loading={loading}
        user={user}
      />
    );
  }

  return (
    <>
      <aside
        className={`
          ${isMobile ? 'w-[84vw] max-w-[340px]' : 'w-[340px]'}
          h-full border-r border-secondary-700/70 bg-secondary-900/95
          backdrop-blur-xl
        `}
      >
        <SidebarHeader onToggleCollapse={onToggleCollapse} isMobile={isMobile} />

        <SidebarTopicsSection
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicSelect={onTopicSelect}
          onDeleteTopic={handleDeleteTopic}
          onCreateTopic={() => setShowCreateModal(true)}
          loading={loading}
        />
      </aside>

      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTopic}
        />
      )}
    </>
  );
};

export default Sidebar;
