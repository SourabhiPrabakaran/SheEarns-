import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageId, CommunityPost, CommunityCategory, CommunityJourneyStats } from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/communityPosts';
import { CommunityHero } from '../components/community/CommunityHero';
import { CommunityCategories } from '../components/community/CommunityCategories';
import { CommunityPostCard } from '../components/community/CommunityPostCard';
import { CommunityDiscussion } from '../components/community/CommunityDiscussion';
import { CommunityJourney } from '../components/community/CommunityJourney';
import { CommunityMilestones } from '../components/community/CommunityMilestones';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { useUser } from '../context/UserContext';
import { MessageSquare, Plus, ShieldAlert } from 'lucide-react';

const STORAGE_KEY_POSTS = 'sheearns_community_posts_v1';
const STORAGE_KEY_STATS = 'sheearns_community_journey_stats_v1';
const STORAGE_KEY_LIKES = 'sheearns_community_likes_v1';

interface CommunityPageProps {
  onNavigate: (page: PageId) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const discussionsRef = useRef<HTMLDivElement>(null);

  // Load Posts from localStorage or fallback to default sample posts
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Load Journey Stats from localStorage
  const [stats, setStats] = useState<CommunityJourneyStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return { discussionsViewed: 0, questionsShared: 0, actionsDiscovered: 0 };
  });

  // Load Liked Post IDs
  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'All'>('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync Posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch {
      // Ignore quota errors
    }
  }, [posts]);

  // Sync Stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch {
      // Ignore quota errors
    }
  }, [stats]);

  // Sync Likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likedPosts));
    } catch {
      // Ignore quota errors
    }
  }, [likedPosts]);

  // Find the currently active post if any
  const activePost = useMemo(() => {
    if (!activePostId) return null;
    return posts.find(p => p.id === activePostId) || null;
  }, [activePostId, posts]);

  // Post counts per category
  const postCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    posts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Filtered posts based on category selection
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleOpenPost = (post: CommunityPost) => {
    setActivePostId(post.id);
    setStats(prev => ({
      ...prev,
      discussionsViewed: prev.discussionsViewed + 1
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isAlreadyLiked = likedPosts.includes(postId);
    setLikedPosts(prev =>
      isAlreadyLiked ? prev.filter(id => id !== postId) : [...prev, postId]
    );

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: isAlreadyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = ({
    title,
    category,
    text,
    isAnonymous
  }: {
    title: string;
    category: CommunityCategory;
    text: string;
    isAnonymous: boolean;
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title,
      category,
      text,
      author: isAnonymous ? 'Anonymous Community Member' : (user.name || 'Community Member'),
      isAnonymous,
      timestamp: 'Just now',
      likesCount: 1,
      repliesCount: 0,
      replies: []
    };

    setPosts(prev => [newPost, ...prev]);
    setLikedPosts(prev => [...prev, newPost.id]);
    setStats(prev => ({
      ...prev,
      questionsShared: prev.questionsShared + 1
    }));

    // Open the new post automatically
    setActivePostId(newPost.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReply = (postId: string, replyText: string, isAnonymous: boolean) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      author: isAnonymous ? 'Anonymous Community Member' : (user.name || 'Community Member'),
      isAnonymous,
      text: replyText,
      timestamp: 'Just now',
      likesCount: 0
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...p.replies, newReply]
          };
        }
        return p;
      })
    );
  };

  const handleActionDiscovered = () => {
    setStats(prev => ({
      ...prev,
      actionsDiscovered: prev.actionsDiscovered + 1
    }));
  };

  const scrollToDiscussions = () => {
    discussionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-10 pb-24 text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        {activePost ? (
          /* Discussion Detail View */
          <CommunityDiscussion
            post={activePost}
            onBack={handleBackToList}
            onAddReply={handleAddReply}
            onLikePost={handleLike}
            isLiked={likedPosts.includes(activePost.id)}
            onNavigate={onNavigate}
            onActionDiscovered={handleActionDiscovered}
          />
        ) : (
          /* Main Community Hub View */
          <>
            {/* Welcoming Hero Section with Action Loop */}
            <CommunityHero
              onAskQuestion={() => setIsCreateModalOpen(true)}
              onExplore={scrollToDiscussions}
            />

            {/* Personalized Community Journey Progress */}
            <CommunityJourney stats={stats} />

            {/* Category Filter Pills & Discussions Anchor */}
            <div ref={discussionsRef} className="space-y-6 pt-2">
              <CommunityCategories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                postCounts={postCounts}
              />

              {/* Feed Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-800">
                  <MessageSquare className="w-4 h-4 text-stone-700" />
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#1e191b]">
                    {selectedCategory === 'All' ? 'All Community Discussions' : selectedCategory} ({filteredPosts.length})
                  </h3>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ask Question</span>
                </button>
              </div>

              {/* Discussion Cards Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPosts.map(post => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onOpen={handleOpenPost}
                    onLike={handleLike}
                    isLiked={likedPosts.includes(post.id)}
                  />
                ))}
              </div>
            </div>

            {/* Celebrated Community Milestones */}
            <CommunityMilestones />

            {/* Privacy & Educational Disclaimer */}
            <div className="p-4 rounded-2xl bg-white border border-[#ece6de] text-xs text-stone-500 leading-relaxed text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0" />
              <span>
                Community discussions are for peer learning and support. They are not personalized financial, legal, investment, or professional advice.
              </span>
            </div>
          </>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </div>
  );
};
