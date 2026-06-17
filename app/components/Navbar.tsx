'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page, id?: string) => void;
  session: { username: string; email: string; avatar: string; bio: string; walletAddress: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, session, onAuthClick, onLogout }: NavbarProps) {
  const { isConnected, address } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: 'Stories', icon: '📚' },
    { id: 'write', label: 'Publish', icon: '✍️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 flex-shrink-0 group text-left"
        >
          <div className="relative w-9 h-9">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-forest)] flex items-center justify-center text-lg shadow-md group-hover:bg-[var(--accent-forest-hover)] transition-all">
              📚
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-forest)] border border-[var(--bg-primary)]" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-lg tracking-tight font-serif text-[var(--text-primary)]">
              TipToStore
              <span className="font-light text-[var(--text-secondary)]"> Stories</span>
            </span>
          </div>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === l.id
                  ? 'bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] font-semibold border border-[var(--accent-forest)]/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </button>
          ))}
          {session && (
            <button
              onClick={() => onNavigate('author', session.walletAddress)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'author' && session.walletAddress
                  ? 'bg-[var(--accent-ochre)]/10 text-[var(--accent-ochre)] font-semibold border border-[var(--accent-ochre)]/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
              }`}
            >
              <span className="text-base">👤</span>
              My Profile ({session.username})
            </button>
          )}
        </div>

        {/* Wallet, login state & mobile menu */}
        <div className="flex items-center gap-3">
          {/* Web3 Wallet */}
          <div className="wallet-btn-wrapper hidden sm:block">
            <ConnectButton
              showBalance={false}
              chainStatus="none"
              accountStatus="avatar"
              label="Connect Wallet"
            />
          </div>

          {/* Account session login button */}
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--text-primary)] hidden lg:inline-block">
                {session.avatar} {session.username}
              </span>
              <button
                onClick={onLogout}
                className="btn-ghost text-xs font-semibold px-3 py-1.5 rounded-lg border"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="btn-primary text-xs font-bold px-4 py-1.5 rounded-lg"
            >
              Sign In / Register
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border-strong)] bg-[var(--bg-card)] px-4 py-3 space-y-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                currentPage === l.id
                  ? 'bg-[var(--accent-forest)]/10 text-[var(--accent-forest)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
              }`}
            >
              {l.icon} {l.label}
            </button>
          ))}
          {session && (
            <button
              onClick={() => { onNavigate('author', session.walletAddress); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all text-left"
            >
              👤 My Profile ({session.username})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
