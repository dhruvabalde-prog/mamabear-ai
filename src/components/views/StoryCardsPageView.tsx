import React, { useState, useEffect } from 'react';
import { 
  X, Check, ChevronLeft, ChevronRight, MessageSquare, Mic, MicOff, Send, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { StoryCard } from '../types';

interface StoryCardsPageViewProps {
  cards: StoryCard[];
  onApproveAction: (card: StoryCard) => void;
  onDismiss: (cardId: string) => void;
  onClose: () => void;
}

export const StoryCardsPageView: React.FC<StoryCardsPageViewProps> = ({
  cards,
  onApproveAction,
  onDismiss,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 for current card

  const activeCards = cards;
  const currentCard = activeCards[currentIndex] || null;

  // Story progress timer (like Instagram / WhatsApp stories)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 80; // ms
    const increment = 100 / (8000 / intervalTime); // 8 seconds per card

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < activeCards.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, activeCards.length]);

  const handleNext = () => {
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const handleApprove = () => {
    onApproveAction(currentCard);
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const modifiedCard = {
      ...currentCard,
      pre_drafted_action: {
        ...currentCard.pre_drafted_action,
        reply_text: inputText.trim()
      }
    };
    onApproveAction(modifiedCard);
    setInputText('');
    handleNext();
  };

  const getThemeBg = (theme: StoryCard['suggested_background_theme']) => {
    switch (theme) {
      case 'dark-crimson':
        return 'from-rose-950 via-red-950 to-slate-950';
      case 'deep-blue':
        return 'from-slate-950 via-indigo-950 to-blue-950';
      case 'emerald':
        return 'from-emerald-950 via-teal-950 to-slate-950';
      case 'amber':
        return 'from-amber-950 via-orange-950 to-slate-950';
      case 'charcoal':
      default:
        return 'from-slate-900 via-neutral-900 to-black';
    }
  };

  if (!currentCard || activeCards.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 select-none animate-in fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm">Story Cards Engine</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-3 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-white/10 flex items-center justify-center mx-auto text-2xl">
            💬
          </div>
          <h2 className="text-lg font-black tracking-tight">No Pending Social Friction</h2>
          <p className="text-xs text-white/70 leading-relaxed">
            All WhatsApp pings and parent follow-ups are acknowledged. New Story Cards will synthesize automatically as messages stream in.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs cursor-pointer hover:bg-slate-100 transition-colors"
        >
          Close Stories
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-b ${getThemeBg(currentCard.suggested_background_theme)} text-white flex flex-col justify-between p-4 sm:p-6 select-none`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Header & WhatsApp/Instagram style multi-card progress bars */}
      <div className="space-y-3">
        {/* Progress bars row */}
        <div className="flex items-center gap-1.5 w-full">
          {activeCards.map((c, idx) => (
            <div key={c.card_id || idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-75"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              {currentCard.contact_name.charAt(0)}
            </span>
            <div className="min-w-0">
              <span className="font-extrabold text-sm block truncate text-white">
                {currentCard.contact_name}
              </span>
              <span className="text-[10px] text-white/70 block uppercase font-mono">
                {currentCard.category.replace('_', ' ')} • {currentCard.urgency}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Story Content Area (Clean, High Signal, Simple Language) */}
      <div className="my-auto py-6 space-y-5 max-w-md mx-auto w-full text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
          {currentCard.headline}
        </h2>

        {/* Simple Insight */}
        <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium bg-black/30 backdrop-blur-md p-4 rounded-3xl border border-white/10">
          {currentCard.context_summary}
        </p>

        {/* Suggested Action & Permission */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 text-left space-y-3">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Suggested Action
          </span>
          <p className="text-xs sm:text-sm text-white leading-relaxed font-medium whitespace-pre-line">
            {currentCard.ai_proposal}
          </p>

          {currentCard.pre_drafted_action.reply_text && (
            <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-xs text-emerald-200 font-mono">
              💬 "{currentCard.pre_drafted_action.reply_text}"
            </div>
          )}
        </div>

        {/* 1-Tap Permission Button */}
        <div className="flex items-center gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => onDismiss(currentCard.card_id)}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-all cursor-pointer"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={handleApprove}
            className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Send WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Bottom Interactive Bar with Input & Mic */}
      <div className="pt-2 pb-[env(safe-area-inset-bottom)] max-w-md mx-auto w-full">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isListening ? 'Listening...' : 'Voice Dictate'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'Listening to speech...' : 'Edit response or type custom note...'}
            className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-hidden"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-white text-slate-900 disabled:opacity-40 hover:bg-white/90 transition-all cursor-pointer shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center justify-between text-xs text-white/50 px-2 pt-2">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={currentIndex === 0} 
            className="disabled:opacity-20 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span>{currentIndex + 1} of {activeCards.length}</span>
          <button 
            type="button" 
            onClick={handleNext} 
            disabled={currentIndex >= activeCards.length - 1} 
            className="disabled:opacity-20 flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
