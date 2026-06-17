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

  const links: { id: Page; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Stories',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'write',
      label: 'Publish',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 flex-shrink-0 group text-left"
        >
          <div className="relative w-9 h-9">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-forest)] flex items-center justify-center text-white shadow-sm group-hover:bg-[var(--accent-forest-hover)] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
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
        <div className="hidden md:flex items-center gap-1.5">
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
              {l.icon}
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile ({session.username})
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
              Sign In
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
                  ? 'bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
              }`}
            >
              {l.icon}
              {l.label}
            </button>
          ))}
          {session && (
            <button
              onClick={() => { onNavigate('author', session.walletAddress); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all text-left"
            >
              <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile ({session.username})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
