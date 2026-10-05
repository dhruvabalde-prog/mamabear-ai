import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Copy, Check, Baby, MessageSquare
} from 'lucide-react';

interface MamaBearViewProps {
  activeFounder?: 'academics' | 'business' | 'dual';
  onNavigateToTasks?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mamabear';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export const MamaBearView: React.FC<MamaBearViewProps> = ({
  onNavigateToTasks
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'mamabear',
      text: `Hello! 🐻 I'm MamaBear AI. Ready to draft parent messages, sync tasks, or balance toddler schedules for Maple Bear Subhash Nagar, Kota.`,
      timestamp: 'Just now',
      suggestedActions: [
        'Draft WhatsApp to doctor parents',
        'Check Kota stone finishing checklist',
        'Weekend campus tour agenda'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/mamabear-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          activeFounder: 'academics',
          momMode: true,
          history: messages.slice(-4).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      
      const aiReply: ChatMessage = {
        id: `mb-${Date.now()}`,
        sender: 'mamabear',
        text: data.reply || "I've noted that for our Subhash Nagar campus roadmap.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [
          "Check Task Library",
          "Copy text"
        ]
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `mb-err-${Date.now()}`,
          sender: 'mamabear',
          text: `Got it! Let's keep our focus on the 60-day launch milestones for Subhash Nagar.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-36 relative min-h-[500px]">
      
      {/* Simple Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-2xs font-bold">
            🐻
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">MamaBear AI</h1>
            <p className="text-xs text-slate-500">
              Co-Founder AI Chief of Staff • Subhash Nagar, Kota
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* Suggested Follow-up Actions */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs font-semibold transition-all text-left flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Copy tool */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-500 animate-pulse">
            <span className="text-base">🐻</span>
            <span>MamaBear is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* LOCKED INPUT BAR RIGHT ABOVE FOOTER (bottom-16) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 px-4 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask MamaBear (e.g. 'Draft WhatsApp to Dr. Radhika')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};
