'use client';

import React, { useState } from 'react';
import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author' | 'library';

interface LibraryViewProps {
  stories: Story[];
  onNavigate: (page: Page, id?: string) => void;
  onTipClick: (story: Story) => void;
  onLike: (id: string) => void;
}

function storagePercent(hours: number, max: number) {
  if (max === 0) return 0;
  return Math.min(100, Math.round((hours / max) * 100));
}

function getStatusBadge(status: string, hours: number) {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] border border-[var(--accent-forest)]/20 shadow-sm animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-forest)]" />
          Active Deal
        </span>
      );
    case 'EXPIRING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-ochre)]/10 text-[var(--accent-ochre)] border border-[var(--accent-ochre)]/20 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-ochre)]" />
          Expiring ({hours}h left)
        </span>
      );
    case 'EXPIRED':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-clay)]/10 text-[var(--accent-clay)] border border-[var(--accent-clay)]/20 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-clay)]" />
          Decayed
        </span>
      );
  }
}

export function LibraryView({ stories, onNavigate, onTipClick, onLike }: LibraryViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'decayed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'tips'>('recent');

  const filtered = stories
    .filter(s => {
      if (filter === 'active') return s.status !== 'EXPIRED';
      if (filter === 'decayed') return s.status === 'EXPIRED';
      return true;
    })
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes;
      if (sortBy === 'tips') return b.tipsUSDFC - a.tipsUSDFC;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-[var(--text-primary)] mb-2">
          Digital Library & Showcase
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Explore and read manuscripts pinned directly to Filecoin. Keep storage leases active by tipping authors.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8 pb-4 border-b border-[var(--border-strong)]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author, tag…"
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] bg-[var(--bg-card)] font-serif shadow-sm transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Status Filter */}
          <div className="flex rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] p-0.5 overflow-hidden shadow-sm">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'active', label: 'Active Leases' },
              { id: 'decayed', label: 'Decayed Void' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-[var(--accent-forest)]/10 text-[var(--accent-forest)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] px-3 py-1 text-[10px] font-bold text-[var(--text-secondary)] shadow-sm">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="recent">Newest</option>
              <option value="popular">Most Liked</option>
              <option value="tips">Most Tipped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-inner">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-[var(--text-primary)] font-bold font-serif text-lg">No books found in this category</p>
          <p className="text-[var(--text-secondary)] text-xs mt-1">Try resetting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(story => {
            const pct = storagePercent(story.hoursRemaining, story.maxHours);
            const isCoverGradient = story.coverImage?.startsWith('linear');

            return (
              <div
                key={story.id}
                className="group rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Book Cover Top area */}
                <div
                  onClick={() => onNavigate('story', story.id)}
                  className="h-48 overflow-hidden relative cursor-pointer group-hover:opacity-95 transition-opacity duration-300"
                  style={{ background: isCoverGradient ? story.coverImage : undefined }}
                >
                  {!isCoverGradient && story.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Spine effect */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent border-r border-white/5" />
                  {/* Status Badge overlay */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(story.status, story.hoursRemaining)}
                  </div>
                  {/* Title overlay for gradients */}
                  {isCoverGradient && (
                    <div className="absolute inset-0 p-5 flex flex-col justify-between bg-black/10 text-white font-serif">
                      <span className="text-[8px] tracking-widest font-sans font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full w-max">
                        {story.chapters && story.chapters.length > 1 ? `${story.chapters.length} Chapters` : 'Short Story'}
                      </span>
                      <h3 className="text-lg font-bold leading-tight">{story.title}</h3>
                    </div>
                  )}
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    <div className="flex gap-1 mb-2.5 flex-wrap">
                      {story.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] font-bold text-[var(--accent-forest)] bg-[var(--accent-forest)]/5 px-2 py-0.5 rounded-md border border-[var(--accent-forest)]/10 uppercase tracking-wider">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {!isCoverGradient && (
                      <h3
                        onClick={() => onNavigate('story', story.id)}
                        className="text-base font-bold font-serif text-[var(--text-primary)] mb-1 hover:text-[var(--accent-forest)] transition-colors cursor-pointer truncate"
                      >
                        {story.title}
                      </h3>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[14px]">{story.authorAvatar || '✍️'}</span>
                      <span
                        onClick={() => onNavigate('author', story.authorFull)}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer font-bold"
                      >
                        {story.author}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4 font-medium">
                      {story.content.replace(/[#*`!\[\]()]/g, '').slice(0, 120)}...
                    </p>
                  </div>

                  <div>
                    {/* Storage Life bar */}
                    {story.status !== 'EXPIRED' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-medium mb-1">
                          <span>Storage Deal Health</span>
                          <span className="font-bold">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-black/5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: story.status === 'EXPIRING' ? 'var(--accent-ochre)' : 'var(--accent-forest)'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stats footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--border-strong)] text-[11px] text-[var(--text-secondary)] font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onLike(story.id)}
                          className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                        >
                          <svg className={`w-3.5 h-3.5 ${story.isLikedByUser ? 'text-rose-600 fill-current' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{story.likes}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>{story.views}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onTipClick(story)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] hover:bg-[var(--accent-forest)]/20 transition-all font-bold cursor-pointer"
                      >
                        <span>🪙</span>
                        <span>${story.tipsUSDFC.toFixed(1)} USDFC</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
