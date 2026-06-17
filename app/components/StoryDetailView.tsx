'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
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
  const { isConnected } = useAccount();
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
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
            story.status === 'ACTIVE'   ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-forest)] border border-[var(--accent-forest)]/30' :
            story.status === 'EXPIRING' ? 'bg-[var(--bg-primary)]/95 text-[var(--accent-ochre)] border border-[var(--accent-ochre)]/30' :
                                          'bg-[var(--bg-primary)]/95 text-[var(--accent-clay)] border border-[var(--accent-clay)]/30'
          }`}>
            {story.status === 'ACTIVE'   && `✅ ${Math.ceil(story.hoursRemaining / 24)}d active`}
            {story.status === 'EXPIRING' && `⚠️ ${story.hoursRemaining}h left`}
            {story.status === 'EXPIRED'  && '💀 Decayed'}
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

          <div className="flex items-center gap-2 sm:ml-6 flex-shrink-0">
            {story.status !== 'EXPIRED' && (
              <button
                className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all ${
                  story.isLikedByUser
                    ? 'text-rose-600 border-rose-200 bg-rose-50'
                    : 'text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-rose-600 hover:bg-rose-50/50'
                }`}
                onClick={() => onLike(story.id)}
              >
                {story.isLikedByUser ? '❤️' : '🤍'} {story.likes.toLocaleString()}
              </button>
            )}
            <button
              onClick={() => onTipClick(story)}
              className="btn-tip text-sm font-bold px-4 py-2 rounded-xl transition-all"
            >
              {story.status === 'EXPIRED' ? '⚡ Resurrect' : '💸 Tip Author'}
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-4 text-xs text-[var(--text-secondary)] flex-wrap">
          <span className="text-[var(--accent-forest)] font-bold">💰 ${story.tipsUSDFC} tipped</span>
          <span>· {story.tipsReceived} tips received</span>
          <span>· {story.likes.toLocaleString()} likes</span>
          <span>· {story.views.toLocaleString()} views</span>
          {story.likes >= 10000 && <span className="text-[var(--accent-sage)] font-bold">🏆 Viral (5 FIL bonus earned!)</span>}
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
        <div className="rounded-2xl p-8 text-center border border-[var(--accent-clay)]/20 bg-[var(--accent-clay)]/5 shadow-sm">
          <p className="text-5xl mb-4">💀</p>
          <h3 className="text-xl font-bold font-serif text-[var(--accent-clay)] mb-2">This story has decayed</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-lg mx-auto leading-relaxed">
            The community did not tip enough to keep this story's Filecoin storage deal active. The content has been removed from the decentralized network.
          </p>
          <button
            onClick={() => onTipClick(story)}
            className="px-6 py-3 rounded-xl font-bold text-white btn-primary transition-all"
          >
            ⚡ Resurrect with a Tip
          </button>
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
