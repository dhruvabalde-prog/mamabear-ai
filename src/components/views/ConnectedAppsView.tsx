import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, ShieldCheck, ExternalLink, RefreshCw, 
  Mail, Calendar, FileText, CheckSquare, Sparkles, Phone, Camera, 
  Mic, Layers, Users, BookOpen, MapPin, Sheet, Presentation, FileCode
} from 'lucide-react';
import { ConnectedAppItem } from '../../types';
import { googleSignIn, logoutGoogle } from '../../services/firebaseAuth';
import { User } from 'firebase/auth';

interface ConnectedAppsViewProps {
  onBack: () => void;
  user: User | null;
  hasToken: boolean;
  onAuthSuccess: (user: User, token: string | null) => void;
  onAuthLogout: () => void;
}

const DEFAULT_CONNECTED_APPS: ConnectedAppItem[] = [
  // Google Workspace Tools
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'google_workspace',
    icon: 'Mail',
    description: 'Read and send official parent inquiry emails & franchise notifications.',
    enabled: true,
    requiredScope: 'https://www.googleapis.com/auth/gmail.send',
    status: 'connected'
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    category: 'google_workspace',
    icon: 'Calendar',
    description: 'Auto-schedule campus tours, contractor inspections, and founder meetings.',
    enabled: true,
    requiredScope: 'https://www.googleapis.com/auth/calendar',
    status: 'connected'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    category: 'google_workspace',
    icon: 'FileText',
    description: 'Archive inspection dossiers, fee invoices, and classroom learning binders.',
    enabled: true,
    requiredScope: 'https://www.googleapis.com/auth/drive.file',
    status: 'connected'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    category: 'google_workspace',
    icon: 'Sheet',
    description: 'Live cash-flow models, student fee trackers, and contractor billing ledgers.',
    enabled: false,
    requiredScope: 'https://www.googleapis.com/auth/spreadsheets',
    status: 'not_connected'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    category: 'google_workspace',
    icon: 'FileText',
    description: 'Generate teacher offer letters, child admission handbooks, and police NOCs.',
    enabled: false,
    requiredScope: 'https://www.googleapis.com/auth/documents',
    status: 'not_connected'
  },
  {
    id: 'slides',
    name: 'Google Slides',
    category: 'google_workspace',
    icon: 'Presentation',
    description: 'Present Canadian ECE curriculum decks for prospective parent orientation.',
    enabled: false,
    requiredScope: 'https://www.googleapis.com/auth/presentations',
    status: 'not_connected'
  },
  {
    id: 'tasks',
    name: 'Google Tasks',
    category: 'google_workspace',
    icon: 'CheckSquare',
    description: 'Sync daily 60-day launch roadmap checkboxes with your mobile device.',
    enabled: true,
    requiredScope: 'https://www.googleapis.com/auth/tasks',
    status: 'connected'
  },
  {
    id: 'keep',
    name: 'Google Keep Notes',
    category: 'google_workspace',
    icon: 'FileCode',
    description: 'Quick site observation notes, material codes, and vendor phone numbers.',
    enabled: false,
    status: 'not_connected'
  },
  {
    id: 'notebook',
    name: 'NotebookLM / Docs Notebook',
    category: 'google_workspace',
    icon: 'BookOpen',
    description: 'AI-grounded pedagogical inquiry research based on Canadian Maple Bear manuals.',
    enabled: false,
    status: 'not_connected'
  },
  {
    id: 'forms',
    name: 'Google Forms',
    category: 'google_workspace',
    icon: 'FileText',
    description: 'Collect digital admission queries, parent surveys, and staff feedback.',
    enabled: false,
    status: 'not_connected'
  },
  {
    id: 'maps',
    name: 'Google Maps',
    category: 'google_workspace',
    icon: 'MapPin',
    description: 'Subhash Nagar campus geolocation and optimal school van route navigation.',
    enabled: false,
    status: 'not_connected'
  },

  // Phone Hardware Access & System Permissions
  {
    id: 'phone_call',
    name: 'Phone Calling',
    category: 'device_hardware',
    icon: 'Phone',
    description: '1-tap native dialer trigger for follow-up calls to parent leads and suppliers.',
    enabled: true,
    status: 'permission_granted'
  },
  {
    id: 'draw_overlay',
    name: 'Draw Over Other Apps',
    category: 'device_hardware',
    icon: 'Layers',
    description: 'Display quick urgent Story Card heads-up alerts during active site visits.',
    enabled: false,
    status: 'disabled'
  },
  {
    id: 'camera',
    name: 'Camera Access',
    category: 'device_hardware',
    icon: 'Camera',
    description: 'Capture instant photos of Kota stone civil work, receipts, and material arrivals.',
    enabled: true,
    status: 'permission_granted'
  },
  {
    id: 'mic',
    name: 'Microphone Access',
    category: 'device_hardware',
    icon: 'Mic',
    description: 'Voice walkie-talkie pings, hands-free speech input, and audio note synthesis.',
    enabled: true,
    status: 'permission_granted'
  },
  {
    id: 'contacts',
    name: 'Contacts Access',
    category: 'device_hardware',
    icon: 'Users',
    description: 'Read and sync parent and Kota vendor phone numbers seamlessly.',
    enabled: false,
    status: 'disabled'
  }
];

