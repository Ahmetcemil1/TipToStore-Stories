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
  if (pct > 50) return 'linear-gradient(90deg,#10b981,#34d399)';
  if (pct > 20) return 'linear-gradient(90deg,#f59e0b,#fbbf24)';
  return 'linear-gradient(90deg,#ef4444,#f87171)';
}

export function StoryDetailView({ story, onBack, onTipClick, onLike, onNavigate }: StoryDetailViewProps) {
  const { isConnected } = useAccount();
  const [currentChapter, setCurrentChapter] = useState(0);

  const pct = storagePercent(story.hoursRemaining, story.maxHours);
  const hasChapters = story.chapters && story.chapters.length > 1;
  const displayContent = hasChapters ? story.chapters![currentChapter].content : story.content;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Stories
      </button>

      {/* Cover */}
      <div
        className="h-56 sm:h-72 rounded-2xl overflow-hidden relative mb-8"
        style={{
          background: story.coverImage?.startsWith('linear')
            ? story.coverImage
            : 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
        }}
      >
        {story.coverImage && !story.coverImage.startsWith('linear') && (
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {story.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">{story.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
            <button
              onClick={() => onNavigate('author', story.authorFull)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>{story.authorAvatar}</span>
              <span className="text-sky-300">{story.author}</span>
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
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
            story.status === 'ACTIVE'   ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            story.status === 'EXPIRING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                          'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {story.status === 'ACTIVE'   && `✅ ${Math.ceil(story.hoursRemaining / 24)}d active`}
            {story.status === 'EXPIRING' && `⚠ ${story.hoursRemaining}h left`}
            {story.status === 'EXPIRED'  && '💀 Decayed'}
          </span>
        </div>
      </div>

      {/* Storage health */}
      <div className="rounded-2xl p-5 mb-6 border border-white/5" style={{background:'rgba(8,15,28,0.85)'}}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Filecoin Storage Health</span>
              <span style={{ color: pct > 50 ? '#34d399' : pct > 20 ? '#fbbf24' : '#f87171' }}>
                {story.hoursRemaining > 0 ? `${story.hoursRemaining}h remaining (${pct}%)` : 'Expired'}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${pct}%`, background: barColor(pct) }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-6 flex-shrink-0">
            {story.status !== 'EXPIRED' && (
              <button
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl border transition-all ${
                  story.isLikedByUser
                    ? 'text-rose-400 border-rose-500/25'
                    : 'text-slate-500 border-white/7 hover:text-rose-400 hover:border-rose-500/20'
                }`}
                style={{ background: story.isLikedByUser ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.03)' }}
                onClick={() => onLike(story.id)}
              >
                {story.isLikedByUser ? '❤️' : '🤍'} {story.likes.toLocaleString()}
              </button>
            )}
            <button
              onClick={() => onTipClick(story)}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-emerald-300 border border-emerald-500/25 transition-all hover:bg-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
              style={{ background: 'rgba(16,185,129,0.1)' }}
            >
              {story.status === 'EXPIRED' ? '⚡ Resurrect' : '💸 Tip Author'}
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-4 text-xs text-slate-500 flex-wrap">
          <span className="text-emerald-400 font-semibold">💰 ${story.tipsUSDFC} tipped</span>
          <span>· {story.tipsReceived} tips received</span>
          <span>· {story.likes.toLocaleString()} likes</span>
          <span>· {story.views.toLocaleString()} views</span>
          {story.likes >= 10000 && <span className="text-violet-400 font-semibold">🏆 Viral (5 FIL bonus earned!)</span>}
        </div>
      </div>

      {/* Chapter navigation */}
      {hasChapters && (
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chapters</p>
          <div className="flex gap-2 flex-wrap">
            {story.chapters!.map((ch, i) => (
              <button
                key={i}
                onClick={() => setCurrentChapter(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  currentChapter === i
                    ? 'border-emerald-500/30 text-emerald-300'
                    : 'border-white/7 text-slate-500 hover:text-white hover:border-white/15'
                }`}
                style={{ background: currentChapter === i ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}
              >
                {i + 1}. {ch.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {story.status === 'EXPIRED' ? (
        <div className="rounded-2xl p-8 text-center border border-red-900/30" style={{background:'rgba(127,29,29,0.1)'}}>
          <p className="text-5xl mb-4">💀</p>
          <h3 className="text-xl font-bold text-red-300 mb-2">This story has decayed</h3>
          <p className="text-slate-400 text-sm mb-6">The community did not tip enough to keep this story's Filecoin storage deal active. The content has been removed from the decentralized network.</p>
          <button
            onClick={() => onTipClick(story)}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#059669,#0ea5e9)' }}
          >
            ⚡ Resurrect with a Tip
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-6 sm:p-8 border border-white/5 mb-6" style={{background:'rgba(8,15,28,0.85)'}}>
          {hasChapters && (
            <h2 className="text-xl font-bold text-white mb-5">{story.chapters![currentChapter].title}</h2>
          )}
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous Chapter
          </button>
          <button
            disabled={currentChapter === story.chapters!.length - 1}
            onClick={() => setCurrentChapter(c => c + 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next Chapter →
          </button>
        </div>
      )}

      {/* Filecoin CID */}
      <div className="rounded-2xl p-4 border border-white/5" style={{background:'rgba(4,10,20,0.8)'}}>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Filecoin Storage Info</p>
        <div className="space-y-1.5">
          {[
            { label: 'IPFS CID',       value: story.filecoinCID },
            { label: 'Network',        value: 'Filecoin Calibration Testnet' },
            { label: 'Proof system',   value: 'PDP (Proof of Data Possession)' },
            { label: 'Published',      value: story.publishedAt },
            { label: 'Storage status', value: story.status },
          ].map(r => (
            <div key={r.label} className="flex flex-col sm:flex-row sm:justify-between text-xs gap-0.5 sm:gap-0">
              <span className="text-slate-600">{r.label}</span>
              <span className="text-slate-400 font-mono sm:text-right break-all">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Author card */}
      <div className="mt-6 rounded-2xl p-5 border border-white/5 flex items-center gap-4" style={{background:'rgba(8,15,28,0.85)'}}>
        <span className="text-4xl">{story.authorAvatar}</span>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onNavigate('author', story.authorFull)}
            className="text-sky-400 font-bold hover:text-sky-300 transition-colors"
          >
            {story.author}
          </button>
          {story.authorBio && <p className="text-xs text-slate-500 mt-0.5">{story.authorBio}</p>}
        </div>
        <button
          onClick={() => onTipClick(story)}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all"
          style={{ background: 'rgba(16,185,129,0.08)' }}
        >
          💸 Tip
        </button>
      </div>
    </div>
  );
}
