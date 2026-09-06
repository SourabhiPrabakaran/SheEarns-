import React from 'react';
import { CommunityJourneyStats } from '../../types';
import { MessageSquare, PenTool, Lightbulb, Compass } from 'lucide-react';

interface CommunityJourneyProps {
  stats: CommunityJourneyStats;
}

export const CommunityJourney: React.FC<CommunityJourneyProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 card-shadow border border-[#ece6de] space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-center text-[#762e50]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#1e191b]">
              Your Community Journey
            </h3>
            <p className="text-[11px] text-stone-500">
              Personalized engagement progress tracked this session
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#faf8f5] text-stone-600 border border-[#ece6de]">
          Active Learner
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Discussions Viewed */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Viewed
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="font-display font-bold text-xl sm:text-2xl text-[#1e191b]">
            {stats.discussionsViewed}
          </div>
          <p className="text-[10px] text-stone-500">Discussions viewed</p>
        </div>

        {/* Questions Shared */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Shared
            </span>
            <PenTool className="w-3.5 h-3.5 text-[#762e50]" />
          </div>
          <div className="font-display font-bold text-xl sm:text-2xl text-[#762e50]">
            {stats.questionsShared}
          </div>
          <p className="text-[10px] text-stone-500">Questions asked</p>
        </div>

        {/* Actions Discovered */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Action
            </span>
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-xl sm:text-2xl text-emerald-700">
            {stats.actionsDiscovered}
          </div>
          <p className="text-[10px] text-stone-500">Tools discovered</p>
        </div>
      </div>
    </div>
  );
};
