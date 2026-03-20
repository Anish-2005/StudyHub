'use client';

import React from 'react';
import { Task } from '@/types';
import TaskList from '../tasks/TaskList';

interface TopicTasksTabProps {
  tasks: Task[];
  topic: { id: string; name: string };
  highlightedTaskId?: string | null;
  getTaskShareLink?: (task: Task) => string | null;
}

const TopicTasksTab: React.FC<TopicTasksTabProps> = ({
  tasks,
  topic,
  highlightedTaskId,
  getTaskShareLink,
}) => {
  return (
    <div className="h-full">
      <TaskList
        tasks={tasks}
        topicId={topic.id}
        topicName={topic.name}
        highlightedTaskId={highlightedTaskId}
        getTaskShareLink={getTaskShareLink}
      />
    </div>
  );
};

export default TopicTasksTab;
