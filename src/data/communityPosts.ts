import { CommunityPost, CommunityCategory, CommunityMilestone } from '../types';

export const COMMUNITY_CATEGORIES: { id: CommunityCategory; label: string; icon: string; description: string }[] = [
  {
    id: 'Starting My Financial Journey',
    label: 'Starting Journey',
    icon: '🌱',
    description: 'First salary, budgeting basics, starting to save, and building confidence.'
  },
  {
    id: 'Saving & Budgeting',
    label: 'Saving & Budgeting',
    icon: '💰',
    description: 'Household expenses, emergency buffers, saving habits, and family responsibilities.'
  },
  {
    id: 'Career & Income',
    label: 'Career & Income',
    icon: '💼',
    description: 'Managing first income, career growth, salary raises, and planning career breaks.'
  },
  {
    id: 'Entrepreneurship',
    label: 'Entrepreneurship',
    icon: '🚀',
    description: 'Business cash flow, managing irregular revenue, and financing readiness.'
  },
  {
    id: 'Financial Goals',
    label: 'Financial Goals',
    icon: '🎯',
    description: 'Long-term independence milestones, debt freedom, and wealth foundations.'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How do I manage my first salary?',
    category: 'Starting My Financial Journey',
    text: "I recently started my first job and want to start saving, but I'm not sure how to divide my income between expenses, family responsibilities, and personal savings.",
    author: 'Ananya S.',
    timestamp: '2 days ago',
    likesCount: 14,
    repliesCount: 3,
    sheAiConceptPrompt: 'What is the 50/30/20 budgeting rule?',
    replies: [
      {
        id: 'rep-1-1',
        author: 'Pooja R.',
        text: 'Congratulations on your first job! A rule that helped me early on was the 50/30/20 framework: 50% for essentials, 30% personal wants, and 20% right into savings on day 1.',
        timestamp: '1 day ago',
        likesCount: 6
      },
      {
        id: 'rep-1-2',
        author: 'Community Member',
        isAnonymous: true,
        text: 'Automate a small transfer (even ₹2,000 to ₹3,000) on salary day to a separate account. If you wait until month-end, it disappears on random spending.',
        timestamp: '18 hours ago',
        likesCount: 4
      },
      {
        id: 'rep-1-3',
        author: 'Kavita M.',
        text: 'Open the SheEarns learning modules on cash flow! It takes just 3 minutes and gives you a clear mental picture of where every rupee goes.',
        timestamp: '10 hours ago',
        likesCount: 3
      }
    ]
  },
  {
    id: 'post-2',
    title: 'How can I save while supporting my family?',
    category: 'Saving & Budgeting',
    text: 'A large part of my income goes toward household expenses. How do others balance family responsibilities while still building personal savings?',
    author: 'Priya K.',
    timestamp: '3 days ago',
    likesCount: 28,
    repliesCount: 3,
    sheAiConceptPrompt: 'How can I build an emergency fund while managing high expenses?',
    replies: [
      {
        id: 'rep-2-1',
        author: 'Deepa V.',
        text: 'I started by choosing a small fixed savings amount instead of waiting to see what was left at the end of the month.',
        timestamp: '2 days ago',
        likesCount: 12
      },
      {
        id: 'rep-2-2',
        author: 'Community Member',
        isAnonymous: true,
        text: 'Tracking my essential household contributions separately helped me understand what I could realistically save.',
        timestamp: '1 day ago',
        likesCount: 9
      },
      {
        id: 'rep-2-3',
        author: 'Sunita N.',
        text: 'Communicate openly with your family about a designated personal security fund. Even ₹1,500/month compounds into real peace of mind over a year.',
        timestamp: '8 hours ago',
        likesCount: 5
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Managing irregular business income',
    category: 'Entrepreneurship',
    text: 'Some months my business performs well and other months are slow. How do you plan expenses when your income changes every month?',
    author: 'Meera Patel',
    timestamp: '4 days ago',
    likesCount: 32,
    repliesCount: 2,
    sheAiConceptPrompt: 'How should I manage irregular income as an entrepreneur?',
    replies: [
      {
        id: 'rep-3-1',
        author: 'Ritu Sen',
        text: 'Separate your business account from your personal account completely! During peak months, leave the surplus in the business as a cushion for slower months.',
        timestamp: '3 days ago',
        likesCount: 11
      },
      {
        id: 'rep-3-2',
        author: 'Community Member',
        isAnonymous: true,
        text: 'Pay yourself a fixed baseline "salary" from your business earnings each month. That stabilizes your household budget regardless of revenue fluctuations.',
        timestamp: '2 days ago',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Preparing financially for a career break',
    category: 'Career & Income',
    text: "I'm considering taking a career break in the future. What financial preparations should I start making now?",
    author: 'Tanvi J.',
    timestamp: '5 days ago',
    likesCount: 19,
    repliesCount: 2,
    sheAiConceptPrompt: 'How many months of expenses should an emergency buffer cover?',
    replies: [
      {
        id: 'rep-4-1',
        author: 'Shalini G.',
        text: 'Target 6 to 9 months of bare-minimum living expenses in a liquid fund before taking the leap. Having that buffer eliminated all anxiety for me.',
        timestamp: '4 days ago',
        likesCount: 7
      },
      {
        id: 'rep-4-2',
        author: 'Community Member',
        isAnonymous: true,
        text: 'Clear all high-interest debt or ongoing EMIs first. When your monthly fixed obligations are low, your career break feels empowering rather than stressful.',
        timestamp: '3 days ago',
        likesCount: 5
      }
    ]
  },
  {
    id: 'post-5',
    title: 'My first ₹10,000 saved! 🎉',
    category: 'Financial Goals',
    text: "It took me a few months, but I finally reached my first savings milestone. Sharing this here because seeing other women's progress motivated me to start.",
    author: 'Radhika S.',
    timestamp: '6 days ago',
    likesCount: 45,
    repliesCount: 3,
    isMilestone: true,
    sheAiConceptPrompt: 'How does consistent saving impact my financial readiness score?',
    replies: [
      {
        id: 'rep-5-1',
        author: 'Aarti D.',
        text: 'So proud of you Radhika! The first milestone is always the hardest because habit formation takes patience. On to the next goal!',
        timestamp: '5 days ago',
        likesCount: 14
      },
      {
        id: 'rep-5-2',
        author: 'Community Member',
        isAnonymous: true,
        text: 'Seeing this gave me the nudge I needed today to set aside my first ₹1,000. Congratulations!',
        timestamp: '4 days ago',
        likesCount: 10
      },
      {
        id: 'rep-5-3',
        author: 'Divya T.',
        text: 'Check your SheScore! You will notice your savings pillar score jump as your emergency coverage expands.',
        timestamp: '3 days ago',
        likesCount: 6
      }
    ]
  }
];

export const COMMUNITY_MILESTONES: CommunityMilestone[] = [
  {
    id: 'mile-1',
    title: 'First ₹10,000 Saved',
    author: 'Radhika S.',
    story: 'I started with small weekly savings and gradually built the habit.',
    badge: '🎉 Milestone'
  },
  {
    id: 'mile-2',
    title: 'Started Tracking My Business Cash Flow',
    author: 'Meera P.',
    story: 'Seeing my income patterns helped me prepare better for slower months.',
    badge: '🚀 Entrepreneur'
  },
  {
    id: 'mile-3',
    title: 'Built My Emergency Fund',
    author: 'Sneha B.',
    story: 'I focused on small consistent contributions instead of trying to save a large amount immediately.',
    badge: '🌱 Resilience'
  }
];
