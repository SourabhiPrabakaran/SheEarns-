import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSheAI } from '../context/SheAIContext';
import { PageId, ComponentKey, SheAIQuestionId, Recommendation, SheAIQuestion } from '../types';
import { ScoreRing } from '../components/common/ScoreRing';
import { ProgressBar } from '../components/common/ProgressBar';
import { SHE_AI_QUESTIONS, getSheAIResponse, askCustomSheAIQuestion } from '../utils/sheAiEngine';
import { formatPercent, formatMonths, formatINR } from '../utils/formatters';
import {
  Wallet,
  Coins,
  ShieldCheck,
  BookOpen,
  Building2,
  TrendingUp,
  Target,
  Bot,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Send,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

interface SheScorePageProps {
  onNavigate: (page: PageId) => void;
}

export const SheScorePage: React.FC<SheScorePageProps> = ({ onNavigate }) => {
  const { user, scoreData, recommendations, financingReadiness } = useUser();
  const { openAssistant } = useSheAI();
  const { displayScore, status, components, savingsRate, monthsCoverage } = scoreData;

  const [activeQuestionId, setActiveQuestionId] = useState<SheAIQuestionId | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<'groq' | 'deterministic' | null>(null);
  const [aiKeyPoint, setAiKeyPoint] = useState<string | null>(null);
  const [aiDisclaimer, setAiDisclaimer] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  const componentDetails: {
    key: ComponentKey;
    label: string;
    weight: string;
    icon: React.ReactNode;
    explanation: string;
  }[] = [
    {
      key: 'savingsStability',
      label: 'Savings Stability',
      weight: '25%',
      icon: <Wallet className="w-4 h-4" />,
      explanation: `Savings rate is ${formatPercent(savingsRate, 1)} of income (${formatINR(user.monthlySavings)}/mo). Brackets: 10–14% earns 60 pts, 20%+ earns 90 pts.`
    },
    {
      key: 'cashFlowHealth',
      label: 'Cash Flow Health',
      weight: '25%',
      icon: <Coins className="w-4 h-4" />,
      explanation: `Net surplus is ${formatINR(user.monthlyIncome - user.monthlyExpenses)}/mo (${formatPercent(scoreData.surplusRatio, 1)} surplus margin). Healthy positive surplus scores 100 pts.`
    },
    {
      key: 'emergencyPrep',
      label: 'Emergency Preparedness',
      weight: '20%',
      icon: <ShieldCheck className="w-4 h-4" />,
      explanation: `Emergency savings of ${formatINR(user.emergencySavings)} cover ${formatMonths(monthsCoverage)} of expenses. Target is 3+ months for 100 pts.`
    },
    {
      key: 'financialLiteracy',
      label: 'Financial Literacy',
      weight: '15%',
      icon: <BookOpen className="w-4 h-4" />,
      explanation: `Baseline ${user.financialConfidence.toLowerCase()} level (${user.financialConfidence === 'Beginner' ? 40 : user.financialConfidence === 'Intermediate' ? 70 : 90} pts) + ${(user.completedModules || []).length * 10} pts from completed modules (capped at 100).`
    },
    {
      key: 'incomeStability',
      label: 'Income Stability',
      weight: '15%',
      icon: <Building2 className="w-4 h-4" />,
      explanation: `Profile: ${user.incomeConsistency} flow earns ${components.incomeStability} pts. Very consistent earns 90 pts.`
    }
  ];

  // Triage: Strength, Opportunity, Growing
  const sortedByScore = [...componentDetails].sort(
    (a, b) => components[b.key] - components[a.key]
  );
  const strengthItem = sortedByScore[0];
  const opportunityItem = sortedByScore[sortedByScore.length - 1];
  const growingItem = sortedByScore[Math.floor(sortedByScore.length / 2)];

  // Guided SheAI Question Click Handler (with double-click protection)
  const handleAskAI = async (questionId: SheAIQuestionId) => {
    if (isLoadingAI) return;
    setActiveQuestionId(questionId);
    setIsLoadingAI(true);
    setAiAnswer(null);
    setAiKeyPoint(null);
    setAiDisclaimer(null);

    const response = await getSheAIResponse(questionId, user, scoreData);
    setAiAnswer(response.text);
    setAiSource(response.source);
    setAiKeyPoint(response.keyPoint || null);
    setAiDisclaimer(response.disclaimer || null);
    setIsLoadingAI(false);
  };

  // Custom Educational Question Handler (with scope guard)
  const handleAskCustomAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customQuestion.trim();
    if (!query || isLoadingAI) return;

    setActiveQuestionId('custom');
    setIsLoadingAI(true);
    setAiAnswer(null);
    setAiKeyPoint(null);
    setAiDisclaimer(null);

    const response = await askCustomSheAIQuestion(query);
    setAiAnswer(response.text);
    setAiSource(response.source);
    setAiKeyPoint(response.keyPoint || null);
    setAiDisclaimer(response.disclaimer || null);
    setIsLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-10 pb-24 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebe0] text-stone-800 border border-[#e5dcd3] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#762e50]" />
            <span>Frozen SheScore Model v1.0</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1e191b] tracking-tight">
            Your SheScore <span className="italic font-serif text-[#762e50]">Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            A transparent, multi-dimensional assessment of financial readiness and resilience.
          </p>
          <p className="text-[11px] text-stone-500 italic max-w-lg mx-auto">
            SheScore is an educational readiness indicator. It is not an official credit score or lending decision.
          </p>
        </div>

        {/* Hero Score Gauge Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 card-shadow border border-[#ece6de] text-center relative overflow-hidden">
          <div className="relative z-10">
            <ScoreRing score={displayScore} status={status} size={220} />

            <div className="mt-6 max-w-lg mx-auto space-y-2">
              <h2 className="font-display text-xl font-bold text-[#1e191b]">
                Current Status: {status} ({displayScore}/100)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {status === 'Strong' && "You're in a resilient financial position. Keep strengthening your long-term goals and investment foundations."}
                {status === 'Growing' && "You have solid momentum! Your cash flow is positive; scaling your emergency fund will elevate you to the Strong tier."}
                {status === 'Building' && "Foundations are falling into place. Consistent small savings and completing learning modules will lift your readiness rapidly."}
                {status === 'Starting' && "Every journey toward financial independence begins with clarity. Tracking your cash flow is your first major step forward."}
              </p>
            </div>
          </div>
        </div>

        {/* 5-Pillar Score Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-[#1e191b]">
                5-Pillar Score Breakdown
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Weighted formula: Savings (25%) + Cash Flow (25%) + Emergency (20%) + Literacy (15%) + Stability (15%)
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {componentDetails.map((c, i) => (
              <ProgressBar
                key={c.key}
                label={c.label}
                score={components[c.key]}
                weight={c.weight}
                icon={c.icon}
                explanation={c.explanation}
                delayMs={i * 80}
              />
            ))}
          </div>
        </div>

        {/* Diagnostic Triage: "Why This Score?" */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[#1e191b]">
            Why This Score?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Strength */}
            <div className="bg-white border border-[#ece6de] rounded-3xl p-6 flex flex-col justify-between card-shadow">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-3">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Top Strength
                </span>
                <h3 className="font-display font-bold text-[#1e191b] text-base mt-1">
                  {strengthItem.label}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                  {components[strengthItem.key]}/100 Points
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Your primary anchor providing financial peace of mind.
                </p>
              </div>
            </div>

            {/* Opportunity */}
            <div className="bg-white border border-[#ece6de] rounded-3xl p-6 flex flex-col justify-between card-shadow">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                  Biggest Opportunity
                </span>
                <h3 className="font-display font-bold text-[#1e191b] text-base mt-1">
                  {opportunityItem.label}
                </h3>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {components[opportunityItem.key]}/100 Points
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  The fastest leverage point to increase your overall SheScore.
                </p>
              </div>
            </div>

            {/* Growing */}
            <div className="bg-white border border-[#ece6de] rounded-3xl p-6 flex flex-col justify-between card-shadow">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-center text-[#762e50] mb-3">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#762e50] uppercase tracking-wider block">
                  Growing Area
                </span>
                <h3 className="font-display font-bold text-[#1e191b] text-base mt-1">
                  {growingItem.label}
                </h3>
                <p className="text-xs text-[#762e50] font-semibold mt-0.5">
                  {components[growingItem.key]}/100 Points
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Consistently improving with every small habit you practice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Action Plan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#1e191b]">
              Your Path Forward
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Prioritized next steps ordered by your lowest component areas.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {recommendations.map((rec: Recommendation, index: number) => (
              <div
                key={rec.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] hover:border-stone-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#1e191b] text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-display font-bold text-[#1e191b] text-sm sm:text-base">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-stone-600">
                    <span className="font-medium text-stone-500">Current:</span> {rec.currentStatus} →{' '}
                    <span className="font-semibold text-[#1e191b]">Target:</span> {rec.targetGoal}
                  </p>
                  {rec.suggestedModuleTitle && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetId = rec.suggestedModuleId || 'm1';
                        onNavigate(`learning-${targetId}` as PageId);
                      }}
                      className="text-xs text-[#762e50] font-medium pt-0.5 hover:underline cursor-pointer text-left block"
                    >
                      💡 Suggested action: Explore <strong>"{rec.suggestedModuleTitle}"</strong> →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENTREPRENEUR FINANCING READINESS (Visible ONLY when Income Type = Business) */}
        {user.incomeType === 'Business' && financingReadiness && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ece6de]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebe0] text-stone-800 border border-[#e5dcd3] text-xs font-medium mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-stone-700" />
                  <span>Alternative Financing Readiness</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#1e191b]">
                  Entrepreneur Financing Readiness
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
                  A sample alternative-readiness assessment using cash flow, business activity and financial resilience instead of conventional collateral or credit history.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-center shrink-0">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Financing Readiness
                </span>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#1e191b] mt-0.5">
                  {financingReadiness.displayScore}
                  <span className="text-sm font-normal text-stone-400"> / 100</span>
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                  Non-Collateral Signal
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs text-stone-600 leading-relaxed flex items-start gap-2.5">
              <span className="text-stone-500 font-bold shrink-0">ℹ️</span>
              <span>
                This is an educational financing-readiness indicator based on sample/non-traditional financial signals. It is not a credit score, lending decision, or guarantee of approval.
              </span>
            </div>

            {/* 5 Components Breakdown */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-[#1e191b] uppercase tracking-wider">
                Readiness Components (Alternative Scoring)
              </h3>
              <div className="space-y-1">
                <ProgressBar
                  label="Cash Flow Health"
                  score={financingReadiness.components.cashFlowHealth}
                  weight="30%"
                  icon={<Coins className="w-4 h-4" />}
                  explanation="Net monthly cash flow surplus reflects sustainable debt repayment capacity without conventional collateral."
                  delayMs={0}
                />
                <ProgressBar
                  label="Business Activity Consistency"
                  score={financingReadiness.components.businessActivityConsistency}
                  weight="25%"
                  icon={<Briefcase className="w-4 h-4" />}
                  explanation={`Operational consistency (${user.businessRevenueConsistency || 'Mostly consistent'}) demonstrates regular commercial activity and transaction flow.`}
                  delayMs={80}
                />
                <ProgressBar
                  label="Business Revenue Stability"
                  score={financingReadiness.components.businessRevenueStability}
                  weight="20%"
                  icon={<TrendingUp className="w-4 h-4" />}
                  explanation={`Ratio of monthly business revenue (${formatINR(user.businessMonthlyRevenue || 0)}) relative to total personal monthly income.`}
                  delayMs={160}
                />
                <ProgressBar
                  label="Savings / Emergency Buffer"
                  score={financingReadiness.components.emergencyPrep}
                  weight="15%"
                  icon={<ShieldCheck className="w-4 h-4" />}
                  explanation={`Liquid reserves (${formatINR(user.emergencySavings)}) available to cushion business against seasonal slowdowns or inventory lags.`}
                  delayMs={240}
                />
                <ProgressBar
                  label="Financial Literacy"
                  score={financingReadiness.components.financialLiteracy}
                  weight="10%"
                  icon={<BookOpen className="w-4 h-4" />}
                  explanation="Foundational knowledge of borrowing terms, interest management, and cash flow governance."
                  delayMs={320}
                />
              </div>

              {/* Contextual Ask SheAI Entry Point */}
              <div className="p-3.5 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#762e50] shrink-0" />
                  <span className="text-xs text-stone-700">
                    Not sure what these alternative scoring signals mean?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAssistant("How does alternative financing readiness evaluate business cash flow and activity instead of conventional collateral?")}
                  className="text-xs font-semibold text-[#762e50] hover:text-[#521f37] inline-flex items-center gap-1 cursor-pointer shrink-0 transition"
                >
                  <span>Ask SheAI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Explainability: Why this readiness score? */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-3">
              <h4 className="font-display font-bold text-sm text-[#1e191b]">
                Why this readiness score?
              </h4>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#ece6de] space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    ⭐ Primary Strength
                  </span>
                  <p className="text-stone-700 font-medium">
                    {financingReadiness.strongestComponent === 'cashFlowHealth'
                      ? 'Strong cash-flow health with healthy monthly surplus.'
                      : financingReadiness.strongestComponent === 'businessRevenueStability'
                      ? 'High revenue stability contributing significantly to income.'
                      : 'Solid operating activity consistency.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#ece6de] space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 block">
                    🎯 Key Opportunity
                  </span>
                  <p className="text-stone-700 font-medium">
                    {financingReadiness.weakestComponent === 'emergencyPrep'
                      ? 'Building emergency buffer to absorb business volatility.'
                      : financingReadiness.weakestComponent === 'businessActivityConsistency'
                      ? 'Stabilizing monthly operating consistency.'
                      : 'Expanding financial literacy knowledge base.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#ece6de] space-y-1">
                  <span className="text-[11px] font-bold text-[#762e50] block">
                    📈 Growth Area
                  </span>
                  <p className="text-stone-700 font-medium">
                    {financingReadiness.growthComponent === 'businessActivityConsistency'
                      ? 'Maintaining regular transaction rhythms.'
                      : financingReadiness.growthComponent === 'financialLiteracy'
                      ? 'Completing micro-learning modules.'
                      : 'Optimizing monthly operating surplus.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Deterministic Action Plan */}
            <div className="p-5 rounded-2xl bg-[#1e191b] text-white border border-[#352c31] flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-[#dbc38e] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-white text-sm">
                  Recommended Action Plan:
                </h4>
                <p className="text-xs text-stone-300 mt-0.5 font-normal">
                  {financingReadiness.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guided SheAI Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1e191b] flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1e191b]">
                Ask SheAI
              </h2>
              <p className="text-xs text-stone-500">
                Guided financial explanations personalized to your exact profile data.
              </p>
            </div>
          </div>

          {/* Guided Question Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {SHE_AI_QUESTIONS.filter(q => !q.businessOnly || user.incomeType === 'Business').map((q: SheAIQuestion) => {
              const isSelected = activeQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  disabled={isLoadingAI}
                  onClick={() => handleAskAI(q.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                    isLoadingAI ? 'cursor-not-allowed opacity-70 ' : ''
                  }${
                    isSelected
                      ? 'bg-[#1e191b] text-white border-[#1e191b] shadow-xs'
                      : 'bg-[#faf8f5] hover:bg-stone-100 text-stone-700 border-[#ece6de]'
                  }`}
                >
                  {q.label}
                </button>
              );
            })}
          </div>

          {/* Ask your own question input */}
          <div className="pt-3 border-t border-[#ece6de]">
            <form onSubmit={handleAskCustomAI} className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="custom-question-input"
                  className="text-xs font-medium text-stone-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#762e50]" />
                  <span>Ask your own financial question:</span>
                </label>
                <span className="text-[10px] text-stone-400">
                  {customQuestion.length}/160
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  id="custom-question-input"
                  type="text"
                  maxLength={160}
                  value={customQuestion}
                  onChange={e => setCustomQuestion(e.target.value)}
                  placeholder="e.g. What is collateral? What is APR? How does a credit score work?"
                  disabled={isLoadingAI}
                  className="flex-1 px-4 py-2.5 rounded-full border border-[#ece6de] bg-[#faf8f5] text-xs sm:text-sm text-[#1e191b] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || isLoadingAI}
                  className="px-5 py-2.5 rounded-full bg-[#1e191b] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  {isLoadingAI && activeQuestionId === 'custom' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Asking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Ask SheAI</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                Ask about financial terms (collateral, APR, EMI), credit building, budgeting, and savings concepts.
              </p>
            </form>
          </div>

          {/* AI Response Display */}
          {isLoadingAI && (
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-center gap-2 text-stone-700 text-xs sm:text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
              <span>Analyzing financial concept with SheAI...</span>
            </div>
          )}

          {aiAnswer && !isLoadingAI && (
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#ece6de] text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#762e50]" />
                  <span>SheAI Explanation</span>
                </span>
                <span className="text-[11px] text-stone-400 font-normal">
                  {aiSource === 'groq' ? 'Groq AI (Structured Education)' : 'SheAI Verified Financial Engine'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1e191b] leading-relaxed whitespace-pre-line font-normal">
                {aiAnswer}
              </p>
              {aiKeyPoint && (
                <div className="p-3.5 rounded-xl bg-white border border-[#e9d0dc] text-xs text-stone-900 font-medium flex items-start gap-2 shadow-2xs">
                  <span className="text-[#762e50] font-bold shrink-0">💡 Key Point:</span>
                  <span>{aiKeyPoint}</span>
                </div>
              )}
              {aiDisclaimer && (
                <p className="text-[11px] text-stone-500 italic mt-1 leading-normal">
                  {aiDisclaimer}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3.5 bg-white border border-stone-300 text-stone-800 font-medium rounded-full hover:bg-stone-50 transition flex items-center gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('independence')}
            className="px-7 py-3.5 bg-[#1e191b] hover:bg-black text-white font-medium rounded-full shadow-xs transition flex items-center gap-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Financial Independence Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
