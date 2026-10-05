import React, { useState } from 'react';
import { 
  MessageCircle, Send, Mail, Users, Building, 
  Sparkles, ExternalLink, CheckCheck, Clock, Share2, Copy, MessageSquare
} from 'lucide-react';
import { VoiceNudge } from '../../types';

interface CommsHubViewProps {
  nudges: VoiceNudge[];
  onSendNudge: (nudge: VoiceNudge) => void;
}

type ChatMode = 'google_chat' | 'gmail' | 'whatsapp';

export const CommsHubView: React.FC<CommsHubViewProps> = ({
  nudges,
  onSendNudge
}) => {
  const [chatMode, setChatMode] = useState<ChatMode>('google_chat');
  const [inputText, setInputText] = useState<string>('');

  // 1. Google Chat Messages (Internal Team: Teachers, Staff, Center Head & Family)
  const [googleChatMessages, setGoogleChatMessages] = useState([
    {
      id: 'gc-1',
      sender: 'Kavita Dave (Center Head)',
      role: 'Staff & Pedagogy Lead',
      text: 'Good morning Priya & Ananya! Sunita and Meenakshi completed the Canadian sound-box workshop module.',
      timestamp: '8:45 AM',
      avatarColor: 'bg-indigo-600'
    },
    {
      id: 'gc-2',
      sender: 'Sunita Rathore (Lead Educator)',
      role: 'Nursery Class Lead',
      text: 'The bilingual storybooks for Canadian Nest section look wonderful. Aarav loved the wooden block station today!',
      timestamp: '10:15 AM',
      avatarColor: 'bg-rose-500'
    },
    {
      id: 'gc-3',
      sender: 'Kamla Bai (Caregiver Didi)',
      role: 'Caregiver',
      text: 'Didi, Toddler Explorer Room toy bins aur miniature washroom seats fit ho gayi hain Subhash Nagar mein.',
      timestamp: '11:20 AM',
      avatarColor: 'bg-amber-600'
    },
    {
      id: 'gc-4',
      sender: 'Family Bridge (Aarav & Myra Care)',
      role: 'Co-founder Family',
      text: 'Aarav and Myra had lunch and are resting now (1:30 PM nap window). All good at Subhash Nagar campus!',
      timestamp: '1:30 PM',
      avatarColor: 'bg-emerald-600'
    }
  ]);

  // 2. Gmail Dispatches (Maple Bear Master Franchise HQ)
  const [gmailDispatches] = useState([
    {
      id: 'gm-1',
      sender: 'Vikramaditya Sen (Regional Franchise Director)',
      email: 'operations@maplebear.in',
      subject: 'Franchise Agreement Signed & 60-Day Launch Toolkit Dispatched',
      snippet: 'Congratulations Priya & Ananya on paying the ₹15L signing amount today! License #MB-2026-94 is active.',
      timestamp: '9:30 AM',
      unread: true
    },
    {
      id: 'gm-2',
      sender: 'Maple Bear Curriculum Cell',
      email: 'curriculum@maplebear.in',
      subject: 'Canadian Early Childhood Bilingual Immersion Binders',
      snippet: 'Attached are the 40-week thematic lesson guides for Toddler Explorer & Nursery sections.',
      timestamp: 'Yesterday',
      unread: false
    }
  ]);

  // 3. WhatsApp Contacts (Parents & Vendors)
  const [whatsappContacts, setWhatsappContacts] = useState([
    {
      id: 'wa-1',
      name: 'Dr. Radhika Mehta (Cardiologist NMCH)',
      phone: '919414123456',
      subtext: 'Parent of 3yo Twins Kabir & Vivaan',
      defaultDraft: 'Hello Dr. Radhika! Confirming your Saturday 10:30 AM campus tour for twins Kabir & Vivaan at Maple Bear Subhash Nagar.'
    },
    {
      id: 'wa-2',
      name: 'Er. Rajesh Khandelwal (Allen Senior Physics)',
      phone: '919829298765',
      subtext: 'Parent of Anvi (2.5yo)',
      defaultDraft: 'Namaste Rajesh ji! Attached is the Term 1 fee breakdown for Toddler section along with our 5:30 PM Allen Faculty extended day-care schedule.'
    },
    {
      id: 'wa-3',
      name: 'Hadoti Constructions (Master Craftsman Suresh)',
      phone: '919829011223',
      subtext: 'Vendor • Kota Stone Polishing',
      defaultDraft: 'Namaste Suresh ji, please confirm if the zero-chemical matte polish in Zone 4 (Kindergarten) will be completed by 4 PM today.'
    },
    {
      id: 'wa-4',
      name: 'Gumanpura Electronics Hub',
      phone: '919414577881',
      subtext: 'Vendor • HVAC & Heat-Shield Coolers',
      defaultDraft: 'Hello Gumanpura Electronics, please confirm delivery slot for the 6 Inverter ACs at Subhash Nagar campus tomorrow morning.'
    }
  ]);

  const [selectedWhatsAppContact, setSelectedWhatsAppContact] = useState(whatsappContacts[0]);
  const [customWhatsAppDraft, setCustomWhatsAppDraft] = useState(whatsappContacts[0].defaultDraft);

  const handleSendGoogleChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `gc-${Date.now()}`,
      sender: 'Co-Founder',
      role: 'Management',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: 'bg-indigo-600'
    };

    setGoogleChatMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleLaunchWhatsApp = () => {
    const cleanPhone = selectedWhatsAppContact.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customWhatsAppDraft)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-28">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chats
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Google Chat for internal team & family • Gmail for HQ • WhatsApp for parents & vendors.
          </p>
        </div>

        {/* 3 Native Channel Selector Tabs */}
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
            <span>Team Chat</span>
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
            <span>Gmail</span>
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
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 1. GOOGLE CHAT MODE */}
      {chatMode === 'google_chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col min-h-[420px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h2 className="font-extrabold text-xs sm:text-sm">
                Google Chat • Maple Bear Internal Room
              </h2>
            </div>
            <span className="text-[10px] font-extrabold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">
              Native Stream
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-96 bg-slate-50/50">
            {googleChatMessages.map((m) => (
              <div key={m.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${m.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                      {m.sender[0]}
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">{m.sender}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({m.role})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 pl-8 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendGoogleChatMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Post a message to teachers & staff on Google Chat..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
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
              <span>Gmail Dispatches from Maple Bear HQ</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Official Franchise Channel
            </span>
          </div>

          <div className="space-y-3">
            {gmailDispatches.map((gm) => (
              <div key={gm.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">{gm.sender}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{gm.timestamp}</span>
                </div>
                <div className="font-bold text-xs text-slate-800">{gm.subject}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{gm.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WHATSAPP MODE (Type in app, touch button to send!) */}
      {chatMode === 'whatsapp' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Outreach to Parents & Vendors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select recipient, customize your message, and touch the green button to dispatch directly on WhatsApp.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {whatsappContacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  setSelectedWhatsAppContact(contact);
                  setCustomWhatsAppDraft(contact.defaultDraft);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  selectedWhatsAppContact.id === contact.id
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-extrabold text-xs text-slate-900">{contact.name}</div>
                <div className="text-[11px] text-slate-500">{contact.subtext}</div>
              </button>
            ))}
          </div>

          {/* Composer & Dispatch Button */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Recipient: <strong className="text-slate-900">{selectedWhatsAppContact.name}</strong> ({selectedWhatsAppContact.phone})
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
        </div>
      )}

    </div>
  );
};
