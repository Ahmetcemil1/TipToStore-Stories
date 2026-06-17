'use client';

import React from 'react';
import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author' | 'library';

interface LandingViewProps {
  stories: Story[];
  onNavigate: (page: Page, id?: string) => void;
  onAuthClick: () => void;
  session: unknown;
}

export function LandingView({ stories, onNavigate, onAuthClick, session }: LandingViewProps) {
  const activeStoriesCount = stories.filter(s => s.status !== 'EXPIRED').length;
  const decayedStoriesCount = stories.filter(s => s.status === 'EXPIRED').length;
  const totalTips = stories.reduce((sum, s) => sum + s.tipsUSDFC, 0);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-[var(--border-subtle)] bg-[radial-gradient(ellipse_at_top_right,var(--accent-forest)/5,transparent_50%)]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-[var(--accent-forest)]/20 bg-[var(--accent-forest)]/5 text-[var(--accent-forest)] mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-forest)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-forest)]"></span>
            </span>
            <span>Powered by Filecoin Calibration Testnet & Synapse SDK</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-serif tracking-tight leading-tight mb-6 max-w-4xl mx-auto animate-fade-in-up">
            Decentralized Literature, <br/>
            <span className="text-[var(--accent-forest)] bg-[linear-gradient(to_right,var(--accent-forest),var(--accent-sage))] bg-clip-text text-transparent">Sustained by Time & Tipping</span>
          </h1>

          <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up">
            Welcome to TipToStore, the world&apos;s first reader-supported library where stories live as permanent Filecoin storage deals. Popular works survive. Ignored manuscripts decay back into the void.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up">
            <button
              onClick={() => onNavigate('library')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white btn-primary shadow-lg shadow-[var(--accent-forest)]/10 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Digital Library
            </button>
            <button
              onClick={() => {
                if (session) {
                  onNavigate('write');
                } else {
                  onAuthClick();
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Publish a Manuscript
            </button>
          </div>

          {/* Core Stats in Hero */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto border border-[var(--border-strong)] bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-[var(--accent-forest)]">{activeStoriesCount}</p>
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">Active Deals</p>
            </div>
            <div className="text-center border-x border-[var(--border-strong)]">
              <p className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">${totalTips.toFixed(2)}</p>
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">USDFC Contributed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-[var(--accent-clay)]">{decayedStoriesCount}</p>
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">Decayed Items</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D-like Feature Showcase Cards */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-serif mb-3">Protocol Architecture</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Every manuscript is packed with its metadata and embedded Base64 illustration imagery, then pinned directly to decentralized rails.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: IPFS Pinning & Filecoin Deals */}
          <div className="group rounded-2xl p-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-80">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-forest)]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-forest)]/10 text-[var(--accent-forest)] flex items-center justify-center mb-5 font-bold text-lg">
                📦
              </div>
              <h3 className="text-lg font-bold font-serif mb-2">1. Pinned to IPFS</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                When you publish a book, chapter titles, text content, cover graphics, and embedded images are compiled, encrypted, and mapped directly to a unique IPFS CID payload.
              </p>
            </div>
            <span className="text-[10px] text-[var(--accent-forest)] font-extrabold tracking-wider uppercase mt-4 block">Secured in Calibration Network</span>
          </div>

          {/* Card 2: community-led storage deals */}
          <div className="group rounded-2xl p-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-80">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-ochre)]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-ochre)]/10 text-[var(--accent-ochre)] flex items-center justify-center mb-5 font-bold text-lg">
                ⏳
              </div>
              <h3 className="text-lg font-bold font-serif mb-2">2. Storage Life Decays</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                Decentralized storage requires active leases. Each published item starts with a lease of 7 days (or 30 days for your first story!). The hours countdown in real-time.
              </p>
            </div>
            <span className="text-[10px] text-[var(--accent-ochre)] font-extrabold tracking-wider uppercase mt-4 block">Real-Time Decay Lifecycle</span>
          </div>

          {/* Card 3: community tipping split */}
          <div className="group rounded-2xl p-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-80">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-clay)]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-clay)]/10 text-[var(--accent-clay)] flex items-center justify-center mb-5 font-bold text-lg">
                🪙
              </div>
              <h3 className="text-lg font-bold font-serif mb-2">3. Tip Split Economics</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                Readers tip in USDFC to support authors. 90% goes directly to the author cüzdan address, while 10% platform protocol cut is kept to sustain IPFS pinning gateways.
              </p>
            </div>
            <span className="text-[10px] text-[var(--accent-clay)] font-extrabold tracking-wider uppercase mt-4 block">10% Platform / 90% Writer Split</span>
          </div>
        </div>
      </section>

      {/* 3D Visual Flow Section */}
      <section className="py-16 border-t border-b border-[var(--border-strong)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-5 leading-snug">
                An Elegant Reader Experience Resembling a Digital Bookshop
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                Stories are cataloged as tangible books. Readers can see the cover art, read the blurb, inspect the word counts, and look at the real-time Filecoin lease health.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-lg mt-0.5">📚</span>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-0.5">Premium Library Catalog</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Displays stories as digital hardcover books with rich cover textures, customizable gradients, and metadata overlays.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg mt-0.5">💸</span>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-0.5">Peer-to-Peer Tipping</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Payments are settled directly on-chain. There is no central intermediary holding user tips, making transaction withdrawals instant.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Layout Mockup using pure CSS */}
            <div className="relative h-80 flex items-center justify-center">
              <div className="w-56 h-76 rounded-2xl border-4 border-white bg-gradient-to-br from-[var(--accent-forest)] to-[var(--accent-sage)] shadow-2xl relative rotate-[-6deg] translate-x-[-30px] z-10 transition-transform duration-500 hover:rotate-0 hover:translate-x-0 hover:scale-105 group">
                <div className="absolute inset-0 bg-black/10 opacity-60 rounded-xl" />
                <div className="p-5 flex flex-col justify-between h-full relative z-20 text-white font-serif">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-sans font-bold bg-white/20 px-2 py-0.5 rounded-full">ACTIVE DEAL</span>
                    <h3 className="text-lg font-bold mt-4 leading-tight">The Last Filecoin Node</h3>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans font-bold text-white/85">BY ARCHIVIST</p>
                  </div>
                </div>
              </div>

              <div className="w-56 h-76 rounded-2xl border-4 border-white bg-gradient-to-br from-[var(--accent-clay)] to-[var(--accent-ochre)] shadow-2xl absolute rotate-[6deg] translate-x-[40px] translate-y-[10px] hover:z-20 transition-transform duration-500 hover:rotate-0 hover:translate-x-0 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 opacity-60 rounded-xl" />
                <div className="p-5 flex flex-col justify-between h-full relative z-20 text-white font-serif">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-sans font-bold bg-white/20 px-2 py-0.5 rounded-full">DECAYING</span>
                    <h3 className="text-lg font-bold mt-4 leading-tight">Neo-Istanbul Archives</h3>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans font-bold text-white/85">BY PROTOCOL PHILOSOPHER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center px-6 bg-[radial-gradient(ellipse_at_bottom,var(--accent-forest)/5,transparent_50%)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-4">Start Supporting Decentralized Literature</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto mb-8 font-medium">
            Explore the library to tip your favorite authors and keep their Filecoin deals active, or sign in to publish your own work to the network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('library')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white btn-primary shadow-lg cursor-pointer"
            >
              Enter Digital Library
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-black/30 transition-all cursor-pointer bg-[var(--bg-card)]"
            >
              Learn More About Filecoin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
