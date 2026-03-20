'use client';

import React, { useMemo, useState } from 'react';
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

  const allTags = useMemo(() => Array.from(new Set(notes.flatMap((note) => note.tags))).sort(), [notes]);

  const filteredNotes = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return notes.filter((note) => {
      const matchesSearch =
        !query || note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
      const matchesTag = !selectedTag || note.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, searchTerm, selectedTag]);

  const toggleExpand = (noteId: string) => {
    setExpandedNote((prev) => (prev === noteId ? null : noteId));
  };

  if (notes.length === 0) {
    return (
      <div className="mobile-scroll-container flex h-full items-center justify-center p-6">
        <div className="surface-soft w-full max-w-xl py-12 text-center">
          <p className="text-base font-semibold text-secondary-100">No notes yet</p>
          <p className="mt-1 text-sm text-secondary-400">Create notes to capture summaries, formulas, and references.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-scroll-container h-full px-4 py-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-5xl space-y-4">
        <section className="surface p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-secondary-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search notes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-secondary-700 bg-secondary-950/70 py-2.5 pl-9 pr-3 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
              />
            </label>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 md:justify-end">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    !selectedTag
                      ? 'bg-primary-500 text-white'
                      : 'border border-secondary-700 bg-secondary-900 text-secondary-300 hover:bg-secondary-800'
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary-500 text-white'
                        : 'border border-secondary-700 bg-secondary-900 text-secondary-300 hover:bg-secondary-800'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          {filteredNotes.map((note) => {
            const expanded = expandedNote === note.id;

            return (
              <article key={note.id} className="surface p-4">
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-secondary-100">{note.title}</h3>
                    <p className="mt-0.5 text-xs text-secondary-500">
                      Created {format(note.createdAt, 'MMM d, yyyy')} • Updated {format(note.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleExpand(note.id)}
                      className="touch-target rounded-md p-1.5 text-secondary-400 hover:bg-secondary-800 hover:text-secondary-200"
                      title={expanded ? 'Collapse note' : 'Expand note'}
                    >
                      <svg
                        className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {onEdit && (
                      <button
                        onClick={() => onEdit(note)}
                        className="touch-target rounded-md p-1.5 text-secondary-400 hover:bg-secondary-800 hover:text-primary-300"
                        title="Edit note"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(note.id)}
                        className="touch-target rounded-md p-1.5 text-secondary-400 hover:bg-accent-500/10 hover:text-accent-300"
                        title="Delete note"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </header>

                {note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="rounded-md border border-primary-500/35 bg-primary-500/10 px-2 py-1 text-xs text-primary-200"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-3 text-sm leading-relaxed text-secondary-300 whitespace-pre-wrap">
                  {expanded || note.content.length <= 260 ? note.content : `${note.content.slice(0, 260)}...`}
                </div>
              </article>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="surface-soft py-10 text-center">
              <p className="text-sm font-semibold text-secondary-200">No notes match your filters</p>
              <p className="mt-1 text-xs text-secondary-400">Try another keyword or clear the tag filter.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NoteList;
