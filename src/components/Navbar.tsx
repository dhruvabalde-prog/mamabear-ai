import React from 'react';
import { 
  Sparkles, Menu
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: string;
  pageTitle?: string;
  onOpenDrawer: () => void;
  googleUser: User | null;
  hasGoogleToken: boolean;
  onOpenGoogleSettings: () => void;
  onOpenStoryCards?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Home',
  tasks: 'Tasks',
  mamabear: 'MamaBear',
  comms: 'Chats',
  school: 'School'
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  pageTitle,
  onOpenDrawer,
  googleUser,
  hasGoogleToken,
  onOpenGoogleSettings,
  onOpenStoryCards
}) => {
  const displayTitle = pageTitle || TAB_TITLES[currentTab] || 'Home';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Maple Bear logo triggers Drawer menu */}
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={onOpenDrawer}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-xs font-black text-base cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
            title="Open Menu"
          >
            🍁
          </button>

          {/* Heading of current page: 1-2 words only */}
          <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Right Side: Stories & Account Status (Configure button removed) */}
        <div className="flex items-center gap-1.5">
          
          {/* Executive Story Cards Symbol Button */}
          {onOpenStoryCards && (
            <button
              type="button"
              onClick={onOpenStoryCards}
              className="p-2 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all flex items-center cursor-pointer shadow-2xs relative"
              title="Story Cards"
            >
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 animate-pulse" />
            </button>
          )}

          {/* Google Workspace / Account Button */}
          <button
            type="button"
            onClick={onOpenGoogleSettings}
            className={`p-2 rounded-2xl border transition-all flex items-center cursor-pointer shadow-2xs ${
              hasGoogleToken
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={hasGoogleToken ? `Account: ${googleUser?.email}` : 'Google Sync'}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </button>

        </div>

      </div>
    </header>
  );
};
