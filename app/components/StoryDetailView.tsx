'use client';

import { useState } from 'react';
import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface StoryDetailViewProps {
  story: Story;
  onBack: () => void;
  onTipClick: (story: Story) => void;
  onLike: (id: string) => void;
  onNavigate: (page: Page, id?: string) => void;
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

export function StoryDetailView({ story, onBack, onTipClick, onLike, onNavigate }: StoryDetailViewProps) {
  const [currentChapter, setCurrentChapter] = useState(0);

  const pct = storagePercent(story.hoursRemaining, story.maxHours);
  const hasChapters = story.chapters && story.chapters.length > 1;
  const displayContent = hasChapters ? story.chapters![currentChapter].content : story.content;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Stories
      </button>

      {/* Cover */}
      <div
        className="h-56 sm:h-72 rounded-2xl overflow-hidden relative mb-8 shadow-md"
        style={{
          background: story.coverImage?.startsWith('linear')
            ? story.coverImage
            : 'linear-gradient(135deg,#eaddca,#c2b280)',
        }}
      >
        {story.coverImage && !story.coverImage.startsWith('linear') && (
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {story.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white drop-shadow-md">{story.title}</h1>
          <div className="flex items-center gap-3 mt-2.5 text-white/80 text-xs">
            <button
              onClick={() => onNavigate('author', story.authorFull)}
              className="flex items-center gap-1.5 hover:underline transition-colors font-semibold"
            >
              <span>{story.authorAvatar}</span>
              <span>{story.author}</span>
            </button>
            <span>·</span>
            <span>{story.wordCount} words</span>
            <span>·</span>
            <span>~{story.readMinutes} min read</span>
            <span>·</span>
            <span>{story.views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm flex items-center gap-1.5 ${
            story.status === 'ACTIVE'   ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-forest)] border border-[var(--accent-forest)]/30' :
            story.status === 'EXPIRING' ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-ochre)] border border-[var(--accent-ochre)]/30' :
                                          'bg-[var(--bg-primary)]/95 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30'
          }`}>
            {story.status === 'ACTIVE' && (
              <>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-forest)] animate-pulse inline-block" />
                <span>{Math.ceil(story.hoursRemaining / 24)}d active</span>
              </>
            )}
            {story.status === 'EXPIRING' && (
              <>
                <svg className="w-3.5 h-3.5 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{story.hoursRemaining}h left</span>
              </>
            )}
            {story.status === 'EXPIRED' && (
              <>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-clay)] inline-block" />
                <span>Decayed</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Storage health */}
      <div className="rounded-2xl p-5 mb-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-[var(--text-secondary)]">Filecoin Storage Health</span>
              <span style={{ color: barColor(pct) }} className="font-bold">
                {story.hoursRemaining > 0 ? `${story.hoursRemaining}h remaining (${pct}%)` : 'Expired'}
              </span>
            </div>
            <div className="h-2 storage-bar-bg">
              <div
                className="h-2 storage-bar-fill"
                style={{ width: `${pct}%`, background: barColor(pct) }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-6 flex-shrink-0 font-bold">
            {story.status !== 'EXPIRED' && (
              <button
                className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl border transition-all ${
                  story.isLikedByUser
                    ? 'text-rose-600 border-rose-200 bg-rose-50'
                    : 'text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-rose-600 hover:bg-rose-50/50'
                }`}
                onClick={() => onLike(story.id)}
              >
                {story.isLikedByUser ? (
                  <svg className="w-4 h-4 text-rose-600 fill-current animate-heart-beat" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span>{story.likes.toLocaleString()}</span>
              </button>
            )}
            <button
              onClick={() => onTipClick(story)}
              className="btn-tip text-sm font-bold px-4 py-2 rounded-xl transition-all"
            >
              {story.status === 'EXPIRED' ? 'Resurrect Storage' : 'Tip Author'}
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-4 text-xs text-[var(--text-secondary)] flex-wrap items-center">
          <span className="text-[var(--accent-forest)] font-bold flex items-center gap-1 bg-[var(--accent-forest)]/5 px-2 py-1 rounded-lg border border-[var(--accent-forest)]/10">
            <span>$</span>
            <span>{story.tipsUSDFC.toFixed(2)} Tipped</span>
          </span>
          <span>· {story.tipsReceived} tips received</span>
          <span>· {story.likes.toLocaleString()} likes</span>
          <span>· {story.views.toLocaleString()} views</span>
          {story.likes >= 10000 && (
            <span className="text-[var(--accent-sage)] font-bold flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8zm0 0v6m-3 0h6M4 9h3v1H4V9zm13 0h3v1h-3V9z" />
              </svg>
              <span>Viral Bonus (5 FIL Earned)</span>
            </span>
          )}
        </div>
      </div>

      {/* Chapter navigation */}
      {hasChapters && (
        <div className="mb-6">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Chapters</p>
          <div className="flex gap-2 flex-wrap">
            {story.chapters!.map((ch, i) => (
              <button
                key={i}
                onClick={() => setCurrentChapter(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  currentChapter === i
                    ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)] font-bold'
                    : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {i + 1}. {ch.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {story.status === 'EXPIRED' ? (
        <div className="rounded-2xl p-8 border border-[var(--accent-clay)]/20 bg-[var(--accent-clay)]/5 shadow-sm">
          {/* Decay header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-4 border border-[var(--border-strong)] text-[var(--accent-clay)]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-serif text-[var(--accent-clay)] mb-2">This story has decayed from storage</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-lg mx-auto leading-relaxed">
              The community did not support this story enough to keep its Filecoin storage deal active. The content has been removed from the decentralized network.
            </p>
          </div>

          {/* Resurrection explanation */}
          <div className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-secondary)] mb-5">
            <h4 className="text-sm font-bold font-serif text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How to Resurrect This Story
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-strong)]">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] mb-0.5">Readers tip the author</p>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Send USDFC tips to support the author. 100% of tips go directly to their withdrawable balance.</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex-1 flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-strong)]">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] mb-0.5">Author allocates balance to storage</p>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">The author visits their profile, selects this story, and uses their earnings to open a new Filecoin storage lease. Minimum: 30 days for $0.05 USDFC.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onTipClick(story)}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white btn-primary transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Tip the Author
            </button>
            <button
              onClick={() => onNavigate('author', story.authorFull)}
              className="px-6 py-3 rounded-xl font-bold text-sm border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] bg-[var(--bg-card)] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Author&apos;s Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm mb-6">
          {hasChapters && (
            <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-5">{story.chapters![currentChapter].title}</h2>
          )}
          <div className="serif-body text-[var(--text-primary)] whitespace-pre-line text-[15px] sm:text-[17px]">
            {displayContent}
          </div>
        </div>
      )}

      {/* Chapter nav buttons */}
      {hasChapters && story.status !== 'EXPIRED' && (
        <div className="flex justify-between gap-4 mb-6">
          <button
            disabled={currentChapter === 0}
            onClick={() => setCurrentChapter(c => c - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 bg-[var(--bg-card)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous Chapter
          </button>
          <button
            disabled={currentChapter === story.chapters!.length - 1}
            onClick={() => setCurrentChapter(c => c + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 bg-[var(--bg-card)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next Chapter →
          </button>
        </div>
      )}

      {/* Filecoin CID */}
      <div className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Filecoin Storage Metadata</p>
        <div className="space-y-2">
          {[
            { label: 'IPFS CID',       value: story.filecoinCID },
            { label: 'Network',        value: 'Filecoin Calibration Testnet' },
            { label: 'Proof system',   value: 'PDP (Proof of Data Possession)' },
            { label: 'Published',      value: story.publishedAt },
            { label: 'Storage status', value: story.status },
          ].map(r => (
            <div key={r.label} className="flex flex-col sm:flex-row sm:justify-between text-xs gap-0.5 sm:gap-0 border-b border-black/5 last:border-0 pb-1.5 last:pb-0">
              <span className="text-[var(--text-secondary)] font-medium">{r.label}</span>
              <span className="text-[var(--text-muted)] font-mono sm:text-right break-all">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Author card */}
      <div className="mt-6 rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm flex items-center gap-4">
        <span className="text-4xl">{story.authorAvatar}</span>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onNavigate('author', story.authorFull)}
            className="text-[var(--accent-forest)] font-bold hover:underline transition-colors"
          >
            {story.author}
          </button>
          {story.authorBio && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{story.authorBio}</p>}
        </div>
        <button
          onClick={() => onTipClick(story)}
          className="btn-tip text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          💸 Tip
        </button>
      </div>
    </div>
  );
}
