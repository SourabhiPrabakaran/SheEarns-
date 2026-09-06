import React from 'react';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  hint?: string;
  subText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  prefix = '',
  suffix = '',
  icon,
  hint,
  subText
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 card-shadow border border-[#ece6de] hover:border-stone-300 transition-all text-left">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="text-stone-700 bg-[#faf8f5] border border-[#ece6de] p-2 rounded-xl text-sm">
            {icon}
          </div>
        )}
      </div>
      <p className="font-display text-2xl sm:text-3xl font-bold text-[#1e191b] flex items-baseline flex-wrap gap-2">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        {subText && (
          <span className="text-xs sm:text-sm font-medium text-[#762e50] font-sans">
            {subText}
          </span>
        )}
      </p>
      {hint && (
        <p className="text-xs text-stone-500 mt-1.5 font-normal">
          {hint}
        </p>
      )}
    </div>
  );
};
