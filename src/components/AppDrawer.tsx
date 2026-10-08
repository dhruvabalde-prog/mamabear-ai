import React from 'react';
import { 
  X, Plus, Calendar, FolderHeart, AppWindow, 
  MessageSquare, Brain, Sparkles, ChevronRight, Check
} from 'lucide-react';

export interface ChatSessionSummary {
  id: string;
  title: string;
  timestamp: string;
  lastMessage: string;
}

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenScheduled: () => void;
  onOpenLibrary: () => void;
  onOpenConnectedApps: () => void;
  chatSessions: ChatSessionSummary[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onOpenScheduled,
  onOpenLibrary,
  onOpenConnectedApps,
  chatSessions,
  activeChatId,
  onSelectChat
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content on left */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-sm">
              🍁
            </div>
            <span className="font-black text-sm text-slate-900">Menu</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="p-3 border-b border-slate-100 space-y-1">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenScheduled();
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer text-left"
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Scheduled</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenLibrary();
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer text-left"
          >
            <FolderHeart className="w-4 h-4 text-rose-600" />
            <span>Library</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenConnectedApps();
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer text-left"
          >
            <AppWindow className="w-4 h-4 text-emerald-600" />
            <span>Connected Apps</span>
          </button>
        </div>

        {/* Chronological Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block">
            Chats
          </span>

          <div className="space-y-1">
            {chatSessions.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                  chat.id === activeChatId
                    ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{chat.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{chat.lastMessage}</div>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0 mt-0.5 font-mono">
                  {chat.timestamp}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Memory Section (Locked) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="p-2.5 rounded-xl border border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-slate-400" />
              <span className="font-bold">Memory</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600">
              Locked
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
