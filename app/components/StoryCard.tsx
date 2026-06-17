'use client';

import { useState } from 'react';
import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface StoryCardProps {
  story: Story;
  onLike: (id: string) => void;
  onTipClick: (story: Story) => void;
  onNavigate: (page: Page, id?: string) => void;
  delay?: number;
}

function storagePercent(hours: number, max: number) {
  if (max === 0) return 0;
  return Math.min(100, Math.round((hours / max) * 100));
}

function barColor(pct: number) {
  if (pct > 50) return 'var(--accent-forest)';
  if (pct > 20) return 'var(--accent-ochre)';
  return 'var(--accent-clay)';
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

export function StoryCard({ story, onLike, onTipClick, onNavigate, delay = 0 }: StoryCardProps) {
  const pct = storagePercent(story.hoursRemaining, story.maxHours);
  const isViral = story.likes >= 10000;
  const isExpired = story.status === 'EXPIRED';

  return (
    <article
      className="glass glass-hover rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Cover image */}
      <div
        className="h-44 w-full relative overflow-hidden cursor-pointer"
        style={{
          background: story.coverImage?.startsWith('linear')
            ? story.coverImage
            : 'linear-gradient(135deg, #eaddca, #c2b280)',
        }}
        onClick={() => onNavigate('story', story.id)}
      >
        {story.coverImage && !story.coverImage.startsWith('linear') && (
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
            story.status === 'ACTIVE'   ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-forest)] border border-[var(--accent-forest)]/30' :
            story.status === 'EXPIRING' ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-ochre)] border border-[var(--accent-ochre)]/30' :
                                          'bg-[var(--bg-primary)]/95 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30'
          }`}>
            {story.status === 'ACTIVE'   && `✅ ${Math.ceil(story.hoursRemaining / 24)}d active`}
            {story.status === 'EXPIRING' && `⚠️ ${story.hoursRemaining}h left`}
            {story.status === 'EXPIRED'  && '💀 Decayed'}
          </span>
        </div>

        {isViral && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--bg-primary)]/95 text-[var(--accent-sage)] border border-[var(--accent-sage)]/30 backdrop-blur-sm shadow-sm">
              🔥 Viral
            </span>
          </div>
        )}

        {/* Reading time bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
          <span>📖</span> {story.readMinutes} min read · {story.wordCount} words
          {story.chapters && story.chapters.length > 1 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold">{story.chapters.length} chapters</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {story.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-[var(--text-secondary)] border border-[var(--border-strong)] bg-[var(--bg-secondary)]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold font-serif text-[var(--text-primary)] leading-snug mb-2 hover:text-[var(--accent-forest)] cursor-pointer transition-colors"
          onClick={() => onNavigate('story', story.id)}
        >
          {story.title}
        </h3>

        {/* Excerpt */}
        {isExpired ? (
          <div className="rounded-xl border border-[var(--accent-clay)]/20 p-3 mb-4 bg-[var(--accent-clay)]/5">
            <p className="text-[var(--accent-clay)] text-xs font-medium">⚡ This story decayed from Filecoin storage due to lack of community support.</p>
          </div>
        ) : (
          <p className="serif-body text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
            {story.content.slice(0, 220)}…
          </p>
        )}

        {/* Storage bar */}
        {!isExpired && (
          <div className="mb-4">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[var(--text-muted)] font-medium">Filecoin Storage Health</span>
              <span className="font-semibold" style={{ color: barColor(pct) }}>{pct}%</span>
            </div>
            <div className="h-1.5 storage-bar-bg">
              <div className="h-1.5 storage-bar-fill" style={{ width: `${pct}%`, background: barColor(pct) }} />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="divider mb-4" />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Author */}
          <button
            className="flex items-center gap-2 group text-left"
            onClick={() => onNavigate('author', story.authorFull)}
          >
            <span className="text-xl">{story.authorAvatar}</span>
            <div>
              <p className="text-xs font-bold text-[var(--accent-forest)] group-hover:underline transition-colors">{story.author}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{timeAgo(story.publishedAt)} · {story.views.toLocaleString()} views</p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isExpired && (
              <button
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  story.isLikedByUser
                    ? 'text-rose-600 border-rose-200 bg-rose-50'
                    : 'text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200'
                }`}
                onClick={() => onLike(story.id)}
              >
                {story.isLikedByUser ? '❤️' : '🤍'} {story.likes.toLocaleString()}
              </button>
            )}
            <div className="flex items-center gap-1 text-xs text-[var(--accent-forest)] font-semibold px-2.5 py-1.5 rounded-xl border border-[var(--accent-forest)]/10 bg-[var(--accent-forest)]/5">
              💰 ${story.tipsUSDFC}
            </div>
            <button
              onClick={() => onTipClick(story)}
              className="btn-tip text-xs font-bold px-4 py-1.5 rounded-xl transition-all"
            >
              {isExpired ? '⚡ Resurrect' : '💸 Tip'}
            </button>
          </div>
        </div>

        {/* Viral bonus */}
        {isViral && !isExpired && (
          <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <span>🏆</span>
            <p className="text-xs text-[var(--text-secondary)]">Crossed 10K likes — author received <strong>5 FIL</strong> network bonus!</p>
          </div>
        )}

        {/* CID */}
        <p className="mt-3 text-[10px] text-[var(--text-muted)] font-mono truncate">{story.filecoinCID}</p>
      </div>
    </article>
  );
}
