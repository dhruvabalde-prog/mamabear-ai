import React, { useState } from 'react';
import { 
  QrCode, RefreshCw, Smartphone, LogOut, CheckCircle2, AlertCircle, ChevronDown, ChevronUp
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
                status.status === 'connected' ? 'bg-emerald-500' : status.status === 'qr_ready' ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
              }`} />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {status.status === 'connected'
                ? `Active: ${status.phone || 'Linked'}`
                : status.status === 'qr_ready'
                ? 'Scan QR code below'
                : 'Baileys stream engine'}
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
          ) : status.status === 'qr_ready' && status.qrCode ? (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-center">
              <span className="text-xs font-extrabold text-slate-900">Scan with WhatsApp</span>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Open WhatsApp on phone → Linked Devices → Link a Device, and point your camera here.
              </p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img src={status.qrCode} alt="WhatsApp QR Code" className="w-44 h-44 object-contain" />
              </div>
              <button
                type="button"
                onClick={onConnect}
                className="p-2 text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh QR</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your WhatsApp via Baileys to ingest live message streams and generate proactive Story Cards.
              </p>

              <button
                type="button"
                onClick={onConnect}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Generate QR Code</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
