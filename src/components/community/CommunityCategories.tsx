import React from 'react';
import { CommunityCategory } from '../../types';
import { COMMUNITY_CATEGORIES } from '../../data/communityPosts';

interface CommunityCategoriesProps {
  selectedCategory: CommunityCategory | 'All';
  onSelectCategory: (category: CommunityCategory | 'All') => void;
  postCounts: Record<string, number>;
}

export const CommunityCategories: React.FC<CommunityCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  postCounts
}) => {
  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-[#1e191b]">
          Explore by Category
        </h3>
        <span className="text-xs text-stone-500">
          Filter discussions by financial stage
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Discussions Tab */}
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 border ${
            selectedCategory === 'All'
              ? 'bg-[#1e191b] text-white border-[#1e191b] shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-50 border-[#ece6de]'
          }`}
        >
          <span>All Discussions</span>
          <span className="ml-1.5 opacity-60 text-[11px]">({postCounts['All'] || 0})</span>
        </button>

        {/* Categories */}
        {COMMUNITY_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = postCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#1e191b] text-white border-[#1e191b] shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-[#ece6de]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="opacity-60 text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
