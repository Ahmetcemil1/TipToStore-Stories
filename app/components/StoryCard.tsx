'use client';

import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author' | 'library';

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
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm flex items-center gap-1.5 ${
            story.status === 'ACTIVE'   ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-forest)] border border-[var(--accent-forest)]/30' :
            story.status === 'EXPIRING' ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-ochre)] border border-[var(--accent-ochre)]/30' :
                                          'bg-[var(--bg-primary)]/95 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30'
          }`}>
            {story.status === 'ACTIVE' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-forest)] animate-pulse inline-block" />
                <span>{Math.ceil(story.hoursRemaining / 24)}d active</span>
              </>
            )}
            {story.status === 'EXPIRING' && (
              <>
                <svg className="w-3 h-3 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{story.hoursRemaining}h left</span>
              </>
            )}
            {story.status === 'EXPIRED' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-clay)] inline-block" />
                <span>Decayed</span>
              </>
            )}
          </span>
        </div>

        {isViral && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--bg-primary)]/95 text-[var(--accent-sage)] border border-[var(--accent-sage)]/30 backdrop-blur-sm shadow-sm flex items-center gap-1">
              <svg className="w-3 h-3 text-[var(--accent-sage)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Viral</span>
            </span>
          </div>
        )}

        {/* Reading time bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/90 font-bold backdrop-blur-[3px] bg-black/10 px-2 py-0.5 rounded-lg">
          <svg className="w-3 h-3 text-white/90 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{story.readMinutes} min read · {story.wordCount} words</span>
          {story.chapters && story.chapters.length > 1 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white/20 text-white font-extrabold text-[9px] uppercase tracking-wider">{story.chapters.length} chapters</span>
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
          <div className="rounded-xl border border-[var(--accent-clay)]/20 p-3.5 mb-4 bg-[var(--accent-clay)]/5 flex items-start gap-2">
            <svg className="w-4 h-4 text-[var(--accent-clay)] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[var(--accent-clay)] text-xs font-semibold leading-relaxed">This story decayed from Filecoin storage due to lack of community support.</p>
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
          <div className="flex items-center gap-2 font-bold">
            {!isExpired && (
              <button
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  story.isLikedByUser
                    ? 'text-rose-600 border-rose-200 bg-rose-50'
                    : 'text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200'
                }`}
                onClick={() => onLike(story.id)}
              >
                {story.isLikedByUser ? (
                  <svg className="w-3.5 h-3.5 text-rose-600 fill-current animate-heart-beat" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span>{story.likes.toLocaleString()}</span>
              </button>
            )}
            <div className="flex items-center gap-1 text-xs text-[var(--accent-forest)] px-2.5 py-1.5 rounded-xl border border-[var(--accent-forest)]/10 bg-[var(--accent-forest)]/5 font-bold">
              <span>$</span>
              <span>{story.tipsUSDFC.toFixed(2)}</span>
            </div>
            <button
              onClick={() => onTipClick(story)}
              className="btn-tip text-xs font-bold px-4 py-1.5 rounded-xl transition-all"
            >
              {isExpired ? 'Resurrect' : 'Tip'}
            </button>
          </div>
        </div>

        {/* Viral bonus */}
        {isViral && !isExpired && (
          <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium">
            <svg className="w-4 h-4 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8zm0 0v6m-3 0h6M4 9h3v1H4V9zm13 0h3v1h-3V9z" />
            </svg>
            <p className="text-xs">Crossed 10K likes — author received <strong>5 FIL</strong> network bonus!</p>
          </div>
        )}

        {/* CID */}
        <p className="mt-3 text-[10px] text-[var(--text-muted)] font-mono truncate">{story.filecoinCID}</p>
      </div>
    </article>
  );
}
