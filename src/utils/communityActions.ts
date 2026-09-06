import { CommunityCategory, CommunityActionRecommendation } from '../types';

/**
 * Deterministic category-to-action mappings linking community discussions directly
 * to existing SheEarns tools, calculators, and learning modules.
 *
 * User Journey Loop:
 * Community Discussion -> Shared Experience -> SheEarns Action -> Progress
 */
export const CATEGORY_ACTION_MAPPINGS: Record<CommunityCategory, CommunityActionRecommendation[]> = {
  'Saving & Budgeting': [
    {
      id: 'act-sb-1',
      icon: '🧮',
      title: 'Review Your Financial Snapshot',
      description: 'Audit monthly expenses, current savings rate, and discretionary margin in your private dashboard.',
      targetPage: 'dashboard',
      ctaText: 'Open Dashboard'
    },
    {
      id: 'act-sb-2',
      icon: '📊',
      title: 'Check Your SheScore',
      description: 'See how your savings stability and emergency preparedness factor into your 5-pillar financial readiness score.',
      targetPage: 'score',
      ctaText: 'View SheScore'
    },
    {
      id: 'act-sb-3',
      icon: '📚',
      title: 'Improve Your Financial Readiness',
      description: 'Complete the "Building an Emergency Fund" module to add +10 points to your Financial Literacy.',
      targetPage: 'learning-m1',
      ctaText: 'Start Lesson'
    }
  ],

  'Entrepreneurship': [
    {
      id: 'act-ent-1',
      icon: '🚀',
      title: 'Check Financing Readiness',
      description: 'Assess business readiness using alternative cash-flow and activity indicators without traditional collateral.',
      targetPage: 'score',
      ctaText: 'Check Readiness'
    },
    {
      id: 'act-ent-2',
      icon: '💰',
      title: 'Review Cash Flow Health',
      description: 'Analyze net operating surplus and monthly revenue consistency over the past 4 recorded months.',
      targetPage: 'dashboard',
      ctaText: 'Review Cash Flow'
    },
    {
      id: 'act-ent-3',
      icon: '📚',
      title: 'Learn Financial Resilience',
      description: 'Master cash-flow optimization and seasonal buffer techniques in the "Understanding Cash Flow" lesson.',
      targetPage: 'learning-m2',
      ctaText: 'Explore Module'
    }
  ],

  'Starting My Financial Journey': [
    {
      id: 'act-start-1',
      icon: '📚',
      title: 'Start Financial Learning',
      description: 'Begin with foundational financial security lessons designed specifically for first-time earners.',
      targetPage: 'learning-m1',
      ctaText: 'Start Learning'
    },
    {
      id: 'act-start-2',
      icon: '📊',
      title: 'Understand Your SheScore',
      description: 'Calculate your baseline SheScore to discover your strongest financial anchors and biggest growth opportunities.',
      targetPage: 'score',
      ctaText: 'Explore SheScore'
    }
  ],

  'Career & Income': [
    {
      id: 'act-car-1',
      icon: '📊',
      title: 'Review Your Financial Snapshot',
      description: 'Track how career progression, salary revisions, and income changes impact your monthly cash-flow surplus.',
      targetPage: 'dashboard',
      ctaText: 'View Snapshot'
    },
    {
      id: 'act-car-2',
      icon: '🎯',
      title: 'Understand Your Financial Readiness',
      description: 'Evaluate your stability buffer to prepare for career transitions, skill upgrades, or planned breaks.',
      targetPage: 'score',
      ctaText: 'Check Readiness'
    }
  ],

  'Financial Goals': [
    {
      id: 'act-goals-1',
      icon: '🎯',
      title: 'Review Your Progress',
      description: 'Monitor your monthly savings velocity and track your trajectory toward your core financial independence milestones.',
      targetPage: 'dashboard',
      ctaText: 'Track Progress'
    },
    {
      id: 'act-goals-2',
      icon: '📊',
      title: 'Understand Your SheScore',
      description: 'See how consistent saving habits elevate your score status from Starting to Building, Growing, and Strong.',
      targetPage: 'score',
      ctaText: 'View SheScore'
    },
    {
      id: 'act-goals-3',
      icon: '📚',
      title: 'Continue Learning',
      description: 'Reinforce automated wealth-building habits with the "Smart Saving Habits" micro-learning module.',
      targetPage: 'learning-m3',
      ctaText: 'Learn Habits'
    }
  ]
};

/**
 * Returns deterministic SheEarns tool action recommendations for a given community category.
 */
export function getActionsForCategory(category: CommunityCategory): CommunityActionRecommendation[] {
  return CATEGORY_ACTION_MAPPINGS[category] || CATEGORY_ACTION_MAPPINGS['Saving & Budgeting'];
}
