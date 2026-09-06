import React from 'react';
import { PageId } from '../../types';
import { useUser } from '../../context/UserContext';
import { ShieldCheck, BarChart3, User, Award, Users } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { scoreData, user } = useUser();

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'score', label: 'SheScore', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'independence', label: 'Independence', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'onboarding', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ece6de] transition-all">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-[80px] flex items-center justify-between gap-3 sm:gap-6">
        {/* SheEarns AI Logo on the far left */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="group text-left transition cursor-pointer flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
            title="Return to Landing Page"
            aria-label="Return to SheEarns Home"
          >
            <BrandLogo size="header" />
          </button>
        </div>

        {/* Center Navigation Pills with clean modern sans-serif typography */}
        <nav 
          aria-label="Main Navigation"
          className="flex items-center gap-0.5 sm:gap-1.5 p-1 rounded-full bg-white/90 border border-[#ece6de] shadow-2xs"
        >
          {navItems.map(item => {
            const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage.startsWith('learning'));
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-[#1e191b] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-[#1e191b] hover:bg-stone-100/70'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User-Specific Data: User Name & SheScore Only on authenticated/product pages */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => onNavigate('score')}
            className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white border border-[#ece6de] hover:border-stone-400 transition-all card-shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
            title="Click to view SheScore details"
            aria-label={`View SheScore details for ${user.name}. Current score: ${scoreData.displayScore}, status: ${scoreData.status}`}
          >
            <span className="text-xs sm:text-sm font-sans font-medium text-stone-700 hidden sm:inline">
              {user.name}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1e191b] text-white font-sans font-bold tracking-tight">
              {scoreData.displayScore}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
