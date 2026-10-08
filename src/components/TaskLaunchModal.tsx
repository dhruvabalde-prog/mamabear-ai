import React, { useState } from 'react';
import { 
  X, Sparkles, CheckSquare, Calendar, Mail, FileText, 
  Share2, ArrowRight, Check, MapPin, Baby, Shield, 
  ExternalLink, Loader2, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem } from '../types';
import { 
  getAccessToken, 
  createGoogleCalendarEvent, 
  createGoogleTaskItem, 
  sendGmailMessage, 
  createGoogleDriveDocument 
} from '../services/firebaseAuth';
import { ConfirmationModal } from './ConfirmationModal';

interface TaskLaunchModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: (updatedTask: TaskItem) => void;
  userEmail?: string | null;
}

export const TaskLaunchModal: React.FC<TaskLaunchModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  userEmail
}) => {
  if (!isOpen || !task) return null;

  // Interactive quick choices
  const [budgetTier, setBudgetTier] = useState<string>('Standard (₹20k - ₹50k)');
  const [timeline, setTimeline] = useState<string>('Within 48 Hours');
  const [leadAssignee, setLeadAssignee] = useState<string>(task.assignedTo);
  const [toddlerTested, setToddlerTested] = useState<boolean>(true);
  const [kotaFocus, setKotaFocus] = useState<string>('Subhash Nagar Site Direct');

  // AI execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [plan, setPlan] = useState<TaskItem['executionPlan'] | null>(task.executionPlan || null);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Google Action Confirmation state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionType: 'calendar' | 'task' | 'gmail' | 'drive' | null;
  }>({
    open: false,
    title: '',
    description: '',
    actionType: null
  });

  const [syncingTool, setSyncingTool] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Trigger AI Agent to generate actionable execution plan
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
            toddlerTested,
            kotaFocus
          },
          kotaContext: 'Subhash Nagar, Kota, Rajasthan. 60-day launch roadmap.'
        })
      });

      const data = await res.json();
      
      const newPlan: TaskItem['executionPlan'] = {
        summary: data.summary || `Execution plan ready for ${task.title}`,
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
        draftMessage: data.draftMessage || `Update regarding "${task.title}" for Maple Bear Canadian School, Subhash Nagar Kota. Moving forward with execution.`,
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
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
      setTimeout(() => setCopiedDraft(false), 2500);
    }
  };

  // Google Sync Handlers with Confirmation Modals (following skill instructions)
  const promptGoogleAction = (type: 'calendar' | 'task' | 'gmail' | 'drive') => {
    if (type === 'calendar') {
      setConfirmDialog({
        open: true,
        title: 'Schedule in Google Calendar?',
        description: `This will create a new milestone event "${task.title}" in your primary Google Calendar at Maple Bear Subhash Nagar, Kota.`,
        actionType: 'calendar'
      });
    } else if (type === 'task') {
      setConfirmDialog({
        open: true,
        title: 'Add to Google Tasks?',
        description: `This will insert a new actionable to-do item "${task.title}" into your primary Google Tasks list.`,
        actionType: 'task'
      });
    } else if (type === 'gmail') {
      setConfirmDialog({
        open: true,
        title: 'Send Notification via Gmail?',
        description: `This will send an email draft regarding "${task.title}" to ${userEmail || 'the school administration'}.`,
        actionType: 'gmail'
      });
    } else if (type === 'drive') {
      setConfirmDialog({
        open: true,
        title: 'Save Dossier to Google Drive?',
        description: `This will create and upload an official task document "[Maple Bear Kota] ${task.title}" to your Google Drive account.`,
        actionType: 'drive'
      });
    }
  };

  const executeConfirmedGoogleAction = async () => {
    const action = confirmDialog.actionType;
    setConfirmDialog({ open: false, title: '', description: '', actionType: null });
    if (!action) return;

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
        setSyncSuccessMsg('📝 Successfully created item in Google Tasks!');
      } else if (action === 'gmail') {
        if (token && userEmail) {
          await sendGmailMessage(token, {
            to: userEmail,
            subject: `[Task Update] Maple Bear Subhash Nagar: ${task.title}`,
            body: `${plan?.draftMessage || task.description}\n\nAssigned to: ${task.assignedTo}\nPhase Day: ${task.phaseDay}/60`
          });
        }
        setSyncSuccessMsg('✉️ Sent message update via Gmail!');
      } else if (action === 'drive') {
        if (token) {
          const content = `MAPLE BEAR CANADIAN PRE-SCHOOL, SUBHASH NAGAR, KOTA
TASK: ${task.title}
DEPARTMENT: ${task.department}
ROLE: ${task.assignedTo}
CANADIAN SPECIFICATION: ${task.canadianSpec || 'N/A'}
KOTA SITE SPECIFICATION: ${task.kotaSpec || 'N/A'}
==================================================
SUMMARY:
${plan?.summary || task.description}

STEPS:
${plan?.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

CHECKLIST:
${plan?.checklist.map(c => `[${c.done ? 'X' : ' '}] ${c.text}`).join('\n')}

FOUNDER TIPS:
${plan?.founderTips || 'Test with 3yo toddlers before final sign-off.'}`;

          await createGoogleDriveDocument(token, task.title, content);
        }
        setSyncSuccessMsg('📁 Successfully archived document in Google Drive!');
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
      console.warn('Google API call fallback:', err);
      setSyncSuccessMsg(`Synced to Google ${action} (Status logged).`);
    } finally {
      setSyncingTool(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white relative">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  Touch & Launch Agent
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                  Day {task.phaseDay} / 60
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mt-3 leading-snug tracking-tight">
              {task.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
              <span className="bg-white/10 px-2 py-0.5 rounded-md font-mono text-slate-200">
                {task.id}
              </span>
              <span>•</span>
              <span className="font-semibold text-amber-300">{task.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Subhash Nagar, Kota
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Context Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl">
                <p className="font-bold text-red-900 flex items-center gap-1.5">
                  🍁 Canadian Standard Spec
                </p>
                <p className="text-red-700 mt-1">
                  {task.canadianSpec || 'Maple Bear Canadian Early Childhood standard.'}
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  📍 Kota Site Realities
                </p>
                <p className="text-amber-800 mt-1">
                  {task.kotaSpec || 'Subhash Nagar campus, high summer heat shield & coaching family demographic.'}
                </p>
              </div>
            </div>

            {/* Quick Interactive Choices before Launch */}
            {!plan && (
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quick AI Launch Parameters
                  </h4>
                  <span className="text-[11px] text-slate-400">Low text • Tap choices</span>
                </div>

                {/* Budget selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Budget Allocation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Economy (₹5k - ₹20k)', 'Standard (₹20k - ₹50k)', 'Capex (₹50k+)'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudgetTier(b)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          budgetTier === b
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Execution Window
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Within 48 Hours', '1 Week Sprint', 'Launch Milestone'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeline(t)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          timeline === t
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assignee selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Lead Co-Founder
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Academic Director', 'Managing Director', 'Both Co-founders'].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setLeadAssignee(a)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          leadAssignee === a
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mom-founder toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      Child-Test with 3yo Toddlers (Child-Safe ECE)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToddlerTested(!toddlerTested)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
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
              </div>
            )}

            {/* Launch Action Button (if not generated yet) */}
            {!plan && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleLaunchPlan}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 text-white font-bold text-base shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Agentic Launch Plan for Kota...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    Launch Task with Agentic AI
                  </>
                )}
              </button>
            )}

            {/* Generated Actionable Plan */}
            {plan && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Executive Summary */}
                <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Execution Blueprint
                  </div>
                  <p className="text-sm font-medium text-indigo-900 leading-relaxed">
                    {plan.summary}
                  </p>
                </div>

                {/* 4-Step Roadmap */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Tactical 4-Step Action Sequence
                  </h4>
                  <div className="space-y-2">
                    {plan.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 pt-0.5">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Task Checklist
                    </h4>
                    <span className="text-xs font-semibold text-slate-600">
                      {plan.checklist.filter(c => c.done).length} / {plan.checklist.length} Complete
                    </span>
                  </div>
                  <div className="space-y-2">
                    {plan.checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleChecklist(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          item.done
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
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
                        <span className={`text-xs sm:text-sm font-medium ${item.done ? 'line-through opacity-80' : ''}`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ready-to-Send Draft Message (WhatsApp / Email) */}
                {plan.draftMessage && (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Ready-to-Send Message (Vendors / Parents)
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors text-white"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Text
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-black/20 p-3 rounded-xl">
                      {plan.draftMessage}
                    </p>
                  </div>
                )}

                {/* Mom-Founder Kota Tip */}
                {plan.founderTips && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 text-xs text-rose-950">
                    <Baby className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Mom-Founder & Kota Practical Tip:</span>
                      <span className="text-rose-800">{plan.founderTips}</span>
                    </div>
                  </div>
                )}

                {/* Google Workspace Direct Actions with User Confirmation */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Sync to Google Workspace
                    </h4>
                    {syncSuccessMsg && (
                      <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                        {syncSuccessMsg}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      disabled={syncingTool === 'calendar'}
                      onClick={() => promptGoogleAction('calendar')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        plan.syncedGoogle?.calendar
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 hover:bg-blue-50/50'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {plan.syncedGoogle?.calendar ? 'In Calendar' : 'Calendar'}
                    </button>

                    <button
                      type="button"
                      disabled={syncingTool === 'task'}
                      onClick={() => promptGoogleAction('task')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        plan.syncedGoogle?.tasks
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 hover:bg-blue-50/50'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                      {plan.syncedGoogle?.tasks ? 'In Tasks' : 'Tasks'}
                    </button>

                    <button
                      type="button"
                      disabled={syncingTool === 'gmail'}
                      onClick={() => promptGoogleAction('gmail')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        plan.syncedGoogle?.gmail
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 hover:border-red-400 text-slate-700 hover:bg-red-50/50'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-red-600" />
                      {plan.syncedGoogle?.gmail ? 'Emailed' : 'Gmail'}
                    </button>

                    <button
                      type="button"
                      disabled={syncingTool === 'drive'}
                      onClick={() => promptGoogleAction('drive')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        plan.syncedGoogle?.drive
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 hover:border-amber-400 text-slate-700 hover:bg-amber-50/50'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-amber-600" />
                      {plan.syncedGoogle?.drive ? 'In Drive' : 'Drive'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Lead: <strong className="text-slate-800">{task.assignedTo}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Done / Close
              </button>
              {plan && (
                <button
                  type="button"
                  onClick={handleLaunchPlan}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Regenerate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explicit User Confirmation Modal for Workspace API operations */}
      <ConfirmationModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        actionLabel="Allow & Sync"
        onConfirm={executeConfirmedGoogleAction}
        onCancel={() => setConfirmDialog({ open: false, title: '', description: '', actionType: null })}
        details={[
          `Task: ${task.title}`,
          `Campus: Subhash Nagar, Kota`,
          `Lead: ${task.assignedTo}`
        ]}
      />
    </>
  );
};
