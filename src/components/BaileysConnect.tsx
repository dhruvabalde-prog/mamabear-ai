import React, { useState } from 'react';
import { 
  QrCode, RefreshCw, Smartphone, LogOut, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Copy, Check, ExternalLink, Key
} from 'lucide-react';
import { BaileysConnectionStatus } from '../../types';

interface BaileysConnectProps {
  status: BaileysConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const BaileysConnect: React.FC<BaileysConnectProps> = ({
  status,
  onConnect,
  onDisconnect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPairing, setIsPairing] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(status.pairingCode || null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairError, setPairError] = useState<string | null>(null);

  const handleRequestPairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsPairing(true);
    setPairError(null);
    try {
      const res = await fetch('/api/baileys/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber.trim() })
      });
      const data = await res.json();
      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
      } else if (data.error) {
        setPairError(data.error);
      }
    } catch (err: any) {
      setPairError(err.message || 'Failed to generate pairing code');
    } finally {
      setIsPairing(false);
    }
  };

  const handleCopyCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
      
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xs ${
            status.status === 'connected' ? 'bg-emerald-600' : 'bg-slate-800'
          }`}>
            <Smartphone className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-slate-900">WhatsApp Link</span>
              <span className={`w-2 h-2 rounded-full ${
                status.status === 'connected' ? 'bg-emerald-500' : (status.status === 'qr_ready' || pairingCode) ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
              }`} />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {status.status === 'connected'
                ? `Active: ${status.phone || 'Linked'}`
                : pairingCode
                ? `Pairing Code: ${pairingCode}`
                : status.status === 'qr_ready'
                ? 'Scan QR or enter 8-digit code'
                : 'Link with 8-digit phone code'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expandable Link Panel */}
      {isOpen && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3.5">
          {status.status === 'connected' ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Linked: {status.phone || status.name}</span>
                </div>

                <button
                  type="button"
                  onClick={onDisconnect}
                  className="p-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                  title="Disconnect"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Inbound & outbound WhatsApp events are being monitored for social and operational friction cards.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 8-Digit Phone Pairing Form */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Link with 8-Digit Code</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter your WhatsApp phone number to generate your 8-digit link code.
                </p>

                <form onSubmit={handleRequestPairing} className="space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 919876543210"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isPairing || !phoneNumber.trim()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      {isPairing ? 'Generating...' : 'Get Code'}
                    </button>
                  </div>

                  {pairError && (
                    <p className="text-[11px] text-red-600 font-semibold">{pairError}</p>
                  )}
                </form>

                {pairingCode && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Your 8-Digit Pairing Code:</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl sm:text-2xl font-black font-mono text-emerald-900 tracking-widest">
                        {pairingCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-emerald-800 leading-normal pt-1">
                      1. Open WhatsApp on phone → <strong>Settings / Linked Devices</strong> → <strong>Link with phone number instead</strong>.<br />
                      2. Paste or type this 8-digit code to complete link.
                    </p>

                    <a
                      href="https://web.whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline pt-1"
                    >
                      <span>Open WhatsApp Web / Devices Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* QR Code Alternative */}
              {status.status === 'qr_ready' && status.qrCode ? (
                <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-800">Or Scan QR Code</span>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <img src={status.qrCode} alt="WhatsApp QR Code" className="w-36 h-36 object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={onConnect}
                    className="p-1 text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh QR</span>
                  </button>
                </div>
              ) : (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={onConnect}
                    className="text-xs text-slate-600 font-bold hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Use QR Code Instead</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
