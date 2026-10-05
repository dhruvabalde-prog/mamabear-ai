import React, { useState } from 'react';
import { 
  X, Mic, MicOff, Send, Volume2, Sparkles, 
  MapPin, Baby, Building, Flame, CheckCircle, Clock 
} from 'lucide-react';
import { VoiceNudge } from '../types';

interface WalkieTalkieModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFounder: 'academics' | 'business';
  nudges: VoiceNudge[];
  onSendNudge: (nudge: VoiceNudge) => void;
}

export const WalkieTalkieModal: React.FC<WalkieTalkieModalProps> = ({
  isOpen,
  onClose,
  activeFounder,
  nudges,
  onSendNudge
}) => {
  if (!isOpen) return null;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [playingNudgeId, setPlayingNudgeId] = useState<string | null>(null);

  const senderName = activeFounder === 'academics' ? 'Priya (Academics)' : 'Ananya (Business)';
  const recipientName = activeFounder === 'academics' ? 'Ananya (Business)' : 'Priya (Academics)';

  // Quick 1-tap rapid voice nudges
  const quickTemplates = [
    { text: 'At Subhash Nagar site right now inspecting Kota stone finishing!', tag: 'Site Visit' as const, icon: '🏛️' },
    { text: 'Aarav & Myra just tested the new sensory blocks - 5/5 stars!', tag: 'Toddler' as const, icon: '🧸' },
    { text: 'Senior Allen faculty parent just called for Nursery tour this Saturday.', tag: 'Parent' as const, icon: '📞' },
    { text: 'Fire Department physical inspection passed without objection!', tag: 'Franchise' as const, icon: '🔥' },
    { text: 'Signing amount receipt and Canadian curriculum manuals confirmed!', tag: 'Celebration' as const, icon: '🎉' }
  ];

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordSeconds(0);
      const timer = setInterval(() => {
        setRecordSeconds(s => {
          if (s >= 15) {
            clearInterval(timer);
            setIsRecording(false);
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      // Auto-send voice simulation
      const newNudge: VoiceNudge = {
        id: `nudge-${Date.now()}`,
        from: senderName,
        to: recipientName,
        message: typedMessage || 'Voice memo: Quick update regarding Subhash Nagar campus milestone.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag: 'Urgent',
        duration: `0:${recordSeconds < 10 ? '0' : ''}${recordSeconds || 12}`
      };
      onSendNudge(newNudge);
      setTypedMessage('');
    }
  };

  const handleSendQuick = (template: typeof quickTemplates[0]) => {
    const newNudge: VoiceNudge = {
      id: `nudge-${Date.now()}`,
      from: senderName,
      to: recipientName,
      message: template.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: template.tag,
      duration: '0:15'
    };
    onSendNudge(newNudge);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newNudge: VoiceNudge = {
      id: `nudge-${Date.now()}`,
      from: senderName,
      to: recipientName,
      message: typedMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'Site Visit'
    };
    onSendNudge(newNudge);
    setTypedMessage('');
  };

  const playVoiceMemo = (id: string) => {
    setPlayingNudgeId(id);
    setTimeout(() => {
      setPlayingNudgeId(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-rose-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Co-Founder Walkie-Talkie</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Direct channel: {senderName} ⇄ {recipientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nudge History */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
          <div className="text-center my-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-200/60 px-3 py-1 rounded-full">
              Live Kota Subhash Nagar Handoffs
            </span>
          </div>

          {nudges.map((nudge) => {
            const isMe = nudge.from.includes(activeFounder === 'academics' ? 'Priya' : 'Ananya');
            return (
              <div
                key={nudge.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-600">
                    {nudge.from}
                  </span>
                  <span className="text-[10px] text-slate-400">{nudge.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {nudge.message}
                  </p>

                  {nudge.duration && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => playVoiceMemo(nudge.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${playingNudgeId === nudge.id ? 'animate-bounce text-amber-300' : ''}`} />
                        {playingNudgeId === nudge.id ? 'Playing Voice...' : `Voice Note (${nudge.duration})`}
                      </button>

                      {/* Soundwave Simulation */}
                      <div className="flex items-center gap-0.5 h-3">
                        <span className={`w-0.5 rounded-full ${isMe ? 'bg-white' : 'bg-indigo-600'} ${playingNudgeId === nudge.id ? 'h-3 animate-pulse' : 'h-1'}`}></span>
                        <span className={`w-0.5 rounded-full ${isMe ? 'bg-white' : 'bg-indigo-600'} ${playingNudgeId === nudge.id ? 'h-4 animate-bounce' : 'h-2'}`}></span>
                        <span className={`w-0.5 rounded-full ${isMe ? 'bg-white' : 'bg-indigo-600'} ${playingNudgeId === nudge.id ? 'h-2 animate-pulse' : 'h-1.5'}`}></span>
                        <span className={`w-0.5 rounded-full ${isMe ? 'bg-white' : 'bg-indigo-600'} ${playingNudgeId === nudge.id ? 'h-3.5 animate-bounce' : 'h-2'}`}></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-Tap Quick Responses */}
        <div className="p-3 bg-white border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            1-Tap Quick Status Nudges
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuick(t)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{t.icon}</span>
                <span className="truncate max-w-[130px]">{t.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Record & Text Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            {/* Hold/Click to Record Button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
              }`}
              title={isRecording ? 'Click to finish audio' : 'Click to record voice memo'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {isRecording ? (
              <div className="flex-1 px-3 py-2 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
                <span>🔴 Recording Voice Memo... ({recordSeconds}s)</span>
                <span className="text-[11px]">Click mic to send</span>
              </div>
            ) : (
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder={`Quick nudge to ${recipientName.split(' ')[0]}...`}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            )}

            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
