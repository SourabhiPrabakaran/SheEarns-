import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
  UserProfile,
  IncomeType,
  FinancialConfidence,
  IncomeConsistency,
  BusinessRevenueConsistency,
  BusinessOperatingDuration
} from '../types';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { ArrowRight, RotateCcw, User, ShieldCheck, Briefcase, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { user, setUser, resetToPriya, loadMeera } = useUser();
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  const handleChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev: UserProfile) => ({ ...prev, [field]: value }));
  };

  const handleResetPriya = () => {
    resetToPriya();
    setFormData({ ...PRIYA_DEMO_USER });
  };

  const handleLoadMeera = () => {
    loadMeera();
    setFormData({ ...MEERA_DEMO_USER });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isBiz = formData.incomeType === 'Business';
    setUser({
      ...formData,
      completedModules: formData.completedModules || [],
      financialHistory:
        formData.financialHistory && formData.financialHistory.length > 0
          ? formData.financialHistory
          : isBiz
          ? [...MEERA_DEMO_USER.financialHistory!]
          : [...PRIYA_DEMO_USER.financialHistory!]
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-12 pb-24 text-left">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebe0] text-stone-800 border border-[#e5dcd3] text-xs font-medium">
            <User className="w-3.5 h-3.5" />
            <span>Profile Configuration</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1e191b] font-normal tracking-tight">
            Your Financial <span className="italic font-serif text-[#762e50]">Profile</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Choose your income type. Switch to <strong>Business</strong> to activate the <strong>Entrepreneur Financing Readiness</strong> mode.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6"
        >
          {/* Quick Demo Profile Loaders */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs">
              <div className="flex items-center gap-2 text-stone-800">
                <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="font-medium">Salaried Demo (Priya)</span>
              </div>
              <button
                type="button"
                onClick={handleResetPriya}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-stone-800 font-medium text-xs border border-[#ece6de] hover:border-stone-400 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Load</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] text-xs">
              <div className="flex items-center gap-2 text-stone-800">
                <Sparkles className="w-4 h-4 text-[#762e50] shrink-0" />
                <span className="font-medium">Sample Entrepreneur (Meera)</span>
              </div>
              <button
                type="button"
                onClick={handleLoadMeera}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-stone-800 font-medium text-xs border border-[#ece6de] hover:border-stone-400 transition"
              >
                <Briefcase className="w-3 h-3" />
                <span>Load</span>
              </button>
            </div>
          </div>

          {/* Name & Income Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Income Type
              </label>
              <select
                value={formData.incomeType}
                onChange={e => handleChange('incomeType', e.target.value as IncomeType)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
              >
                <option value="Salaried">Salaried</option>
                <option value="Freelance">Freelance</option>
                <option value="Business">Business (Entrepreneur Mode)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Monthly Income & Expenses */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Total Monthly Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.monthlyIncome}
                onChange={e => handleChange('monthlyIncome', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Monthly Expenses (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.monthlyExpenses}
                onChange={e => handleChange('monthlyExpenses', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                required
              />
            </div>
          </div>

          {/* Monthly Savings & Emergency Savings */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Monthly Savings (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.monthlySavings}
                onChange={e => handleChange('monthlySavings', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Emergency Savings Fund (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.emergencySavings}
                onChange={e => handleChange('emergencySavings', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                required
              />
            </div>
          </div>

          {/* ENTREPRENEUR MODE: Business Activity & Cash-flow Fields */}
          {formData.incomeType === 'Business' && (
            <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#ece6de] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#ece6de]">
                <Briefcase className="w-4 h-4 text-stone-800" />
                <h3 className="font-display font-bold text-sm text-[#1e191b]">
                  Entrepreneur Non-Traditional Data
                </h3>
                <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-[#ece6de] text-stone-700 ml-auto">
                  Alternative Signals
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Evaluating financing readiness via cash-flow patterns and business consistency without requiring conventional collateral or credit bureau history.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Monthly Revenue (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.businessMonthlyRevenue ?? 0}
                    onChange={e => handleChange('businessMonthlyRevenue', Number(e.target.value))}
                    placeholder="45000"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ece6de] bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Evaluates revenue stability ratio.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Average Monthly Business Surplus (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.averageMonthlyBusinessSurplus ?? 0}
                    onChange={e => handleChange('averageMonthlyBusinessSurplus', Number(e.target.value))}
                    placeholder="22000"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ece6de] bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Operational cash flow buffer.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Revenue Consistency
                  </label>
                  <select
                    value={formData.businessRevenueConsistency ?? 'Mostly consistent'}
                    onChange={e => handleChange('businessRevenueConsistency', e.target.value as BusinessRevenueConsistency)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ece6de] bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                  >
                    <option value="Very consistent">Very consistent (100)</option>
                    <option value="Mostly consistent">Mostly consistent (80)</option>
                    <option value="Sometimes irregular">Sometimes irregular (60)</option>
                    <option value="Highly irregular">Highly irregular (35)</option>
                  </select>
                  <p className="text-[10px] text-stone-500 mt-1">Operational regularity signal.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Operating Duration
                  </label>
                  <select
                    value={formData.businessOperatingDuration ?? '1–3 years'}
                    onChange={e => handleChange('businessOperatingDuration', e.target.value as BusinessOperatingDuration)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ece6de] bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
                  >
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  <p className="text-[10px] text-stone-500 mt-1">Business track record tenure.</p>
                </div>
              </div>
            </div>
          )}

          {/* Income Consistency & Financial Confidence */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Personal Income Consistency
              </label>
              <select
                value={formData.incomeConsistency}
                onChange={e => handleChange('incomeConsistency', e.target.value as IncomeConsistency)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
              >
                <option value="Very consistent">Very consistent (90)</option>
                <option value="Mostly consistent">Mostly consistent (75)</option>
                <option value="Sometimes irregular">Sometimes irregular (55)</option>
                <option value="Highly irregular">Highly irregular (35)</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1">Factors directly into Income Stability score.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                Financial Confidence
              </label>
              <select
                value={formData.financialConfidence}
                onChange={e => handleChange('financialConfidence', e.target.value as FinancialConfidence)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
              >
                <option value="Beginner">Beginner (40 base)</option>
                <option value="Intermediate">Intermediate (70 base)</option>
                <option value="Confident">Confident (90 base)</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1">Base score for Financial Literacy (+10/module).</p>
            </div>
          </div>

          {/* Primary Financial Goal */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Primary Financial Goal
            </label>
            <select
              value={formData.financialGoal}
              onChange={e => handleChange('financialGoal', e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#ece6de] bg-[#faf8f5] focus:bg-white focus:border-stone-400 outline-none text-[#1e191b] text-sm font-medium transition"
            >
              <option value="Become financially independent">Become financially independent</option>
              <option value="Build emergency savings">Build emergency savings</option>
              <option value="Start a business">Start a business</option>
              <option value="Expand my business">Expand my business</option>
              <option value="Improve financial confidence">Improve financial confidence</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#1e191b] hover:bg-black text-white font-medium rounded-full transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Save Profile & View Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
