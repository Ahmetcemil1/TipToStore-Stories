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
  const [profile, setProfile] = useState<{ username: string; email: string; avatar: string; bio: string; walletAddress: string } | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Wagmi Hooks for real wallet data
  const { isConnected, address: connectedAddress } = useAccount();
  
  // Fetch real FIL balance on Calibration / Mainnet
  const { data: balanceData } = useBalance({
    address: address.startsWith('0x') && address.length === 42 ? (address as `0x${string}`) : undefined,
  });

  useEffect(() => {
    // 1. Check if the address belongs to the active session
    const sessionRaw = localStorage.getItem('tiptostore_session');
    let sessionAddress = '';
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      sessionAddress = session.walletAddress;
      if (session.walletAddress.toLowerCase() === address.toLowerCase()) {
        setProfile(session);
        setIsOwnProfile(true);
        return;
      }
    }

    // 2. Check if it matches the connected Web3 wallet address directly
    if (connectedAddress && connectedAddress.toLowerCase() === address.toLowerCase()) {
      setIsOwnProfile(true);
      // Create a profile for the connected wallet
      const mockProfile = {
        username: sessionRaw ? JSON.parse(sessionRaw).username : `Wallet ${shortenAddr(connectedAddress)}`,
        email: '',
        avatar: '🦊',
        bio: 'Web3 connected wallet writer.',
        walletAddress: connectedAddress,
      };
      setProfile(mockProfile);
      return;
    }

    // 3. Check in all registered users
    const usersRaw = localStorage.getItem('tiptostore_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const found = users.find((u: any) => u.walletAddress.toLowerCase() === address.toLowerCase());
      if (found) {
        setProfile(found);
        setIsOwnProfile(found.walletAddress.toLowerCase() === sessionAddress.toLowerCase());
        return;
      }
    }

    // 4. Fallback for seed stories
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

    const key = address.toLowerCase();
    if (seedAuthors[key]) {
      setProfile({
        username: seedAuthors[key].username,
        email: '',
        avatar: seedAuthors[key].avatar,
        bio: seedAuthors[key].bio,
        walletAddress: address
      });
      setIsOwnProfile(false);
    } else {
      // Generic guest profile
      setProfile({
        username: `Author ${address.slice(0, 6)}`,
        email: '',
        avatar: '👤',
        bio: 'TipToStore user profile.',
        walletAddress: address
      });
      setIsOwnProfile(false);
    }
  }, [address, connectedAddress]);

  // Find stories by this author
  const authorStories = stories.filter(
    s => s.authorFull.toLowerCase() === address.toLowerCase() || s.author.toLowerCase() === address.toLowerCase()
  );

  const totalTips = authorStories.reduce((a, s) => a + s.tipsUSDFC, 0);
  const totalLikes = authorStories.reduce((a, s) => a + s.likes, 0);
  const totalViews = authorStories.reduce((a, s) => a + s.views, 0);
  const activeStories = authorStories.filter(s => s.status === 'ACTIVE').length;

  const givenTips = tipHistory;

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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Stories',     value: authorStories.length, color:'var(--accent-forest)', icon:'📚' },
          { label: 'USDFC Earned',value: `$${totalTips.toFixed(2)}`, color:'var(--accent-forest)', icon:'💰' },
          { label: 'Total Likes', value: totalLikes.toLocaleString(), color:'var(--accent-clay)', icon:'❤️' },
          { label: 'Total Views', value: totalViews.toLocaleString(), color:'var(--accent-sage)', icon:'👁️' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <span>{s.icon}</span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-extrabold" style={{color: s.color}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Author's stories */}
      <h2 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-4">📚 Published Stories</h2>
      {authorStories.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border border-[var(--border-strong)] bg-[var(--bg-card)] mb-10">
          <p className="text-[var(--text-secondary)] text-sm mb-4">No stories published yet under this profile.</p>
          <button
            onClick={() => onNavigate('write')}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white btn-primary transition-all"
          >
            ✍️ Write First Story
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
          <h2 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-4">💸 Tipping History</h2>
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] overflow-hidden shadow-sm mb-6">
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
        </>
      )}
    </div>
  );
}
