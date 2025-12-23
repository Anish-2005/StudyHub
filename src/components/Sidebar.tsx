'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Topic } from '@/types';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TopicItem from './TopicItem';
import CreateTopicModal from './CreateTopicModal';
import UserMenu from './UserMenu';

interface SidebarProps {
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  showMobileSidebar?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedTopic,
  onTopicSelect,
  collapsed,
  onToggleCollapse,
  isMobile = false,
  showMobileSidebar = false,
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
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col">
        <button
          onClick={onToggleCollapse}
          className="p-3 text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active transition-colors touch-target"
          title="Expand Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`
        ${isMobile ? 'w-80 max-w-[85vw]' : 'w-80'} 
        bg-secondary-800/95 backdrop-blur-xl border-r border-secondary-700/50 flex flex-col h-full shadow-professional-xl
        ${isMobile ? 'safe-area-inset-top' : ''}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-secondary-700/50 bg-gradient-to-r from-secondary-800/50 to-secondary-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                StudyHub
              </h1>
            </div>
            {!isMobile && (
              <button
                onClick={onToggleCollapse}
                className="p-2 text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50 rounded-lg transition-all duration-200 touch-target"
                title="Collapse Sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
            {isMobile && (
              <button
                onClick={onToggleCollapse}
                className="p-2 text-secondary-400 hover:text-secondary-200 hover:bg-secondary-700/50 rounded-lg transition-all duration-200 touch-target"
                title="Close Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <UserMenu />
        </div>

        {/* Topics Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-vscode-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-vscode-text/70 uppercase tracking-wider">
                Topics
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1.5 text-vscode-text/70 hover:text-vscode-accent hover:bg-vscode-active rounded transition-colors touch-target"
                title="Create New Topic"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => onTopicSelect(null)}
              className={`w-full text-left p-3 rounded-lg font-medium text-sm transition-colors touch-target ${
                !selectedTopic
                  ? 'bg-vscode-accent text-white shadow-professional'
                  : 'text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v1H8V5z" />
                </svg>
                <span className="font-medium">All Topics</span>
              </div>
            </button>
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-vscode-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-vscode-text/50">Loading topics...</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-vscode-text/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-vscode-text mb-2">No topics yet</h3>
                <p className="text-sm text-vscode-text/60 mb-4">Create your first study topic to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-vscode-accent text-white rounded-lg hover:bg-vscode-accent/80 transition-colors font-medium touch-target"
                >
                  Create Topic
                </button>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {topics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    isSelected={selectedTopic?.id === topic.id}
                    onSelect={() => onTopicSelect(topic)}
                    onDelete={() => handleDeleteTopic(topic.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
