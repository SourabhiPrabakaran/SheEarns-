import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Coins,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Lock,
  Activity
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const scrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col text-[#1e191b]">
      {/* Clean, Professional Landing Page Header */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ece6de] transition-all">
        <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-[80px] flex items-center justify-between gap-4 sm:gap-6">
          {/* Exact SHEEARNS logo image on the far left */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => scrollTo('top')}
              className="transition cursor-pointer block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
              title="SheEarns Home"
              aria-label="SheEarns Home"
            >
              <BrandLogo size="header" />
            </button>
          </div>

          {/* Navigation links: Home | How It Works | Features | Why SheEarns */}
          <nav 
            aria-label="Landing Page Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-10 font-sans text-[15px] font-medium text-stone-700"
          >
            <button
              onClick={() => scrollTo('top')}
              className="hover:text-[#1e191b] transition-colors py-1 cursor-pointer tracking-normal rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#1e191b] transition-colors py-1 cursor-pointer tracking-normal rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-[#1e191b] transition-colors py-1 cursor-pointer tracking-normal rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('why-sheearns')}
              className="hover:text-[#1e191b] transition-colors py-1 cursor-pointer tracking-normal rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
            >
              Why SheEarns
            </button>
          </nav>

          {/* "Get Started" CTA button aligned to the far right */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onStart}
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs sm:text-[15px] font-sans font-medium transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 sm:px-8 pt-14 pb-20 md:pt-20 md:pb-28 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2ebe0]/80 border border-[#e5dcd3] text-stone-800 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#762e50]" />
              <span>Alternative Financial Readiness for Women</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1e191b] leading-[1.12] tracking-tight font-normal">
              Understand Your Money.<br />
              Build Your <span className="italic font-serif text-[#762e50]">Independence.</span>
            </h1>

            <p className="text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              A compassionate, alternative readiness platform helping women master cash flow, build resilient emergency reserves, and assess loan preparedness without conventional collateral.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1e191b] hover:bg-black text-white text-sm font-sans font-medium transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('how-it-works')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-stone-200/50 text-stone-800 border border-stone-300 text-sm font-sans font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Reassurance Signals */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-500 font-normal">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>No conventional credit check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-600" />
                <span>100% Private & confidential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#762e50]" />
                <span>Deterministic SheScore algorithm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Universal Platform Readiness Framework Preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Subtle background glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#f3e8ee] via-[#faf5f7] to-[#f5eedc] rounded-3xl blur-xl opacity-70 -z-10" />

              <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-[#ece6de] card-shadow space-y-5 text-left">
                {/* Preview Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#762e50]" />
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                      SheScore Readiness Framework
                    </span>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#faf5f7] text-[#762e50] font-medium border border-[#e9d0dc]">
                    Holistic 5-Pillar Model
                  </span>
                </div>

                {/* Framework Overview */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Financial Independence Architecture
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-normal text-[#1e191b] leading-snug">
                    Beyond Traditional <span className="italic font-serif text-[#762e50]">Credit Scoring.</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Evaluating real-world financial strength through cash flow surplus, savings discipline, and emergency reserves.
                  </p>
                </div>

                {/* 5 Real Implemented Pillars */}
                <div className="space-y-2 pt-0.5">
                  <div className="p-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-800">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1e191b] block">Savings Stability</span>
                        <span className="text-[10px] text-stone-500">Savings rate & monthly inflow retention</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">25%</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-800">
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1e191b] block">Cash Flow Health</span>
                        <span className="text-[10px] text-stone-500">Monthly surplus ratio & debt-service capacity</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">25%</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-800">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1e191b] block">Emergency Preparedness</span>
                        <span className="text-[10px] text-stone-500">3–6 months essential living coverage</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">20%</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-800">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1e191b] block">Financial Literacy</span>
                        <span className="text-[10px] text-stone-500">Budgeting, EMI, loan terms & completed modules</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">15%</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-800">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1e191b] block">Income Stability</span>
                        <span className="text-[10px] text-stone-500">Recurring earning consistency & income resilience</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-full bg-stone-100">15%</span>
                  </div>
                </div>

                {/* SheAI Coaching Callout */}
                <div className="p-3.5 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#762e50]" />
                    <span className="text-[11px] font-semibold text-[#762e50] uppercase tracking-wider">
                      Empathetic AI Guidance
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-normal">
                    SheAI explains loan terminology, APR, collateral, and personalized improvement steps in plain, supportive language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-5 sm:px-8 py-20 bg-white border-y border-[#ece6de] scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12 text-left">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#762e50]">
              Core Framework
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1e191b] font-normal leading-tight">
              From tracking money to building <span className="italic font-serif">financial independence.</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Designed around the real nuances of women's lives — accounting for irregular earnings, caregiving buffers, and alternative creditworthiness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#faf8f5] border border-[#ece6de] card-shadow card-shadow-hover flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-stone-600 font-semibold">01 / Clarity</span>
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#ece6de] flex items-center justify-center text-[#1e191b]">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1e191b]">
                  Understand Your Money
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Gain immediate clarity on monthly income, expenses, and net surplus margin. Track where your money flows without overwhelming spreadsheets.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ece6de] text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                Surplus & Cash-Flow Tracking
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#faf8f5] border border-[#ece6de] card-shadow card-shadow-hover flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-stone-600 font-semibold">02 / Resilience</span>
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#ece6de] flex items-center justify-center text-[#762e50]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1e191b]">
                  Build Your SheScore
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  A transparent 5-pillar financial readiness score that evaluates savings consistency, emergency reserves, and financial literacy instead of rigid bureau formulas.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ece6de] text-[11px] font-semibold text-[#762e50] uppercase tracking-wider">
                5-Pillar Holistic Metric
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#faf8f5] border border-[#ece6de] card-shadow card-shadow-hover flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-stone-600 font-semibold">03 / Empowerment</span>
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#ece6de] flex items-center justify-center text-stone-900">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1e191b]">
                  Learn With SheAI
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Ask educational questions in plain English. SheAI demystifies loan jargon, collateral, APR, and credit building with structured, supportive answers.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ece6de] text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                Guided & Safe AI Coaching
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entrepreneur Feature Section (Dark Charcoal Section) */}
      <section id="entrepreneurs" className="px-5 sm:px-8 py-20 bg-[#1e191b] text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2f252a] text-[#dbc38e] border border-[#44363d] text-xs font-medium">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Non-Traditional Alternative Scoring</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight">
              Alternative Financing Readiness for <span className="italic font-serif text-[#dbc38e]">Women Entrepreneurs.</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Most women entrepreneurs are denied credit simply because they lack conventional property collateral or formal bureau history. SheEarns AI assesses financing readiness through real business activity and cash-flow resilience.
            </p>
          </div>

          {/* 5 Alternative Signals Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2">
              <span className="text-[11px] text-[#dbc38e] font-mono font-semibold">30% WEIGHT</span>
              <h4 className="font-display text-base font-bold text-white">
                Cash-Flow Patterns
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Operating surplus after business costs proves real debt-servicing capacity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2">
              <span className="text-[11px] text-[#dbc38e] font-mono font-semibold">25% WEIGHT</span>
              <h4 className="font-display text-base font-bold text-white">
                Business Activity
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Regularity of monthly transactions demonstrates ongoing customer demand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2">
              <span className="text-[11px] text-[#dbc38e] font-mono font-semibold">20% WEIGHT</span>
              <h4 className="font-display text-base font-bold text-white">
                Revenue Stability
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Commercial turnover relative to living expenses reflects enterprise health.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2">
              <span className="text-[11px] text-[#dbc38e] font-mono font-semibold">15% WEIGHT</span>
              <h4 className="font-display text-base font-bold text-white">
                Emergency Buffer
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Liquid reserves to absorb supply shocks or off-season slowdowns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2">
              <span className="text-[11px] text-[#dbc38e] font-mono font-semibold">10% WEIGHT</span>
              <h4 className="font-display text-base font-bold text-white">
                Financial Literacy
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Understanding loan terms, compounding interest, and cash controls.
              </p>
            </div>
          </div>

          {/* Sample Entrepreneur callout */}
          <div className="p-6 rounded-3xl bg-[#2a2226] border border-[#3e3238] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#dbc38e] uppercase tracking-wider">
                Alternative Scoring in Action
              </span>
              <p className="text-sm text-stone-200">
                Women entrepreneurs with consistent monthly sales and positive cash flow can qualify for financing readiness without pledging gold or land collateral.
              </p>
            </div>
            <button
              onClick={onStart}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-100 text-[#1e191b] font-medium text-xs sm:text-sm shrink-0 transition cursor-pointer"
            >
              Test Entrepreneur Mode →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-5 sm:px-8 py-20 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="space-y-12 text-left">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#762e50]">
              Simple Roadmap
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1e191b] font-normal leading-tight">
              Four steps toward lasting <span className="italic font-serif">financial freedom.</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              No complex paperwork, no bank queues, and no judgment. Start your journey in under two minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#ece6de] card-shadow space-y-4">
              <span className="font-display text-3xl font-bold text-stone-400 block">
                01
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e191b]">
                Tell us about your finances
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Provide your basic income, living expenses, and current savings in a private, gentle 60-second intake.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#ece6de] card-shadow space-y-4">
              <span className="font-display text-3xl font-bold text-stone-400 block">
                02
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e191b]">
                See your SheScore
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Uncover your holistic 5-pillar score with complete transparency on your strongest assets and biggest growth areas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#ece6de] card-shadow space-y-4">
              <span className="font-display text-3xl font-bold text-stone-400 block">
                03
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e191b]">
                Learn and improve with SheAI
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Receive personalized action steps and ask SheAI about loan terminology, interest rates, and credit building.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#ece6de] card-shadow space-y-4">
              <span className="font-display text-3xl font-bold text-stone-400 block">
                04
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e191b]">
                Build toward independence
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Complete micro-learning modules to increase your score and track tangible milestones on your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SheEarns Section */}
      <section id="why-sheearns" className="px-5 sm:px-8 py-16 bg-white border-y border-[#ece6de] scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-10 text-left">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#762e50]">
              Built With Empathy
            </span>
            <h2 className="font-display text-3xl text-[#1e191b] font-normal">
              Why SheEarns?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-2">
              <h4 className="font-display font-bold text-base text-[#1e191b]">
                Tailored for Real Lives
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Unlike traditional credit scores that penalize career breaks and informal income, SheScore values operational surplus and emergency buffers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-2">
              <h4 className="font-display font-bold text-base text-[#1e191b]">
                Safe & Non-Predatory
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                No credit inquiries, no aggressive lending solicitations, and no hidden terms. Your financial journey remains strictly educational and secure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-2">
              <h4 className="font-display font-bold text-base text-[#1e191b]">
                Actionable Mathematical Clarity
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every score increment is tied to transparent mathematical logic and clear steps—not opaque black-box credit bureau algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA (Dark Charcoal Section) */}
      <section className="px-5 sm:px-8 py-20 bg-[#1e191b] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight">
            Start building your <span className="italic font-serif text-[#dbc38e]">financial independence.</span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Gain complete clarity on your cash flow, understand your alternative credit readiness, and take your next best financial step today.
          </p>

          <div className="pt-2">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-[#1e191b] font-medium text-sm sm:text-base transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e191b]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-400 pt-2 font-normal">
            Free educational platform • No credit card required • 100% confidential
          </p>
        </div>
      </section>
    </div>
  );
};
