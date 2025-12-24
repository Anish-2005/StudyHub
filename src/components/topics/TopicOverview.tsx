'use client';

import React from 'react';
import { Task, Reminder, Note } from '@/types';
import TaskList from '../tasks/TaskList';
import ReminderList from '../reminders/ReminderList';
import NoteList from '../notes/NoteList';
import StudyStats from '../ui/StudyStats';

interface TopicOverviewProps {
  tasks: Task[];
  reminders: Reminder[];
  notes: Note[];
  topicName: string;
}

const TopicOverview: React.FC<TopicOverviewProps> = ({
  tasks,
  reminders,
  notes,
  topicName,
}) => {
  const upcomingReminders = reminders.filter(reminder => !reminder.completed && reminder.date > new Date());

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Topic Statistics</h3>
          <p className="card-description">Your progress in {topicName}</p>
        </div>
        <StudyStats topics={[]} tasks={tasks} reminders={reminders} />
      </div>

      {/* Recent Tasks */}
      {tasks.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
            <p className="card-description">Your latest tasks for this topic</p>
          </div>
          <TaskList tasks={tasks.slice(0, 5)} />
        </div>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Reminders</h3>
            <p className="card-description">Don&apos;t miss important dates</p>
          </div>
          <ReminderList reminders={upcomingReminders.slice(0, 5)} />
        </div>
      )}

      {/* Recent Notes */}
      {notes.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Notes</h3>
            <p className="card-description">Your latest study notes</p>
          </div>
          <NoteList notes={notes.slice(0, 3)} />
        </div>
      )}
    </div>
  );
};

export default TopicOverview;