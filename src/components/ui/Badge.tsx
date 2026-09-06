import React from 'react';
import { ScoreStatus } from '../../types';

interface BadgeProps {
  status: ScoreStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Growing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Building':
        return 'bg-plum-100 text-plum-800 border-plum-300';
      case 'Starting':
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};
