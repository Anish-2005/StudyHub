'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Topic } from '@/types';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
    if (!user) return;

    const q = query(
      collection(db, 'topics'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
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
      <div className={`
        ${isMobile ? 'w-80 max-w-[85vw]' : 'w-80'} 
        bg-secondary-800/95 backdrop-blur-xl border-r border-secondary-700/50 flex flex-col h-full shadow-professional-xl
        ${isMobile ? 'safe-area-inset-top' : ''}
      `}>
        <SidebarHeader onToggleCollapse={onToggleCollapse} isMobile={isMobile} />

        <SidebarTopicsSection
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicSelect={onTopicSelect}
          onDeleteTopic={handleDeleteTopic}
          onCreateTopic={() => setShowCreateModal(true)}
          loading={loading}
        />
      </div>

      {/* Create Topic Modal */}

      {/* Create Topic Modal */}
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
