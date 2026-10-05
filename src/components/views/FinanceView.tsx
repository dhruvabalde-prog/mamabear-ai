import React, { useState } from 'react';
import { 
  DollarSign, PieChart, TrendingUp, CheckCircle2, 
  ArrowUpRight, Plus, Download, ShieldCheck, Calculator 
} from 'lucide-react';
import { INITIAL_EXPENSES } from '../../data/initialData';
import { ExpenseItem } from '../../types';

export const FinanceView: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [studentEnrolledCount, setStudentEnrolledCount] = useState<number>(35);
  const [monthlyTuitionFee, setMonthlyTuitionFee] = useState<number>(7500);

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalLaunchBudget = 4500000; // ₹45 Lakhs launch capital
  const signingAmount = 1500000; // ₹15 Lakhs signing amount given today

  // Monthly revenue at current student count
  const projectedMonthlyRevenue = studentEnrolledCount * monthlyTuitionFee;
  const monthlyOperatingExpense = 195000; // Rent ₹80k + Staff ₹85k + Royalty ₹30k
  const monthlyNetMargin = projectedMonthlyRevenue - monthlyOperatingExpense;
  const breakEvenStudents = Math.ceil(monthlyOperatingExpense / monthlyTuitionFee);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Ledger & Fee Economics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Signing amount paid today, Capex tracking, and break-even projection for Kota market.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>₹15L Franchise Signing Amount Verified</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Launch Capex</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">
            ₹{(totalSpent / 100000).toFixed(2)}L
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">Budget: ₹45.00L (74% allocated)</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Signing Fee (Paid Today)</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">₹15,00,000</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Maple Bear HQ Receipt #MB-2026-94</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Break-Even Threshold</span>
          <span className="text-2xl font-black text-indigo-600 mt-0.5 block">{breakEvenStudents} Students</span>
          <span className="text-[11px] text-indigo-700 font-semibold">At ₹{monthlyTuitionFee.toLocaleString()}/mo fee</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Net at 35 Kids</span>
          <span className="text-2xl font-black text-amber-600 mt-0.5 block">
            ₹{(monthlyNetMargin / 1000).toFixed(0)}k/mo
          </span>
          <span className="text-[11px] text-amber-700 font-semibold">Profitable from Day 1</span>
        </div>
      </div>

      {/* Interactive Kota Fee & Break-even Calculator */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-lg space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Interactive Break-Even & Cash Flow Simulator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Target Enrolled Students for Launch</span>
                <span className="font-bold text-amber-300">{studentEnrolledCount} Students</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={studentEnrolledCount}
                onChange={(e) => setStudentEnrolledCount(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Monthly Tuition Fee (Kota Benchmarked)</span>
                <span className="font-bold text-amber-300">₹{monthlyTuitionFee.toLocaleString()} / month</span>
              </div>
              <input
                type="range"
                min="5000"
                max="12000"
                step="500"
                value={monthlyTuitionFee}
                onChange={(e) => setMonthlyTuitionFee(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Gross Monthly Tuition Revenue:</span>
              <span className="font-bold text-white">₹{projectedMonthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Subhash Nagar Property Rent:</span>
              <span className="font-bold text-white">-₹80,000</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Staff Salaries (6 Educators + Didis):</span>
              <span className="font-bold text-white">-₹85,000</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Maple Bear Franchise Royalty (8%):</span>
              <span className="font-bold text-white">-₹{(projectedMonthlyRevenue * 0.08).toFixed(0)}</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between font-extrabold text-sm text-amber-300">
              <span>Projected Net Monthly Margin:</span>
              <span>₹{(projectedMonthlyRevenue - 165000 - (projectedMonthlyRevenue * 0.08)).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-900">Capex Expenditure Ledger</h2>
          <span className="text-xs text-slate-500 font-medium">Dual authorized by Priya & Ananya</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
          {expenses.map((exp) => (
            <div key={exp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{exp.item}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    exp.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Vendor: {exp.vendor} • Authorized by: <strong>{exp.authorizedBy}</strong> • {exp.paidDate}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{exp.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">{exp.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
