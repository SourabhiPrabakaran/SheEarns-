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
    <div className="bg-white rounded-3xl p-4 sm:p-6 card-shadow border border-[#ece6de] hover:border-stone-300 transition-all text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {label}
          </p>
          {icon && (
            <div className="text-stone-700 bg-[#faf8f5] border border-[#ece6de] p-1.5 sm:p-2 rounded-xl text-xs sm:text-sm shrink-0">
              {icon}
            </div>
          )}
        </div>
        <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#1e191b] flex items-baseline flex-wrap gap-1.5 sm:gap-2">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          {subText && (
            <span className="text-xs sm:text-sm font-medium text-[#762e50] font-sans">
              {subText}
            </span>
          )}
        </p>
      </div>
      {hint && (
        <p className="text-[11px] sm:text-xs text-stone-500 mt-2 font-normal">
          {hint}
        </p>
      )}
    </div>
  );
};
