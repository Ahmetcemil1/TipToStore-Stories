'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Story } from '../types';

interface TipModalProps {
  story: Story;
  onClose: () => void;
  onTip: (storyId: string, amount: number) => void;
}

function storagePercent(hours: number, max: number) {
  if (max === 0) return 0;
  return Math.min(100, Math.round((hours / max) * 100));
}

function barColor(pct: number) {
  if (pct > 50) return 'var(--accent-forest)';
  if (pct > 20) return 'var(--accent-ochre)';
  return 'var(--accent-clay)';
}

const PRESETS = [1, 5, 10, 25];

export function TipModal({ story, onClose, onTip }: TipModalProps) {
  const { isConnected } = useAccount();
  const [selected, setSelected] = useState<number | null>(5);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);

  const finalAmount = selected ?? (custom ? parseFloat(custom) : 0);
  const pct = storagePercent(story.hoursRemaining, story.maxHours);
  const addHours = finalAmount > 0 ? Math.round(finalAmount * 24) : 0;

  const handleSend = async () => {
    if (!isConnected) return;
    if (finalAmount <= 0) return;
    setLoading(true);
    // Simulate tx delay
    await new Promise(r => setTimeout(r, 1800));
    onTip(story.id, finalAmount);
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(27,30,36,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 border border-[var(--border-subtle)] shadow-xl animate-fade-in-up bg-[var(--bg-card)]"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">Tip & Extend Storage</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">100% goes to the author • Storage auto-renewed on Filecoin</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl leading-none p-1">✕</button>
        </div>

        {/* Story preview */}
        <div
          className="rounded-xl p-3.5 mb-5 border border-[var(--border-strong)] bg-[var(--bg-secondary)]"
        >
          {/* Cover thumbnail */}
          {story.coverImage && (
            <div
              className="h-16 rounded-lg mb-2.5 overflow-hidden"
              style={{
                background: story.coverImage.startsWith('linear') ? story.coverImage : undefined,
              }}
            >
              {!story.coverImage.startsWith('linear') && (
                <img src={story.coverImage} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <p className="text-sm font-bold font-serif text-[var(--text-primary)] truncate">{story.title}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-2">by {story.author}</p>
          {/* Storage bar */}
          <div className="h-1.5 rounded-full overflow-hidden bg-black/5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, background: barColor(pct) }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">
            {story.hoursRemaining > 0
              ? `${story.hoursRemaining}h storage remaining (${pct}%)`
              : '⚡ Storage expired — tip to resurrect!'}
          </p>
        </div>

        {/* Preset amounts */}
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Choose Amount (USDFC)</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setSelected(p); setCustom(''); }}
              className={`py-2 rounded-xl text-sm font-bold transition-all border ${
                selected === p
                  ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)] shadow-sm'
                  : 'border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              ${p}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Custom amount…"
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null); }}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] mb-4 focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
          min="0.1"
          step="0.1"
        />

        {finalAmount > 0 && (
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-4 px-1">
            <span>Tip amount</span>
            <span className="text-[var(--accent-forest)] font-bold">${finalAmount} USDFC → +{addHours}h storage</span>
          </div>
        )}

        {!isConnected && (
          <p className="text-xs text-[var(--accent-ochre)] text-center mb-3 bg-[var(--accent-ochre)]/10 border border-[var(--accent-ochre)]/20 rounded-lg py-2">
            ⚠️ Connect your wallet to send a tip
          </p>
        )}

        <button
          disabled={!isConnected || finalAmount <= 0 || loading}
          onClick={handleSend}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending transaction…
            </span>
          ) : (
            `⚡ Send $${finalAmount > 0 ? finalAmount : '?'} USDFC`
          )}
        </button>

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
          Powered by Filecoin Synapse SDK • Calibration Testnet
        </p>
      </div>
    </div>
  );
}
