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
  if (pct > 50) return 'linear-gradient(90deg,#10b981,#34d399)';
  if (pct > 20) return 'linear-gradient(90deg,#f59e0b,#fbbf24)';
  return 'linear-gradient(90deg,#ef4444,#f87171)';
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
      style={{ background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 border border-emerald-500/20 shadow-2xl animate-fade-in-up"
        style={{ background: 'rgba(8,15,28,0.97)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Tip & Extend Storage</h3>
            <p className="text-xs text-slate-500 mt-0.5">100% goes to the author • Storage auto-renewed on Filecoin</p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors text-xl leading-none p-1">✕</button>
        </div>

        {/* Story preview */}
        <div
          className="rounded-xl p-3.5 mb-5 border border-white/5"
          style={{ background: 'rgba(2,8,16,0.7)' }}
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
          <p className="text-sm font-semibold text-slate-200 truncate">{story.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 mb-2">by {story.author}</p>
          {/* Storage bar */}
          <div className="h-1.5 rounded-full overflow-hidden bg-white/6">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, background: barColor(pct) }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {story.hoursRemaining > 0
              ? `${story.hoursRemaining}h storage remaining (${pct}%)`
              : '⚡ Storage expired — tip to resurrect!'}
          </p>
        </div>

        {/* Preset amounts */}
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Choose Amount (USDFC)</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setSelected(p); setCustom(''); }}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                selected === p
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-white/7 text-slate-400 hover:border-white/15 hover:text-white'
              }`}
              style={{ background: selected === p ? undefined : 'rgba(255,255,255,0.03)' }}
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
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-white/7 text-slate-200 placeholder-slate-600 mb-4 focus:outline-none focus:border-emerald-500/40 transition-all"
          style={{ background: 'rgba(2,8,16,0.8)' }}
          min="0.1"
          step="0.1"
        />

        {finalAmount > 0 && (
          <div className="flex justify-between text-xs text-slate-500 mb-4 px-1">
            <span>Tip amount</span>
            <span className="text-emerald-400 font-semibold">${finalAmount} USDFC → +{addHours}h storage</span>
          </div>
        )}

        {!isConnected && (
          <p className="text-xs text-amber-400 text-center mb-3 bg-amber-500/10 border border-amber-500/20 rounded-lg py-2">
            ⚠️ Connect your wallet to send a tip
          </p>
        )}

        <button
          disabled={!isConnected || finalAmount <= 0 || loading}
          onClick={handleSend}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#059669,#0ea5e9)' }}
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

        <p className="text-center text-xs text-slate-600 mt-3">
          Powered by Filecoin Synapse SDK • Calibration Testnet
        </p>
      </div>
    </div>
  );
}
