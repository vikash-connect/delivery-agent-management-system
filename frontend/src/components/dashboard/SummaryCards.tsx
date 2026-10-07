import React from 'react';

interface SummaryCardsProps {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  isLoading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalAgents,
  activeAgents,
  inactiveAgents,
  isLoading,
}) => {
  const cards = [
    {
      title: 'Total Agents',
      value: totalAgents,
      color: 'text-slate-100',
      bgColor: 'bg-slate-900/60',
      borderColor: 'border-slate-800',
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Active Agents',
      value: activeAgents,
      color: 'text-emerald-400',
      bgColor: 'bg-slate-900/60',
      borderColor: 'border-slate-800',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Inactive Agents',
      value: inactiveAgents,
      color: 'text-rose-400',
      bgColor: 'bg-slate-900/60',
      borderColor: 'border-slate-800',
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-5 shadow-sm transition-all duration-150 hover:border-slate-700`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <div className={`p-2 rounded-lg border ${card.iconColor}`}>{card.icon}</div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-800 animate-pulse rounded" />
            ) : (
              <span className={`text-2xl sm:text-3xl font-extrabold ${card.color}`}>
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
