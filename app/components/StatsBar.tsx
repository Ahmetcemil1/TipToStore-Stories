'use client';

import { Story } from '../types';

interface StatsBarProps {
  stories: Story[];
}

export function StatsBar({ stories }: StatsBarProps) {
  const active   = stories.filter(s => s.status === 'ACTIVE').length;
  const expiring = stories.filter(s => s.status === 'EXPIRING').length;
  const totalTips = stories.reduce((a, s) => a + s.tipsUSDFC, 0);
  const totalViews = stories.reduce((a, s) => a + s.views, 0);

  const stats = [
    { label: 'Active Stories', value: active,                     icon: '📚', color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Expiring Soon',  value: expiring,                   icon: '⚠️', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)'  },
    { label: 'USDFC Tipped',   value: `$${totalTips.toFixed(0)}`, icon: '💰', color: '#38bdf8', glow: 'rgba(56,189,248,0.15)'  },
    { label: 'Total Reads',    value: totalViews.toLocaleString(), icon: '👁️', color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rounded-2xl p-4 border border-white/5 transition-all hover:border-white/10 animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg,rgba(8,15,28,0.9),rgba(4,10,20,0.95))',
            animationDelay: `${i * 60}ms`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs text-slate-500 font-medium">{s.label}</span>
          </div>
          <p className="text-2xl font-black" style={{ color: s.color, textShadow: `0 0 20px ${s.glow}` }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
