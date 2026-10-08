import React, { useState } from 'react';
import { 
  Send, User, Search
} from 'lucide-react';
import { VoiceNudge, ParentInquiry, LocalVendor, SetupConfig } from '../../types';

interface CommsHubViewProps {
  nudges: VoiceNudge[];
  onSendNudge: (nudge: VoiceNudge) => void;
  inquiries?: ParentInquiry[];
  vendors?: LocalVendor[];
  setupConfig?: SetupConfig | null;
}

export const CommsHubView: React.FC<CommsHubViewProps> = ({
  nudges,
  onSendNudge,
  inquiries = [],
  vendors = [],
  setupConfig
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // WhatsApp-style long chat list
  const threads = [
    ...inquiries.map(i => ({
      id: `inq-${i.id}`,
      name: i.parentName,
      subtext: `${i.grade} • ${i.locality}`,
      lastMessage: i.notes || 'Inquiry registered',
      phone: i.phone,
      type: 'parent'
    })),
    ...vendors.map(v => ({
      id: `vend-${v.id}`,
      name: v.name,
      subtext: v.serviceCategory,
      lastMessage: v.contactPerson || 'Vendor contract',
      phone: v.phone,
      type: 'vendor'
    }))
  ];

  const filteredThreads = threads.filter(t => 
    !searchQuery.trim() || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subtext.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newNudge: VoiceNudge = {
      id: `nudge-${Date.now()}`,
      from: setupConfig?.leadAcademicsName || 'Director',
      to: activeThread ? activeThread.name : 'Team',
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'Urgent'
    };

    onSendNudge(newNudge);
    setInputText('');
  };

  const handleOpenWhatsAppDirect = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto space-y-3 pb-24 px-2 pt-1">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-3 py-2 bg-white rounded-2xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500 shadow-2xs font-medium"
        />
      </div>

      {/* WhatsApp chat style list */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active conversations
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs shrink-0">
                    {thread.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {thread.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {thread.lastMessage}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenWhatsAppDirect(thread.phone, `Hello ${thread.name}, update regarding campus admissions.`);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-2xs"
                >
                  WhatsApp
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Input bar for quick messaging */}
      <div className="p-3 bg-white rounded-3xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={activeThread ? `Message ${activeThread.name}...` : 'Type a message...'}
            className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold cursor-pointer shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
