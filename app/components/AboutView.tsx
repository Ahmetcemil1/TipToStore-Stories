'use client';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface AboutViewProps {
  onNavigate: (page: Page, id?: string) => void;
}

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '✍️',
    title: 'Write & Upload',
    desc: 'Authors write stories on TipToStore. The content is encoded, pinned to IPFS, and registered as a Filecoin dataset via the Synapse SDK.',
    color: 'var(--accent-forest)',
  },
  {
    step: '02',
    icon: '⛓️',
    title: 'Filecoin Deal Opens',
    desc: 'A storage deal is created on-chain. Every 30 seconds the storage provider submits a cryptographic PDP proof to the Filecoin network confirming your data is safe.',
    color: 'var(--accent-sage)',
  },
  {
    step: '03',
    icon: '📖',
    title: 'Anyone Reads for Free',
    desc: 'Stories are always free to read. There are no paywalls. The content lives on IPFS — a CID cannot be deleted or censored.',
    color: 'var(--accent-forest)',
  },
  {
    step: '04',
    icon: '💸',
    title: 'Readers Tip in USDFC',
    desc: "Readers can send small tips in USDFC (Filecoin's stablecoin). 100% goes to the author. Each dollar of tips automatically extends the Filecoin storage lease by 24 hours.",
    color: 'var(--accent-ochre)',
  },
  {
    step: '05',
    icon: '♾️',
    title: 'Survive or Decay',
    desc: 'Popular stories get tipped more and live longer. Ignored stories slowly lose their storage lease and eventually "decay" — disappearing from the decentralized web.',
    color: 'var(--accent-clay)',
  },
  {
    step: '06',
    icon: '🏆',
    title: 'Viral Rewards',
    desc: 'Stories that cross 10,000 community likes trigger a 5 FIL network bonus payout to the author — rewarding creators who drive traffic to the Filecoin ecosystem.',
    color: 'var(--accent-forest)',
  },
];

const TECH_STACK = [
  { name: 'Filecoin Calibration', desc: 'Testnet for storage deals & payments', icon: '🌐' },
  { name: 'Synapse SDK', desc: 'Warm storage, PDP proofs, payment rails', icon: '⚙️' },
  { name: 'IPFS / UCAN', desc: 'Content-addressed immutable storage', icon: '📦' },
  { name: 'USDFC', desc: 'FRC-46 stablecoin for tipping', icon: '💵' },
  { name: 'RainbowKit + wagmi', desc: 'MetaMask, WalletConnect, Coinbase', icon: '🌈' },
  { name: 'Next.js 16', desc: 'React framework with SSR', icon: '⚡' },
];

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
          A community-funded decentralized publishing platform where stories live or die based on how much the community values them — powered by Filecoin's cryptographic storage economy.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-8 px-6 py-3 font-bold text-white btn-primary shadow-sm"
        >
          📚 Explore Stories
        </button>
      </div>

      {/* Core concept */}
      <div className="rounded-2xl p-6 mb-12 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
        <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-3">🧠 The Core Idea</h2>
        <p className="serif-body text-[var(--text-secondary)] mb-4 text-sm sm:text-base">
          Traditional publishing platforms host your content on centralized servers. They can delete it, monetize it, or shut down. With TipToStore, your story is encrypted into an IPFS content hash and stored by independent Filecoin storage providers who are <em>paid in cryptocurrency</em> to keep it alive.
        </p>
        <p className="serif-body text-[var(--text-secondary)] text-sm sm:text-base">
          The survival of each story becomes a <strong className="text-[var(--text-primary)] font-serif">market signal</strong>: the community votes with USDFC tips. Stories that resonate get funded. Stories that don't get forgotten — just like they would in any library that runs out of shelf space. The difference is, here it's transparent, algorithmic, and decentralized.
        </p>
      </div>

      {/* How it works */}
      <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)] mb-6">⚙️ How It Works</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {HOW_IT_WORKS.map((step, i) => (
          <div
            key={step.step}
            className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm transition-all hover:border-[var(--accent-forest)]/30 animate-fade-in-up"
            style={{ animationDelay:`${i*60}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:`${step.color}10`, border:`1px solid ${step.color}25`}}>
                {step.icon}
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
        <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-4">📝 Story Format & Filecoin Value</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Story Length', value: 'Unlimited', sub: 'Multi-chapter support · No page limit', icon: '📄' },
            { label: 'Cover Photos', value: 'Supported', sub: 'Images pinned to IPFS alongside content', icon: '🖼️' },
            { label: 'Storage Cost', value: '~$0.12/mo', sub: 'Per story · Funded by community tips', icon: '💾' },
            { label: 'Data Format', value: 'IPFS CID', sub: 'Immutable content address · Cannot 404', icon: '🔗' },
            { label: 'Proof System', value: 'PDP (PoRep)', sub: 'Proof every 30s · On-chain verification', icon: '🔐' },
            { label: 'Payments', value: 'USDFC', sub: 'FRC-46 stablecoin · Direct to author', icon: '💰' },
          ].map(f => (
            <div key={f.label} className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-secondary)] text-left">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-0.5">{f.label}</p>
              <p className="font-bold text-[var(--text-primary)] text-sm">{f.value}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)] mb-6">🛠️ Tech Stack</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {TECH_STACK.map(t => (
          <div key={t.name} className="rounded-xl p-4 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
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
            ✍️ Publish a Story
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 font-semibold btn-ghost shadow-sm"
          >
            📚 Browse Stories
          </button>
        </div>
      </div>
    </div>
  );
}
