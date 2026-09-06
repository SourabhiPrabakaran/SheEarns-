import React, { useState } from 'react';
import { CommunityCategory } from '../../types';
import { COMMUNITY_CATEGORIES } from '../../data/communityPosts';
import { X, MessageSquarePlus, AlertCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    category: CommunityCategory;
    text: string;
    isAnonymous: boolean;
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('Starting My Financial Journey');
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedText = text.trim();

    if (!trimmedTitle) {
      setError('Please provide a title for your discussion.');
      return;
    }

    if (!trimmedText) {
      setError('Please describe your question or experience.');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      category,
      text: trimmedText,
      isAnonymous
    });

    // Reset & Close
    setTitle('');
    setText('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full card-shadow border border-[#ece6de] space-y-5 text-left relative animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ece6de]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-center text-[#762e50]">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1e191b]">
                Ask the Community
              </h3>
              <p className="text-[11px] text-stone-500">
                Share a question or challenge with fellow women
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Discussion Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Discussion Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What financial challenge would you like to discuss?"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityCategory)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {COMMUNITY_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.id}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Share your question or experience with the community..."
              className="w-full p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
              required
            />
          </div>

          {/* Privacy Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm border-stone-300 text-[#762e50] focus:ring-[#762e50]"
              />
              <span>🔒 Post anonymously</span>
            </label>
            <p className="text-[10px] text-stone-400 mt-1 pl-5.5">
              If checked, your name will display as "Anonymous Community Member".
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#ece6de] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
            >
              Share with Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
