import React, { useState } from 'react';
import { 
  Lock, Key, ShieldCheck, Database, Smartphone, Check, X, Server, RefreshCw, AlertCircle, LogOut
} from 'lucide-react';
import { BaileysConnectionStatus } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  baileysStatus?: BaileysConnectionStatus;
  onResetBaileys?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  baileysStatus,
  onResetBaileys
}) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'dhruvabalde@gmail.com' && pin.trim() === '210996') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPin('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Admin Console</h2>
              <span className="text-[10px] text-slate-400 block font-mono">Restricted Access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <form onSubmit={handleLogin} className="space-y-3.5 py-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter authorized administrator credentials to unlock system operations.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Security PIN</label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 font-mono tracking-widest"
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer shadow-xs mt-2"
            >
              Verify & Enter
            </button>
          </form>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-4 py-1 animate-in fade-in">
            {/* System Status Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>Engine & Baileys Session</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  baileysStatus?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {baileysStatus?.status || 'disconnected'}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                <div>Active Phone: {baileysStatus?.phone || 'None'}</div>
                <div>Session Name: {baileysStatus?.name || 'Default Session'}</div>
              </div>
            </div>

            {/* Quick System Actions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Administrative Controls
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('mb_setup_config');
                    alert('Setup config cache cleared from local browser.');
                  }}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="font-extrabold text-slate-800 block">Clear Cache</span>
                  <span className="text-[10px] text-slate-400 block">Reset local storage config</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (onResetBaileys) {
                      onResetBaileys();
                    } else {
                      await fetch('/api/baileys/disconnect', { method: 'POST' }).catch(() => {});
                    }
                    alert('WhatsApp session flushed.');
                  }}
                  className="p-3 bg-white hover:bg-red-50 border border-red-200 rounded-2xl text-left text-xs space-y-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="font-extrabold text-red-700 block">Flush Session</span>
                  <span className="text-[10px] text-red-400 block">Disconnect Baileys socket</span>
                </button>
              </div>
            </div>

            {/* Exit / Sign Out */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Session: dhruvabalde@gmail.com</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
