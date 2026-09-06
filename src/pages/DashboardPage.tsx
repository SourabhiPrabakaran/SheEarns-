import React from 'react';
import { useUser } from '../context/UserContext';
import { PageId, LearningModule } from '../types';
import { LEARNING_MODULES } from '../data/learningModules';
import { STATIC_EXPENSE_CATEGORIES, ExpenseCategory } from '../data/expenseCategories';
import { StatCard } from '../components/ui/StatCard';
import { formatINR, formatPercent, formatMonths } from '../utils/formatters';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Target,
  CheckCircle2,
  Circle,
  BookOpen,
  PieChart as PieChartIcon,
  Sparkles,
  Award
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getRecommendedLearningModule } from '../utils/learningRecommendation';
import { FinancialHistorySection } from '../components/dashboard/FinancialHistorySection';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    user,
    scoreData,
    recommendations,
    toggleModule,
    isModuleCompleted,
    financialHistory,
    addFinancialHistoryRecord,
    resetFinancialHistory
  } = useUser();

  const savingsRate = user.monthlyIncome > 0
    ? (user.monthlySavings / user.monthlyIncome) * 100
    : 0;

  const monthsCoverage = user.monthlyExpenses > 0
    ? user.emergencySavings / user.monthlyExpenses
    : 0;

  // Single source of truth: reuse the top prioritized recommendation from scoring engine
  const nextBestStep = recommendations[0];

  // Deterministic personalized learning recommendation (incorporating financial history context)
  const learningRecommendation = getRecommendedLearningModule(user, scoreData, financialHistory);

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-8 sm:py-10 pb-24 text-left">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Header with Greeting & SheScore Quick Snapshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf5f7] text-[#762e50] border border-[#e9d0dc] text-xs font-semibold mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#762e50]" />
              <span>Financial Overview</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1e191b] font-normal tracking-tight">
              Hello, {user.name}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Your real-time financial readiness and cash flow snapshot.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-[#faf8f5] p-3.5 sm:p-4 rounded-2xl border border-[#ece6de]">
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-stone-500">
                SheScore
              </span>
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#1e191b] leading-tight block">
                {scoreData.displayScore}
              </span>
              <span className="inline-block text-[10px] font-semibold text-[#762e50] px-2 py-0.5 rounded-full bg-[#faf5f7] border border-[#e9d0dc]">
                {scoreData.status}
              </span>
            </div>
            <button
              onClick={() => onNavigate('score')}
              className="px-4 py-2.5 rounded-full bg-[#1e191b] hover:bg-black text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
              title="View full SheScore breakdown"
              aria-label="View full SheScore breakdown"
            >
              <span>View SheScore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Monthly Income"
            value={user.monthlyIncome}
            prefix="₹"
            icon={<Wallet className="w-4 h-4" />}
            hint="Gross monthly inflow"
          />
          <StatCard
            label="Monthly Expenses"
            value={user.monthlyExpenses}
            prefix="₹"
            icon={<PieChartIcon className="w-4 h-4" />}
            hint="Essential & personal"
          />
          <StatCard
            label="Monthly Savings"
            value={user.monthlySavings}
            prefix="₹"
            icon={<TrendingUp className="w-4 h-4" />}
            hint={`${Math.round(savingsRate)}% savings rate`}
          />
          <StatCard
            label="SheScore"
            value={scoreData.displayScore}
            subText={`— ${scoreData.status}`}
            icon={<Award className="w-4 h-4" />}
            hint="Financial readiness score"
          />
        </div>

        {/* Explicit "Your Next Best Step" Section (Dark Charcoal Editorial Banner) */}
        {nextBestStep && (
          <div className="bg-[#1e191b] text-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#352c31] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2f252a] text-[#dbc38e] border border-[#44363d] text-xs font-medium">
                <Sparkles className="w-3 h-3 text-[#dbc38e]" />
                <span>Your Next Best Step</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-white font-normal tracking-tight">
                {nextBestStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                {nextBestStep.currentStatus}
              </p>
            </div>
            <button
              onClick={() => onNavigate('score')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-[#1e191b] font-medium text-xs sm:text-sm transition-all shadow-sm shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e191b]"
            >
              <span>View My Improvement Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Middle Row: Expense Breakdown & Dynamic Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Static Expense Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 card-shadow border border-[#ece6de] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-[#1e191b] flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-stone-700" />
                  <span>Expense Distribution</span>
                </h3>
                <span className="text-xs font-medium text-stone-600 bg-[#faf8f5] border border-[#ece6de] px-2.5 py-1 rounded-full">
                  Total: {formatINR(user.monthlyExpenses)}
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATIC_EXPENSE_CATEGORIES}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={40}
                      paddingAngle={4}
                    >
                      {STATIC_EXPENSE_CATEGORIES.map((entry: ExpenseCategory, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${formatINR(val)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Legend */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#ece6de] text-xs">
              {STATIC_EXPENSE_CATEGORIES.map((cat: ExpenseCategory, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-stone-700 truncate">{cat.name}</span>
                  <span className="text-stone-500 font-medium ml-auto">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Financial Insights */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 card-shadow border border-[#ece6de] flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#1e191b] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#762e50]" />
                <span>Financial Insights</span>
              </h3>

              <div className="space-y-3">
                {/* Savings Insight */}
                <div className="flex gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    <p className="font-semibold text-[#1e191b]">Healthy Monthly Savings</p>
                    <p className="text-stone-600 text-xs mt-0.5">
                      You are saving <strong>{formatPercent(savingsRate, 1)}</strong> of your monthly income ({formatINR(user.monthlySavings)}/mo).
                    </p>
                  </div>
                </div>

                {/* Emergency Fund Insight */}
                <div className="flex gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de]">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    <p className="font-semibold text-[#1e191b]">Emergency Fund Growth Opportunity</p>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Your emergency savings cover <strong>{formatMonths(monthsCoverage)}</strong> of expenses. Target is 3–6 months ({formatINR(user.monthlyExpenses * 3)}).
                    </p>
                  </div>
                </div>

                {/* Goal Focus */}
                <div className="flex gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de]">
                  <div className="w-8 h-8 rounded-xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-center text-[#762e50] shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    <p className="font-semibold text-[#1e191b]">Core Financial Goal</p>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Focused on <strong>"{user.financialGoal}"</strong>. Completing learning modules raises literacy readiness.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ece6de] text-right">
              <button
                onClick={() => onNavigate('score')}
                className="text-xs font-semibold text-stone-700 hover:text-[#1e191b] inline-flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
              >
                <span>Explore score breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Financial History and Trend Analysis Section */}
        <FinancialHistorySection
          records={financialHistory}
          isBusiness={user.incomeType === 'Business'}
          onAddRecord={addFinancialHistoryRecord}
          onResetDefault={resetFinancialHistory}
        />

        {/* Financial Readiness Learning Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1e191b] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-stone-800" />
                <span>Financial Readiness Learning</span>
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Each completed module adds <strong>+10 points</strong> to your Financial Literacy score, immediately lifting your SheScore!
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#faf8f5] border border-[#ece6de] text-stone-700 self-start sm:self-center">
              Completed: {(user.completedModules || []).length} / {LEARNING_MODULES.length}
            </span>
          </div>

          {/* Personalized "Recommended for You" Card */}
          {learningRecommendation.allCompleted ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#faf8f5] border border-[#ece6de] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>All Modules Completed</span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-[#1e191b]">
                  {learningRecommendation.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {learningRecommendation.reason}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100/70 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Full Literacy Earned</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#faf5f7] border border-[#e9d0dc] flex flex-col md:flex-row md:items-center justify-between gap-5 card-shadow text-left">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e9d0dc] text-[#762e50] text-[10px] font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-[#762e50]" />
                  <span>PERSONALIZED FOR YOU</span>
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium block uppercase tracking-wider">
                    Your Recommended Next Step
                  </span>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-[#1e191b] mt-0.5">
                    {learningRecommendation.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {learningRecommendation.reason}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate(`learning-${learningRecommendation.moduleId}` as PageId)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs sm:text-sm font-sans font-medium transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
                >
                  <span>Start Learning →</span>
                </button>
              </div>
            </div>
          )}

          {/* Existing Three Learning Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {LEARNING_MODULES.map((module: LearningModule) => {
              const isCompleted = isModuleCompleted(module.id);
              const isRecommended = !learningRecommendation.allCompleted && learningRecommendation.moduleId === module.id;
              return (
                <div
                  key={module.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open learning module: ${module.title}`}
                  onClick={() => onNavigate(`learning-${module.id}` as PageId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigate(`learning-${module.id}` as PageId);
                    }
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between cursor-pointer group hover:shadow-md hover:-translate-y-0.5 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2 ${
                    isRecommended && !isCompleted
                      ? 'bg-[#faf5f7]/60 border-[#e9d0dc] ring-1 ring-[#e9d0dc]/80'
                      : isCompleted
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : 'bg-[#faf8f5] border-[#ece6de] hover:bg-white hover:border-stone-300'
                  }`}
                  title="Click to read full lesson"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-1">
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#ece6de] text-stone-600">
                        {module.time}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {isRecommended && !isCompleted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#faf5f7] text-[#762e50] border border-[#e9d0dc]">
                            Recommended for you
                          </span>
                        )}
                        <span className="text-xs text-stone-500 font-normal">
                          {module.category}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Done
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-[#1e191b] text-base sm:text-lg mb-1.5 group-hover:text-[#762e50] transition-colors flex items-center justify-between">
                      <span>{module.title}</span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#762e50] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-5">
                      {module.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModule(module.id);
                      }}
                      className={`w-full py-2.5 rounded-full text-xs font-sans font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-1 ${
                        isCompleted
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                          : 'bg-white hover:bg-stone-100 text-stone-800 border border-[#ece6de]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed (+10 pts)</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-stone-400" />
                          <span>Mark Complete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('score')}
            className="px-7 py-3.5 bg-[#1e191b] hover:bg-black text-white font-medium rounded-full shadow-sm transition flex items-center gap-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
          >
            <span>View Full SheScore Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('independence')}
            className="px-6 py-3.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-medium rounded-full transition text-xs sm:text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
          >
            Financial Independence Check →
          </button>
        </div>
      </div>
    </div>
  );
};
