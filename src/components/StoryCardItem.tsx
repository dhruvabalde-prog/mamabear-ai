import React, { useState } from 'react';
import { 
  Sparkles, Check, X, Clock, AlertTriangle, Calendar, Bell, Send, CheckCheck, RefreshCw, MessageSquare
} from 'lucide-react';
import { StoryCard } from '../../types';

interface StoryCardItemProps {
  card: StoryCard;
  onApproveAction: (card: StoryCard) => void;
  onDismiss: (cardId: string) => void;
}

export const StoryCardItem: React.FC<StoryCardItemProps> = ({
  card,
  onApproveAction,
  onDismiss
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const getThemeClasses = (theme: StoryCard['suggested_background_theme']) => {
    switch (theme) {
      case 'dark-crimson':
        return {
          wrapper: 'bg-gradient-to-br from-rose-950/90 to-slate-900 border-rose-900/60 text-white',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-700/50',
          proposalBox: 'bg-rose-950/40 border-rose-800/40 text-rose-100',
          btnPrimary: 'bg-rose-600 hover:bg-rose-500 text-white'
        };
      case 'deep-blue':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/50 text-white',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-700/50',
          proposalBox: 'bg-indigo-950/40 border-indigo-800/40 text-blue-100',
          btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white'
        };
      case 'emerald':
        return {
          wrapper: 'bg-gradient-to-br from-emerald-950/90 to-slate-900 border-emerald-900/50 text-white',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-700/50',
          proposalBox: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-100',
          btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        };
      case 'amber':
        return {
          wrapper: 'bg-gradient-to-br from-amber-950/80 to-slate-900 border-amber-900/50 text-white',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-700/50',
          proposalBox: 'bg-amber-950/40 border-amber-800/40 text-amber-100',
          btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-white'
        };
      case 'charcoal':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white',
          badge: 'bg-slate-700/40 text-slate-300 border-slate-700',
          proposalBox: 'bg-slate-800/40 border-slate-700 text-slate-200',
          btnPrimary: 'bg-white hover:bg-slate-100 text-slate-900'
        };
    }
  };

  const theme = getThemeClasses(card.suggested_background_theme);

  const handleExecute = async () => {
    setIsSending(true);
    await onApproveAction(card);
    setIsSending(false);
    setIsDone(true);
  };

  return (
    <div className={`p-4 rounded-3xl border shadow-md space-y-3 transition-all ${theme.wrapper}`}>
      
      {/* Top Header: Contact + Urgency Badge + Dismiss Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.badge}`}>
            {card.urgency}
          </span>
          <span className="text-[11px] font-bold text-slate-300 truncate">
            {card.contact_name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(card.card_id)}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Headline & High-Signal Context (1 sentence) */}
      <div className="space-y-1">
        <h3 className="text-sm font-black leading-snug tracking-tight text-white">
          {card.headline}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {card.context_summary}
        </p>
      </div>

      {/* AI Agent Proposal (Strict 2 lines) */}
      <div className={`p-2.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${theme.proposalBox}`}>
        <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-amber-300">
          <Sparkles className="w-3 h-3" />
          <span>Agent Proposal</span>
        </div>
        <p className="text-[11px] whitespace-pre-line text-slate-200 font-medium">
          {card.ai_proposal}
        </p>
      </div>

      {/* One-Tap Action Execution Row */}
      {card.pre_drafted_action.reply_text && !isDone && (
        <div className="pt-1 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-300 italic truncate max-w-[210px] sm:max-w-xs">
            &ldquo;{card.pre_drafted_action.reply_text}&rdquo;
          </div>

          <button
            type="button"
            disabled={isSending}
            onClick={handleExecute}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1 shrink-0 shadow-sm cursor-pointer transition-all ${theme.btnPrimary}`}
            title="Approve & Send"
          >
            {isSending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      )}

      {isDone && (
        <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <CheckCheck className="w-4 h-4" />
          <span>Action executed</span>
        </div>
      )}
    </div>
  );
};
