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
  if (pct > 50) return 'linear-gradient(90deg,#10b981,#34d399)';
  if (pct > 20) return 'linear-gradient(90deg,#f59e0b,#fbbf24)';
  return 'linear-gradient(90deg,#ef4444,#f87171)';
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
      className="rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-0.5 hover:shadow-2xl animate-fade-in-up"
      style={{
        background: 'rgba(8,15,28,0.85)',
        backdropFilter: 'blur(12px)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Cover image */}
      <div
        className="h-36 w-full relative overflow-hidden cursor-pointer"
        style={{
          background: story.coverImage?.startsWith('linear')
            ? story.coverImage
            : 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
        }}
        onClick={() => onNavigate('story', story.id)}
      >
        {story.coverImage && !story.coverImage.startsWith('linear') && (
          <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            story.status === 'ACTIVE'   ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            story.status === 'EXPIRING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                          'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {story.status === 'ACTIVE'   && `✅ ${Math.ceil(story.hoursRemaining / 24)}d active`}
            {story.status === 'EXPIRING' && `⚠ ${story.hoursRemaining}h left`}
            {story.status === 'EXPIRED'  && '💀 Decayed'}
          </span>
        </div>

        {isViral && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/25 text-violet-300 border border-violet-500/30 backdrop-blur-sm">
              🔥 Viral
            </span>
          </div>
        )}

        {/* Reading time bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/70">
          <span>📖</span> {story.readMinutes} min read · {story.wordCount} words
          {story.chapters && story.chapters.length > 1 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-white/15 text-white/80">{story.chapters.length} chapters</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {story.tags.map(tag => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-slate-500 border border-white/5" style={{background:'rgba(255,255,255,0.03)'}}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-white leading-snug mb-2 hover:text-emerald-300 cursor-pointer transition-colors"
          onClick={() => onNavigate('story', story.id)}
        >
          {story.title}
        </h3>

        {/* Excerpt */}
        {isExpired ? (
          <div className="rounded-xl border border-red-900/30 p-3 mb-4" style={{background:'rgba(127,29,29,0.1)'}}>
            <p className="text-red-400 text-sm">⚡ This story decayed from Filecoin storage due to lack of community support.</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {story.content.slice(0, 220)}…
          </p>
        )}

        {/* Storage bar */}
        {!isExpired && (
          <div className="mb-4">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Filecoin Storage Health</span>
              <span style={{ color: pct > 50 ? '#34d399' : pct > 20 ? '#fbbf24' : '#f87171' }}>{pct}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: barColor(pct), transition: 'width 0.5s' }} />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px mb-4" style={{background:'linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent)'}} />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Author */}
          <button
            className="flex items-center gap-2 group"
            onClick={() => onNavigate('author', story.authorFull)}
          >
            <span className="text-xl">{story.authorAvatar}</span>
            <div className="text-left">
              <p className="text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">{story.author}</p>
              <p className="text-[10px] text-slate-600">{timeAgo(story.publishedAt)} · {story.views.toLocaleString()} views</p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isExpired && (
              <button
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
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
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-500/10" style={{background:'rgba(16,185,129,0.07)'}}>
              💰 ${story.tipsUSDFC}
            </div>
            <button
              onClick={() => onTipClick(story)}
              className="text-xs font-bold px-4 py-1.5 rounded-xl border border-emerald-500/25 text-emerald-300 transition-all hover:bg-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
              style={{ background: 'rgba(16,185,129,0.1)' }}
            >
              {isExpired ? '⚡ Resurrect' : '💸 Tip'}
            </button>
          </div>
        </div>

        {/* Viral bonus */}
        {isViral && !isExpired && (
          <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2 border border-violet-500/15" style={{background:'rgba(139,92,246,0.07)'}}>
            <span>🏆</span>
            <p className="text-xs text-violet-300">Crossed 10K likes — author received <strong>5 FIL</strong> network bonus!</p>
          </div>
        )}

        {/* CID */}
        <p className="mt-3 text-[10px] text-slate-700 font-mono truncate">{story.filecoinCID}</p>
      </div>
    </article>
  );
}
