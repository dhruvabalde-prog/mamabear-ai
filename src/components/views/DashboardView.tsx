import React, { useState } from 'react';
import { 
  Sparkles, Check, MessageCircle, ArrowRight, Plus, RefreshCw, Send, CheckCheck
} from 'lucide-react';
import { TaskItem, SetupConfig, StoryCard, BaileysConnectionStatus } from '../../types';
import { StoryCardItem } from '../StoryCardItem';
import { BaileysConnect } from '../BaileysConnect';

interface DashboardViewProps {
  tasks: TaskItem[];
  setupConfig?: SetupConfig | null;
  storyCards?: StoryCard[];
  baileysStatus?: BaileysConnectionStatus;
  onConnectBaileys?: () => void;
  onDisconnectBaileys?: () => void;
  onApproveStoryCard?: (card: StoryCard) => void;
  onDismissStoryCard?: (cardId: string) => void;
  onOpenTaskModal?: (task: TaskItem) => void;
  onToggleTask?: (taskId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  setupConfig,
  storyCards = [],
  baileysStatus = { status: 'disconnected' },
  onConnectBaileys = () => {},
  onDisconnectBaileys = () => {},
  onApproveStoryCard = () => {},
  onDismissStoryCard = () => {},
  onOpenTaskModal,
  onToggleTask,
  onNavigateTab
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback demo story cards if none generated yet from live stream
  const activeCards: StoryCard[] = storyCards.length > 0 ? storyCards : [
    {
      card_id: 'card_demo_1',
      chat_id: 'contact_1@s.whatsapp.net',
      contact_name: 'Dr. Radhika',
      category: 'UNANSWERED_PING',
      urgency: 'medium',
      headline: 'Unanswered inquiry on admissions',
      context_summary: 'Parent asked about campus tour availability for next weekend 3 hours ago.',
      ai_proposal: 'I can send a confirmation note offering Saturday 10:30 AM or Sunday 11 AM.\nKeeps enrollment velocity high without manual drafting.',
      pre_drafted_action: {
        action_type: 'SEND_WHATSAPP_REPLY',
        reply_text: 'Namaste Dr. Radhika! We would love to host you. Does Saturday 10:30 AM or Sunday 11 AM work for your visit?',
        action_payload: {}
      },
      suggested_background_theme: 'amber'
    },
    {
      card_id: 'card_demo_2',
      chat_id: 'vendor_1@s.whatsapp.net',
      contact_name: 'Hadoti Stone',
      category: 'TASK_COMMITMENT',
      urgency: 'critical',
      headline: 'Site milestone confirmation required',
      context_summary: 'Flooring contractor is awaiting inspection sign-off on Zone 1 matte finish.',
      ai_proposal: 'I can confirm you will inspect the non-slip beveling on site by 4 PM today.\nProtects installation schedule and vendor accountability.',
      pre_drafted_action: {
        action_type: 'SEND_WHATSAPP_REPLY',
        reply_text: 'Namaste Suresh ji, will visit site by 4 PM today for the non-slip safety inspection.',
        action_payload: {}
      },
      suggested_background_theme: 'dark-crimson'
    }
  ];

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-1 sm:px-0">
      
      {/* 1. Header: Clean, Compact 1-2 words */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Stream
          </h1>
          <p className="text-[11px] text-slate-500">
            High-signal WhatsApp friction & action cards
          </p>
        </div>

        {/* WhatsApp Icon Status CTA */}
        <button
          type="button"
          onClick={() => onNavigateTab ? onNavigateTab('comms') : onConnectBaileys()}
          className="p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs transition-all cursor-pointer"
          title="WhatsApp Engine"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
        </button>
      </div>

      {/* 2. Baileys Quick Link Bar */}
      <BaileysConnect
        status={baileysStatus}
        onConnect={onConnectBaileys}
        onDisconnect={onDisconnectBaileys}
      />

      {/* 3. Executive Story Cards Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Story Cards ({activeCards.length})</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Auto-synthesized</span>
        </div>

        {activeCards.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
            <span className="font-extrabold text-xs text-slate-900 block">No pending friction</span>
            <p className="text-[11px] text-slate-500">All WhatsApp commitments and inquiries are acknowledged.</p>
          </div>
        ) : (
          activeCards.map((card) => (
            <StoryCardItem
              key={card.card_id}
              card={card}
              onApproveAction={onApproveStoryCard}
              onDismiss={onDismissStoryCard}
            />
          ))
        )}
      </div>

      {/* 4. Active Deliverables: Compact mobile list */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-xs text-slate-900">
            Pending Tasks
          </h2>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('tasks')}
            className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            All ({tasks.length})
          </button>
        </div>

        <div className="space-y-2">
          {tasks.slice(0, 3).map((t) => (
            <div
              key={t.id}
              onClick={() => onOpenTaskModal && onOpenTaskModal(t)}
              className="p-3 bg-slate-50/80 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask && onToggleTask(t.id);
                  }}
                  className="w-4 h-4 rounded-md border border-slate-300 flex items-center justify-center shrink-0 bg-white"
                >
                  {t.status === 'completed' && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
                <span className="font-bold text-xs text-slate-800 truncate">
                  {t.title}
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
