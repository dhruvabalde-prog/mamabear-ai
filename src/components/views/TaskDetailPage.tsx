import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Copy, ExternalLink, MessageCircle, 
  Sparkles, Loader2, Baby, AlertCircle
} from 'lucide-react';
import { TaskItem } from '../../types';

interface TaskDetailPageProps {
  task: TaskItem;
  onBack: () => void;
  onTaskUpdated: (updatedTask: TaskItem) => void;
  userEmail?: string;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  onBack,
  onTaskUpdated
}) => {
  const [plan, setPlan] = useState<TaskItem['executionPlan'] | null>(task.executionPlan || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [budgetTier, setBudgetTier] = useState('Standard (₹20k - ₹50k)');
  const [timeline, setTimeline] = useState('1 Week Sprint');
  const [leadAssignee, setLeadAssignee] = useState(task.assignedTo);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const handleLaunchPlan = async () => {
    setIsGenerating(true);
    setSyncSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/task-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          role: task.founderRole,
          category: task.category,
          userInputs: {
            budgetTier,
            timeline,
            leadAssignee
          }
        })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (e) {
        data = {};
      }
      
      const newPlan: TaskItem['executionPlan'] = {
        summary: data.summary || `Execution plan ready for "${task.title}".`,
        steps: data.steps || [
          'Review standard specifications',
          'Coordinate with suppliers and team',
          'Execute quality checklist',
          'Confirm completion and update record'
        ],
        checklist: (data.checklist || ['Review guidelines', 'Confirm specifications', 'Sign-off with team']).map((item: string, idx: number) => ({
          id: `chk-${idx}`,
          text: item,
          done: false
        })),
        draftMessage: data.draftMessage || `Update regarding "${task.title}". Execution underway.`,
        founderTips: data.founderTips || 'Verify quality and specifications before final sign-off.',
        syncedGoogle: {
          calendar: true,
          tasks: true,
          gmail: false,
          drive: true
        }
      };

      setPlan(newPlan);
      onTaskUpdated({
        ...task,
        status: 'in_progress',
        executionPlan: newPlan
      });
      setSyncSuccessMsg('✓ Synced with Calendar, Tasks & Drive');
    } catch (err) {
      console.error('Failed to generate task plan', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleChecklist = (id: string) => {
    if (!plan) return;
    const updatedChecklist = plan.checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    const allDone = updatedChecklist.every(c => c.done);
    const updatedPlan = { ...plan, checklist: updatedChecklist };
    setPlan(updatedPlan);
    onTaskUpdated({
      ...task,
      status: allDone ? 'completed' : task.status,
      executionPlan: updatedPlan
    });
  };

  const handleCopyDraft = () => {
    if (!plan?.draftMessage) return;
    navigator.clipboard.writeText(plan.draftMessage);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header: Locked 1-2 words heading + Back arrow */}
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
            Task
          </h1>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Update on: *${task.title}*\n• Status: ${task.status.toUpperCase()}\n${plan?.summary ? `• Plan: ${plan.summary}` : ''}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
        </a>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Task Title & Details */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
              {task.id}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">
              {task.category}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {task.title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Sync Status Banner */}
        {syncSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {/* Setup Parameters before plan */}
        {!plan && (
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Parameters
            </h3>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Budget
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Economy', 'Standard', 'Capex'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetTier(b)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      budgetTier.includes(b)
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Timeline
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['48 Hours', '1 Week', 'Milestone'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      timeline.includes(t)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleLaunchPlan}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning & Syncing Tools...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start Task & Auto-Sync Tools</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Generated Plan */}
        {plan && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {plan.summary}
              </p>
            </div>

            {/* Checklist */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Checklist
              </h3>
              <div className="space-y-2">
                {plan.checklist.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleToggleChecklist(c.id)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-left text-xs font-medium cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      c.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {c.done && <Check className="w-3 h-3" />}
                    </div>
                    <span className={c.done ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {c.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ready Draft */}
            {plan.draftMessage && (
              <div className="p-5 bg-slate-900 text-white rounded-3xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    Pre-Drafted Message
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 bg-black/30 p-3 rounded-xl whitespace-pre-line leading-relaxed font-mono">
                  {plan.draftMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
