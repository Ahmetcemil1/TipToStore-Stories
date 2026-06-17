'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import './globals.css';

// Components
import { Navbar }          from './components/Navbar';
import { Toast }           from './components/Toast';
import { TipModal }        from './components/TipModal';
import { StoryCard }       from './components/StoryCard';
import { StatsBar }        from './components/StatsBar';
import { AboutView }       from './components/AboutView';
import { WriteView }       from './components/WriteView';
import { StoryDetailView } from './components/StoryDetailView';
import { AuthorView }      from './components/AuthorView';

// Data & Types
import { SEED_STORIES, TIP_HISTORY_SEED } from './lib/data';
import { Story, TipRecord, FilterType, SortType } from './types';

// ─────────────────────────────────────
//  Page / routing state
// ─────────────────────────────────────
type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface NavState {
  page: Page;
  id?: string;   // storyId or authorAddress
}

// ─────────────────────────────────────
//  Home feed
// ─────────────────────────────────────
function HomeFeed({
  stories,
  onLike,
  onTipClick,
  onNavigate,
}: {
  stories: Story[];
  onLike: (id: string) => void;
  onTipClick: (s: Story) => void;
  onNavigate: (page: Page, id?: string) => void;
}) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort,   setSort]   = useState<SortType>('recent');
  const [search, setSearch] = useState('');

  const filtered = stories
    .filter(s => {
      if (filter === 'active')   return s.status === 'ACTIVE';
      if (filter === 'expiring') return s.status === 'EXPIRING';
      if (filter === 'expired')  return s.status === 'EXPIRED';
      if (filter === 'trending') return s.likes >= 3000 && s.status !== 'EXPIRED';
      return true;
    })
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    })
    .sort((a, b) => {
      if (sort === 'popular')   return b.likes - a.likes;
      if (sort === 'mostTipped') return b.tipsUSDFC - a.tipsUSDFC;
      if (sort === 'expiring')  return a.hoursRemaining - b.hoursRemaining;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all',      label: '🌐 All' },
    { id: 'trending', label: '🔥 Trending' },
    { id: 'active',   label: '✅ Active' },
    { id: 'expiring', label: '⚠️ Expiring' },
    { id: 'expired',  label: '💀 Decayed' },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'recent',    label: 'Newest' },
    { id: 'popular',   label: 'Most Liked' },
    { id: 'mostTipped',label: 'Most Tipped' },
    { id: 'expiring',  label: 'Expiring Soon' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Stats */}
      <StatsBar stories={stories} />

      {/* Explainer */}
      <div className="rounded-2xl p-5 mb-8 border border-white/5 relative overflow-hidden" style={{background:'rgba(8,15,28,0.85)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(135deg,rgba(16,185,129,0.04),transparent 60%)'}} />
        <div className="relative flex flex-col sm:flex-row gap-5 items-start">
          <div className="flex-1">
            <h2 className="font-bold text-white mb-1.5 text-base">💡 How TipToStore Works</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every story is stored as a <strong className="text-white">Filecoin dataset</strong> via the Synapse SDK. Stories are <strong className="text-emerald-400">free to read</strong> — but storage isn't free. Readers tip authors in <strong className="text-emerald-400">USDFC</strong>. Each dollar of tips extends the story's storage lease. Popular stories survive. Ignored ones <em className="text-red-400">decay</em>.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-slate-500 shrink-0">
            {['📤 Write & pin to IPFS', '⛓️ Filecoin deal opens', '💸 Readers tip USDFC', '♾️ Storage renews or decays'].map(s => (
              <div key={s} className="flex items-center gap-1.5">{s.split(' ')[0]} <span>{s.slice(2)}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stories column */}
        <div className="lg:col-span-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-1.5 flex-wrap">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === tab.id
                      ? 'border-emerald-500/30 text-emerald-300'
                      : 'border-white/7 text-slate-500 hover:text-white hover:border-white/15'
                  }`}
                  style={{ background: filter === tab.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search stories…"
              className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-xl border border-white/7 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 transition-all"
              style={{ background: 'rgba(2,8,16,0.7)' }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-slate-600">Sort:</span>
            {sortOptions.map(o => (
              <button
                key={o.id}
                onClick={() => setSort(o.id)}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all ${
                  sort === o.id ? 'text-white' : 'text-slate-600 hover:text-slate-400'
                }`}
                style={{ background: sort === o.id ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              >
                {o.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-600">{filtered.length} stories</span>
          </div>

          {/* Story list */}
          <div className="space-y-5">
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center border border-white/5" style={{background:'rgba(8,15,28,0.6)'}}>
                <p className="text-5xl mb-3">🔍</p>
                <p className="text-slate-400 font-medium">No stories found</p>
                <p className="text-slate-600 text-sm mt-1">Try a different filter or search term</p>
              </div>
            ) : (
              filtered.map((s, i) => (
                <StoryCard
                  key={s.id}
                  story={s}
                  onLike={onLike}
                  onTipClick={onTipClick}
                  onNavigate={onNavigate}
                  delay={i * 60}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Tip economics */}
          <div className="rounded-2xl p-5 border border-white/5 sticky top-20" style={{background:'rgba(8,15,28,0.85)'}}>
            <h3 className="text-sm font-bold text-white mb-4">⚡ Tip Economics</h3>
            <div className="space-y-2.5">
              {[
                { amount: '$1',  result: '+24h storage' },
                { amount: '$5',  result: '+5 days storage' },
                { amount: '$10', result: '+10 days storage' },
                { amount: '$25', result: '+25 days storage' },
              ].map(r => (
                <div key={r.amount} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-emerald-400 font-semibold">{r.amount} USDFC</span>
                  <span className="text-slate-500">{r.result}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl border border-white/5 text-xs text-slate-500 leading-relaxed" style={{background:'rgba(2,8,16,0.5)'}}>
              Tips go <strong className="text-white">directly to the author</strong>. The protocol calculates storage cost and auto-extends the Filecoin deal duration.
            </div>
          </div>

          {/* Viral reward */}
          <div className="rounded-2xl p-5 border border-violet-500/15" style={{background:'rgba(139,92,246,0.06)'}}>
            <h3 className="text-sm font-bold text-violet-300 mb-2">🏆 Viral Reward Program</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stories crossing <strong className="text-white">10,000 likes</strong> trigger a <strong className="text-violet-300">5 FIL</strong> bonus payout to the author from the network incentive pool.
            </p>
          </div>

          {/* Network info */}
          <div className="rounded-2xl p-5 border border-white/5" style={{background:'rgba(8,15,28,0.7)'}}>
            <h3 className="text-sm font-bold text-white mb-3">🌐 Network</h3>
            <div className="space-y-2">
              {[
                { k: 'Network',      v: 'Filecoin Calibration' },
                { k: 'Token',        v: 'USDFC (FRC-46)' },
                { k: 'Storage SDK',  v: 'Synapse Warm Storage' },
                { k: 'Epoch time',   v: '~30 seconds' },
                { k: 'Proof system', v: 'PDP (PoRep)' },
              ].map(n => (
                <div key={n.k} className="flex justify-between text-xs">
                  <span className="text-slate-600">{n.k}</span>
                  <span className="text-slate-300 font-medium">{n.v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
//  Root
// ─────────────────────────────────────
export default function App() {
  const { isConnected, address } = useAccount();

  const [stories,    setStories]    = useState<Story[]>(SEED_STORIES);
  const [tipHistory, setTipHistory] = useState<TipRecord[]>(TIP_HISTORY_SEED);
  const [nav,        setNav]        = useState<NavState>({ page: 'home' });
  const [tipStory,   setTipStory]   = useState<Story | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null);

  function showToast(msg: string, type: 'success'|'error'|'info' = 'success') {
    setToast({ msg, type });
  }

  function navigate(page: Page, id?: string) {
    setNav({ page, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Simulated decay clock (1 tick = 1 hour for demo; real = epoch-based)
  useEffect(() => {
    const t = setInterval(() => {
      setStories(prev =>
        prev.map(s => {
          if (s.hoursRemaining <= 0) return s;
          const next = Math.max(0, s.hoursRemaining - 1);
          return {
            ...s,
            hoursRemaining: next,
            status: next === 0 ? 'EXPIRED' : next < 24 ? 'EXPIRING' : 'ACTIVE',
          };
        })
      );
    }, 12000);  // 12s = 1 simulated hour
    return () => clearInterval(t);
  }, []);

  function handleLike(id: string) {
    if (!isConnected) { showToast('Connect your wallet to like stories.', 'error'); return; }
    setStories(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const liked = !s.isLikedByUser;
        const nl = liked ? s.likes + 1 : s.likes - 1;
        if (!s.isLikedByUser && s.likes < 10000 && nl >= 10000) {
          setTimeout(() => showToast(`🏆 "${s.title}" crossed 10K likes! Author earns 5 FIL bonus!`), 800);
        }
        return { ...s, likes: nl, isLikedByUser: liked };
      })
    );
  }

  function handleTip(storyId: string, amount: number) {
    setStories(prev =>
      prev.map(s => {
        if (s.id !== storyId) return s;
        const addHours = Math.round(amount * 24);
        const next = s.hoursRemaining + addHours;
        return {
          ...s,
          hoursRemaining: next,
          tipsReceived: s.tipsReceived + 1,
          tipsUSDFC: +(s.tipsUSDFC + amount).toFixed(2),
          status: next === 0 ? 'EXPIRED' : next < 24 ? 'EXPIRING' : 'ACTIVE',
        };
      })
    );
    const story = stories.find(s => s.id === storyId);
    const rec: TipRecord = {
      storyId,
      storyTitle: story?.title ?? 'Unknown',
      amount,
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    setTipHistory(prev => [rec, ...prev]);
    showToast(`✅ Sent $${amount} USDFC — storage extended by ${Math.round(amount)} day(s)!`);
  }

  function handlePublish(story: Story) {
    setStories(prev => [story, ...prev]);
  }

  // Resolve current view
  const currentStory  = stories.find(s => s.id === nav.id);
  const authorAddress = nav.id ?? '';

  return (
    <div className="min-h-screen bg-mesh">
      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Tip Modal */}
      {tipStory && (
        <TipModal
          story={tipStory}
          onClose={() => setTipStory(null)}
          onTip={handleTip}
        />
      )}

      {/* Navbar */}
      <Navbar currentPage={nav.page} onNavigate={navigate} />

      {/* Page router */}
      <main>
        {nav.page === 'home' && (
          <HomeFeed
            stories={stories}
            onLike={handleLike}
            onTipClick={setTipStory}
            onNavigate={navigate}
          />
        )}

        {nav.page === 'about' && (
          <AboutView onNavigate={navigate} />
        )}

        {nav.page === 'write' && (
          <WriteView
            onPublish={handlePublish}
            onNavigate={navigate}
            showToast={showToast}
          />
        )}

        {nav.page === 'story' && currentStory && (
          <StoryDetailView
            story={currentStory}
            onBack={() => navigate('home')}
            onTipClick={setTipStory}
            onLike={handleLike}
            onNavigate={navigate}
          />
        )}

        {nav.page === 'story' && !currentStory && (
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-slate-400 font-semibold text-lg">Story not found</p>
            <button onClick={() => navigate('home')} className="mt-5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              ← Back to stories
            </button>
          </div>
        )}

        {nav.page === 'author' && (
          <AuthorView
            address={authorAddress}
            stories={stories}
            tipHistory={tipHistory}
            onNavigate={navigate}
            onTipClick={setTipStory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span>TipToStore Stories</span>
            <span>·</span>
            <span>FilecoinTLDR Builder Challenge 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Filecoin + Synapse SDK</span>
            <span>·</span>
            <button onClick={() => navigate('about')} className="hover:text-slate-400 transition-colors">About</button>
            <span>·</span>
            <button onClick={() => navigate('write')} className="hover:text-slate-400 transition-colors">Publish</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
