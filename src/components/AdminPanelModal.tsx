import React, { useState } from 'react';
import { 
  ShieldCheck, X, Server, Database, Smartphone, 
  Trash2, RefreshCw, Key, Lock, CheckCircle2, AlertCircle, LogOut
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
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'dhruvabalde@gmail.com' && pin.trim() === '210996') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPin('');
    onClose();
  };

  const handleClearCache = () => {
    localStorage.clear();
    setActionNotice('Local browser cache cleared.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleFlushBaileys = async () => {
    if (onResetBaileys) {
      onResetBaileys();
    } else {
      await fetch('/api/baileys/disconnect', { method: 'POST' }).catch(() => {});
    }
    setActionNotice('WhatsApp session reset.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Admin</h2>
              <span className="text-[10px] text-slate-400 block font-mono">Operations Console</span>
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {!isAuthenticated ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">PIN</label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 font-mono tracking-widest"
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer mt-2"
              >
                Sign In
              </button>
            </form>
          ) : (
            /* Admin Operations Dashboard */
            <div className="space-y-4">
              {actionNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                  {actionNotice}
                </div>
              )}

              {/* Status Section */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Engine Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  WhatsApp: {baileysStatus?.status || 'disconnected'} • Phone: {baileysStatus?.phone || 'none'}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Quick Actions
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs cursor-pointer shadow-2xs"
                  >
                    <span className="font-extrabold text-slate-900 block">Clear Cache</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Flush localStorage</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFlushBaileys}
                    className="p-3 bg-white hover:bg-red-50 border border-red-200 rounded-2xl text-left text-xs cursor-pointer shadow-2xs"
                  >
                    <span className="font-extrabold text-red-700 block">Flush WhatsApp</span>
                    <span className="text-[10px] text-red-400 block mt-0.5">Reset connection</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">dhruvabalde@gmail.com</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
