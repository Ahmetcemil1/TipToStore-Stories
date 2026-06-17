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
import { AuthModal }       from './components/AuthModal';

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

interface LoggedInUser {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  walletAddress: string;
}

function getFilterIcon(id: FilterType) {
  switch (id) {
    case 'all':
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.952 11.952 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m0 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      );
    case 'trending':
      return (
        <svg className="w-3.5 h-3.5 text-[var(--accent-clay)]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'active':
      return (
        <svg className="w-3.5 h-3.5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'expiring':
      return (
        <svg className="w-3.5 h-3.5 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'expired':
      return (
        <svg className="w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
  }
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
    { id: 'all',      label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'active',   label: 'Active' },
    { id: 'expiring', label: 'Expiring' },
    { id: 'expired',  label: 'Decayed' },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'recent',    label: 'Newest' },
    { id: 'popular',   label: 'Most Liked' },
    { id: 'mostTipped',label: 'Most Tipped' },
    { id: 'expiring',  label: 'Expiring Soon' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Stats */}
      <StatsBar stories={stories} />

      {/* Explainer */}
      <div className="rounded-2xl p-5 mb-8 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row gap-5 items-start">
          <div className="flex-1">
            <h2 className="font-bold font-serif text-[var(--text-primary)] mb-2 text-base flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0V21h2v-2.243a5 5 0 013.536 0z" />
              </svg>
              How TipToStore Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every story is stored as a <strong className="text-[var(--text-primary)]">Filecoin dataset</strong> via the Synapse SDK. Stories are <strong className="text-[var(--accent-forest)]">free to read</strong> — but decentralized storage isn&apos;t free. Readers tip authors in <strong className="text-[var(--accent-forest)]">USDFC</strong>. Each dollar of tips extends the story&apos;s storage lease on Filecoin. Popular stories survive. Ignored ones <em className="text-[var(--accent-clay)]">decay</em>.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 text-xs text-[var(--text-secondary)] shrink-0 font-bold bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-strong)]">
            {[
              { num: '1', text: 'Write & pin to IPFS' },
              { num: '2', text: 'Filecoin deal opens' },
              { num: '3', text: 'Readers tip USDFC' },
              { num: '4', text: 'Storage extends/decays' }
            ].map(s => (
              <div key={s.num} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                  {s.num}
                </span>
                <span>{s.text}</span>
              </div>
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    filter === tab.id
                      ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)]'
                      : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black/20'
                  }`}
                >
                  {getFilterIcon(tab.id)}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stories…"
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-card)]"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-[var(--text-muted)] font-medium">Sort:</span>
            {sortOptions.map(o => (
              <button
                key={o.id}
                onClick={() => setSort(o.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  sort === o.id
                    ? 'bg-[var(--accent-forest)]/10 text-[var(--accent-forest)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {o.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-[var(--text-muted)] font-medium">{filtered.length} stories</span>
          </div>

          {/* Story list */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4 border border-[var(--border-strong)] text-[var(--text-muted)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-[var(--text-primary)] font-bold font-serif text-lg">No stories found</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Try a different filter or search term</p>
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
        <aside className="lg:col-span-4 space-y-6">
          {/* Tip economics */}
          <div className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm sticky top-20">
            <h3 className="text-sm font-bold font-serif text-[var(--text-primary)] mb-4 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--accent-ochre)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Storage Extension Rules
            </h3>
            <div className="space-y-2.5">
              {[
                { amount: '$0.05', result: '+30 days (1 month)' },
                { amount: '$0.10', result: '+90 days (3 months)' },
                { amount: '$0.20', result: '+180 days (6 months)' },
                { amount: '$0.50', result: '+365 days (1 year)' },
              ].map(r => (
                <div key={r.amount} className="flex justify-between items-center text-xs py-2 border-b border-black/5 last:border-0 font-medium">
                  <span className="text-[var(--accent-forest)] font-bold">{r.amount} USDFC</span>
                  <span className="text-[var(--text-secondary)]">{r.result}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl border border-[var(--border-strong)] text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)]">
              Tips go <strong>directly to the author</strong>. The protocol calculates storage cost and auto-extends the Filecoin deal duration.
            </div>
          </div>

          {/* Viral reward */}
          <div className="rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
            <h3 className="text-sm font-bold font-serif text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8zm0 0v6m-3 0h6M4 9h3v1H4V9zm13 0h3v1h-3V9z" />
              </svg>
              Viral Reward Program
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Stories crossing <strong className="text-[var(--text-primary)]">10,000 likes</strong> trigger a <strong className="text-[var(--accent-forest)] font-bold">5 FIL</strong> bonus payout to the author from the network incentive pool.
            </p>
          </div>

          {/* Network info */}
          <div className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
            <h3 className="text-sm font-bold font-serif text-[var(--text-primary)] mb-3 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
              </svg>
              Network Settings
            </h3>
            <div className="space-y-2.5">
              {[
                { k: 'Network',      v: 'Filecoin Calibration' },
                { k: 'Token',        v: 'USDFC (FRC-46)' },
                { k: 'Storage SDK',  v: 'Synapse Warm Storage' },
                { k: 'Epoch time',   v: '~30 seconds' },
                { k: 'Proof system', v: 'PDP (PoRep)' },
              ].map(n => (
                <div key={n.k} className="flex justify-between text-xs font-medium border-b border-black/5 last:border-0 pb-1.5 last:pb-0">
                  <span className="text-[var(--text-muted)]">{n.k}</span>
                  <span className="text-[var(--text-secondary)] font-semibold">{n.v}</span>
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
  const { isConnected, address: connectedAddress } = useAccount();

  const [stories,    setStories]    = useState<Story[]>(SEED_STORIES);
  const [tipHistory, setTipHistory] = useState<TipRecord[]>(TIP_HISTORY_SEED);
  const [nav,        setNav]        = useState<NavState>({ page: 'home' });
  const [tipStory,   setTipStory]   = useState<Story | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null);

  // Authentication State
  const [session, setSession] = useState<LoggedInUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Author Earnings Balances
  const [balances, setBalances] = useState<Record<string, number>>({});

  // Load session and balances from localStorage
  useEffect(() => {
    const activeSession = localStorage.getItem('tiptostore_session');
    if (activeSession) {
      const parsed = JSON.parse(activeSession);
      const t = setTimeout(() => {
        setSession(parsed);
      }, 0);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const storedBalances = localStorage.getItem('tiptostore_balances');
    const INITIAL_BALANCES: Record<string, number> = {
      '0xalicef4b2e8a1d3c2b9e7f6a5d4c3b2a1e9f8d7c6': 45.0,
      '0xarchivist99e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6': 78.0,
      '0xdeepnode22d2a1b2c3d4e5f6a7b8c9d0e1f2a3b4': 12.0,
      '0xbob99a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7': 12.0,
      '0xpoet33b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8': 15.0
    };

    if (storedBalances) {
      const t = setTimeout(() => {
        setBalances(JSON.parse(storedBalances));
      }, 0);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setBalances(INITIAL_BALANCES);
        localStorage.setItem('tiptostore_balances', JSON.stringify(INITIAL_BALANCES));
      }, 0);
      return () => clearTimeout(t);
    }
  }, []);

  function showToast(msg: string, type: 'success'|'error'|'info' = 'success') {
    setToast({ msg, type });
  }

  function navigate(page: Page, id?: string) {
    if (page === 'write' && !session) {
      showToast('Please Sign In to publish stories or books.', 'error');
      setAuthOpen(true);
      return;
    }
    setNav({ page, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Login Success
  const handleLoginSuccess = (user: LoggedInUser) => {
    setSession(user);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('tiptostore_session');
    setSession(null);
    showToast('Signed out successfully.', 'info');
    navigate('home');
  };

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
    if (!isConnected && !session) {
      showToast('Please Sign In or Connect Wallet to like stories.', 'error');
      return;
    }
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

  function handleTip(storyId: string, amount: number, txHash?: string) {
    setStories(prev =>
      prev.map(s => {
        if (s.id !== storyId) return s;
        return {
          ...s,
          tipsReceived: s.tipsReceived + 1,
          tipsUSDFC: +(s.tipsUSDFC + amount).toFixed(2),
        };
      })
    );

    const story = stories.find(s => s.id === storyId);
    if (story) {
      const authorAddr = story.authorFull.toLowerCase();
      setBalances(prev => {
        const nextBalances = {
          ...prev,
          [authorAddr]: +((prev[authorAddr] || 0) + amount).toFixed(2)
        };
        localStorage.setItem('tiptostore_balances', JSON.stringify(nextBalances));
        return nextBalances;
      });
    }

    const rec: TipRecord = {
      storyId,
      storyTitle: story?.title ?? 'Unknown',
      amount,
      timestamp: new Date().toISOString(),
      txHash: txHash ?? `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      tipperAddress: connectedAddress || (session ? session.walletAddress : '0xAnonymousTipper'),
      authorAddress: story?.authorFull ?? '',
    };
    setTipHistory(prev => [rec, ...prev]);
    showToast(`✅ Sent $${amount.toFixed(2)} USDFC directly to the author's balance!`, 'success');
  }

  function handleWithdraw(authorAddress: string, amount: number) {
    const key = authorAddress.toLowerCase();
    const currentBal = balances[key] || 0;
    if (currentBal < amount) {
      showToast('Insufficient balance to withdraw.', 'error');
      return false;
    }

    setBalances(prev => {
      const nextBalances = {
        ...prev,
        [key]: +(prev[key] - amount).toFixed(2)
      };
      localStorage.setItem('tiptostore_balances', JSON.stringify(nextBalances));
      return nextBalances;
    });

    showToast(`Successfully withdrew $${amount.toFixed(2)} USDFC to wallet!`, 'success');
    return true;
  }

  function handleAllocateStorage(storyId: string, days: number, cost: number) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return false;
    const authorAddr = story.authorFull.toLowerCase();
    const currentBal = balances[authorAddr] || 0;
    if (currentBal < cost) {
      showToast('Insufficient balance to extend storage.', 'error');
      return false;
    }

    // Deduct balance
    setBalances(prev => {
      const nextBalances = {
        ...prev,
        [authorAddr]: +(prev[authorAddr] - cost).toFixed(2)
      };
      localStorage.setItem('tiptostore_balances', JSON.stringify(nextBalances));
      return nextBalances;
    });

    // Update story storage
    const addHours = days * 24;
    setStories(prev =>
      prev.map(s => {
        if (s.id !== storyId) return s;
        const next = s.hoursRemaining + addHours;
        return {
          ...s,
          hoursRemaining: next,
          maxHours: Math.max(s.maxHours, next),
          status: next === 0 ? 'EXPIRED' : next < 24 ? 'EXPIRING' : 'ACTIVE',
        };
      })
    );

    showToast(`Storage extended by ${days} days for "${story.title}"!`, 'success');
    return true;
  }

  function handlePublish(story: Story) {
    // Override author info with real session if logged in
    if (session) {
      story.author = session.username;
      story.authorFull = session.walletAddress;
      story.authorAvatar = session.avatar;
      story.authorBio = session.bio;
    }
    setStories(prev => [story, ...prev]);
  }

  // Resolve current view
  const currentStory  = stories.find(s => s.id === nav.id);
  const authorAddress = nav.id ?? '';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
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

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
        />
      )}

      {/* Navbar */}
      <Navbar
        currentPage={nav.page}
        onNavigate={navigate}
        session={session}
        onAuthClick={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

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
            session={session}
            stories={stories}
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
            <p className="text-[var(--text-secondary)] font-bold text-lg">Story not found</p>
            <button onClick={() => navigate('home')} className="mt-5 text-sm text-[var(--accent-forest)] hover:underline transition-colors font-bold">
              ← Back to stories
            </button>
          </div>
        )}

        {nav.page === 'author' && (
          <AuthorView
            address={authorAddress}
            stories={stories}
            tipHistory={tipHistory}
            balances={balances}
            onWithdraw={handleWithdraw}
            onAllocateStorage={handleAllocateStorage}
            onNavigate={navigate}
            onTipClick={setTipStory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-strong)] mt-20 py-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span>TipToStore Stories</span>
            <span>·</span>
            <span>FilecoinTLDR Builder Challenge 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Filecoin + Synapse SDK</span>
            <span>·</span>
            <button onClick={() => navigate('about')} className="hover:text-[var(--text-primary)] transition-colors">About</button>
            <span>·</span>
            <button onClick={() => navigate('write')} className="hover:text-[var(--text-primary)] transition-colors">Publish</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
