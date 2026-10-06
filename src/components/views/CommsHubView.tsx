import React, { useState } from 'react';
import { 
  MessageCircle, Send, Mail, Users, Building, 
  Sparkles, ExternalLink, CheckCheck, Clock, Share2, Copy, MessageSquare, AlertCircle
} from 'lucide-react';
import { VoiceNudge, ParentInquiry, StaffMember, LocalVendor, SetupConfig } from '../../types';

interface CommsHubViewProps {
  nudges: VoiceNudge[];
  onSendNudge: (nudge: VoiceNudge) => void;
  inquiries?: ParentInquiry[];
  staff?: StaffMember[];
  vendors?: LocalVendor[];
  setupConfig?: SetupConfig | null;
}

type ChatMode = 'google_chat' | 'gmail' | 'whatsapp';

export const CommsHubView: React.FC<CommsHubViewProps> = ({
  nudges,
  onSendNudge,
  inquiries = [],
  staff = [],
  vendors = [],
  setupConfig
}) => {
  const [chatMode, setChatMode] = useState<ChatMode>('google_chat');
  const [inputText, setInputText] = useState<string>('');

  // 1. WhatsApp contacts derived dynamically from live Inquiries and Vendors
  const parentContacts = inquiries.map(i => ({
    id: `parent-${i.id}`,
    name: `${i.parentName} (${i.childName}'s Parent)`,
    phone: i.phone,
    subtext: `Grade: ${i.grade} • ${i.locality} • ${i.parentBackground}`,
    defaultDraft: `Namaste ${i.parentName}! Warm greetings from ${setupConfig?.schoolName || 'Maple Bear Canadian Pre-school'}. We are excited to assist you with ${i.childName}'s enrollment journey for our ${i.grade} Canadian immersion classroom. Would you like to schedule a personalized campus walkthrough?`
  }));

  const vendorContacts = vendors.map(v => ({
    id: `vendor-${v.id}`,
    name: `${v.name} (${v.contactPerson})`,
    phone: v.phone,
    subtext: `${v.serviceCategory} • ${v.area}`,
    defaultDraft: `Namaste ${v.contactPerson} ji! Following up on behalf of ${setupConfig?.schoolName || 'Maple Bear Canadian Pre-school'} regarding ${v.serviceCategory}. Please confirm the current timeline and delivery schedule at our campus site.`
  }));

  const allContacts = [...parentContacts, ...vendorContacts];

  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState<string>(allContacts[0]?.id || '');
  const [customWhatsAppDraft, setCustomWhatsAppDraft] = useState<string>(allContacts[0]?.defaultDraft || '');

  // Keep selected contact synced
  const activeContact = allContacts.find(c => c.id === selectedWhatsAppId) || allContacts[0] || null;

  const handleSelectContact = (contact: typeof allContacts[0]) => {
    setSelectedWhatsAppId(contact.id);
    setCustomWhatsAppDraft(contact.defaultDraft);
  };

  const handleSendNudgeAsMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newNudge: VoiceNudge = {
      id: `nudge-${Date.now()}`,
      from: setupConfig?.leadAcademicsName || 'Dr. Priya Sharma',
      to: 'Team & Co-Founders',
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'Urgent'
    };

    onSendNudge(newNudge);
    setInputText('');
  };

  const handleLaunchWhatsApp = () => {
    if (!activeContact) return;
    const cleanPhone = activeContact.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customWhatsAppDraft)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-28">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Communication Channels
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal team stream • Maple Bear HQ communications • Live WhatsApp outreach to verified parents & vendors.
          </p>
        </div>

        {/* 3 Channel Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setChatMode('google_chat')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chatMode === 'google_chat'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Team Chat ({nudges.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setChatMode('gmail')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chatMode === 'gmail'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>HQ Dispatches</span>
          </button>

          <button
            type="button"
            onClick={() => setChatMode('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              chatMode === 'whatsapp'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Outreach ({allContacts.length})</span>
          </button>
        </div>
      </div>

      {/* 1. GOOGLE CHAT MODE (Powered by live mb_voice_nudges) */}
      {chatMode === 'google_chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col min-h-[420px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h2 className="font-extrabold text-xs sm:text-sm">
                Internal Team Channel • {setupConfig?.schoolName || 'Maple Bear'}
              </h2>
            </div>
            <span className="text-[10px] font-extrabold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">
              Live Stream ({nudges.length} updates)
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-96 bg-slate-50/50">
            {nudges.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No team messages logged yet</p>
                <p className="text-[11px] text-slate-400">Post an update below to coordinate with teachers and staff.</p>
              </div>
            ) : (
              nudges.map((n) => (
                <div key={n.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {n.from ? n.from[0] : 'T'}
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">{n.from}</span>
                      <span className="text-[10px] text-slate-400 font-mono">→ {n.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {n.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 pl-8 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendNudgeAsMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Post a message to teachers, didis & co-founder..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. GMAIL HQ MODE */}
      {chatMode === 'gmail' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <span>Franchise HQ Communications</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Official Franchise Portal
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                {setupConfig?.franchiseBrand || 'Maple Bear'} Master Franchise HQ
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Status: Verified</span>
            </div>
            <div className="font-bold text-xs text-slate-800">
              Franchise License Agreement & Curriculum Dispatches Active
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Signed fee recorded at ₹{Number(setupConfig?.signingFeePaid || 1500000).toLocaleString('en-IN')}. 
              Official 40-week thematic bilingual early learning binders and teacher training modules are unlocked for campus: {setupConfig?.campusLocation || 'Subhash Nagar, Kota'}.
            </p>
          </div>
        </div>
      )}

      {/* 3. WHATSAPP MODE (Connected to live Inquiries and Vendors) */}
      {chatMode === 'whatsapp' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Outreach to Parents & Vendors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select recipient from verified campus inquiries and local vendors, customize message, and launch WhatsApp.
            </p>
          </div>

          {allContacts.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No parents or vendors in database</p>
              <p className="text-[11px] text-slate-400">Add admissions inquiries or local vendors to start one-touch WhatsApp outreach.</p>
            </div>
          ) : (
            <>
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {allContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      activeContact?.id === contact.id
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-slate-900">{contact.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{contact.subtext}</div>
                  </button>
                ))}
              </div>

              {/* Composer & Dispatch Button */}
              {activeContact && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Recipient: <strong className="text-slate-900">{activeContact.name}</strong> ({activeContact.phone})
                    </label>
                    <textarea
                      rows={4}
                      value={customWhatsAppDraft}
                      onChange={(e) => setCustomWhatsAppDraft(e.target.value)}
                      className="w-full mt-2 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleLaunchWhatsApp}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Send on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
};
