'use client';

import React, { useState } from 'react';
import { Note } from '@/types';
import { format } from 'date-fns';

interface NoteListProps {
  notes: Note[];
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Filter notes based on search and tag
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleExpand = (noteId: string) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <svg className="w-16 h-16 text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-vscode-text mb-2">No notes yet</h3>
        <p className="text-sm text-vscode-text/60">Start taking notes to organize your thoughts and ideas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded-md text-vscode-text font-medium focus:outline-none focus:border-vscode-accent transition-colors"
        />
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                !selectedTag 
                  ? 'bg-vscode-accent text-white'
                  : 'bg-vscode-bg text-vscode-text/70 hover:text-vscode-text border border-vscode-border'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedTag === tag
                    ? 'bg-vscode-accent text-white'
                    : 'bg-vscode-bg text-vscode-text/70 hover:text-vscode-text border border-vscode-border'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4 hover:border-vscode-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-vscode-text mb-1 truncate">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-4 text-xs text-vscode-text/50">
                  <span>Created {format(note.createdAt, 'MMM d, yyyy')}</span>
                  <span>Updated {format(note.updatedAt, 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleExpand(note.id)}
                  className="p-1 text-vscode-text/70 hover:text-vscode-text hover:bg-vscode-active rounded transition-colors"
                  title={expandedNote === note.id ? 'Collapse' : 'Expand'}
                >
                  <svg className={`w-4 h-4 transition-transform ${expandedNote === note.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {onEdit && (
                  <button
                    onClick={() => onEdit(note)}
                    className="p-1 text-vscode-text/70 hover:text-vscode-accent hover:bg-vscode-active rounded transition-colors"
                    title="Edit note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-1 text-vscode-text/70 hover:text-vscode-error hover:bg-vscode-active rounded transition-colors"
                    title="Delete note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-vscode-accent/10 text-vscode-accent rounded text-xs cursor-pointer hover:bg-vscode-accent/20 transition-colors"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content Preview/Full */}
            <div className="text-sm text-vscode-text/80">
              {expandedNote === note.id ? (
                <div className="whitespace-pre-wrap">{note.content}</div>
              ) : (
                <div className="line-clamp-3">
                  {note.content.length > 200 
                    ? `${note.content.substring(0, 200)}...`
                    : note.content
                  }
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-vscode-text/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-vscode-text/50">No notes match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default NoteList;
