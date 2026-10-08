import React, { useState } from 'react';
import { 
  MessageCircle, Send, Mail, MessageSquare, AlertCircle, RefreshCw, QrCode
} from 'lucide-react';
import { VoiceNudge, ParentInquiry, StaffMember, LocalVendor, SetupConfig, BaileysConnectionStatus } from '../../types';
import { BaileysConnect } from '../BaileysConnect';

interface CommsHubViewProps {
  nudges: VoiceNudge[];
  onSendNudge: (nudge: VoiceNudge) => void;
  inquiries?: ParentInquiry[];
  staff?: StaffMember[];
  vendors?: LocalVendor[];
  setupConfig?: SetupConfig | null;
  baileysStatus?: BaileysConnectionStatus;
  onConnectBaileys?: () => void;
  onDisconnectBaileys?: () => void;
}

type ChatMode = 'whatsapp' | 'team' | 'hq';

export const CommsHubView: React.FC<CommsHubViewProps> = ({
  nudges,
  onSendNudge,
  inquiries = [],
  staff = [],
  vendors = [],
  setupConfig,
  baileysStatus = { status: 'disconnected' },
  onConnectBaileys = () => {},
  onDisconnectBaileys = () => {}
}) => {
  const [chatMode, setChatMode] = useState<ChatMode>('whatsapp');
  const [inputText, setInputText] = useState<string>('');

  // 1. WhatsApp contacts derived dynamically
  const parentContacts = inquiries.map(i => ({
    id: `parent-${i.id}`,
    name: i.parentName,
    phone: i.phone,
    subtext: `${i.grade} • ${i.locality}`,
    defaultDraft: `Namaste ${i.parentName}! Following up from campus. Would you like to schedule a tour?`
  }));

  const vendorContacts = vendors.map(v => ({
    id: `vendor-${v.id}`,
    name: v.name,
    phone: v.phone,
    subtext: `${v.serviceCategory}`,
    defaultDraft: `Namaste! Following up on delivery status for campus.`
  }));

  const allContacts = [...parentContacts, ...vendorContacts];

  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState<string>(allContacts[0]?.id || '');
  const [customWhatsAppDraft, setCustomWhatsAppDraft] = useState<string>(allContacts[0]?.defaultDraft || '');

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
      from: setupConfig?.leadAcademicsName || 'Director',
      to: 'Team',
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
    <div className="max-w-md mx-auto space-y-3 pb-20 px-1 sm:px-0">
      
      {/* 1. Compact Header: 1-2 words */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Comms
          </h1>
          <p className="text-[11px] text-slate-500">
            WhatsApp bridge & team dispatch
          </p>
        </div>

        {/* 3 Compact Channel Selectors */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setChatMode('whatsapp')}
            className={`p-1.5 rounded-xl cursor-pointer transition-all ${
              chatMode === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setChatMode('team')}
            className={`p-1.5 rounded-xl cursor-pointer transition-all ${
              chatMode === 'team' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Team Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setChatMode('hq')}
            className={`p-1.5 rounded-xl cursor-pointer transition-all ${
              chatMode === 'hq' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="HQ Dispatches"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Baileys WhatsApp Connection Manager */}
      <BaileysConnect
        status={baileysStatus}
        onConnect={onConnectBaileys}
        onDisconnect={onDisconnectBaileys}
      />

      {/* 3. MODE: WHATSAPP */}
      {chatMode === 'whatsapp' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xs text-slate-900">
              Direct Outreach
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              {allContacts.length} contacts
            </span>
          </div>

          {allContacts.length === 0 ? (
            <div className="py-6 text-center text-slate-400 space-y-1">
              <AlertCircle className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No contacts</p>
            </div>
          ) : (
            <>
              {/* Horizontal / Compact contact chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {allContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-left border transition-all cursor-pointer ${
                      activeContact?.id === contact.id
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{contact.name}</span>
                  </button>
                ))}
              </div>

              {/* Composer */}
              {activeContact && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                    <span>To: {activeContact.name}</span>
                    <span className="text-slate-400">{activeContact.phone}</span>
                  </div>

                  <textarea
                    rows={3}
                    value={customWhatsAppDraft}
                    onChange={(e) => setCustomWhatsAppDraft(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white focus:outline-hidden"
                  />

                  {/* Compact WhatsApp icon button instead of bulky text button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleLaunchWhatsApp}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 4. MODE: TEAM CHAT */}
      {chatMode === 'team' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <span className="font-extrabold text-xs">Team Channel</span>
            <span className="text-[10px] text-slate-400">{nudges.length} updates</span>
          </div>

          <div className="p-3 space-y-2 max-h-72 overflow-y-auto bg-slate-50/50">
            {nudges.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No updates logged</div>
            ) : (
              nudges.map((n) => (
                <div key={n.id} className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-800">{n.from}</span>
                    <span>{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendNudgeAsMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Team update..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 text-white cursor-pointer"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 5. MODE: HQ */}
      {chatMode === 'hq' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 space-y-2.5">
          <h2 className="font-extrabold text-xs text-slate-900">
            Franchise HQ
          </h2>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-700">
            <span className="font-bold text-slate-900 block">Licensing Active</span>
            <p className="text-[11px] text-slate-600">
              Official curriculum and operational guidance portal synchronized.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
