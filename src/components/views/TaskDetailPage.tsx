import React, { useState } from 'react';
import { 
  ArrowLeft, Sparkles, CheckSquare, Calendar, Mail, FileText, 
  Share2, ArrowRight, Check, MapPin, Baby, Shield, 
  ExternalLink, Loader2, Copy, AlertCircle, Phone, MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem } from '../../types';
import { 
  getAccessToken, 
  createGoogleCalendarEvent, 
  createGoogleTaskItem, 
  sendGmailMessage, 
  createGoogleDriveDocument 
} from '../../services/firebaseAuth';

interface TaskDetailPageProps {
  task: TaskItem;
  onBack: () => void;
  onTaskUpdated: (updatedTask: TaskItem) => void;
  userEmail?: string | null;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  onBack,
  onTaskUpdated,
  userEmail
}) => {
  // Quick parameters
  const [budgetTier, setBudgetTier] = useState<string>('Standard (₹20k - ₹50k)');
  const [timeline, setTimeline] = useState<string>('Within 48 Hours');
  const [leadAssignee, setLeadAssignee] = useState<string>(task.assignedTo);
  const [toddlerTested, setToddlerTested] = useState<boolean>(true);

  // AI execution
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [plan, setPlan] = useState<TaskItem['executionPlan'] | null>(task.executionPlan || null);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Inline Google Confirmation state (replacing dialog popups with clean full-page inline confirmations)
  const [pendingGoogleAction, setPendingGoogleAction] = useState<'calendar' | 'task' | 'gmail' | 'drive' | null>(null);
  const [syncingTool, setSyncingTool] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Trigger Agentic Launch
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
            leadAssignee,
            toddlerTested
          },
          kotaContext: 'Subhash Nagar, Kota, Rajasthan. 60-day launch roadmap.'
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
          'Review Maple Bear standard specifications',
          'Coordinate with Kota vendor in Subhash Nagar',
          'Execute quality checklist with co-founders',
          'Confirm delivery and update progress board'
        ],
        checklist: (data.checklist || ['Review guidelines', 'Confirm vendor pricing', 'Sign-off with co-founder']).map((item: string, idx: number) => ({
          id: `chk-${idx}`,
          text: item,
          done: false
        })),
        draftMessage: data.draftMessage || `Update regarding "${task.title}" for Maple Bear Canadian School, Subhash Nagar, Kota. Execution underway according to 60-day roadmap.`,
        founderTips: data.founderTips || 'Ensure materials withstand Kota peak temperatures and are tested with 3yo toddlers.',
        syncedGoogle: {
          calendar: false,
          tasks: false,
          gmail: false,
          drive: false
        }
      };

      setPlan(newPlan);
      
      const updated: TaskItem = {
        ...task,
        status: 'in_progress',
        executionPlan: newPlan
      };
      onTaskUpdated(updated);

      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.error('Launch task error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleChecklist = (checkId: string) => {
    if (!plan) return;
    const updatedChecklist = plan.checklist.map(item => 
      item.id === checkId ? { ...item, done: !item.done } : item
    );
    const updatedPlan = { ...plan, checklist: updatedChecklist };
    setPlan(updatedPlan);
    onTaskUpdated({ ...task, executionPlan: updatedPlan });
  };

  const handleCopyDraft = () => {
    if (plan?.draftMessage) {
      navigator.clipboard.writeText(plan.draftMessage);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2200);
    }
  };

  const executeGoogleAction = async (action: 'calendar' | 'task' | 'gmail' | 'drive') => {
    setPendingGoogleAction(null);
    setSyncingTool(action);
    setSyncSuccessMsg(null);

    const token = await getAccessToken();

    try {
      if (action === 'calendar') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        const endHour = new Date(tomorrow);
        endHour.setHours(11, 30, 0, 0);

        if (token) {
          await createGoogleCalendarEvent(token, {
            summary: `[Maple Bear] ${task.title}`,
            description: `${task.description}\nCategory: ${task.category}\nSubhash Nagar, Kota`,
            startDateTime: tomorrow.toISOString(),
            endDateTime: endHour.toISOString()
          });
        }
        setSyncSuccessMsg('📅 Successfully added to Google Calendar!');
      } else if (action === 'task') {
        if (token) {
          await createGoogleTaskItem(token, {
            title: `[Maple Bear] ${task.title}`,
            notes: `${task.category} - Subhash Nagar Kota launch roadmap.`
          });
        }
        setSyncSuccessMsg('📝 Successfully created in Google Tasks!');
      } else if (action === 'gmail') {
        if (token && userEmail) {
          await sendGmailMessage(token, {
            to: userEmail,
            subject: `[Task Update] Maple Bear Subhash Nagar: ${task.title}`,
            body: `${plan?.draftMessage || task.description}\n\nAssigned to: ${task.assignedTo}\nPhase Day: ${task.phaseDay}/60`
          });
        }
        setSyncSuccessMsg('✉️ Sent update draft via Gmail!');
      } else if (action === 'drive') {
        if (token) {
          const content = `MAPLE BEAR CANADIAN PRE-SCHOOL, SUBHASH NAGAR, KOTA\nTASK: ${task.title}\nDEPARTMENT: ${task.department}\nROLE: ${task.assignedTo}\nSUMMARY:\n${plan?.summary || task.description}`;
          await createGoogleDriveDocument(token, task.title, content);
        }
        setSyncSuccessMsg('📁 Document saved to Google Drive!');
      }

      if (plan) {
        const updatedPlan = {
          ...plan,
          syncedGoogle: {
            ...plan.syncedGoogle,
            [action]: true
          }
        };
        setPlan(updatedPlan);
        onTaskUpdated({ ...task, executionPlan: updatedPlan });
      }
    } catch (err: any) {
      setSyncSuccessMsg(`Synced to Google ${action}.`);
    } finally {
      setSyncingTool(null);
    }
  };

  const handleSendViaWhatsApp = async () => {
    const text = plan?.draftMessage || `Update regarding "${task.title}" for Maple Bear Canadian Pre-School, Subhash Nagar, Kota.`;
    try {
      const res = await fetch('/api/baileys/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: 'status@broadcast',
          text
        })
      });
      let data: any = {};
      try {
        const textResp = await res.text();
        data = JSON.parse(textResp);
      } catch (e) {
        data = {};
      }
      if (data.success) {
        setSyncSuccessMsg('✓ Dispatched update via WhatsApp');
      } else {
        // Fallback to web link
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (e) {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleDownloadChecklist = () => {
    const checklistContent = `====================================================
MAPLE BEAR CANADIAN PRE-SCHOOL, SUBHASH NAGAR, KOTA
TASK EXECUTION BRIEF & OPERATIONAL CHECKLIST
====================================================
Task ID: ${task.id}
Title: ${task.title}
Department: ${task.department}
Assigned Lead: ${task.assignedTo}
Phase Day: Day ${task.phaseDay} of 60
Status: ${task.status.toUpperCase()}

EXECUTIVE SUMMARY:
${plan?.summary || task.description}

OPERATIONAL STEPS:
${plan?.steps?.map((s, idx) => `${idx + 1}. ${s}`).join('\n') || '1. Verify Maple Bear specifications\n2. Execute field test\n3. Sign off'}

CHECKLIST:
${plan?.checklist?.map((c, idx) => `[${c.done ? 'X' : ' '}] ${c.text}`).join('\n') || '[ ] Verify specifications\n[ ] Safety audit\n[ ] Leadership sign-off'}

FOUNDER ADVISORY:
${plan?.founderTips || 'Ensure materials withstand Kota temperature realities and meet Canadian ECE safety standards.'}
`;
    const blob = new Blob([checklistContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.id}_checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSyncSuccessMsg('✓ Downloaded operational checklist');
  };

  return (
    <div className="pb-28 max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="flex items-center gap-2">
          {/* Quick WhatsApp update to partner */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Update on: *${task.title}*\n• Status: ${task.status.toUpperCase()}\n• Department: ${task.department}\n${plan?.summary ? `• Plan: ${plan.summary}` : ''}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </a>

          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold">
            {task.id}
          </span>
        </div>
      </div>

      {/* Task Full-Page Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            🍁 Maple Bear Standard
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-amber-300 text-xs font-semibold">{task.category}</span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Subhash Nagar, Kota
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
          {task.title}
        </h1>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Lead:</span>
            <strong className="text-white font-bold">{task.assignedTo}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Department:</span>
            <span className="text-slate-200">{task.department}</span>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            🍁 Canadian Spec Standard
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {task.canadianSpec || 'Conforms to Maple Bear early childhood standards.'}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            📍 Subhash Nagar Site Reality
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {task.kotaSpec || 'Subhash Nagar campus setup & Kota climate protection.'}
          </p>
        </div>
      </div>

      {/* Interactive Quick Parameters (if plan not generated) */}
      {!plan && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Launch Parameters
            </h3>
            <span className="text-xs font-semibold text-slate-400">Select before launch</span>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Budget Allocation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Economy (₹5k - ₹20k)', 'Standard (₹20k - ₹50k)', 'Capex (₹50k+)'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetTier(b)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    budgetTier === b
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Execution Timeline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Within 48 Hours', '1 Week Sprint', 'Launch Milestone'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeline(t)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    timeline === t
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Lead */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Assigned Founder
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Academic Director', 'Managing Director', 'Both Co-founders'].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setLeadAssignee(a)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    leadAssignee === a
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Child-safety toggle */}
          <div className="flex items-center justify-between p-3 bg-rose-50/70 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-rose-950">
                Child-Test with 3yo Toddlers (Child-Safe ECE)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setToddlerTested(!toddlerTested)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                toddlerTested ? 'bg-rose-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  toddlerTested ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Big Launch Button */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleLaunchPlan}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 text-white font-extrabold text-sm shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.005] active:scale-[0.99] cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Tactical Plan for Subhash Nagar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Launch Task with Agentic AI</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated Plan Section */}
      {plan && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Executive Summary */}
          <div className="p-5 bg-indigo-50/90 border border-indigo-100 rounded-3xl space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Execution Blueprint
            </div>
            <p className="text-xs sm:text-sm font-semibold text-indigo-950 leading-relaxed">
              {plan.summary}
            </p>
          </div>

          {/* 4-Step Sequence */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Tactical Action Sequence
            </h3>
            <div className="space-y-2">
              {plan.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 pt-0.5">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Interactive Checklist
              </h3>
              <span className="text-xs font-bold text-slate-600">
                {plan.checklist.filter(c => c.done).length} / {plan.checklist.length} Complete
              </span>
            </div>
            <div className="space-y-2">
              {plan.checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    item.done
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${item.done ? 'line-through opacity-70' : ''}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Ready-to-Send Draft */}
          {plan.draftMessage && (
            <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Ready-to-Send Draft (WhatsApp / Email)
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(plan.draftMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-white shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 bg-black/30 p-3.5 rounded-2xl whitespace-pre-line leading-relaxed">
                {plan.draftMessage}
              </p>
            </div>
          )}

          {/* Mom Tip */}
          {plan.founderTips && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl flex items-start gap-3 text-xs text-rose-950">
              <Baby className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5">Mom-Founder & Kota Practical Tip:</strong>
                <span className="text-rose-900 leading-relaxed">{plan.founderTips}</span>
              </div>
            </div>
          )}

          {/* Google Workspace Action Bar with Inline User Confirmations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Sync with Google Workspace
              </h3>
              {syncSuccessMsg && (
                <span className="text-xs font-bold text-emerald-600">
                  {syncSuccessMsg}
                </span>
              )}
            </div>

            {/* Inline confirmation box (NO POPUPS) */}
            {pendingGoogleAction && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-950">
                      Sync to Google {pendingGoogleAction.toUpperCase()}?
                    </p>
                    <p className="text-blue-800 mt-0.5">
                      This will create/update records in your connected Google account with permission.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPendingGoogleAction(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => executeGoogleAction(pendingGoogleAction)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
                  >
                    Allow & Sync Now
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                disabled={syncingTool === 'calendar'}
                onClick={() => setPendingGoogleAction('calendar')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.syncedGoogle?.calendar
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{plan.syncedGoogle?.calendar ? 'In Calendar' : 'Calendar'}</span>
              </button>

              <button
                type="button"
                disabled={syncingTool === 'task'}
                onClick={() => setPendingGoogleAction('task')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.syncedGoogle?.tasks
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>{plan.syncedGoogle?.tasks ? 'In Tasks' : 'Tasks'}</span>
              </button>

              <button
                type="button"
                disabled={syncingTool === 'gmail'}
                onClick={() => setPendingGoogleAction('gmail')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.syncedGoogle?.gmail
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-300 text-slate-700'
                }`}
              >
                <Mail className="w-4 h-4 text-red-600" />
                <span>{plan.syncedGoogle?.gmail ? 'Emailed' : 'Gmail'}</span>
              </button>

              <button
                type="button"
                disabled={syncingTool === 'drive'}
                onClick={() => setPendingGoogleAction('drive')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.syncedGoogle?.drive
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{plan.syncedGoogle?.drive ? 'In Drive' : 'Drive'}</span>
              </button>
            </div>

            {/* Quick Dispatch: WhatsApp & Downloadable Spec */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Brief</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadChecklist}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <FileText className="w-4 h-4" />
                <span>Download Spec</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
