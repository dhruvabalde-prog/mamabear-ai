import React, { useState } from 'react';
import { 
  DollarSign, PieChart, TrendingUp, CheckCircle2, 
  ArrowUpRight, Plus, Download, ShieldCheck, Calculator, X 
} from 'lucide-react';
import { ExpenseItem, SetupConfig } from '../../types';

interface FinanceViewProps {
  expenses?: ExpenseItem[];
  setupConfig?: SetupConfig | null;
  onAddExpense?: (expense: ExpenseItem) => void;
  isLoading?: boolean;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  expenses = [],
  setupConfig,
  onAddExpense,
  isLoading = false
}) => {
  const [studentEnrolledCount, setStudentEnrolledCount] = useState<number>(35);
  const [monthlyTuitionFee, setMonthlyTuitionFee] = useState<number>(7500);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ExpenseItem>>({
    category: 'Civil & Kota Stone',
    item: '',
    amount: 50000,
    paidDate: new Date().toISOString().split('T')[0],
    status: 'Paid',
    vendor: '',
    authorizedBy: setupConfig?.leadBusinessName || 'Managing Director'
  });

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalLaunchBudget = setupConfig?.totalBudgetAllocated || 4500000;
  const signingAmount = setupConfig?.signingFeePaid || 1500000;

  // Monthly revenue at current student count
  const projectedMonthlyRevenue = studentEnrolledCount * monthlyTuitionFee;
  const monthlyOperatingExpense = 195000; // Rent + Staff base
  const monthlyNetMargin = projectedMonthlyRevenue - monthlyOperatingExpense;
  const breakEvenStudents = Math.ceil(monthlyOperatingExpense / monthlyTuitionFee);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item || !formData.amount || !onAddExpense) return;
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: formData.category as any,
      item: formData.item,
      amount: Number(formData.amount),
      paidDate: formData.paidDate || new Date().toISOString().split('T')[0],
      status: formData.status as any,
      vendor: formData.vendor || '',
      authorizedBy: formData.authorizedBy || 'Joint'
    };
    onAddExpense(newExp);
    setShowAddModal(false);
    setFormData({
      category: 'Civil & Kota Stone',
      item: '',
      amount: 50000,
      paidDate: new Date().toISOString().split('T')[0],
      status: 'Paid',
      vendor: '',
      authorizedBy: setupConfig?.leadBusinessName || 'Managing Director'
    });
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Finance
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Capex ledger & break-even model
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
          title="Add Expense"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Capex Spent</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">
            ₹{(totalSpent / 100000).toFixed(2)}L
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">
            Budget: ₹{(totalLaunchBudget / 100000).toFixed(2)}L ({Math.round((totalSpent / totalLaunchBudget) * 100)}% spent)
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Signing License Fee</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">₹{signingAmount.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Franchise Allocation Confirmed</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Break-Even Threshold</span>
          <span className="text-2xl font-black text-indigo-600 mt-0.5 block">{breakEvenStudents} Students</span>
          <span className="text-[11px] text-indigo-700 font-semibold">At ₹{monthlyTuitionFee.toLocaleString()}/mo fee</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Net at {studentEnrolledCount} Kids</span>
          <span className={`text-2xl font-black mt-0.5 block ${monthlyNetMargin >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
            ₹{(monthlyNetMargin / 1000).toFixed(0)}k/mo
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">
            {monthlyNetMargin >= 0 ? 'Profitable cash flow' : 'Under break-even'}
          </span>
        </div>
      </div>

      {/* Interactive Fee & Break-even Calculator */}
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
                <span>Monthly Tuition Fee (Benchmarked)</span>
                <span className="font-bold text-amber-300">₹{monthlyTuitionFee.toLocaleString()} / month</span>
              </div>
              <input
                type="range"
                min="4000"
                max="15000"
                step="500"
                value={monthlyTuitionFee}
                onChange={(e) => setMonthlyTuitionFee(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Gross Monthly Tuition Revenue:</span>
              <span className="font-bold text-white">₹{projectedMonthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Monthly Opex (Rent + Staff):</span>
              <span className="font-bold text-rose-400">- ₹{monthlyOperatingExpense.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between font-black text-sm">
              <span className="text-amber-300">Net Operating Margin:</span>
              <span className={monthlyNetMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ₹{monthlyNetMargin.toLocaleString()} / mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Disbursement Transactions ({expenses.length})
          </h3>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No expenses recorded yet. Click "Record Expense" to track your first Capex transaction.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-slate-50">
                <div>
                  <h4 className="font-bold text-slate-900">{exp.item}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100">{exp.category}</span>
                    {exp.vendor && <span>Vendor: {exp.vendor}</span>}
                    <span>Date: {exp.paidDate}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-slate-900 block">
                    ₹{exp.amount.toLocaleString()}
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    exp.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {exp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Record Capex Expense</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expense Item / Description *</label>
                <input
                  type="text"
                  required
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  placeholder="e.g. Non-slip floor polish materials"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Civil & Kota Stone">Civil & Kota Stone</option>
                    <option value="Canadian Play Equipment">Canadian Play Equipment</option>
                    <option value="HVAC & Kota Heat-Shield">HVAC & Kota Heat-Shield</option>
                    <option value="Marketing & Signage">Marketing & Signage</option>
                    <option value="Staff Pre-launch">Staff Pre-launch</option>
                    <option value="Franchise Signing & Royalty">Franchise Signing & Royalty</option>
                    <option value="Contingency">Contingency</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="Vendor name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Advance Done">Advance Done</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
