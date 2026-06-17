'use client';

type Page = 'home' | 'about' | 'write' | 'story' | 'author' | 'library';

interface AboutViewProps {
  onNavigate: (page: Page, id?: string) => void;
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Write & Upload',
    desc: 'Authors write stories on TipToStore. The content is encoded, pinned to IPFS, and registered as a Filecoin dataset via the Synapse SDK. First story gets 30 days free!',
    color: 'var(--accent-forest)',
  },
  {
    step: '02',
    title: 'Filecoin Deal Opens',
    desc: 'A storage deal is created on-chain. Every 30 seconds the storage provider submits a cryptographic PDP proof to the Filecoin network confirming your data is safe.',
    color: 'var(--accent-sage)',
  },
  {
    step: '03',
    title: 'Anyone Reads for Free',
    desc: 'Stories are always free to read. There are no paywalls. The content lives on IPFS — a CID cannot be deleted or censored.',
    color: 'var(--accent-forest)',
  },
  {
    step: '04',
    title: 'Readers Tip Authors',
    desc: "Readers send tips in USDFC to support authors they love. 90% of tips go directly to the author's withdrawable balance, and 10% is collected as a platform fee to support server hosting and IPFS pinning.",
    color: 'var(--accent-ochre)',
  },
  {
    step: '05',
    title: 'Author Manages Storage',
    desc: 'Authors control their own storage destiny. From their profile, they can allocate their earned balance to extend specific stories\' Filecoin storage leases — or withdraw to their wallet.',
    color: 'var(--accent-sage)',
  },
  {
    step: '06',
    title: 'Survive, Decay or Resurrect',
    desc: 'Stories without a funded storage lease decay and disappear. But they can be resurrected: readers tip the author, the author allocates the balance to re-open a Filecoin storage deal.',
    color: 'var(--accent-clay)',
  },
  {
    step: '07',
    title: 'Viral Rewards',
    desc: 'Stories that cross 10,000 community likes trigger a 5 FIL network bonus payout to the author — rewarding creators who drive traffic to the Filecoin ecosystem.',
    color: 'var(--accent-forest)',
  },
];

const TECH_STACK = [
  { name: 'Filecoin Calibration', desc: 'Testnet for storage deals & payments' },
  { name: 'Synapse SDK', desc: 'Warm storage, PDP proofs, payment rails' },
  { name: 'IPFS / UCAN', desc: 'Content-addressed immutable storage' },
  { name: 'USDFC', desc: 'FRC-46 stablecoin for tipping' },
  { name: 'RainbowKit + wagmi', desc: 'MetaMask, WalletConnect, Coinbase' },
  { name: 'Next.js 16', desc: 'React framework with SSR' },
];

