import React, { useState } from 'react';
import { FinancialHistoryRecord, FinancialHistoryAnalytics } from '../../types';
import { formatINR } from '../../utils/formatters';
import { analyzeFinancialHistory } from '../../utils/financialHistory';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  Activity,
  Lightbulb,
  Plus,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface FinancialHistorySectionProps {
  records: FinancialHistoryRecord[];
  isBusiness?: boolean;
  onAddRecord?: (record: Omit<FinancialHistoryRecord, 'id'>) => void;
  onResetDefault?: () => void;
}

export const FinancialHistorySection: React.FC<FinancialHistorySectionProps> = ({
  records,
  isBusiness = false,
  onAddRecord,
  onResetDefault
}) => {
  const analytics: FinancialHistoryAnalytics = analyzeFinancialHistory(records, isBusiness);

  // Add Record Modal State
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [formMonth, setFormMonth] = useState('');
  const [formIncome, setFormIncome] = useState('');
  const [formExpenses, setFormExpenses] = useState('');
  const [formSavings, setFormSavings] = useState('');
  const [formRevenue, setFormRevenue] = useState('');
  const [formActivity, setFormActivity] = useState<'Active' | 'Reduced' | 'Inactive'>('Active');
  const [formError, setFormError] = useState('');

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedMonth = formMonth.trim();
    if (!trimmedMonth) {
      setFormError('Please enter a valid month name.');
      return;
    }

    const exists = records.some(
      r => r.month.toLowerCase() === trimmedMonth.toLowerCase()
    );
    if (exists) {
      setFormError(`A record for "${trimmedMonth}" already exists.`);
      return;
    }

    const income = Number(formIncome);
    const expenses = Number(formExpenses);
    const savings = Number(formSavings);

    if (isNaN(income) || income < 0) {
      setFormError('Monthly Income cannot be negative.');
      return;
    }
    if (isNaN(expenses) || expenses < 0) {
      setFormError('Monthly Expenses cannot be negative.');
      return;
    }
    if (isNaN(savings) || savings < 0) {
      setFormError('Monthly Savings cannot be negative.');
      return;
    }

    let revenue: number | undefined;
    if (isBusiness) {
      revenue = formRevenue ? Number(formRevenue) : 0;
      if (isNaN(revenue) || revenue < 0) {
        setFormError('Business Revenue cannot be negative.');
        return;
      }
    }

    if (onAddRecord) {
      onAddRecord({
        month: trimmedMonth,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        monthlySavings: savings,
        businessRevenue: revenue,
        businessActivity: isBusiness ? formActivity : undefined
      });
    }

    // Reset Form
    setFormMonth('');
    setFormIncome('');
    setFormExpenses('');
    setFormSavings('');
    setFormRevenue('');
    setFormActivity('Active');
    setIsAddingRecord(false);
  };

  const getTrendIcon = (trend: 'Improving' | 'Stable' | 'Declining' | 'Increasing' | 'Decreasing') => {
    if (trend === 'Improving' || trend === 'Increasing') {
      return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
    }
    if (trend === 'Declining' || trend === 'Decreasing') {
      return <TrendingDown className="w-3.5 h-3.5 text-rose-600" />;
    }
    return <Minus className="w-3.5 h-3.5 text-stone-500" />;
  };

  const getTrendBadge = (trend: string) => {
    const isPositive = trend === 'Improving' || trend === 'Very Stable' || trend === 'Mostly Stable';
    const isNeutral = trend === 'Stable' || trend === 'Decreasing' || trend === 'Somewhat Variable';
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
          isPositive
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isNeutral
            ? 'bg-stone-100 text-stone-700 border-stone-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}
      >
        {trend}
      </span>
    );
  };

  // Prepare chart data
  const chartData = records.map(r => ({
    name: r.month,
    Income: r.monthlyIncome,
    Expenses: r.monthlyExpenses,
    Savings: r.monthlySavings,
    ...(isBusiness && r.businessRevenue !== undefined ? { 'Business Revenue': r.businessRevenue } : {})
  }));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6 text-left">
      {/* Header with Title and Add Record Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-[#1e191b] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-800" />
            <span>Financial History</span>
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Understand how your financial patterns are changing over time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {onResetDefault && (
            <button
              onClick={onResetDefault}
              type="button"
              className="px-3 py-1.5 rounded-full bg-[#faf8f5] hover:bg-stone-100 text-stone-600 border border-[#ece6de] text-xs font-medium transition cursor-pointer"
              title="Reset history to demo baseline"
            >
              Reset Sample
            </button>
          )}

          {onAddRecord && (
            <button
              onClick={() => setIsAddingRecord(!isAddingRecord)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs font-medium transition shadow-2xs cursor-pointer"
            >
              {isAddingRecord ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAddingRecord ? 'Cancel' : 'Add Month'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Record Form (Expandable) */}
      {isAddingRecord && (
        <form
          onSubmit={handleSaveRecord}
          className="p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-[#1e191b]">
              Add Monthly Financial Record
            </h4>
            <span className="text-[11px] text-stone-500">
              * Does not alter frozen SheScore formula
            </span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Month Name
              </label>
              <input
                type="text"
                placeholder="e.g. August"
                value={formMonth}
                onChange={e => setFormMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Income (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 45000"
                value={formIncome}
                onChange={e => setFormIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Expenses (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 32000"
                value={formExpenses}
                onChange={e => setFormExpenses(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Savings (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 6000"
                value={formSavings}
                onChange={e => setFormSavings(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                required
              />
            </div>

            {isBusiness && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Business Revenue (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45000"
                    value={formRevenue}
                    onChange={e => setFormRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Business Activity
                  </label>
                  <select
                    value={formActivity}
                    onChange={e => setFormActivity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#ece6de] text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingRecord(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#1e191b] hover:bg-black text-white text-xs font-medium transition shadow-xs cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      )}

      {/* History Summary Metric Cards */}
      <div className={`grid grid-cols-2 ${isBusiness ? 'sm:grid-cols-3 lg:grid-cols-6' : 'sm:grid-cols-4'} gap-3`}>
        {/* Positive Cash Flow */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Cash Flow
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-base sm:text-lg text-[#1e191b]">
            {analytics.positiveCashFlowMonths}/{analytics.totalMonths} <span className="text-xs font-normal text-stone-500">Months</span>
          </div>
          <p className="text-[11px] text-stone-500">
            {analytics.cashFlowConsistencyPercent}% consistency
          </p>
        </div>

        {/* Savings Consistency */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Savings Rate
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#762e50]" />
          </div>
          <div className="font-display font-bold text-base sm:text-lg text-[#1e191b]">
            {analytics.savingsConsistencyPercent}%
          </div>
          <p className="text-[11px] text-stone-500">
            Avg {formatINR(analytics.averageMonthlySavings)}/mo
          </p>
        </div>

        {/* Income Trend */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Income Trend
            </span>
            {getTrendIcon(analytics.incomeTrend)}
          </div>
          <div className="pt-0.5">
            {getTrendBadge(analytics.incomeTrend)}
          </div>
          <p className="text-[11px] text-stone-500">
            Last {analytics.totalMonths} months
          </p>
        </div>

        {/* Savings Trend */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Savings Trend
            </span>
            {getTrendIcon(analytics.savingsTrend)}
          </div>
          <div className="pt-0.5">
            {getTrendBadge(analytics.savingsTrend)}
          </div>
          <p className="text-[11px] text-stone-500">
            Pattern trajectory
          </p>
        </div>

        {/* Business User Metrics */}
        {isBusiness && (
          <>
            <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#762e50] uppercase tracking-wider">
                  Revenue
                </span>
                <Briefcase className="w-3.5 h-3.5 text-[#762e50]" />
              </div>
              <div className="pt-0.5">
                {getTrendBadge(analytics.revenuePattern || 'Mostly Stable')}
              </div>
              <p className="text-[11px] text-stone-500">
                Pattern stability
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#762e50] uppercase tracking-wider">
                  Activity
                </span>
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="font-display font-bold text-base sm:text-lg text-[#1e191b]">
                {analytics.activeMonthsCount}/{analytics.totalMonths} <span className="text-xs font-normal text-stone-500">Active</span>
              </div>
              <p className="text-[11px] text-stone-500">
                {analytics.businessActivityConsistencyPercent}% active rate
              </p>
            </div>
          </>
        )}
      </div>

      {/* "What Your History Shows" Insights Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-3">
        <div className="flex items-center gap-2 text-stone-800">
          <Lightbulb className="w-4 h-4 text-[#762e50]" />
          <h4 className="font-display font-bold text-sm sm:text-base text-[#1e191b]">
            What Your History Shows
          </h4>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
          {analytics.topInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-[#762e50] font-bold text-sm shrink-0 mt-0.5">✓</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trend Chart (Recharts) */}
      <div className="space-y-2 pt-2">
        <h4 className="font-display font-bold text-sm text-[#1e191b]">
          Monthly Cash Flow & Trends
        </h4>
        <div className="h-60 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece6de" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} />
              <YAxis
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={v => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => formatINR(value)}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: '1px solid #ece6de',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Income" fill="#1e191b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#a8a29e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Savings" fill="#762e50" radius={[4, 4, 0, 0]} />
              {isBusiness && (
                <Bar dataKey="Business Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly History Records Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ece6de] text-stone-500 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 font-semibold">Month</th>
              <th className="py-2.5 px-3 font-semibold">Income</th>
              <th className="py-2.5 px-3 font-semibold">Expenses</th>
              <th className="py-2.5 px-3 font-semibold">Savings</th>
              <th className="py-2.5 px-3 font-semibold">Net Surplus</th>
              {isBusiness && (
                <>
                  <th className="py-2.5 px-3 font-semibold">Business Revenue</th>
                  <th className="py-2.5 px-3 font-semibold">Activity</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece6de]">
            {records.map((rec) => {
              const surplus = rec.monthlyIncome - rec.monthlyExpenses;
              return (
                <tr key={rec.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-[#1e191b]">{rec.month}</td>
                  <td className="py-2.5 px-3 text-stone-700">{formatINR(rec.monthlyIncome)}</td>
                  <td className="py-2.5 px-3 text-stone-700">{formatINR(rec.monthlyExpenses)}</td>
                  <td className="py-2.5 px-3 text-[#762e50] font-medium">{formatINR(rec.monthlySavings)}</td>
                  <td className="py-2.5 px-3 font-medium">
                    <span className={surplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {surplus >= 0 ? `+${formatINR(surplus)}` : formatINR(surplus)}
                    </span>
                  </td>
                  {isBusiness && (
                    <>
                      <td className="py-2.5 px-3 font-medium text-emerald-800">
                        {rec.businessRevenue !== undefined ? formatINR(rec.businessRevenue) : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {rec.businessActivity || 'Active'}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
