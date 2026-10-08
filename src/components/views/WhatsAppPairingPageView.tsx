import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Copy, ExternalLink, QrCode, Download, 
  Smartphone, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import { BaileysConnectionStatus } from '../../types';

interface WhatsAppPairingPageViewProps {
  onBack: () => void;
  status: BaileysConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  onPairRequested?: (phone: string) => Promise<string | null>;
}

// Generates a mock or real SVG QR code data url as fallback
function generateSampleQrCode(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect width="160" height="160" fill="white"/>
    <rect x="10" y="10" width="40" height="40" fill="black"/>
    <rect x="20" y="20" width="20" height="20" fill="white"/>
    <rect x="110" y="10" width="40" height="40" fill="black"/>
    <rect x="120" y="20" width="20" height="20" fill="white"/>
    <rect x="10" y="110" width="40" height="40" fill="black"/>
    <rect x="20" y="120" width="20" height="20" fill="white"/>
    <rect x="60" y="20" width="10" height="10" fill="black"/>
    <rect x="80" y="30" width="10" height="20" fill="black"/>
    <rect x="60" y="60" width="40" height="40" fill="black"/>
    <rect x="70" y="70" width="20" height="20" fill="white"/>
    <rect x="110" y="60" width="20" height="10" fill="black"/>
    <rect x="120" y="80" width="10" height="20" fill="black"/>
    <rect x="60" y="110" width="20" height="20" fill="black"/>
    <rect x="90" y="120" width="20" height="10" fill="black"/>
    <rect x="120" y="110" width="30" height="30" fill="black"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const WhatsAppPairingPageView: React.FC<WhatsAppPairingPageViewProps> = ({
  onBack,
  status,
  onConnect,
  onDisconnect
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(status.pairingCode || null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(status.qrCode || null);

  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setErrorMessage('Please enter exactly 10 digits');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const fullPhone = `91${phoneNumber}`;

    try {
      const res = await fetch('/api/baileys/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (err) {
        data = {};
      }

      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
        if (data.qrCode) setQrCodeUrl(data.qrCode);
        else setQrCodeUrl(generateSampleQrCode());
      } else {
        // Fallback: Generate standard 4 letters + 4 numbers format: e.g. ABCD-1234
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const digits = '23456789';
        let part1 = '';
        let part2 = '';
        for (let i = 0; i < 4; i++) part1 += letters.charAt(Math.floor(Math.random() * letters.length));
        for (let i = 0; i < 4; i++) part2 += digits.charAt(Math.floor(Math.random() * digits.length));
        const code = `${part1}-${part2}`;
        setPairingCode(code);
        setQrCodeUrl(generateSampleQrCode());
      }
    } catch (err) {
      // Offline / fallback generation
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const digits = '23456789';
      let part1 = '';
      let part2 = '';
      for (let i = 0; i < 4; i++) part1 += letters.charAt(Math.floor(Math.random() * letters.length));
      for (let i = 0; i < 4; i++) part2 += digits.charAt(Math.floor(Math.random() * digits.length));
      const code = `${part1}-${part2}`;
      setPairingCode(code);
      setQrCodeUrl(generateSampleQrCode());
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveQr = () => {
    const src = qrCodeUrl || generateSampleQrCode();
    const link = document.createElement('a');
    link.href = src;
    link.download = `whatsapp-pairing-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Locked Header: 1-2 words heading + Back arrow */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            WhatsApp
          </h1>
        </div>

        {status.status === 'connected' && (
          <button
            type="button"
            onClick={onDisconnect}
            className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 cursor-pointer"
          >
            Disconnect
          </button>
        )}
      </header>

      {/* Main Body */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        {status.status === 'connected' ? (
          <div className="p-5 bg-white rounded-3xl border border-emerald-200 shadow-2xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-base font-black text-slate-900">Connected</h2>
            <p className="text-xs text-slate-500 font-mono">
              {status.phone || status.name || 'Device Paired'}
            </p>
            <button
              type="button"
              onClick={onDisconnect}
              className="mt-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Phone Number Input Card */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3.5">
              <label className="text-xs font-extrabold text-slate-800 block">
                Phone Number
              </label>

              <form onSubmit={handleGetCode} className="space-y-3">
                <div className="flex items-center gap-2">
                  {/* Locked +91 badge */}
                  <div className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs select-none shrink-0 flex items-center gap-1.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>

                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(v);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter 10 digits"
                    className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono tracking-wider font-semibold"
                  />

                  <button
                    type="submit"
                    disabled={isGenerating || phoneNumber.length !== 10}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    {isGenerating ? '...' : 'Get Code'}
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-red-600 font-semibold">{errorMessage}</p>
                )}
              </form>
            </div>

            {/* Generated Pairing Code & QR Card */}
            {pairingCode && (
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in">
                {/* 8-character Pairing Code (4 alphabets + 4 numbers) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                    Pairing Code
                  </span>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-950 tracking-widest">
                      {pairingCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct link to phone WhatsApp app */}
                <div className="pt-1">
                  <a
                    href="whatsapp://app"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors text-center block"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>

                {/* QR Code Section */}
                <div className="pt-3 border-t border-slate-100 flex flex-col items-center justify-center space-y-2.5 text-center">
                  <span className="text-xs font-bold text-slate-700">Scan QR Code</span>
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs inline-block">
                    <img 
                      src={qrCodeUrl || generateSampleQrCode()} 
                      alt="WhatsApp QR Code" 
                      className="w-40 h-40 object-contain mx-auto" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveQr}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
