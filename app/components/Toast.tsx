'use client';

import { useEffect } from 'react';

interface ToastProps {
  msg: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ msg, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'border-[var(--accent-forest)]/20 text-[var(--accent-forest)] bg-[var(--bg-card)]',
    error: 'border-[var(--accent-clay)]/20 text-[var(--accent-clay)] bg-[var(--bg-card)]',
    info: 'border-[var(--accent-sage)]/20 text-[var(--accent-sage)] bg-[var(--bg-card)]',
  };
  const dots = {
    success: 'bg-[var(--accent-forest)]',
    error: 'bg-[var(--accent-clay)]',
    info: 'bg-[var(--accent-sage)]',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 rounded-2xl p-4 border shadow-lg max-w-sm animate-slide-right ${colors[type]}`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <span className="relative flex h-2.5 w-2.5 mt-1 flex-shrink-0">
        <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${dots[type]}`} />
        <span className={`relative h-2.5 w-2.5 rounded-full ${dots[type]}`} />
      </span>
      <p className="text-sm font-semibold leading-snug flex-1">{msg}</p>
      <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm mt-0.5 flex-shrink-0">✕</button>
    </div>
  );
}
