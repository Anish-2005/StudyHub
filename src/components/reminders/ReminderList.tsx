'use client';

import React, { useState } from 'react';
import { Reminder } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CreateReminderModal from '../modals/CreateReminderModal';
import ReminderListHeader from './components/ReminderListHeader';
import ReminderFilters from './components/ReminderFilters';
import ReminderItem from './components/ReminderItem';
import ReminderEmptyState from './components/ReminderEmptyState';

interface ReminderListProps {
  reminders: Reminder[];
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders }) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const now = new Date();
  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'upcoming') return !reminder.completed && reminder.date > now;
    if (filter === 'completed') return reminder.completed;
    return true;
  });

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'reminders', reminderId), {
        completed: !completed,
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleCreateReminder = async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId: user.uid,
        createdAt: new Date(),
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <ReminderListHeader onCreateReminder={() => setShowCreateModal(true)} />

        {/* Filters - Mobile Optimized */}
        <div className="px-4 md:px-6 pb-4">
          <ReminderFilters
            filter={filter}
            onFilterChange={setFilter}
            reminders={reminders}
          />
        </div>

        {/* Reminders List - Mobile Optimized */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredReminders.length === 0 ? (
            <ReminderEmptyState
              filter={filter}
              onCreateReminder={() => setShowCreateModal(true)}
            />
          ) : (
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
              {filteredReminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={handleToggleReminder}
                  onDelete={handleDeleteReminder}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Reminder Modal */}
      {showCreateModal && (
        <CreateReminderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateReminder}
        />
      )}
    </>
  );
};

export default ReminderList;
