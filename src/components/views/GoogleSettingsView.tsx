import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Smartphone, Mail, Plus, Trash2, ArrowRight
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle } from '../../services/firebaseAuth';
import { BaileysConnectionStatus } from '../../types';

interface GoogleSettingsViewProps {
  user: User | null;
  hasToken: boolean;
  onAuthSuccess: (user: User, token: string | null) => void;
  onAuthLogout: () => void;
  onClose?: () => void;
  baileysStatus?: BaileysConnectionStatus;
  onOpenWhatsAppPairing?: () => void;
  onOpenAdmin?: () => void;
}

export const GoogleSettingsView: React.FC<GoogleSettingsViewProps> = ({
  user,
  hasToken,
  onAuthSuccess,
  onAuthLogout,
  onClose,
  baileysStatus = { status: 'disconnected' },
  onOpenWhatsAppPairing,
  onOpenAdmin
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Work Email state with persistent localStorage
  const [workEmail, setWorkEmail] = useState<string>(() => {
    return localStorage.getItem('mb_work_email') || '';
  });
  const [isWorkEmailConnected, setIsWorkEmailConnected] = useState<boolean>(() => {
    return localStorage.getItem('mb_work_email_connected') === 'true';
  });
  const [workInput, setWorkInput] = useState<string>('');

  const handleConnectGmail = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onAuthSuccess(result.user, result.accessToken);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && !err?.message?.includes('popup-closed-by-user')) {
        setErrorMsg(err.message || 'Google Sign-in failed. Please check popup permissions.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDisconnectGmail = async () => {
    await logoutGoogle();
    onAuthLogout();
  };

  const handleConnectWorkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workInput.trim()) return;
    setWorkEmail(workInput.trim());
    setIsWorkEmailConnected(true);
    localStorage.setItem('mb_work_email', workInput.trim());
    localStorage.setItem('mb_work_email_connected', 'true');
    setWorkInput('');
  };

  const handleDisconnectWorkEmail = () => {
    setIsWorkEmailConnected(false);
    localStorage.removeItem('mb_work_email_connected');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header: Locked 1-2 words heading with X button */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <h1 className="text-lg font-black tracking-tight text-slate-900">
          Accounts
        </h1>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* 1. Gmail Card */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900">Gmail</h2>
                <p className="text-[11px] text-slate-500 truncate">
                  {hasToken && user?.email ? user.email : 'Not connected'}
                </p>
              </div>
            </div>

            {hasToken ? (
              <button
                type="button"
                onClick={handleDisconnectGmail}
                className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 cursor-pointer shrink-0"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                disabled={isSigningIn}
                onClick={handleConnectGmail}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                {isSigningIn ? '...' : 'Connect'}
              </button>
            )}
          </div>
        </div>

        {/* 2. Work Email Card */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900">Work Email</h2>
                <p className="text-[11px] text-slate-500 truncate">
                  {isWorkEmailConnected && workEmail ? workEmail : 'Not connected'}
                </p>
              </div>
            </div>

            {isWorkEmailConnected ? (
              <button
                type="button"
                onClick={handleDisconnectWorkEmail}
                className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 cursor-pointer shrink-0"
              >
                Disconnect
              </button>
            ) : null}
          </div>

          {!isWorkEmailConnected && (
            <form onSubmit={handleConnectWorkEmail} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                required
                value={workInput}
                onChange={(e) => setWorkInput(e.target.value)}
                placeholder="name@school.com"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                Connect
              </button>
            </form>
          )}
        </div>

        {/* 3. WhatsApp Card */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900">WhatsApp</h2>
                <p className="text-[11px] text-slate-500 truncate">
                  {baileysStatus.status === 'connected' ? (baileysStatus.phone || 'Linked') : 'Not connected'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWhatsAppPairing}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 ${
                baileysStatus.status === 'connected'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {baileysStatus.status === 'connected' ? 'Manage' : 'Connect'}
            </button>
          </div>
        </div>

        {/* Admin Console Button at the bottom */}
        {onOpenAdmin && (
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 py-2 cursor-pointer transition-colors"
            >
              Admin Console
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
