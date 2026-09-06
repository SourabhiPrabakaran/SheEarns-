import React from 'react';
import { CommunityCategory, PageId } from '../../types';
import { getActionsForCategory } from '../../utils/communityActions';
import { Zap, ArrowRight } from 'lucide-react';

interface CommunityActionCardsProps {
  category: CommunityCategory;
  onNavigate: (page: PageId) => void;
  onActionClicked: () => void;
}

export const CommunityActionCards: React.FC<CommunityActionCardsProps> = ({
  category,
  onNavigate,
  onActionClicked
}) => {
  const actions = getActionsForCategory(category);

  const handleActionClick = (targetPage: PageId) => {
    onActionClicked();
    onNavigate(targetPage);
  };

  return (
    <div className="bg-[#faf5f7] border border-[#e9d0dc] rounded-3xl p-6 sm:p-8 space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#762e50]">
          <Zap className="w-4 h-4 fill-[#762e50]" />
          <h4 className="font-display font-bold text-base sm:text-lg text-[#1e191b]">
            Take Action with SheEarns
          </h4>
        </div>
        <span className="text-[11px] font-medium text-stone-500">
          Turn peer insights into real financial progress
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
        Based on this discussion topic ({category}), here are recommended SheEarns tools and learning steps to evaluate your readiness:
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => handleActionClick(act.targetPage)}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ece6de] hover:border-[#762e50]/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{act.icon}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#faf8f5] text-stone-600 border border-[#ece6de] group-hover:border-[#762e50]/30 transition-colors">
                  SheEarns Tool
                </span>
              </div>
              <h5 className="font-display font-bold text-sm text-[#1e191b] group-hover:text-[#762e50] transition-colors">
                {act.title}
              </h5>
              <p className="text-stone-600 text-xs leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#762e50] group-hover:translate-x-0.5 transition-transform">
              <span>{act.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
