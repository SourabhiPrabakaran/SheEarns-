import React from 'react';
import { CommunityPost } from '../../types';
import { MessageSquare, Heart, ArrowRight, Sparkles, User } from 'lucide-react';

interface CommunityPostCardProps {
  post: CommunityPost;
  onOpen: (post: CommunityPost) => void;
  onLike: (postId: string, e: React.MouseEvent) => void;
  isLiked?: boolean;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onOpen,
  onLike,
  isLiked = false
}) => {
  return (
    <div
      onClick={() => onOpen(post)}
      className="bg-white rounded-3xl p-6 sm:p-7 card-shadow border border-[#ece6de] hover:border-stone-400/80 transition-all cursor-pointer flex flex-col justify-between space-y-4 text-left group"
    >
      <div className="space-y-3">
        {/* Top Meta: Category Tag & Milestone / Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf8f5] text-stone-700 text-xs font-medium border border-[#ece6de]">
            {post.category}
          </span>

          <div className="flex items-center gap-2">
            {post.isMilestone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Milestone Story</span>
              </span>
            )}
            <span className="text-xs text-stone-400">{post.timestamp}</span>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#1e191b] group-hover:text-[#762e50] transition-colors leading-snug">
          {post.title}
        </h3>

        {/* Post Body Snippet */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {post.text}
        </p>
      </div>

      {/* Card Footer: Author, Stats & Action */}
      <div className="pt-4 border-t border-[#ece6de] flex items-center justify-between gap-3 text-xs">
        {/* Author */}
        <div className="flex items-center gap-2 text-stone-600 font-medium">
          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <User className="w-3.5 h-3.5" />
          </div>
          <span>{post.isAnonymous ? 'Anonymous Member' : post.author}</span>
        </div>

        {/* Actions & Stats */}
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={(e) => onLike(post.id, e)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
              isLiked
                ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                : 'bg-[#faf8f5] hover:bg-stone-100 text-stone-600 border-[#ece6de]'
            }`}
            title="Support this post"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span>{post.likesCount}</span>
          </button>

          {/* Reply Count */}
          <span className="inline-flex items-center gap-1 text-stone-500">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.repliesCount}</span>
          </span>

          {/* View Discussion Link */}
          <span className="font-semibold text-stone-800 group-hover:text-[#762e50] inline-flex items-center gap-1 ml-1 transition">
            <span>Discuss</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
