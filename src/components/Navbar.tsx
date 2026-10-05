import React from 'react';
import { 
  MapPin, Mail, Settings, User as UserIcon, LogOut
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  googleUser: User | null;
  hasGoogleToken: boolean;
  isSupabaseConnected?: boolean;
  onOpenGoogleSettings: () => void;
  onAuthSuccess: (user: User, token: string | null) => void;
  onAuthLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  googleUser,
  hasGoogleToken,
  isSupabaseConnected,
  onOpenGoogleSettings,
  onAuthSuccess,
  onAuthLogout
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand & Campus (No '15L Signed' tag) */}
        <button 
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-xs font-black text-base shrink-0">
            🍁
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors block leading-tight">
              Maple Bear Kota
            </span>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span>Subhash Nagar</span>
            </p>
          </div>
        </button>

        {/* Right Side: Supabase & Gmail Auth Status */}
        <div className="flex items-center gap-2">
          
          {/* Supabase Status Pill */}
          <div 
            className={`px-2.5 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs ${
              isSupabaseConnected 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            title={isSupabaseConnected ? 'Connected to Supabase PostgreSQL (Subhash Nagar, Kota dataset active)' : 'Connecting to Supabase...'}
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="hidden sm:inline">Supabase</span>
          </div>

          {/* Gmail / Google Workspace Auth Button */}
          <button
            type="button"
            onClick={onOpenGoogleSettings}
            className={`p-2 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              hasGoogleToken
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
            title={hasGoogleToken ? `Connected as ${googleUser?.email}` : 'Connect Gmail & Google Workspace'}
          >
            {/* Google / Gmail Multi-color Emblem */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="text-xs font-bold hidden sm:inline">
              {hasGoogleToken ? (googleUser?.email?.split('@')[0] || 'Synced') : 'Gmail'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
