import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckSquare, Mail, FileText, CheckCircle2, 
  AlertCircle, ShieldCheck, LogOut, Sparkles, RefreshCw, Send,
  Inbox, Plus, ChevronRight, User as UserIcon, Clock, ExternalLink, X,
  Users, Key, Lock, Check
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  createGoogleCalendarEvent, 
  listGoogleCalendarEvents,
  createGoogleTaskItem, 
  listGoogleTasks,
  sendGmailMessage, 
  listGmailMessages,
  createGoogleDriveDocument,
  listGoogleDriveFiles,
  GmailMessageSummary 
} from '../../services/firebaseAuth';
import { ConfirmationModal } from '../ConfirmationModal';
import { BaileysConnect } from '../BaileysConnect';
import { AdminPanelModal } from '../AdminPanelModal';
import { BaileysConnectionStatus } from '../../types';

interface GoogleSettingsViewProps {
  user: User | null;
  hasToken: boolean;
  onAuthSuccess: (user: User, token: string | null) => void;
  onAuthLogout: () => void;
  onClose?: () => void;
  baileysStatus?: BaileysConnectionStatus;
  onConnectBaileys?: () => void;
  onDisconnectBaileys?: () => void;
  onOpenConnectedApps?: () => void;
}

export const GoogleSettingsView: React.FC<GoogleSettingsViewProps> = ({
  user,
  hasToken,
  onAuthSuccess,
  onAuthLogout,
  onClose,
  baileysStatus = { status: 'disconnected' },
  onConnectBaileys = () => {},
  onDisconnectBaileys = () => {},
  onOpenConnectedApps
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [testSuccessMsg, setTestSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gmail' | 'calendar' | 'tasks' | 'drive'>('gmail');
  
  // Custom Gmail input field
  const [gmailInput, setGmailInput] = useState<string>(user?.email || '');
  
  // Additional Work & Team Accounts
  const [workEmails, setWorkEmails] = useState<{ email: string; role: string; status: string }[]>(() => {
    return user?.email ? [
      { email: user.email, role: 'Primary Founder', status: 'Connected' }
    ] : [];
  });
  const [newWorkEmail, setNewWorkEmail] = useState('');
  const [showAddWorkEmail, setShowAddWorkEmail] = useState(false);

  // Partner & Family Integrations
  const [familyIntegrations, setFamilyIntegrations] = useState<{ name: string; role: string; email: string; connected: boolean }[]>([]);

  // Admin panel state (secured modal with dhruvabalde@gmail.com 210996)
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Gmail Inbox state
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingGmail, setIsLoadingGmail] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Calendar & Tasks state
  const [calendarEvents, setCalendarEvents] = useState<Array<{ id: string; summary: string; start: string; end: string }>>([]);
  const [tasksList, setTasksList] = useState<Array<{ id: string; title: string; status: string }>>([]);
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string; mimeType: string }>>([]);

  const loadWorkspaceData = async () => {
    setIsLoadingGmail(true);
    try {
      const messages = await listGmailMessages('active_token', 10);
      setGmailMessages(messages);
      const events = await listGoogleCalendarEvents('active_token');
      setCalendarEvents(events);
      const tasks = await listGoogleTasks('active_token');
      setTasksList(tasks);
      const files = await listGoogleDriveFiles('active_token');
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error loading workspace data:', err);
    } finally {
      setIsLoadingGmail(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [hasToken]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onAuthSuccess(result.user, result.accessToken);
        setTestSuccessMsg('Connected Google OAuth successfully!');
        loadWorkspaceData();
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && !err?.message?.includes('popup-closed-by-user')) {
        setErrorMsg(err.message || 'Google Sign-in failed. Please check popup permissions.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAddWorkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkEmail.trim()) return;
    setWorkEmails(prev => [
      ...prev,
      { email: newWorkEmail.trim(), role: 'Work / Partner Account', status: 'Auto-Shared' }
    ]);
    setNewWorkEmail('');
    setShowAddWorkEmail(false);
    setTestSuccessMsg(`Added ${newWorkEmail.trim()} with automatic access sharing.`);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      setErrorMsg('Please fill in all email fields.');
      return;
    }
    setIsSendingEmail(true);
    setErrorMsg(null);
    try {
      await sendGmailMessage('active_token', {
        to: composeTo,
        subject: composeSubject,
        body: composeBody
      });
      setTestSuccessMsg(`✓ Email sent via Gmail to ${composeTo}!`);
      setIsComposing(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      
      {/* Header with Close Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Google Workspace & Gmail Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Gmail, Google Chat, Calendar, and multi-user OAuth integrations.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1. Gmail ID & OAuth Connect Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
                Primary Gmail Account
              </h2>
              <p className="text-xs text-slate-500">
                {hasToken && user ? `Authenticated as ${user.email}` : 'Enter your Gmail ID and connect OAuth.'}
              </p>
            </div>
          </div>

          {!hasToken ? (
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleSignIn}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs shrink-0"
            >
              <span>{isSigningIn ? 'Connecting...' : 'Connect OAuth'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => {
                await logoutGoogle();
                onAuthLogout();
              }}
              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 text-xs font-bold cursor-pointer shrink-0"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Immediate OAuth Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">OAuth Authentication Notice</span>
              <p className="text-[11px] leading-relaxed text-red-700">{errorMsg}</p>
              {errorMsg.includes('unauthorized_client') || errorMsg.includes('authorized domain') ? (
                <p className="text-[10px] text-red-600 font-mono mt-1">
                  Add this Vercel domain to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains.
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* WhatsApp & Phone Permissions Card inside Settings */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">
              WhatsApp Link & Phone Permissions
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              baileysStatus?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {baileysStatus?.status === 'connected' ? 'Linked & Monitoring' : 'Setup Required'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Link your phone to ingest live messages and synthesize executive Story Cards without manual copy-pasting.
          </p>

          <BaileysConnect
            status={baileysStatus}
            onConnect={onConnectBaileys}
            onDisconnect={onDisconnectBaileys}
          />
        </div>

        {/* Connected Apps & System Permissions Full-Page Portal Link */}
        {onOpenConnectedApps && (
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenConnectedApps}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between hover:opacity-95 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    Connected Apps & System Permissions
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Toggle Sheets, Docs, Slides, Forms, Maps, Calls, Camera & Mic
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Work / Co-founder Accounts & Auto-Access */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700">
              Work Accounts (Automatic Shared Access)
            </span>
            <button
              type="button"
              onClick={() => setShowAddWorkEmail(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Work Email</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {workEmails.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{item.email}</span>
                  <span className="text-slate-400 text-[11px] ml-2 font-medium">({item.role})</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {showAddWorkEmail && (
            <form onSubmit={handleAddWorkEmail} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                required
                value={newWorkEmail}
                onChange={(e) => setNewWorkEmail(e.target.value)}
                placeholder="co-founder@maplebear-kota.in"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Add & Share
              </button>
              <button
                type="button"
                onClick={() => setShowAddWorkEmail(false)}
                className="px-2 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* 2. Husbands & Family Collaboration (4-Way Group Chat) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700">
              Husbands & Family 4-Way Collaboration (Google Chat)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              4-Way Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {familyIntegrations.map((f, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{f.name}</div>
                  <div className="text-[11px] text-slate-500">{f.role} • {f.email}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {testSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{testSuccessMsg}</span>
        </div>
      )}

      {/* 3. Live Inbox & Workspace Tabs */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'gmail' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Gmail Inbox ({gmailMessages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Calendar Tours ({calendarEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Google Tasks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'drive' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Drive Archive
          </button>
        </div>

        {/* Gmail List */}
        {activeTab === 'gmail' && (
          <div className="space-y-2">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {gmailMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-0.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate">{msg.from}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                  </div>
                  <div className="font-semibold text-xs text-slate-800 truncate">{msg.subject}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{msg.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {calendarEvents.map((evt) => (
              <div key={evt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-blue-700">{new Date(evt.start).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <h4 className="font-bold text-slate-900">{evt.summary}</h4>
              </div>
            ))}
          </div>
        )}

        {/* Tasks View */}
        {activeTab === 'tasks' && (
          <div className="space-y-1.5">
            {tasksList.map((t) => (
              <div key={t.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{t.title}</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px]">{t.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Drive View */}
        {activeTab === 'drive' && (
          <div className="space-y-1.5">
            {driveFiles.map((f) => (
              <div key={f.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{f.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{f.mimeType.split('/').pop()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SECURE ADMIN PANEL BUTTON AT BOTTOM */}
      <div className="pt-4 flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setShowAdminModal(true)}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer py-1 flex items-center gap-1"
        >
          <span>Admin Console</span>
        </button>
      </div>

      {/* Secure Admin Console Modal */}
      <AdminPanelModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        baileysStatus={baileysStatus}
        onResetBaileys={onDisconnectBaileys}
      />

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {selectedMessage.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  From: {selectedMessage.from} • {selectedMessage.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
              {selectedMessage.body || selectedMessage.snippet}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
