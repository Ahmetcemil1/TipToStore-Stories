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
    { label: 'Active Stories', value: active,                     icon: '📚', color: 'var(--accent-forest)' },
    { label: 'Expiring Soon',  value: expiring,                   icon: '⚠️', color: 'var(--accent-ochre)'  },
    { label: 'USDFC Tipped',   value: `$${totalTips.toFixed(0)}`, icon: '💰', color: 'var(--accent-forest)'  },
    { label: 'Total Reads',    value: totalViews.toLocaleString(), icon: '👁️', color: 'var(--accent-sage)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rounded-2xl p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-sm transition-all hover:border-[var(--accent-forest)]/30 animate-fade-in-up"
          style={{
            animationDelay: `${i * 60}ms`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs text-[var(--text-secondary)] font-medium">{s.label}</span>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: s.color }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
