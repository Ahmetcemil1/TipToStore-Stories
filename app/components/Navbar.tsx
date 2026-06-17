'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page, id?: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { isConnected, address } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: 'Stories', icon: '📚' },
    { id: 'write', label: 'Publish', icon: '✍️' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#020810]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 flex-shrink-0 group"
        >
          <div className="relative w-9 h-9">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-lg shadow-lg group-hover:shadow-emerald-500/30 transition-all">
              📚
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#020810] animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-lg tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">TipToStore</span>
              <span className="text-white"> Stories</span>
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
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </button>
          ))}
          {isConnected && address && (
            <button
              onClick={() => onNavigate('author', address)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'author'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">👤</span>
              Profile
            </button>
          )}
        </div>

        {/* Wallet + mobile menu */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Calibration
          </div>

          {/* Wallet */}
          <div className="wallet-btn-wrapper">
            <ConnectButton
              showBalance={false}
              chainStatus="none"
              accountStatus="avatar"
              label="Connect"
            />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#020810]/95 px-4 py-3 space-y-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                currentPage === l.id
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.icon} {l.label}
            </button>
          ))}
          {isConnected && address && (
            <button
              onClick={() => { onNavigate('author', address); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              👤 My Profile
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
