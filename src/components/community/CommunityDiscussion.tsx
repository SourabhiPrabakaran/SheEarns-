import React, { useState } from 'react';
import { CommunityPost, PageId } from '../../types';
import { CommunityActionCards } from './CommunityActionCards';
import { useSheAI } from '../../context/SheAIContext';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Sparkles,
  Send,
  User,
  Clock
} from 'lucide-react';

interface CommunityDiscussionProps {
  post: CommunityPost;
  onBack: () => void;
  onAddReply: (postId: string, replyText: string, isAnonymous: boolean) => void;
  onLikePost: (postId: string) => void;
  isLiked: boolean;
  onNavigate: (page: PageId) => void;
  onActionDiscovered: () => void;
}

export const CommunityDiscussion: React.FC<CommunityDiscussionProps> = ({
  post,
  onBack,
  onAddReply,
  onLikePost,
  isLiked,
  onNavigate,
  onActionDiscovered
}) => {
  const { openAssistant } = useSheAI();
  const [replyText, setReplyText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyError, setReplyError] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError('');
    const trimmed = replyText.trim();
    if (!trimmed) {
      setReplyError('Please write a reply before submitting.');
      return;
    }

    onAddReply(post.id, trimmed, isAnonymous);
    setReplyText('');
  };

  const handleAskSheAI = () => {
    const prompt = post.sheAiConceptPrompt || `Can you explain the key financial concepts in "${post.title}"?`;
    openAssistant(prompt);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ece6de] hover:border-stone-400 text-stone-700 hover:text-[#1e191b] text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Discussions</span>
        </button>

        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Peer Learning Discussion
        </span>
      </div>

      {/* Main Original Post Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-6">
        {/* Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf8f5] text-stone-700 text-xs font-semibold border border-[#ece6de]">
            {post.category}
          </span>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.timestamp}</span>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1e191b] font-normal tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Full Post Text */}
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {post.text}
        </p>

        {/* Author & Interactions */}
        <div className="pt-6 border-t border-[#ece6de] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#1e191b]">
                {post.isAnonymous ? 'Anonymous Community Member' : post.author}
              </span>
              <span className="text-[11px] text-stone-400 block">Community Contributor</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ask SheAI Concept Button */}
            <button
              onClick={handleAskSheAI}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf5f7] hover:bg-[#f3e3eb] text-[#762e50] text-xs font-semibold border border-[#e9d0dc] transition cursor-pointer"
              title="Ask SheAI to explain concepts in this discussion"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#762e50]" />
              <span>Ask SheAI to Explain</span>
            </button>

            {/* Like Button */}
            <button
              onClick={() => onLikePost(post.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
                isLiked
                  ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                  : 'bg-[#faf8f5] hover:bg-stone-100 text-stone-600 border-[#ece6de]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
              <span>{post.likesCount} Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 7: Turn Discussion into Action */}
      <CommunityActionCards
        category={post.category}
        onNavigate={onNavigate}
        onActionClicked={onActionDiscovered}
      />

      {/* Replies Thread Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#ece6de]">
          <h3 className="font-display font-bold text-lg text-[#1e191b] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-800" />
            <span>Community Experiences & Advice ({post.replies.length})</span>
          </h3>
          <span className="text-xs text-stone-500">
            Peer support from fellow women
          </span>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          {post.replies.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-500">
              No replies yet. Be the first to share your experience or advice!
            </div>
          ) : (
            post.replies.map((reply) => (
              <div
                key={reply.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-[10px] font-bold">
                      {reply.isAnonymous ? 'A' : reply.author.charAt(0)}
                    </div>
                    <span className="font-semibold text-[#1e191b]">
                      {reply.isAnonymous ? 'Anonymous Community Member' : reply.author}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">{reply.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {reply.text}
                </p>

                <div className="pt-2 flex items-center gap-1 text-[11px] text-stone-500">
                  <Heart className="w-3 h-3 text-stone-400" />
                  <span>{reply.likesCount} helpful</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Reply Form */}
        <form onSubmit={handleSendReply} className="pt-4 border-t border-[#ece6de] space-y-3">
          <h4 className="font-display font-bold text-sm text-[#1e191b]">
            Share Your Experience or Advice
          </h4>

          {replyError && (
            <p className="text-xs text-rose-600">{replyError}</p>
          )}

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder="Share your experience or supportive advice with the community..."
            className="w-full p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm border-stone-300 text-[#762e50] focus:ring-[#762e50]"
              />
              <span>🔒 Post anonymously</span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share Reply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
