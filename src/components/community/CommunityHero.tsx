import React from 'react';
import { Users, MessageSquarePlus, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface CommunityHeroProps {
  onAskQuestion: () => void;
  onExplore: () => void;
}

export const CommunityHero: React.FC<CommunityHeroProps> = ({ onAskQuestion, onExplore }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-8 text-left relative overflow-hidden">
      {/* Decorative subtle background gradient blob */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#dbc38e]/15 via-[#762e50]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Banner & Safe Space Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf5f7] border border-[#e9d0dc] text-[#762e50] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>SheEarns Peer Learning Community</span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>🔒 A supportive space designed around women's financial journeys.</span>
        </div>
      </div>

      {/* Main Heading & Narrative */}
      <div className="max-w-2xl space-y-3 relative z-10">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1e191b] font-normal tracking-tight leading-tight">
          You're Not Building Financial Independence Alone.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Learn from other women's financial journeys, share your experiences, ask questions, and turn financial conversations into meaningful action.
        </p>
      </div>

      {/* Hero CTA Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <button
          onClick={onAskQuestion}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Ask the Community</span>
        </button>

        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#faf8f5] hover:bg-stone-100 text-stone-800 border border-[#ece6de] text-xs sm:text-sm font-medium transition cursor-pointer"
        >
          <span>Explore Discussions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Community Journey Loop */}
      <div className="pt-6 border-t border-[#ece6de] relative z-10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1e191b] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#762e50]" />
          <span>The SheEarns Action Loop — Beyond Generic Forums</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-[760px] text-xs">
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#ece6de] font-semibold text-stone-800 shadow-2xs">
              ❓ Real Question
            </span>
            <span className="text-stone-400 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#ece6de] font-medium text-stone-700 shadow-2xs">
              💬 Shared Experiences
            </span>
            <span className="text-stone-400 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-full bg-[#faf5f7] border border-[#e9d0dc] font-semibold text-[#762e50] shadow-2xs">
              📚 Financial Learning
            </span>
            <span className="text-stone-400 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-full bg-[#1e191b] text-white font-semibold shadow-xs">
              ⚡ SheEarns Action
            </span>
            <span className="text-stone-400 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#ece6de] font-medium text-stone-700 shadow-2xs">
              📈 Track Progress
            </span>
            <span className="text-stone-400 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shadow-2xs">
              🎉 Inspire Others
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
