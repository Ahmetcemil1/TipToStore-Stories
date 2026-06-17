'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Story, TipRecord } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface AuthorViewProps {
  address: string;
  stories: Story[];
  tipHistory: TipRecord[];
  balances: Record<string, number>;
  onWithdraw: (authorAddress: string, amount: number) => boolean;
  onAllocateStorage: (storyId: string, days: number, cost: number) => boolean;
  onNavigate: (page: Page, id?: string) => void;
  onTipClick: (story: Story) => void;
  platformBalance: number;
  onWithdrawPlatform: (amount: number) => boolean;
}

function shortenAddr(addr: string) {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function storagePercent(hours: number, max: number) {
  if (max === 0) return 0;
  return Math.min(100, Math.round((hours / max) * 100));
}

export function AuthorView({
  address,
  stories,
  tipHistory,
  balances,
  onWithdraw,
  onAllocateStorage,
  onNavigate,
  onTipClick,
  platformBalance,
  onWithdrawPlatform,
}: AuthorViewProps) {
  const [profile, setProfile] = useState<{ username: string; email: string; avatar: string; bio: string; walletAddress: string } | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState('');
  const [selectedPkg, setSelectedPkg] = useState({ days: 30, cost: 0.05 });
  const ADMIN_WALLET = process.env.NEXT_PUBLIC_PLATFORM_OWNER_ADDRESS || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

  // Wagmi Hooks for real wallet data
  const { isConnected, address: connectedAddress } = useAccount();
  
  // Fetch real FIL balance on Calibration / Mainnet
  const { data: balanceData } = useBalance({
    address: address.startsWith('0x') && address.length === 42 ? (address as `0x${string}`) : undefined,
  });

  useEffect(() => {
    const activeSession = localStorage.getItem('tiptostore_session');
    const session = activeSession ? JSON.parse(activeSession) : null;
    const sessionAddress = session ? session.walletAddress : '';

    const usersRaw = localStorage.getItem('tiptostore_users');
    const users: { walletAddress: string; username: string; email: string; avatar: string; bio: string }[] = usersRaw ? JSON.parse(usersRaw) : [];

    const seedAuthors: Record<string, { username: string; avatar: string; bio: string }> = {
      '0xalicef4b2e8a1d3c2b9e7f6a5d4c3b2a1e9f8d7c6': {
        username: 'Alice (Arctic Archivist)',
        avatar: '🧊',
        bio: 'Arctic data archivist. Keeping the record alive one epoch at a time.'
      },
      '0xarchivist99e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6': {
        username: 'Archivist of Neo-Istanbul',
        avatar: '🎵',
        bio: 'Digitizing the cultural memory of Neo-Istanbul, one vinyl at a time.'
      },
      '0xdeepnode22d2a1b2c3d4e5f6a7b8c9d0e1f2a3b4': {
        username: 'Mariana Deep Node Operator',
        avatar: '🌊',
        bio: 'Operator of the Mariana Deep Archive. 4000m below the surface, keeping data alive.'
      },
      '0xbob99a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7': {
        username: 'Bob (Protocol Philosopher)',
        avatar: '📡',
        bio: 'Protocol philosopher. Writing about the permanence of decentralized data.'
      },
      '0xpoet33b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8': {
        username: 'Poet (Code Philosopher)',
        avatar: '🖊️',
        bio: 'Writing at the intersection of code, poetry, and permanence.'
      }
    };

    let resolvedProfile = null;
    let resolvedIsOwn = false;

    // 1. Check active session
    if (session && session.walletAddress.toLowerCase() === address.toLowerCase()) {
      resolvedProfile = session;
      resolvedIsOwn = true;
    }
    // 2. Check Web3 connected wallet
    else if (connectedAddress && connectedAddress.toLowerCase() === address.toLowerCase()) {
      resolvedIsOwn = true;
      resolvedProfile = {
        username: session ? session.username : `Wallet ${shortenAddr(connectedAddress)}`,
        email: '',
        avatar: '🦊',
        bio: 'Web3 connected wallet writer.',
        walletAddress: connectedAddress,
      };
    }
    // 3. Check registered users list
    else {
      const found = users.find(u => u.walletAddress.toLowerCase() === address.toLowerCase());
      if (found) {
        resolvedProfile = found;
        resolvedIsOwn = found.walletAddress.toLowerCase() === sessionAddress.toLowerCase();
      }
      // 4. Check seed fallbacks
      else {
        const key = address.toLowerCase();
        if (seedAuthors[key]) {
          resolvedProfile = {
            username: seedAuthors[key].username,
            email: '',
            avatar: seedAuthors[key].avatar,
            bio: seedAuthors[key].bio,
            walletAddress: address
          };
        } else {
          resolvedProfile = {
            username: `Author ${address.slice(0, 6)}`,
            email: '',
            avatar: '👤',
            bio: 'TipToStore user profile.',
            walletAddress: address
          };
        }
        resolvedIsOwn = false;
      }
    }

    const t = setTimeout(() => {
      setProfile(resolvedProfile);
      setIsOwnProfile(resolvedIsOwn);
    }, 0);

    return () => clearTimeout(t);
  }, [address, connectedAddress]);

  // Find stories by this author
  const authorStories = stories.filter(
    s => s.authorFull.toLowerCase() === address.toLowerCase() || s.author.toLowerCase() === address.toLowerCase()
  );

  const totalTips = authorStories.reduce((a, s) => a + s.tipsUSDFC, 0);
  const totalLikes = authorStories.reduce((a, s) => a + s.likes, 0);
  const totalViews = authorStories.reduce((a, s) => a + s.views, 0);
  const activeStories = authorStories.filter(s => s.status === 'ACTIVE').length;

  const authorStoryIds = new Set(authorStories.map(s => s.id));
  const receivedTips = tipHistory.filter(t =>
    t.authorAddress?.toLowerCase() === address.toLowerCase() ||
    authorStoryIds.has(t.storyId)
  );

  const givenTips = tipHistory.filter(t => t.tipperAddress?.toLowerCase() === address.toLowerCase());

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Stories
      </button>

      {/* Profile header */}
      <div className="rounded-2xl p-6 mb-8 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm relative overflow-hidden">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex-shrink-0">
            {profile.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-1">
              {profile.username}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-3">{profile.bio}</p>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="px-2.5 py-1 rounded-lg border border-[var(--accent-forest)]/20 text-[var(--accent-forest)] bg-[var(--accent-forest)]/5 font-semibold">
                {activeStories} active stories
              </span>
              <span className="text-[var(--text-muted)] font-mono select-all break-all">{profile.walletAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Web3 Wallet Integration Status (in profile) */}
      {isOwnProfile && (
        <div className="rounded-2xl p-6 mb-8 border border-[var(--border-strong)] bg-[var(--bg-secondary)] shadow-sm">
          <h3 className="text-sm font-bold font-serif text-[var(--text-primary)] mb-3">🔌 Web3 Wallet Connection</h3>
          {isConnected && connectedAddress ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">Connected Wallet Address</p>
                <p className="text-sm text-[var(--text-primary)] font-mono break-all mt-0.5">{connectedAddress}</p>
                <div className="flex gap-4 mt-2">
                  <div className="text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">FIL Balance: </span>
                    <span className="text-[var(--accent-forest)] font-bold">
                      {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 'Loading...'}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">Network: </span>
                    <span className="text-[var(--accent-sage)] font-bold">Filecoin Calibration Testnet</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ConnectButton showBalance={false} chainStatus="name" accountStatus="address" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--accent-ochre)] mb-1">Web3 Connection Required</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Your Web3 wallet is not connected. To publish books, tip other authors, or resurrect expired storage deals on-chain, please connect your wallet below.
                </p>
              </div>
              <div className="inline-block flex-shrink-0">
                <ConnectButton label="Connect MetaMask / WalletConnect" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Earnings & Storage Panel */}
      {isOwnProfile && (
        <div className="rounded-2xl p-6 mb-8 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--border-strong)]">
            <h3 className="text-base font-bold font-serif text-[var(--text-primary)] flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
              </svg>
              Manage Earnings & Filecoin Storage Leases
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Earnings Withdrawal */}
            <div className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Withdrawable Balance (90% of Tips)</h4>
                <p className="text-3xl font-extrabold text-[var(--accent-forest)] mb-2">
                  ${(balances[address.toLowerCase()] || 0).toFixed(2)} <span className="text-xs font-semibold text-[var(--text-muted)]">USDFC</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 font-medium">
                  These funds represent your earned tips (excluding 10% platform fee). You can withdraw them to your connected Web3 wallet or use them to extend storage leases.
                </p>
              </div>

              <div>
                {!isConnected ? (
                  <div className="text-xs text-[var(--accent-ochre)] font-bold mb-2">
                    🔌 Connect wallet to withdraw funds
                  </div>
                ) : (
                  <button
                    disabled={(balances[address.toLowerCase()] || 0) <= 0}
                    onClick={() => onWithdraw(address, balances[address.toLowerCase()] || 0)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed btn-primary transition-all shadow-sm"
                  >
                    Withdraw Earnings to Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Right: Storage Lease Allocation */}
            <div className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-secondary)]">
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Extend Filecoin Storage Lease</h4>
              
              {authorStories.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] mt-2">Publish a story first to manage storage leases.</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Select Story</label>
                    <select
                      value={selectedStoryId}
                      onChange={e => setSelectedStoryId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-forest)] font-serif"
                    >
                      <option value="">-- Choose one of your stories --</option>
                      {authorStories.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.status} - {s.hoursRemaining}h left)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Storage Extension Package</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { days: 30, cost: 0.05, label: '30 Days / $0.05' },
                        { days: 90, cost: 0.10, label: '90 Days / $0.10' },
                        { days: 180, cost: 0.20, label: '180 Days / $0.20' },
                        { days: 365, cost: 0.50, label: '365 Days / $0.50' },
                      ].map(pkg => (
                        <button
                          key={pkg.days}
                          type="button"
                          onClick={() => setSelectedPkg(pkg)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedPkg.days === pkg.days
                              ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)] shadow-sm'
                              : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
                          }`}
                        >
                          {pkg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedStoryId || (balances[address.toLowerCase()] || 0) < selectedPkg.cost}
                    onClick={() => {
                      if (onAllocateStorage(selectedStoryId, selectedPkg.days, selectedPkg.cost)) {
                        setSelectedStoryId('');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white disabled:opacity-40 disabled:cursor-not-allowed btn-primary transition-all shadow-sm"
                  >
                    {!selectedStoryId
                      ? 'Select a story'
                      : (balances[address.toLowerCase()] || 0) < selectedPkg.cost
                      ? `Insufficient balance (Needs $${selectedPkg.cost.toFixed(2)})`
                      : `Allocate $${selectedPkg.cost.toFixed(3)} to Extend Storage`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Admin Dashboard (Visible only to the real Platform Admin connected wallet) */}
          {connectedAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase() && (
            <div className="mt-6 pt-6 border-t border-[var(--border-strong)]">
              <h4 className="text-xs font-bold text-[var(--accent-ochre)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Platform Owner Administration Panel
              </h4>
              <div className="rounded-xl p-4 border border-[var(--accent-ochre)]/30 bg-[var(--bg-secondary)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div className="flex-1">
                  <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">
                    Platform Fee Collected (10% Protocol Cut on Reader Tips)
                  </p>
                  <p className="text-2xl font-extrabold text-[var(--accent-ochre)] mb-1">
                    ${platformBalance.toFixed(2)} <span className="text-xs font-semibold text-[var(--text-muted)]">USDFC</span>
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    This balance accumulates 10% of all reader tips to cover decentralized gateway, pinning (IPFS), and server hosting costs.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <button
                    disabled={platformBalance <= 0}
                    onClick={() => onWithdrawPlatform(platformBalance)}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[var(--accent-ochre)] hover:bg-[var(--accent-ochre)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Withdraw Protocol Fees
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: 'Stories',
            value: authorStories.length,
            color: 'var(--accent-forest)',
            icon: (
              <svg className="w-4 h-4 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )
          },
          {
            label: 'USDFC Earned',
            value: `$${totalTips.toFixed(2)}`,
            color: 'var(--accent-forest)',
            icon: (
              <svg className="w-4 h-4 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
              </svg>
            )
          },
          {
            label: 'Total Likes',
            value: totalLikes.toLocaleString(),
            color: 'var(--accent-clay)',
            icon: (
              <svg className="w-4 h-4 text-[var(--accent-clay)] fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )
          },
          {
            label: 'Total Views',
            value: totalViews.toLocaleString(),
            color: 'var(--accent-sage)',
            icon: (
              <svg className="w-4 h-4 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )
          },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5 font-bold">
              {s.icon}
              <span className="text-xs text-[var(--text-secondary)] font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-extrabold" style={{color: s.color}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Author's stories */}
      <h2 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-4">Published Stories</h2>
      {authorStories.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border border-[var(--border-strong)] bg-[var(--bg-card)] mb-10">
          <p className="text-[var(--text-secondary)] text-sm mb-4">No stories published yet under this profile.</p>
          <button
            onClick={() => onNavigate('write')}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white btn-primary transition-all"
          >
            Write First Story
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {authorStories.map(s => {
            const pct = storagePercent(s.hoursRemaining, s.maxHours);
            return (
              <div
                key={s.id}
                className="rounded-2xl p-4 border border-[var(--border-strong)] bg-[var(--bg-card)] flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-[var(--accent-forest)]/30 shadow-sm"
              >
                {/* Cover thumbnail */}
                <div
                  className="w-full sm:w-24 h-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  style={{
                    background: s.coverImage?.startsWith('linear') ? s.coverImage : 'linear-gradient(135deg,#eaddca,#c2b280)',
                  }}
                  onClick={() => onNavigate('story', s.id)}
                >
                  {s.coverImage && !s.coverImage.startsWith('linear') && (
                    <img src={s.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <button
                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent-forest)] transition-colors text-left font-serif text-base"
                    onClick={() => onNavigate('story', s.id)}
                  >
                    {s.title}
                  </button>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--text-secondary)] mt-1.5">
                    <span>{s.wordCount} words</span>
                    <span>{s.likes.toLocaleString()} likes</span>
                    <span>{s.views.toLocaleString()} views</span>
                    <span className="text-[var(--accent-forest)] font-semibold">${s.tipsUSDFC} tipped</span>
                  </div>
                  {/* Storage bar */}
                  <div className="mt-2.5 h-1.5 storage-bar-bg" style={{ maxWidth:'200px' }}>
                    <div className="h-1.5 storage-bar-fill" style={{width:`${pct}%`, background: pct>50?'var(--accent-forest)':pct>20?'var(--accent-ochre)':'var(--accent-clay)'}} />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    s.status === 'ACTIVE'   ? 'badge-active' :
                    s.status === 'EXPIRING' ? 'badge-expiring' :
                                              'badge-expired'
                  }`}>
                    {s.status}
                  </span>
                  <button
                    onClick={() => onTipClick(s)}
                    className="btn-tip text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    Tip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Received Tips Table (Earnings Activity) */}
      {receivedTips.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-4 font-serif">📈 Received Tips (Support Earnings)</h2>
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Story</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Tx Hash</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {receivedTips.map((tip, i) => (
                  <tr key={i} className="border-b border-[var(--border-strong)] last:border-0 hover:bg-black/5 transition-all">
                    <td className="px-4 py-3 text-[var(--text-primary)] font-serif text-xs font-bold">{tip.storyTitle}</td>
                    <td className="px-4 py-3 text-right text-[var(--accent-forest)] font-bold text-xs">${tip.amount.toFixed(2)} USDFC</td>
                    <td className="px-4 py-3 text-right text-[var(--text-muted)] font-mono text-[11px] hidden sm:table-cell">{tip.txHash}</td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)] text-xs hidden sm:table-cell">{new Date(tip.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Given Tips Table (Tipper Activity) */}
      {isOwnProfile && givenTips.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-4 font-serif">💸 Given Tips (Your Tipping Activity)</h2>
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Story</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Tx Hash</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {givenTips.map((tip, i) => (
                  <tr key={i} className="border-b border-[var(--border-strong)] last:border-0 hover:bg-black/5 transition-all">
                    <td className="px-4 py-3 text-[var(--text-primary)] font-serif text-xs font-bold">{tip.storyTitle}</td>
                    <td className="px-4 py-3 text-right text-[var(--accent-forest)] font-bold text-xs">${tip.amount.toFixed(2)} USDFC</td>
                    <td className="px-4 py-3 text-right text-[var(--text-muted)] font-mono text-[11px] hidden sm:table-cell">{tip.txHash}</td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)] text-xs hidden sm:table-cell">{new Date(tip.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
