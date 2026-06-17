'use client';

import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Story } from '../types';

interface TipModalProps {
  story: Story;
  onClose: () => void;
  onTip: (storyId: string, amount: number, txHash?: string) => void;
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

// Reader support tipping presets
const PRESETS = [1.00, 5.00, 10.00, 25.00];

export function TipModal({ story, onClose, onTip }: TipModalProps) {
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const [selected, setSelected] = useState<number | null>(0.10);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const finalAmount = selected ?? (custom ? parseFloat(custom) : 0);
  const pct = storagePercent(story.hoursRemaining, story.maxHours);
  


  // Attempt real transaction
  const handleSend = async () => {
    if (!isConnected) {
      setTxError('Please connect your Web3 wallet first.');
      return;
    }
    if (finalAmount <= 0) return;
    
    setLoading(true);
    setTxError(null);

    try {
      // 1. Send actual Testnet FIL transaction to the author (0.1 FIL per $0.10 USDFC)
      const filValue = (finalAmount * 1.0).toString(); // e.g. $0.10 tip = 1 FIL
      
      const tx = await sendTransactionAsync({
        to: story.authorFull as `0x${string}`,
        value: parseEther(filValue),
      });

      // Transaction submitted successfully
      onTip(story.id, finalAmount, tx);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Transaction failed:', err);
      const error = err as Error;
      setTxError(error.message || 'Transaction rejected or failed. Check your wallet balance.');
      setLoading(false);
    }
  };

  // Fallback simulation (for testing without testnet tokens)
  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      const mockTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      onTip(story.id, finalAmount, mockTx);
      setLoading(false);
      onClose();
    }, 1200);
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
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">Support Author</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Send a tip directly to the author</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl leading-none p-1">✕</button>
        </div>

        {/* Story preview */}
        <div
          className="rounded-xl p-3.5 mb-5 border border-[var(--border-strong)] bg-[var(--bg-secondary)]"
        >
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
              onClick={() => { setSelected(p); setCustom(''); setTxError(null); }}
              className={`py-2 rounded-xl text-sm font-bold transition-all border ${
                selected === p
                  ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)] shadow-sm'
                  : 'border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              ${p.toFixed(2)}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Custom amount in USDFC…"
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null); setTxError(null); }}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] mb-4 focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
          min="0.01"
          step="0.01"
        />

        {finalAmount > 0 && (
          <div className="flex flex-col gap-1 text-xs text-[var(--text-secondary)] mb-4 px-1">
            <div className="flex justify-between mb-1.5">
              <span>Tip Amount</span>
              <span className="text-[var(--accent-forest)] font-bold">${finalAmount.toFixed(2)} USDFC ({ (finalAmount * 1.0).toFixed(1) } FIL)</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium">
              💡 100% of this tip goes to the author&apos;s withdrawable balance. The author can use their balance to extend their stories&apos; storage leases on Filecoin or withdraw it.
            </p>
          </div>
        )}

        {txError && (
          <div className="text-xs text-[var(--accent-clay)] mb-4 bg-[var(--accent-clay)]/5 border border-[var(--accent-clay)]/20 rounded-lg p-2.5 leading-relaxed">
            <p className="font-bold mb-1">❌ Transaction Error:</p>
            <p className="font-mono break-all">{txError.slice(0, 150)}...</p>
            <button
              onClick={handleSimulate}
              className="mt-2 text-xs font-bold underline text-[var(--accent-forest)] block hover:text-[var(--accent-forest-hover)]"
            >
              💡 Skip & complete as a simulated test transaction instead
            </button>
          </div>
        )}

        {!isConnected ? (
          <div className="rounded-xl p-4 border border-[var(--accent-ochre)]/20 bg-[var(--accent-ochre)]/5 text-center mb-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--accent-ochre)] font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Web3 Wallet Connection Required</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Tipping and storage extensions interact directly with the Filecoin network. Connect MetaMask or WalletConnect to tip this author.
            </p>
            <div className="inline-block mt-1">
              <ConnectButton label="Connect Wallet to Tip" />
            </div>
          </div>
        ) : (
          <>
            <button
              disabled={finalAmount <= 0 || loading}
              onClick={handleSend}
              className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed btn-primary transition-all mb-2"
            >
              {loading ? 'Confirming in Wallet…' : `Send Real Transaction ($${finalAmount.toFixed(2)})`}
            </button>

            <button
              onClick={handleSimulate}
              disabled={finalAmount <= 0 || loading}
              className="w-full py-2 rounded-xl text-xs font-bold border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-black/5 transition-all bg-[var(--bg-card)]"
            >
              Simulate Sandbox Tip (Gasless Test)
            </button>
          </>
        )}

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
          Powered by Filecoin Synapse SDK • Calibration Testnet
        </p>
      </div>
    </div>
  );
}
