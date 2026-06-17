'use client';

import { Story, TipRecord } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface AuthorViewProps {
  address: string;
  stories: Story[];
  tipHistory: TipRecord[];
  onNavigate: (page: Page, id?: string) => void;
  onTipClick: (story: Story) => void;
}

function shortenAddr(addr: string) {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function storagePercent(hours: number, max: number) {
  if (max === 0) return 0;
  return Math.min(100, Math.round((hours / max) * 100));
}

export function AuthorView({ address, stories, tipHistory, onNavigate, onTipClick }: AuthorViewProps) {
  // Find stories by this author
  const authorStories = stories.filter(
    s => s.authorFull === address || s.author.toLowerCase() === address.toLowerCase()
  );
  const firstStory = authorStories[0];

  const totalTips = authorStories.reduce((a, s) => a + s.tipsUSDFC, 0);
  const totalLikes = authorStories.reduce((a, s) => a + s.likes, 0);
  const totalViews = authorStories.reduce((a, s) => a + s.views, 0);
  const activeStories = authorStories.filter(s => s.status === 'ACTIVE').length;

  // Tips given by this address (demo: all tip history)
  const givenTips = tipHistory;

  const avatar = firstStory?.authorAvatar ?? '👤';
  const bio = firstStory?.authorBio ?? 'TipToStore author';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Stories
      </button>

      {/* Profile header */}
      <div className="rounded-2xl p-6 mb-8 border border-white/5 relative overflow-hidden" style={{background:'rgba(8,15,28,0.9)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 0% 0%,rgba(16,185,129,0.05),transparent)'}}>
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-white/10 flex-shrink-0" style={{background:'rgba(255,255,255,0.04)'}}>
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white mb-1">
              {shortenAddr(address)}
            </h1>
            <p className="text-sm text-slate-400 mb-2">{bio}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-lg border border-emerald-500/20 text-emerald-400" style={{background:'rgba(16,185,129,0.08)'}}>
                {activeStories} active stories
              </span>
              <span className="text-slate-600 font-mono text-[11px] break-all">{address.slice(0, 20)}…</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Stories',     value: authorStories.length, color:'#10b981', icon:'📚' },
          { label: 'USDFC Earned',value: `$${totalTips}`,      color:'#38bdf8', icon:'💰' },
          { label: 'Total Likes', value: totalLikes.toLocaleString(), color:'#f87171', icon:'❤️' },
          { label: 'Total Views', value: totalViews.toLocaleString(), color:'#8b5cf6', icon:'👁️' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 border border-white/5" style={{background:'linear-gradient(135deg,rgba(8,15,28,0.9),rgba(4,10,20,0.95))'}}>
            <div className="flex items-center gap-2 mb-1">
              <span>{s.icon}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <p className="text-xl font-black" style={{color: s.color}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Author's stories */}
      <h2 className="text-lg font-bold text-white mb-4">📚 Published Stories</h2>
      {authorStories.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border border-white/5 mb-10" style={{background:'rgba(8,15,28,0.6)'}}>
          <p className="text-slate-500">No stories published yet.</p>
          <button
            onClick={() => onNavigate('write')}
            className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{background:'linear-gradient(135deg,#059669,#0ea5e9)'}}
          >
            ✍️ Write First Story
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {authorStories.map(s => {
            const pct = storagePercent(s.hoursRemaining, s.maxHours);
            return (
              <div
                key={s.id}
                className="rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-white/10"
                style={{background:'rgba(8,15,28,0.7)'}}
              >
                {/* Cover thumbnail */}
                <div
                  className="w-full sm:w-24 h-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  style={{
                    background: s.coverImage?.startsWith('linear') ? s.coverImage : 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
                  }}
                  onClick={() => onNavigate('story', s.id)}
                >
                  {s.coverImage && !s.coverImage.startsWith('linear') && (
                    <img src={s.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <button
                    className="text-sm font-bold text-white hover:text-emerald-300 transition-colors text-left"
                    onClick={() => onNavigate('story', s.id)}
                  >
                    {s.title}
                  </button>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                    <span>{s.wordCount} words</span>
                    <span>{s.likes.toLocaleString()} likes</span>
                    <span>{s.views.toLocaleString()} views</span>
                    <span className="text-emerald-400">${s.tipsUSDFC} tipped</span>
                  </div>
                  {/* Storage bar */}
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)', maxWidth:'200px'}}>
                    <div className="h-1 rounded-full" style={{width:`${pct}%`, background: pct>50?'#10b981':pct>20?'#f59e0b':'#ef4444'}} />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    s.status === 'ACTIVE'   ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20' :
                    s.status === 'EXPIRING' ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20' :
                                              'text-red-300 bg-red-500/10 border border-red-500/20'
                  }`}>
                    {s.status}
                  </span>
                  <button
                    onClick={() => onTipClick(s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all"
                    style={{background:'rgba(16,185,129,0.07)'}}
                  >
                    💸 Tip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tip history (given) */}
      {givenTips.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-white mb-4">💸 Tipping History</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden mb-6" style={{background:'rgba(8,15,28,0.7)'}}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Story</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Tx Hash</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {givenTips.map((tip, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-all">
                    <td className="px-4 py-3 text-slate-300 text-xs">{tip.storyTitle}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold text-xs">${tip.amount} USDFC</td>
                    <td className="px-4 py-3 text-right text-slate-600 font-mono text-[11px] hidden sm:table-cell">{tip.txHash}</td>
                    <td className="px-4 py-3 text-right text-slate-600 text-xs hidden sm:table-cell">{new Date(tip.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
