import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Sparkles, AlertCircle, ArrowUpRight, 
  MapPin, Baby, Users, ShieldCheck, Building2, 
  ChevronRight, Zap, MessageCircle, Check, Send, User
} from 'lucide-react';
import { TaskItem } from '../../types';
import { INITIAL_EXPENSES } from '../../data/initialData';
import { getAgenticPriorityNow, buildWhatsAppUrl, ClarifyingQuestion } from '../../services/agentTools';

import { SetupConfig } from '../../types';

interface DashboardViewProps {
  tasks: TaskItem[];
  setupConfig?: SetupConfig | null;
  onOpenTaskModal?: (task: TaskItem) => void;
  onOpenTask?: (task: TaskItem) => void;
  onToggleTask?: (taskId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onNavigateToTasks?: () => void;
  onNavigateToAdmissions?: () => void;
  onNavigateToFacility?: () => void;
  onNavigateToComms?: () => void;
  onNavigateToMamaBear?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  setupConfig,
  onOpenTaskModal,
  onOpenTask,
  onToggleTask,
  onNavigateTab,
  onNavigateToTasks,
  onNavigateToAdmissions,
  onNavigateToFacility,
  onNavigateToComms,
  onNavigateToMamaBear
}) => {
  const handleOpenTask = (task: TaskItem) => {
    if (onOpenTaskModal) onOpenTaskModal(task);
    else if (onOpenTask) onOpenTask(task);
  };

  const handleGoToTasks = () => {
    if (onNavigateTab) onNavigateTab('tasks');
    else if (onNavigateToTasks) onNavigateToTasks();
  };

  const handleGoToAdmissions = () => {
    if (onNavigateTab) onNavigateTab('admissions');
    else if (onNavigateToAdmissions) onNavigateToAdmissions();
  };

  const handleGoToFacility = () => {
    if (onNavigateTab) onNavigateTab('facility');
    else if (onNavigateToFacility) onNavigateToFacility();
  };

  const handleGoToComms = () => {
    if (onNavigateTab) onNavigateTab('comms');
    else if (onNavigateToComms) onNavigateToComms();
  };

  const handleGoToMamaBear = () => {
    if (onNavigateTab) onNavigateTab('mamabear');
    else if (onNavigateToMamaBear) onNavigateToMamaBear();
  };

  // Agentic Priority & Clarifying Questions Engine
  const agenticData = getAgenticPriorityNow('academics', setupConfig);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, { answer: string; feedback?: any; loading?: boolean }>>({});


  // Tasks statistics across all 400 items
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').slice(0, 4);

  const handleAnswerQuestion = async (q: ClarifyingQuestion, option: string) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [q.id]: { answer: option, loading: true }
    }));

    try {
      const res = await fetch('/api/ai/agentic-clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          selectedOption: option,
          activeFounder: 'academics'
        })
      });
      const data = await res.json();
      setAnsweredQuestions(prev => ({
        ...prev,
        [q.id]: { answer: option, feedback: data, loading: false }
      }));
    } catch (err) {
      setAnsweredQuestions(prev => ({
        ...prev,
        [q.id]: {
          answer: option,
          feedback: {
            insight: `Noted: "${option}". Plan updated for Subhash Nagar launch.`,
            nextSteps: ['Sync with team', 'Update task checklist'],
            draftMessage: `Update: ${option} confirmed.`
          },
          loading: false
        }
      }));
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* 1. TOP AGENTIC BANNER: "WHAT NEEDS TO BE DONE RIGHT NOW" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-7 text-white shadow-lg border border-indigo-900/50">
        <div className="relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-300">
              Next Action Priority
            </span>
            <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Baby className="w-3.5 h-3.5 text-rose-400" />
              <span>{agenticData.routineStatus}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {agenticData.primaryAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {agenticData.primaryAction.rationale}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {agenticData.primaryAction.actionData.recipientContact && agenticData.primaryAction.actionData.draftText && (
              <a
                href={buildWhatsAppUrl(
                  agenticData.primaryAction.actionData.recipientContact,
                  agenticData.primaryAction.actionData.draftText
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send via WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleGoToMamaBear}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask MamaBear AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AGENTIC PROACTIVE INQUIRY ENGINE: "MAMABEAR ASKS YOU" */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
              🐻
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                MamaBear Clarifying Questions
              </h3>
              <p className="text-[11px] text-slate-500">
                Answer in 1 tap to calibrate your launch roadmap and communication drafts.
              </p>
            </div>
          </div>
        </div>

        {/* Questions Cards */}
        <div className="space-y-3">
          {agenticData.clarifyingQuestions.map((q, idx) => {
            const answerState = answeredQuestions[q.id];
            return (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{q.context}</p>
                  </div>
                </div>

                {!answerState ? (
                  <div className="flex flex-wrap gap-2 pt-1 pl-7">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerQuestion(q, opt)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 text-xs font-semibold shadow-2xs transition-all text-left cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="pl-7 space-y-2 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected: {answerState.answer}</span>
                    </div>

                    {answerState.loading && (
                      <div className="text-xs text-slate-400 italic">MamaBear is updating roadmap...</div>
                    )}

                    {answerState.feedback && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-2 shadow-2xs">
                        <p className="font-semibold text-slate-900">{answerState.feedback.insight}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MASTER DELIVERABLES PROGRESS */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Master Launch Deliverables ({totalTasks})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedTasks} of {totalTasks} Canadian franchise launch milestones completed.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoToTasks}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>View All ({totalTasks})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }}
          ></div>
        </div>

        {/* High Priority Tasks */}
        <div className="space-y-2.5 pt-2">
          {highPriorityTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask && onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                >
                  <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex items-center justify-center">
                    {task.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                  </div>
                </button>

                <div 
                  onClick={() => handleOpenTask(task)}
                  className="cursor-pointer space-y-1 min-w-0"
                >
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">{task.category}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold">
                      {task.assignedTo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenTask(task)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. QUICK NAVIGATION HUB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={handleGoToAdmissions}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div className="font-extrabold text-xs sm:text-sm text-slate-900">Admissions</div>
          <div className="text-[11px] text-slate-500">Parent Inquiries</div>
        </button>

        <button
          type="button"
          onClick={handleGoToFacility}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="font-extrabold text-xs sm:text-sm text-slate-900">Facility & Stone</div>
          <div className="text-[11px] text-slate-500">6 Campus Zones</div>
        </button>

        <button
          type="button"
          onClick={handleGoToComms}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="font-extrabold text-xs sm:text-sm text-slate-900">Chats Tab</div>
          <div className="text-[11px] text-slate-500">Chat / Gmail / WhatsApp</div>
        </button>

        <button
          type="button"
          onClick={handleGoToMamaBear}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left space-y-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-extrabold text-xs sm:text-sm text-slate-900">MamaBear AI</div>
          <div className="text-[11px] text-slate-500">Launch Chief of Staff</div>
        </button>
      </div>

    </div>
  );
};
