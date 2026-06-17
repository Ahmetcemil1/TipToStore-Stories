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
    color: '#10b981',
  },
  {
    step: '02',
    icon: '⛓️',
    title: 'Filecoin Deal Opens',
    desc: 'A storage deal is created on-chain. Every 30 seconds the storage provider submits a cryptographic PDP proof to the Filecoin network confirming your data is safe.',
    color: '#38bdf8',
  },
  {
    step: '03',
    icon: '📖',
    title: 'Anyone Reads for Free',
    desc: 'Stories are always free to read. There are no paywalls. The content lives on IPFS — a CID cannot be deleted or censored.',
    color: '#8b5cf6',
  },
  {
    step: '04',
    icon: '💸',
    title: 'Readers Tip in USDFC',
    desc: 'Readers can send small tips in USDFC (Filecoin\'s stablecoin). 100% goes to the author. Each dollar of tips automatically extends the Filecoin storage lease by 24 hours.',
    color: '#f59e0b',
  },
  {
    step: '05',
    icon: '♾️',
    title: 'Survive or Decay',
    desc: 'Popular stories get tipped more and live longer. Ignored stories slowly lose their storage lease and eventually "decay" — disappearing from the decentralized web.',
    color: '#ef4444',
  },
  {
    step: '06',
    icon: '🏆',
    title: 'Viral Rewards',
    desc: 'Stories that cross 10,000 community likes trigger a 5 FIL network bonus payout to the author — rewarding creators who drive traffic to the Filecoin ecosystem.',
    color: '#a78bfa',
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-emerald-500/20 text-emerald-400" style={{background:'rgba(16,185,129,0.08)'}}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Built for FilecoinTLDR Builder Challenge 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
          <span style={{background:'linear-gradient(135deg,#10b981,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            TipToStore Stories
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A community-funded decentralized publishing platform where stories live or die based on how much the community values them — powered by Filecoin's cryptographic storage economy.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
          style={{background:'linear-gradient(135deg,#059669,#0ea5e9)'}}
        >
          📚 Explore Stories
        </button>
      </div>

      {/* Core concept */}
      <div className="rounded-2xl p-6 mb-12 border border-white/5 relative overflow-hidden" style={{background:'rgba(8,15,28,0.85)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(135deg,rgba(16,185,129,0.04),transparent 60%)'}} />
        <h2 className="text-xl font-bold text-white mb-3">🧠 The Core Idea</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Traditional publishing platforms host your content on centralized servers. They can delete it, monetize it, or shut down. With TipToStore, your story is encrypted into an IPFS content hash and stored by independent Filecoin storage providers who are <em>paid in cryptocurrency</em> to keep it alive.
        </p>
        <p className="text-slate-400 leading-relaxed">
          The survival of each story becomes a <strong className="text-white">market signal</strong>: the community votes with USDFC tips. Stories that resonate get funded. Stories that don't get forgotten — just like they would in any library that runs out of shelf space. The difference is, here it's transparent, algorithmic, and decentralized.
        </p>
      </div>

      {/* How it works */}
      <h2 className="text-2xl font-bold text-white mb-6">⚙️ How It Works</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {HOW_IT_WORKS.map((step, i) => (
          <div
            key={step.step}
            className="rounded-2xl p-5 border border-white/5 transition-all hover:border-white/10 animate-fade-in-up"
            style={{ background:'rgba(8,15,28,0.7)', animationDelay:`${i*60}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:`${step.color}18`,border:`1px solid ${step.color}30`}}>
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-slate-600">{step.step}</span>
                  <h3 className="font-bold text-white text-sm">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story format */}
      <div className="rounded-2xl p-6 mb-12 border border-sky-500/15" style={{background:'rgba(8,15,28,0.85)'}}>
        <h2 className="text-xl font-bold text-white mb-4">📝 Story Format & Filecoin Value</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Story Length', value: 'Unlimited', sub: 'Multi-chapter support · No page limit', icon: '📄' },
            { label: 'Cover Photos', value: 'Supported', sub: 'Images pinned to IPFS alongside content', icon: '🖼️' },
            { label: 'Storage Cost', value: '~$0.12/mo', sub: 'Per story · Funded by community tips', icon: '💾' },
            { label: 'Data Format', value: 'IPFS CID', sub: 'Immutable content address · Cannot 404', icon: '🔗' },
            { label: 'Proof System', value: 'PDP (PoRep)', sub: 'Proof every 30s · On-chain verification', icon: '🔐' },
            { label: 'Payments', value: 'USDFC', sub: 'FRC-46 stablecoin · Direct to author', icon: '💰' },
          ].map(f => (
            <div key={f.label} className="rounded-xl p-4 border border-white/5" style={{background:'rgba(2,8,16,0.6)'}}>
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <p className="text-xs text-slate-500 mb-0.5">{f.label}</p>
              <p className="font-bold text-white text-sm">{f.value}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <h2 className="text-2xl font-bold text-white mb-6">🛠️ Tech Stack</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {TECH_STACK.map(t => (
          <div key={t.name} className="rounded-xl p-4 border border-white/5 flex items-center gap-3" style={{background:'rgba(8,15,28,0.7)'}}>
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div>
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs text-slate-500">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center rounded-2xl p-8 border border-emerald-500/15 relative overflow-hidden" style={{background:'rgba(8,15,28,0.85)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at center,rgba(16,185,129,0.06),transparent 70%)'}} />
        <h2 className="text-2xl font-bold text-white mb-3">Ready to preserve your story?</h2>
        <p className="text-slate-400 mb-6 text-sm">Write once. Let the community fund its existence. Live forever — or fade gracefully.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => onNavigate('write')}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20"
            style={{background:'linear-gradient(135deg,#059669,#0ea5e9)'}}
          >
            ✍️ Publish a Story
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5"
          >
            📚 Browse Stories
          </button>
        </div>
      </div>
    </div>
  );
}
