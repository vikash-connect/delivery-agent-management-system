import React from 'react';
import { AgentStatus } from '../../types/agent';

interface BadgeProps {
  status: AgentStatus;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const isAvailable = status === 'ACTIVE';

  const baseStyles =
    'inline-flex items-center font-medium rounded-full border transition-colors';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const statusStyles = isAvailable
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  const dotStyles = isAvailable ? 'bg-emerald-400' : 'bg-rose-400';

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${statusStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      {status}
    </span>
  );
};
