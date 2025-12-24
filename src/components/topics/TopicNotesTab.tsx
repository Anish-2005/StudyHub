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
    <>
      {/* Mobile */}
      <div className="md:hidden h-full overflow-y-auto mobile-scroll-container bg-secondary-50/50 dark:bg-vscode-bg">
        <div className="sticky top-0 z-10 p-4 bg-gradient-to-r from-success-500 to-emerald-500 dark:from-vscode-success dark:to-emerald-500/90 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">All Notes</h2>
              <p className="text-xs text-white/80">{topic.name}</p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-sm font-bold text-white">{notes.length}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <NoteList notes={notes} onDelete={onDeleteNote} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block h-full overflow-y-auto p-6 mobile-scroll-container">
        <div className="p-4 border-b border-secondary-200 dark:border-vscode-border bg-white dark:bg-vscode-sidebar mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-vscode-text">Notes for {topic.name}</h2>
            <button className="px-4 py-2 bg-primary-500 dark:bg-vscode-accent text-white font-medium rounded-md hover:bg-primary-600 dark:hover:bg-vscode-accent/80 transition-colors touch-target flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Note</span>
            </button>
          </div>
        </div>
        <NoteList notes={notes} onDelete={onDeleteNote} />
      </div>
    </>
  );
};

export default TopicNotesTab;