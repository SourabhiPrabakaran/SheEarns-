import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  label: string;
  score: number;
  weight: string;
  icon: React.ReactNode;
  explanation: string;
  delayMs?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  score,
  weight,
  icon,
  explanation,
  delayMs = 150
}) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min(100, Math.max(0, score)));
    }, delayMs);
    return () => clearTimeout(timer);
  }, [score, delayMs]);

  const colorClass =
    score >= 75
      ? 'bg-[#762e50]'
      : score >= 50
      ? 'bg-amber-600'
      : 'bg-stone-400';

  const badgeClass =
    score >= 75
      ? 'text-[#762e50] bg-[#faf5f7] border-[#e9d0dc]'
      : score >= 50
      ? 'text-amber-800 bg-amber-50 border-amber-200'
      : 'text-stone-700 bg-stone-100 border-stone-200';

  return (
    <div className="mb-4 p-4 rounded-2xl bg-white border border-[#ece6de] hover:border-stone-300 transition-all text-left">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-center text-stone-700">
            {icon}
          </div>
          <div>
            <span className="font-semibold text-[#1e191b] text-sm">
              {label}
            </span>
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200/70">
              Weight: {weight}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {score}/100
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>

      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};
