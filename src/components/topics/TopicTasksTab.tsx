'use client';

import React from 'react';
import { Task } from '@/types';
import TaskList from '../tasks/TaskList';

interface TopicTasksTabProps {
  tasks: Task[];
  topic: { id: string; name: string };
}

const TopicTasksTab: React.FC<TopicTasksTabProps> = ({ tasks, topic }) => {
  return (
    <div className="h-full">
      <TaskList tasks={tasks} topicId={topic.id} topicName={topic.name} />
    </div>
  );
};

export default TopicTasksTab;
