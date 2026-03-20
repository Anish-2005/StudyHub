'use client';

import React from 'react';
import { Note } from '@/types';
import NoteList from '../notes/NoteList';

interface TopicNotesTabProps {
  notes: Note[];
  topic: { name: string };
  onDeleteNote: (noteId: string) => void;
}

const TopicNotesTab: React.FC<TopicNotesTabProps> = ({ notes, topic, onDeleteNote }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-secondary-700/70 bg-secondary-900/65 px-4 py-4 md:px-6">
        <h2 className="text-lg font-semibold text-secondary-100 md:text-xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Notes
        </h2>
        <p className="text-sm text-secondary-400">Reference notes and study snippets for {topic.name}</p>
      </div>

      <div className="min-h-0 flex-1">
        <NoteList notes={notes} onDelete={onDeleteNote} />
      </div>
    </div>
  );
};

export default TopicNotesTab;
