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
    {
      label: 'Active Stories',
      value: active,
      color: 'var(--accent-forest)',
      icon: (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: 'Expiring Soon',
      value: expiring,
      color: 'var(--accent-ochre)',
      icon: (
        <svg className="w-5 h-5 text-[var(--accent-ochre)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      label: 'USDFC Tipped',
      value: `$${totalTips.toFixed(2)}`,
      color: 'var(--accent-forest)',
      icon: (
        <svg className="w-5 h-5 text-[var(--accent-forest)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 12h4" />
        </svg>
      )
    },
    {
      label: 'Total Reads',
      value: totalViews.toLocaleString(),
      color: 'var(--accent-sage)',
      icon: (
        <svg className="w-5 h-5 text-[var(--accent-sage)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
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
          <div className="flex items-center gap-2 mb-2.5">
            {s.icon}
            <span className="text-xs text-[var(--text-secondary)] font-semibold">{s.label}</span>
          </div>
          <p className="text-2xl font-extrabold" style={{ color: s.color }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
