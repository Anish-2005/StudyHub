'use client';

import React from 'react';
import { Reminder } from '@/types';
import ReminderList from '../reminders/ReminderList';

interface TopicRemindersTabProps {
  reminders: Reminder[];
  topic: { id: string; name: string };
}

const TopicRemindersTab: React.FC<TopicRemindersTabProps> = ({ reminders, topic }) => {
  return (
    <div className="h-full">
      <ReminderList reminders={reminders} topicId={topic.id} topicName={topic.name} />
    </div>
  );
};

export default TopicRemindersTab;
