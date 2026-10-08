import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Copy, Check, Mic
} from 'lucide-react';

interface MamaBearViewProps {
  onNavigateToTasks?: () => void;
  activeChatId?: string;
  onUpdateChatHistory?: (id: string, text: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mamabear';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export const MamaBearView: React.FC<MamaBearViewProps> = ({
  activeChatId = 'default',
  onUpdateChatHistory
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistent messages per activeChatId stored in localStorage
  const storageKey = `mb_chat_${activeChatId}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'msg-init',
        sender: 'mamabear',
        text: `MamaBear AI ready. How can I assist with tasks, messages, or operations?`,
        timestamp: 'Just now',
        suggestedActions: [
          'Draft message to parents',
          'Review launch tasks',
          'Check vendor status'
        ]
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {}
  }, [messages, storageKey]);

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

    if (onUpdateChatHistory) {
      onUpdateChatHistory(activeChatId, message.trim());
    }

    try {
      const res = await fetch('/api/ai/mamabear-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          activeFounder: 'academics',
          history: messages.slice(-4).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (e) {
        data = {};
      }
      
      const aiReply: ChatMessage = {
        id: `mb-${Date.now()}`,
        sender: 'mamabear',
        text: data.reply || "Got it. Taking the necessary steps.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [
          "Check Tasks",
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
          text: "I'm working in offline mode right now. Your note is safely logged.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-36 px-2 pt-2 relative min-h-[500px]">
      {/* Messages Stream */}
      <div className="space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm shrink-0 font-bold shadow-2xs">
                  🐻
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 space-y-2 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Actions & Copy */}
                {!isUser && (
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100/80">
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(act)}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-500 animate-pulse">
            <span className="text-sm">🐻</span>
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar with mic button at bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask MamaBear AI..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 font-medium"
            />

            {/* Mic button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Speak"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold cursor-pointer shrink-0 transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
