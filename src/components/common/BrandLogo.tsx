import React from 'react';
import logoImg from '../../assets/sheearns-logo-horizontal.png';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'header' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'header',
  className = ''
}) => {
  // Height classes preserving natural horizontal aspect ratio (approx 3.6:1).
  // Emblem on left, brand name/company name to the right of the logo (like Chola reference).
  const heightClasses = {
    sm: 'h-9 max-w-[150px]',
    md: 'h-11 max-w-[180px]',
    header: 'h-[46px] sm:h-[50px] md:h-[52px] max-w-[200px] sm:max-w-[220px]',
    lg: 'h-[56px] sm:h-[62px] max-w-[240px] sm:max-w-[260px]'
  };

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      <img
        src={logoImg}
        alt="SheEarns AI - Financial Independence Platform for Women"
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
