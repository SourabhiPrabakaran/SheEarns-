export interface ScopeGuardResult {
  isAllowed: boolean;
  reason?: string;
  outOfScopeResponse?: {
    answer: string;
    key_point: string;
    disclaimer: string;
  };
}

// Patterns that are strictly out of scope
const OUT_OF_SCOPE_PATTERNS = [
  // Stock / Crypto / Specific Investment Tips
  /\b(stock|stocks|share market|crypto|cryptocurrency|bitcoin|btc|eth|ethereum|doge|trading|intraday|options trading|forex|multibagger|penny stock|which stock to buy|invest in crypto)\b/i,
  // Guaranteed returns / Get rich quick
  /\b(guaranteed return|double my money|100% profit|get rich quick|lottery|gamble|gambling|casino)\b/i,
  // Personalized Loan Approval Predictions
  /\b(will (the )?bank approve|will i get approved|guarantee my loan|approve my loan|can you approve my loan|will (sbi|hdfc|icici|axis) give me)\b/i,
  // Legal Advice
  /\b(sue my bank|lawsuit|legal action|court case|divorce lawyer|hire a lawyer)\b/i,
  // Medical Advice
  /\b(diagnose|cure|medicine dosage|prescription|disease treatment|symptoms of)\b/i
];

/**
 * Validates whether a custom user question falls within SheAI's educational financial scope.
 */
export function validateCustomQuestionScope(question: string): ScopeGuardResult {
  const trimmed = (question || '').trim();

  if (trimmed.length < 3) {
    return {
      isAllowed: false,
      reason: 'Question is too short. Please ask a financial concept or loan question.',
      outOfScopeResponse: {
        answer: 'Please enter a complete question about a financial concept, loan term, or credit-building step.',
        key_point: 'Ask about concepts like collateral, credit scores, APR, or emergency funds.',
        disclaimer: 'SheAI provides educational financial guidance.'
      }
    };
  }

  if (trimmed.length > 160) {
    return {
      isAllowed: false,
      reason: 'Question exceeds maximum character limit of 160 characters.',
      outOfScopeResponse: {
        answer: 'Your question is a bit too long. Please keep questions concise (under 160 characters).',
        key_point: 'Short, focused questions about terms or concepts work best.',
        disclaimer: 'SheAI provides educational financial guidance.'
      }
    };
  }

  // Check out-of-scope patterns
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isAllowed: false,
        reason: 'Question falls outside SheAI educational scope.',
        outOfScopeResponse: {
          answer:
            "I'm SheAI, your educational financial guide. I specialize in explaining financial concepts, loan terms, credit education, and budgeting basics. I cannot provide individual stock or crypto investment tips, legal or medical advice, or personal loan approval guarantees.\n\n💡 Try asking an educational question such as:\n• \"What is collateral?\"\n• \"How does a credit score work?\"\n• \"What is the difference between secured and unsecured loans?\"\n• \"How can I build credit history?\"",
          key_point:
            'SheAI offers general financial education, not personalized investment, legal, or lending decisions.',
          disclaimer:
            'Educational information only. Always consult registered professionals for formal financial, legal, or lending advice.'
        }
      };
    }
  }

  return { isAllowed: true };
}

/**
 * Deterministic fallback educational answers for common queries if Groq is offline
 */
export const DETERMINISTIC_CONCEPT_FALLBACKS: Record<
  string,
  { answer: string; key_point: string; disclaimer: string }
> = {
  collateral: {
    answer:
      'Collateral is an asset (such as gold, property, or fixed deposits) that a borrower pledges to a lender to secure a loan. If the borrower is unable to repay the loan, the lender has the legal right to seize the asset to recover the outstanding balance. Because collateral lowers the lender’s risk, secured loans often come with lower interest rates.',
    key_point: 'Collateral secures a loan with an asset, often resulting in lower interest rates.',
    disclaimer: 'Educational explanation of lending terminology. Not formal lending advice.'
  },
  apr: {
    answer:
      'APR (Annual Percentage Rate) is the total annual cost of borrowing money, expressed as a yearly percentage. Unlike a basic interest rate, APR includes both the interest rate and mandatory upfront fees, processing charges, or loan origination costs, giving you the true cost of credit.',
    key_point: 'APR reflects the total annual borrowing cost, including fees and interest.',
    disclaimer: 'Educational explanation of financial terms. Not lending advice.'
  },
  credit_score: {
    answer:
      'A credit score (such as CIBIL in India, ranging from 300 to 900) is a three-digit metric representing your creditworthiness. It is calculated based on your repayment history, credit utilization ratio, length of credit history, and types of credit held. Scores above 750 generally qualify for the best loan terms.',
    key_point: 'A strong credit score (750+) is built by on-time payments and low credit utilization.',
    disclaimer: 'General credit education. Credit reporting bureaus determine official scores.'
  },
  secured_loan: {
    answer:
      'A secured loan is backed by collateral—such as a home loan backed by real estate or a gold loan. Because the lender holds collateral, these loans typically have lower interest rates. In contrast, unsecured loans (like personal loans or credit cards) require no collateral but carry higher interest rates due to higher risk for the lender.',
    key_point: 'Secured loans require collateral and carry lower interest; unsecured loans need no collateral but cost more.',
    disclaimer: 'Educational loan terminology. Not an offer of credit.'
  },
  build_credit: {
    answer:
      'To build a healthy credit history from scratch: 1) Open a secured credit card backed by a small fixed deposit. 2) Keep credit utilization below 30% of your limit. 3) Always pay full balances on time every month. 4) Avoid applying for multiple loans simultaneously. Consistent, timely payments over 6–12 months establish a strong score.',
    key_point: 'Use a secured card, keep utilization under 30%, and pay on time every month to build credit.',
    disclaimer: 'Educational credit guidance. Formal scores are issued by authorized credit bureaus.'
  }
};

/**
 * Retrieves a deterministic educational fallback for custom questions if Groq is unavailable
 */
export function getEducationalFallback(question: string): {
  answer: string;
  key_point: string;
  disclaimer: string;
} {
  const lower = (question || '').toLowerCase();

  if (lower.includes('collateral')) {
    return DETERMINISTIC_CONCEPT_FALLBACKS.collateral;
  }
  if (lower.includes('apr') || lower.includes('annual percentage')) {
    return DETERMINISTIC_CONCEPT_FALLBACKS.apr;
  }
  if (lower.includes('credit score') || lower.includes('cibil') || lower.includes('credit history')) {
    if (lower.includes('build') || lower.includes('start') || lower.includes('improve')) {
      return DETERMINISTIC_CONCEPT_FALLBACKS.build_credit;
    }
    return DETERMINISTIC_CONCEPT_FALLBACKS.credit_score;
  }
  if (lower.includes('secured') || lower.includes('unsecured')) {
    return DETERMINISTIC_CONCEPT_FALLBACKS.secured_loan;
  }

  // General default educational fallback
  return {
    answer:
      `Financial concepts like "${question.trim()}" are key building blocks of financial independence. Managing cash flow, keeping debt service manageable, and maintaining an emergency buffer are universal principles that strengthen your long-term security.`,
    key_point: 'Clear understanding of financial concepts empowers confident, dignified decision-making.',
    disclaimer: 'Educational financial guidance. SheAI provides literacy support, not individualized lending advice.'
  };
}
