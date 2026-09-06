export interface LessonSection {
  heading: string;
  paragraphs: string[];
  tips?: string[];
}

export interface LessonData {
  id: string; // 'm1', 'm2', 'm3'
  title: string;
  category: string;
  time: string;
  overview: string;
  sections: LessonSection[];
  practicalExample: {
    scenarioTitle: string;
    background: string;
    breakdown: { label: string; value: string }[];
    lessonLearned: string;
  };
  keyTakeaways: string[];
  nextSteps: {
    title: string;
    description: string;
  }[];
}

export const LESSON_CONTENTS: Record<string, LessonData> = {
  m1: {
    id: 'm1',
    title: 'Building an Emergency Fund',
    category: 'Security',
    time: '3 min read',
    overview: 'An emergency fund is your financial seatbelt. It is not an investment designed for high returns—it is pure peace of mind, ensuring unexpected events never compromise your independence or force you into debt.',
    sections: [
      {
        heading: '1. What is an Emergency Fund?',
        paragraphs: [
          'An emergency fund is money kept strictly in reserve for life’s unpredictable moments—such as medical emergencies, sudden home or appliance repairs, family transitions, or temporary gaps in earnings.',
          'Without dedicated cash reserves, even a minor unexpected expense of ₹10,000 can force you to borrow on high-interest credit cards, pawn jewelry, or rely on others for assistance.'
        ]
      },
      {
        heading: '2. The 3–6 Month Rule: How Much Do You Need?',
        paragraphs: [
          'The benchmark rule for financial security is having 3 to 6 months worth of essential living expenses safely parked in cash.',
          'Notice the emphasis on "essential expenses": calculate rent, groceries, medicines, utilities, and debt obligations—not lifestyle dining or shopping. If your essential monthly expenses are ₹32,000, your 3-month starter cushion is ₹96,000.'
        ],
        tips: [
          'Starter Milestone: Aim for 1 month of essential expenses first.',
          'Full Security Milestone: Reach 3 to 6 months of living expenses.'
        ]
      },
      {
        heading: '3. Where Should You Keep This Money?',
        paragraphs: [
          'Emergency funds must be completely liquid and accessible within 24 hours, but physically separated from your daily spending account.',
          'If you leave your emergency money in your primary savings account connected to UPI and food delivery apps, it tends to evaporate unnoticed. Instead, keep it in a separate savings account at a reliable bank or in high-safety liquid mutual funds.'
        ]
      }
    ],
    practicalExample: {
      scenarioTitle: 'Real-Life Scenario: Priya’s Unexpected Appliance & Medical Bill',
      background: 'Priya earns ₹45,000/month and has ₹32,000 in monthly expenses. One month, her laptop required urgent motherboard repair (₹8,500) and an outpatient medical checkup cost ₹4,000—a sudden ₹12,500 shock.',
      breakdown: [
        { label: 'Essential Monthly Expenses', value: '₹32,000' },
        { label: 'Total Unexpected Incurred', value: '₹12,500' },
        { label: 'Without Emergency Reserve', value: 'Forced to borrow at 24%+ card interest or dip into next month’s rent' },
        { label: 'With 3-Month Emergency Reserve', value: 'Absorbed seamlessly in full; rebuilt in the following 2 months' }
      ],
      lessonLearned: 'Having an emergency fund meant zero panic, zero borrowing, and zero emotional stress. Her financial autonomy remained 100% intact.'
    },
    keyTakeaways: [
      'Safety before return: An emergency fund is an insurance policy against panic, not an investment for profit.',
      'Separate your accounts: Keep your emergency fund out of sight of daily UPI apps.',
      'Start small: Saving even ₹1,500 per month will create a ₹18,000 buffer in 12 months.'
    ],
    nextSteps: [
      {
        title: 'Step 1: Calculate Your 1-Month Baseline',
        description: 'Review your essentials (rent, food, bills) and write down your target 1-month figure today.'
      },
      {
        title: 'Step 2: Open a "No-Touch" Savings Account',
        description: 'Set up an independent secondary account or auto-recurring deposit dedicated only to emergencies.'
      }
    ]
  },

  m2: {
    id: 'm2',
    title: 'Understanding Cash Flow',
    category: 'Budgeting',
    time: '4 min read',
    overview: 'Earning a high income does not automatically make you financially free. True financial strength is determined by your net cash flow surplus: how much money remains in your hands after all expenses are met.',
    sections: [
      {
        heading: '1. Cash Flow vs Income: The Crucial Difference',
        paragraphs: [
          'Income is the gross money flowing into your bank account each month. Cash flow is the net difference between your total inflows and all outflows.',
          'Someone earning ₹80,000 and spending ₹78,000 has a dangerously fragile cash flow of only ₹2,000 (2.5% margin). Meanwhile, someone earning ₹45,000 and spending ₹32,000 has a resilient cash flow surplus of ₹13,000 (28.8% margin).'
        ]
      },
      {
        heading: '2. The Three Cash Flow Buckets',
        paragraphs: [
          'Organizing your cash flow into three clear buckets brings instant transparency without tedious budgeting spreadsheets:',
          '• Inflow: Salary, business turnover, freelance payments, or family transfers.\n• Fixed Essentials: Rent, utilities, EMIs, grocery essentials, insurance premiums.\n• Discretionary Outflow: Dining, impulse online orders, apparel, and leisure subscriptions.'
        ],
        tips: [
          'Healthy Benchmark: Keep essential fixed costs under 60% of income.',
          'Aim for at least a 20% positive cash flow surplus each month.'
        ]
      },
      {
        heading: '3. Identifying "Invisible" Cash Leaks',
        paragraphs: [
          'With instant UPI payments and micro-transactions, small daily expenses can quietly drain ₹4,000–₹8,000 each month without leaving a trace.',
          'Audit recurring charges, unused OTT memberships, and frequent food delivery surges. Stopping just two unnoticed leaks can fund your entire emergency savings goal.'
        ]
      }
    ],
    practicalExample: {
      scenarioTitle: 'Real-Life Scenario: Finding ₹13,000 Monthly Surplus',
      background: 'When Priya first examined her statements, she was saving very little despite a ₹45,000 salary because her expenses fluctuated erratically.',
      breakdown: [
        { label: 'Gross Monthly Income', value: '₹45,000' },
        { label: 'Optimized Essential Expenses', value: '₹32,000' },
        { label: 'Net Monthly Surplus', value: '+₹13,000' },
        { label: 'Surplus Ratio', value: '28.8% (Healthy > 20% tier)' }
      ],
      lessonLearned: 'By distinguishing true essentials from spontaneous purchases, Priya unlocked ₹13,000 every month to fund savings, investments, and business ideas.'
    },
    keyTakeaways: [
      'Cash flow is king: Surplus margin matters far more than gross earnings.',
      'Frictionless spending is dangerous: Track digital payments for one week to catch invisible leaks.',
      'Aim for 20%+ surplus: A 20% buffer shields you from inflation and allows rapid wealth building.'
    ],
    nextSteps: [
      {
        title: 'Step 1: Download Your Last 30-Day Bank Statement',
        description: 'Highlight every transaction over ₹500 and categorize it as Essential vs Non-essential.'
      },
      {
        title: 'Step 2: Pause Two Unnecessary Subscriptions',
        description: 'Cancel or pause two auto-renewing apps or streaming services you haven’t used in the past month.'
      }
    ]
  },

  m3: {
    id: 'm3',
    title: 'Smart Saving Habits',
    category: 'Growth',
    time: '3 min read',
    overview: 'Saving money is not about sacrifice or deprivation—it is about paying yourself first. Learn how automated saving habits turn modest monthly contributions into lasting financial power.',
    sections: [
      {
        heading: '1. The Golden Rule: "Pay Yourself First"',
        paragraphs: [
          'Most people follow this failing formula: Income − Expenses = Savings (whatever is left over at the end of the month). Usually, that amount is zero.',
          'Successful financial management flips the equation: Income − Savings (transferred first) = Expenses. The moment your income arrives, transfer your target savings immediately before spending begins.'
        ]
      },
      {
        heading: '2. The 50 / 30 / 20 Rule for Financial Independence',
        paragraphs: [
          'A proven guideline tailored for women seeking financial security:',
          '• 50% Needs: Housing, groceries, healthcare, and essential bills.\n• 30% Wants: Hobbies, celebrations, personal care, and social life.\n• 20% Savings & Debt: Emergency fund, investments, and debt reduction.'
        ],
        tips: [
          'Even starting with 10% savings builds the psychological habit.',
          'Scale up by 2–5% every time your income increases.'
        ]
      },
      {
        heading: '3. Put Your Savings on Autopilot',
        paragraphs: [
          'Do not rely on daily willpower to save. Human psychology makes spending money easy when it sits in a checking account.',
          'Set up an automated Standing Instruction (SI) or Recurring Deposit (RD) to transfer your target amount 24 to 48 hours after your salary or business revenue date.'
        ]
      }
    ],
    practicalExample: {
      scenarioTitle: 'Real-Life Scenario: The Compounding Effect of Automated Savings',
      background: 'Priya commits to saving ₹6,000 per month (13.3% of her ₹45,000 salary) through an automated recurring deposit on the 2nd of every month.',
      breakdown: [
        { label: 'Monthly Automated Savings', value: '₹6,000' },
        { label: 'Year 1 Accumulated (Principal)', value: '₹72,000' },
        { label: 'Year 3 Accumulated (with 7% interest)', value: '₹2,42,000' },
        { label: 'Year 5 Accumulated (with 7% interest)', value: '₹4,30,000+' }
      ],
      lessonLearned: 'Because the transfer occurred automatically on day 2, Priya never felt deprived, yet built over ₹4.3 Lakhs in pure personal wealth.'
    },
    keyTakeaways: [
      'Pay yourself first: Move savings on payday, not at month-end.',
      'Automate everything: Systems beat willpower every single time.',
      'Small sums compound: Regular monthly savings grow exponentially over 3 to 5 years.'
    ],
    nextSteps: [
      {
        title: 'Step 1: Pick a Realistic Starting Amount',
        description: 'Choose a monthly savings number (e.g. ₹2,000 or ₹5,000) that you can commit to for the next 6 months.'
      },
      {
        title: 'Step 2: Schedule an Auto-Debit Transfer',
        description: 'Configure an automatic Recurring Deposit (RD) or SIP scheduled for the 2nd or 3rd of next month.'
      }
    ]
  }
};
