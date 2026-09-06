import { PageId } from './index';

export type CommunityCategory =
  | 'Starting My Financial Journey'
  | 'Saving & Budgeting'
  | 'Career & Income'
  | 'Entrepreneurship'
  | 'Financial Goals';

export interface CommunityReply {
  id: string;
  author: string;
  isAnonymous?: boolean;
  text: string;
  timestamp: string;
  likesCount: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  category: CommunityCategory;
  text: string;
  author: string;
  isAnonymous?: boolean;
  timestamp: string;
  repliesCount: number;
  likesCount: number;
  isMilestone?: boolean;
  replies: CommunityReply[];
  sheAiConceptPrompt?: string; // e.g. "What is an emergency fund?"
}

export interface CommunityActionRecommendation {
  id: string;
  icon: string;
  title: string;
  description: string;
  targetPage: PageId;
  ctaText: string;
}

export interface CommunityJourneyStats {
  discussionsViewed: number;
  questionsShared: number;
  actionsDiscovered: number;
}

export interface CommunityMilestone {
  id: string;
  title: string;
  author: string;
  story: string;
  badge: string;
}
