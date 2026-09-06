import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#ece6de] bg-[#faf8f5] py-12 px-5 sm:px-8 text-xs text-stone-500 leading-relaxed">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <BrandLogo size="sm" />
          <span className="hidden sm:inline text-stone-300">|</span>
          <p className="text-stone-500">
            Empowering women with financial clarity, independence, and resilience.
          </p>
        </div>

        <p className="text-[11px] text-stone-500 text-center md:text-right max-w-md">
          SheScore & Entrepreneur Financing Readiness are educational indicators based on non-traditional self-reported data. Not an official credit score or lending guarantee.
        </p>
      </div>
    </footer>
  );
};