export const ConnectedAppsView: React.FC<ConnectedAppsViewProps> = ({
  onBack,
  user,
  hasToken,
  onAuthSuccess,
  onAuthLogout
}) => {
  const [apps, setApps] = useState<ConnectedAppItem[]>(() => {
    try {
      const saved = localStorage.getItem('mb_connected_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CONNECTED_APPS;
  });

  const [connectingAppId, setConnectingAppId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mb_connected_apps', JSON.stringify(apps));
    } catch (e) {}
  }, [apps]);

  const handleToggle = async (appId: string) => {
    const target = apps.find(a => a.id === appId);
    if (!target) return;

    // If currently disabled and requires OAuth or browser permission
    if (!target.enabled) {
      if (target.category === 'google_workspace') {
        if (!hasToken) {
          setConnectingAppId(appId);
          try {
            const res = await googleSignIn();
            if (res) {
              onAuthSuccess(res.user, res.accessToken);
              setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: true, status: 'connected' } : a));
              setFeedbackMsg(`✓ Connected ${target.name} with Google OAuth`);
            }
          } catch (err: any) {
            setFeedbackMsg(`Failed to connect ${target.name}: ${err.message}`);
          } finally {
            setConnectingAppId(null);
          }
          return;
        } else {
          // Already have token, toggle on
          setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: true, status: 'connected' } : a));
          setFeedbackMsg(`✓ Enabled ${target.name}`);
        }
      } else if (target.category === 'device_hardware') {
        // Request browser permission if relevant
        if (target.id === 'mic' && navigator.mediaDevices) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: true, status: 'permission_granted' } : a));
            setFeedbackMsg(`✓ Microphone permission granted`);
            return;
          } catch (e) {}
        } else if (target.id === 'camera' && navigator.mediaDevices) {
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: true, status: 'permission_granted' } : a));
            setFeedbackMsg(`✓ Camera permission granted`);
            return;
          } catch (e) {}
        }
        setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: true, status: 'permission_granted' } : a));
        setFeedbackMsg(`✓ Enabled ${target.name} permission`);
      }
    } else {
      // Toggle off
      setApps(prev => prev.map(a => a.id === appId ? { ...a, enabled: false, status: 'disabled' } : a));
      setFeedbackMsg(`Disabled ${target.name}`);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail className="w-5 h-5 text-red-500" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'Sheet': return <Sheet className="w-5 h-5 text-emerald-500" />;
      case 'Presentation': return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5 text-blue-600" />;
      case 'FileCode': return <FileCode className="w-5 h-5 text-yellow-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-purple-500" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-red-600" />;
      case 'Phone': return <Phone className="w-5 h-5 text-emerald-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-600" />;
      case 'Camera': return <Camera className="w-5 h-5 text-slate-700" />;
      case 'Mic': return <Mic className="w-5 h-5 text-rose-500" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-600" />;
      default: return <Sparkles className="w-5 h-5 text-slate-500" />;
    }
  };

  const googleApps = apps.filter(a => a.category === 'google_workspace');
  const phoneApps = apps.filter(a => a.category === 'device_hardware');

  return (
    <div className="space-y-6 pb-28 max-w-2xl mx-auto px-2 sm:px-0">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Connected Apps
            </h1>
            <p className="text-xs text-slate-500">
              Toggle Workspace tools & phone capabilities on or off
            </p>
          </div>
        </div>

        {hasToken && (
          <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> OAuth Active
          </span>
        )}
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="text-emerald-700 hover:underline cursor-pointer">✕</button>
        </div>
      )}

      {/* 1. Google Workspace Suite */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Google Workspace Suite
          </h2>
          <span className="text-[10px] font-bold text-indigo-600">
            {googleApps.filter(a => a.enabled).length} of {googleApps.length} Enabled
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
          {googleApps.map((app) => (
            <div key={app.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {renderIcon(app.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {app.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {app.enabled ? 'Connected' : 'Off'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {app.description}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                disabled={connectingAppId === app.id}
                onClick={() => handleToggle(app.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  app.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    app.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Phone Access & Hardware Permissions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Phone Hardware & Permissions
          </h2>
          <span className="text-[10px] font-bold text-slate-600">
            {phoneApps.filter(a => a.enabled).length} of {phoneApps.length} Active
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
          {phoneApps.map((app) => (
            <div key={app.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {renderIcon(app.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {app.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {app.enabled ? 'Granted' : 'Off'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {app.description}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle(app.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  app.enabled ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    app.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
