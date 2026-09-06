import React from 'react';
import { ScoreStatus } from '../../types';
import { AnimatedNumber } from './AnimatedNumber';

interface ScoreRingProps {
  score: number;
  status: ScoreStatus;
  size?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  status,
  size = 220
}) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  // Offset calculated from exact score (0 to 100)
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 220 220"
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="sheScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e191b" />
            <stop offset="60%" stopColor="#762e50" />
            <stop offset="100%" stopColor="#cba662" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#ece6de"
          strokeWidth="13"
        />

        {/* Animated fill track */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="url(#sheScoreGradient)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>

      {/* Central Metrics */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-display text-5xl sm:text-6xl font-extrabold text-[#1e191b] tracking-tight">
          <AnimatedNumber value={score} duration={1200} />
        </span>
        <span className="text-[11px] font-semibold tracking-wider text-[#762e50] uppercase mt-1 px-3 py-0.5 rounded-full bg-[#faf5f7] border border-[#e9d0dc]">
          {status}
        </span>
      </div>
    </div>
  );
};
