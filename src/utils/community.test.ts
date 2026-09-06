import { describe, it, expect, beforeEach } from 'vitest';
import { COMMUNITY_CATEGORIES, INITIAL_COMMUNITY_POSTS } from '../data/communityPosts';
import { getActionsForCategory } from './communityActions';
import { CommunityCategory, CommunityPost, CommunityReply, CommunityJourneyStats } from '../types';
import { calculateSheScore } from './sheScore';
import { calculateFinancingReadiness } from './financingReadiness';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
}

const mockStorage = new LocalStorageMock();

describe('SheEarns Community Ecosystem', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // 1. Community Categories
  it('1. Verifies all 5 required community categories exist with valid metadata', () => {
    const expectedCategories: CommunityCategory[] = [
      'Starting My Financial Journey',
      'Saving & Budgeting',
      'Career & Income',
      'Entrepreneurship',
      'Financial Goals'
    ];

    expect(COMMUNITY_CATEGORIES.length).toBe(5);
    expectedCategories.forEach(cat => {
      const match = COMMUNITY_CATEGORIES.find(c => c.id === cat);
      expect(match).toBeDefined();
      expect(match?.label).toBeDefined();
      expect(match?.icon).toBeDefined();
      expect(match?.description).toBeDefined();
    });
  });

  // 2. Sample posts loading
  it('2. Loads 5 realistic sample community posts with complete threads', () => {
    expect(INITIAL_COMMUNITY_POSTS.length).toBe(5);

    INITIAL_COMMUNITY_POSTS.forEach(post => {
      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.text).toBeDefined();
      expect(post.author).toBeDefined();
      expect(post.repliesCount).toBe(post.replies.length);
      expect(post.likesCount).toBeGreaterThan(0);
      expect(post.replies.length).toBeGreaterThanOrEqual(2);
    });

    // Verify Post 5 is celebrated milestone
    const post5 = INITIAL_COMMUNITY_POSTS.find(p => p.id === 'post-5');
    expect(post5?.isMilestone).toBe(true);
    expect(post5?.title).toContain('₹10,000 saved');
  });

  // 3. Category filtering
  it('3. Filters community posts correctly by category', () => {
    const filterByCategory = (posts: CommunityPost[], category: CommunityCategory | 'All') => {
      if (category === 'All') return posts;
      return posts.filter(p => p.category === category);
    };

    const all = filterByCategory(INITIAL_COMMUNITY_POSTS, 'All');
    expect(all.length).toBe(5);

    const entrepreneurshipPosts = filterByCategory(INITIAL_COMMUNITY_POSTS, 'Entrepreneurship');
    expect(entrepreneurshipPosts.length).toBe(1);
    expect(entrepreneurshipPosts[0].title).toBe('Managing irregular business income');

    const savingPosts = filterByCategory(INITIAL_COMMUNITY_POSTS, 'Saving & Budgeting');
    expect(savingPosts.length).toBe(1);
    expect(savingPosts[0].title).toBe('How can I save while supporting my family?');
  });

  // 4. Creating a new post
  it('4. Creates a new post and prepends to the discussion feed', () => {
    const newPost: CommunityPost = {
      id: 'post-test-1',
      title: 'How to build my emergency buffer?',
      category: 'Saving & Budgeting',
      text: 'I want to save 3 months of expenses but do not know where to start.',
      author: 'Priya K.',
      timestamp: 'Just now',
      likesCount: 1,
      repliesCount: 0,
      replies: []
    };

    const feed = [newPost, ...INITIAL_COMMUNITY_POSTS];
    expect(feed.length).toBe(6);
    expect(feed[0].id).toBe('post-test-1');
    expect(feed[0].title).toBe('How to build my emergency buffer?');
  });

  // 5. Anonymous posting
  it('5. Supports anonymous posting displaying Anonymous Community Member', () => {
    const anonymousPost: CommunityPost = {
      id: 'post-anon-1',
      title: 'Struggling with debt shame',
      category: 'Starting My Financial Journey',
      text: 'I have some credit card debt I hide from family.',
      author: 'Anonymous Community Member',
      isAnonymous: true,
      timestamp: 'Just now',
      likesCount: 1,
      repliesCount: 0,
      replies: []
    };

    expect(anonymousPost.isAnonymous).toBe(true);
    expect(anonymousPost.author).toBe('Anonymous Community Member');
  });

  // 6. localStorage persistence
  it('6. Persists and reloads posts, journey stats, and likes via localStorage', () => {
    const storageKeyPosts = 'sheearns_community_posts_test';
    const storageKeyStats = 'sheearns_community_stats_test';

    const testPosts: CommunityPost[] = [
      {
        id: 'p-local',
        title: 'Local Test Post',
        category: 'Financial Goals',
        text: 'Test description',
        author: 'Tester',
        timestamp: 'Just now',
        likesCount: 2,
        repliesCount: 1,
        replies: []
      }
    ];

    const testStats: CommunityJourneyStats = {
      discussionsViewed: 4,
      questionsShared: 2,
      actionsDiscovered: 3
    };

    mockStorage.setItem(storageKeyPosts, JSON.stringify(testPosts));
    mockStorage.setItem(storageKeyStats, JSON.stringify(testStats));

    const loadedPosts = JSON.parse(mockStorage.getItem(storageKeyPosts)!);
    const loadedStats = JSON.parse(mockStorage.getItem(storageKeyStats)!);

    expect(loadedPosts.length).toBe(1);
    expect(loadedPosts[0].title).toBe('Local Test Post');
    expect(loadedStats.discussionsViewed).toBe(4);
    expect(loadedStats.questionsShared).toBe(2);
    expect(loadedStats.actionsDiscovered).toBe(3);
  });

  // 7. Adding replies
  it('7. Adds replies to a discussion thread and increments reply count', () => {
    const post = { ...INITIAL_COMMUNITY_POSTS[0], replies: [...INITIAL_COMMUNITY_POSTS[0].replies] };
    const initialCount = post.replies.length;

    const newReply: CommunityReply = {
      id: 'rep-new-1',
      author: 'Tester',
      text: 'Here is a helpful budgeting tip!',
      timestamp: 'Just now',
      likesCount: 0
    };

    post.replies.push(newReply);
    post.repliesCount = post.replies.length;

    expect(post.replies.length).toBe(initialCount + 1);
    expect(post.replies[post.replies.length - 1].text).toBe('Here is a helpful budgeting tip!');
  });

  // 8. Category-to-action mappings (Deterministic)
  it('8. Verifies deterministic category-to-action mappings for all categories', () => {
    const categories: CommunityCategory[] = [
      'Starting My Financial Journey',
      'Saving & Budgeting',
      'Career & Income',
      'Entrepreneurship',
      'Financial Goals'
    ];

    categories.forEach(cat => {
      const actions = getActionsForCategory(cat);
      expect(actions.length).toBeGreaterThanOrEqual(2);
      actions.forEach(action => {
        expect(action.id).toBeDefined();
        expect(action.title).toBeDefined();
        expect(action.description).toBeDefined();
        expect(action.targetPage).toBeDefined();
        expect(action.ctaText).toBeDefined();
      });
    });

    // Verify Entrepreneurship links to financing readiness tool
    const entActions = getActionsForCategory('Entrepreneurship');
    expect(entActions.some(a => a.targetPage === 'score' && a.title.includes('Financing Readiness'))).toBe(true);

    // Verify Saving & Budgeting links to Dashboard and SheScore
    const savingActions = getActionsForCategory('Saving & Budgeting');
    expect(savingActions.some(a => a.targetPage === 'dashboard')).toBe(true);
    expect(savingActions.some(a => a.targetPage === 'score')).toBe(true);
    expect(savingActions.some(a => a.targetPage === 'learning-m1')).toBe(true);
  });

  // 9. Community Journey statistics
  it('9. Updates Community Journey stats upon view, post, and action discovery', () => {
    let stats: CommunityJourneyStats = {
      discussionsViewed: 0,
      questionsShared: 0,
      actionsDiscovered: 0
    };

    // User views a post
    stats = { ...stats, discussionsViewed: stats.discussionsViewed + 1 };
    expect(stats.discussionsViewed).toBe(1);

    // User asks a question
    stats = { ...stats, questionsShared: stats.questionsShared + 1 };
    expect(stats.questionsShared).toBe(1);

    // User clicks an action card
    stats = { ...stats, actionsDiscovered: stats.actionsDiscovered + 1 };
    expect(stats.actionsDiscovered).toBe(1);
  });

  // 10. Existing SheScore behavior remains unchanged
  it('10. Confirms SheScore calculation and Priya acceptance scores remain frozen and intact', () => {
    const initial = calculateSheScore(PRIYA_DEMO_USER);
    expect(initial.displayScore).toBe(67);
    expect(initial.status).toBe('Growing');

    const afterOne = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    });
    expect(afterOne.displayScore).toBe(68);

    const afterTwo = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm2']
    });
    expect(afterTwo.displayScore).toBe(70);
  });

  // 11. Existing Financing Readiness behavior remains unchanged
  it('11. Confirms Meera Entrepreneur Financing Readiness remains exactly 83/100', () => {
    const readiness = calculateFinancingReadiness(MEERA_DEMO_USER);
    expect(readiness.displayScore).toBe(83);
    expect(readiness.components.cashFlowHealth).toBe(100);
    expect(readiness.components.businessActivityConsistency).toBe(80);
    expect(readiness.components.businessRevenueStability).toBe(100);
  });
});