function getStepIcon(step: string) {
  switch (step) {
    case '01':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case '02':
      return (
        <svg className="w-5 h-5 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case '03':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case '04':
      return (
        <svg className="w-5 h-5 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
        </svg>
      );
    case '05':
      return (
        <svg className="w-5 h-5 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case '06':
      return (
        <svg className="w-5 h-5 text-[var(--accent-clay)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case '07':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8zm0 0v6m-3 0h6M4 9h3v1H4V9zm13 0h3v1h-3V9z" />
        </svg>
      );
  }
}

function getTechIcon(name: string) {
  switch (name) {
    case 'Filecoin Calibration':
      return (
        <svg className="w-6 h-6 text-[var(--accent-sage)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
        </svg>
      );
    case 'Synapse SDK':
      return (
        <svg className="w-6 h-6 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'IPFS / UCAN':
      return (
        <svg className="w-6 h-6 text-[var(--accent-forest)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'USDFC':
      return (
        <svg className="w-6 h-6 text-[var(--accent-forest)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
        </svg>
      );
    case 'RainbowKit + wagmi':
      return (
        <svg className="w-6 h-6 text-[var(--accent-ochre)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case 'Next.js 16':
      return (
        <svg className="w-6 h-6 text-[var(--accent-clay)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}

function getFormatIcon(label: string) {
  switch (label) {
    case 'Story Length':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'Cover Photos':
      return (
        <svg className="w-5 h-5 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'Storage Cost':
      return (
        <svg className="w-5 h-5 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'Data Format':
      return (
        <svg className="w-5 h-5 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case 'Proof System':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'Payments':
      return (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
        </svg>
      );
  }
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[var(--accent-forest)]/20 text-[var(--accent-forest)] bg-[var(--accent-forest)]/5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-forest)] inline-block" />
          Built for FilecoinTLDR Builder Challenge 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight mb-6 text-[var(--text-primary)]">
          TipToStore Stories
        </h1>
        <p className="serif-body text-[var(--text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
          A community-funded decentralized publishing platform where stories live or die based on how much the community values them — powered by Filecoin&apos;s cryptographic storage economy.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-8 px-6 py-3 font-bold text-white btn-primary shadow-sm"
        >
          Explore Stories
        </button>
      </div>

      {/* Core concept */}
      <div className="rounded-2xl p-6 mb-12 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
        <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-3">The Core Idea</h2>
        <p className="serif-body text-[var(--text-secondary)] mb-4 text-sm sm:text-base">
          Traditional publishing platforms host your content on centralized servers. They can delete it, monetize it, or shut down. With TipToStore, your story is encrypted into an IPFS content hash and stored by independent Filecoin storage providers who are <em>paid in cryptocurrency</em> to keep it alive.
        </p>
        <p className="serif-body text-[var(--text-secondary)] text-sm sm:text-base">
          The survival of each story becomes a <strong className="text-[var(--text-primary)] font-serif">market signal</strong>: the community votes with USDFC tips. Stories that resonate get funded. Stories that don&apos;t get forgotten — just like they would in any library that runs out of shelf space. The difference is, here it&apos;s transparent, algorithmic, and decentralized.
        </p>
      </div>

      {/* How it works */}
      <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)] mb-6">How It Works</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {HOW_IT_WORKS.map((step, i) => (
          <div
            key={step.step}
            className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm transition-all hover:border-[var(--accent-forest)]/30 animate-fade-in-up"
            style={{ animationDelay:`${i*60}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${step.color}10`, border:`1px solid ${step.color}25`}}>
                {getStepIcon(step.step)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--text-muted)]">{step.step}</span>
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">{step.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story format */}
      <div className="rounded-2xl p-6 mb-12 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
        <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-4">Story Format & Filecoin Value</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Story Length', value: 'Unlimited', sub: 'Multi-chapter support · No page limit' },
            { label: 'Cover Photos', value: 'Supported', sub: 'Images pinned to IPFS alongside content' },
            { label: 'Storage Cost', value: '$0.05/mo', sub: 'Per story · Funded by community tips' },
            { label: 'Data Format', value: 'IPFS CID', sub: 'Immutable content address · Cannot 404' },
            { label: 'Proof System', value: 'PDP (PoRep)', sub: 'Proof every 30s · On-chain verification' },
            { label: 'Payments', value: 'USDFC', sub: 'FRC-46 stablecoin · Direct to author' },
          ].map(f => (
            <div key={f.label} className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-secondary)] text-left">
              <span className="mb-2.5 block">{getFormatIcon(f.label)}</span>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-0.5">{f.label}</p>
              <p className="font-bold text-[var(--text-primary)] text-sm">{f.value}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)] mb-6">Tech Stack</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {TECH_STACK.map(t => (
          <div key={t.name} className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm flex items-center gap-3">
            {getTechIcon(t.name)}
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">{t.name}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center rounded-2xl p-8 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm relative overflow-hidden">
        <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)] mb-3">Ready to preserve your story?</h2>
        <p className="serif-body text-[var(--text-secondary)] mb-6 text-sm max-w-md mx-auto leading-relaxed">
          Write once. Let the community fund its existence. Live forever — or fade gracefully.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => onNavigate('write')}
            className="px-6 py-3 font-bold text-white btn-primary shadow-sm"
          >
            Publish a Story
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 font-semibold btn-ghost shadow-sm"
          >
            Browse Stories
          </button>
        </div>
      </div>
    </div>
  );
}
