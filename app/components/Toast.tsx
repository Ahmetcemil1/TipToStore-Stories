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
    success: 'border-emerald-500/25 text-emerald-300',
    error: 'border-red-500/25 text-red-300',
    info: 'border-sky-500/25 text-sky-300',
  };
  const dots = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 rounded-2xl p-4 border shadow-2xl max-w-sm animate-slide-right ${colors[type]}`}
      style={{ background: 'rgba(8,15,28,0.95)', backdropFilter: 'blur(16px)' }}
    >
      <span className="relative flex h-2.5 w-2.5 mt-1 flex-shrink-0">
        <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${dots[type]}`} />
        <span className={`relative h-2.5 w-2.5 rounded-full ${dots[type]}`} />
      </span>
      <p className="text-sm font-medium leading-snug flex-1">{msg}</p>
      <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-sm mt-0.5 flex-shrink-0">✕</button>
    </div>
  );
}
