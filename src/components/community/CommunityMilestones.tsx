import React from 'react';
import { COMMUNITY_MILESTONES } from '../../data/communityPosts';
import { Trophy, Heart } from 'lucide-react';

export const CommunityMilestones: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-stone-800">
          <Trophy className="w-5 h-5 text-[#dbc38e]" />
          <div>
            <h3 className="font-display font-bold text-lg text-[#1e191b]">
              🌟 Community Milestones
            </h3>
            <p className="text-xs text-stone-500">
              Celebrated achievements from real peer financial journeys
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#762e50] bg-[#faf5f7] px-3 py-1 rounded-full border border-[#e9d0dc]">
          Your progress could inspire another woman.
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {COMMUNITY_MILESTONES.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-stone-700 border border-[#ece6de]">
                {m.badge}
              </span>
              <h4 className="font-display font-bold text-sm text-[#1e191b]">
                {m.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "{m.story}"
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
              <span className="font-medium text-stone-700">{m.author}</span>
              <span className="flex items-center gap-1 text-[#762e50]">
                <Heart className="w-3 h-3 fill-[#762e50]" />
                <span>Inspired</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
