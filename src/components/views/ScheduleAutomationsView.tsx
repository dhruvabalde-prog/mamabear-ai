import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, Play, CheckCircle2, AlertCircle, 
  RefreshCw, Power, Zap, Shield, Search 
} from 'lucide-react';
import { automationRunner } from '../../services/automationRunner';
import { AutomationSchedule } from '../../types';

interface ScheduleAutomationsViewProps {
  onBack: () => void;
}

export const ScheduleAutomationsView: React.FC<ScheduleAutomationsViewProps> = ({
  onBack
}) => {
  const [schedules, setSchedules] = useState<AutomationSchedule[]>(() => {
    return automationRunner.getAllSchedules();
  });
  const [runningId, setRunningId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastExecutedMessage, setLastExecutedMessage] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const nextState = automationRunner.toggleSchedule(id);
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: nextState } : s));
  };

  const handleRunNow = async (id: string) => {
    setRunningId(id);
    setLastExecutedMessage(null);
    try {
      const res = await automationRunner.runScheduleNow(id);
      if (res.success) {
        setLastExecutedMessage(`✓ Executed successfully: ${res.actionSummary}`);
      } else {
        setLastExecutedMessage(`Error: ${res.error || 'Failed to trigger schedule'}`);
      }
      setSchedules(automationRunner.getAllSchedules());
    } finally {
      setRunningId(null);
    }
  };

  const filtered = schedules.filter(s => 
    !searchQuery.trim() || 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.frequencyText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = schedules.filter(s => s.enabled).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header: Locked 1-word heading with Back arrow */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Scheduled
          </h1>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
          {activeCount} Active
        </span>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Notice of execution */}
        {lastExecutedMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lastExecutedMessage}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheduled routines..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
          />
        </div>

        {/* Schedules list */}
        <div className="space-y-3">
          {filtered.map((sched) => {
            const isRunning = runningId === sched.id;
            return (
              <div
                key={sched.id}
                className={`p-4 bg-white rounded-3xl border transition-all shadow-2xs space-y-3 ${
                  sched.enabled ? 'border-slate-200' : 'border-slate-200/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                        {sched.cronExpression}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {sched.frequencyText}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1 leading-snug">
                      {sched.title}
                    </h3>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(sched.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      sched.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                    title={sched.enabled ? 'Disable' : 'Enable'}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sched.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                    skill: {sched.skillName}
                  </span>

                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => handleRunNow(sched.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Run Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
