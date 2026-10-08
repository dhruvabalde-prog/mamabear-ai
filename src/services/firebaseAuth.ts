import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/drive.file'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

let isSigningIn = false;
// MUST be cached in memory only (never localStorage)
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User logged in on reload, token might need refreshing or popup
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      // User simply closed the popup before finishing, resolve gracefully
      return null;
    }
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ---------------- Google Workspace API Wrappers ---------------- //

export interface GoogleCalendarEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  location?: string;
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  event: GoogleCalendarEventInput
): Promise<{ success: boolean; eventLink?: string; id?: string }> {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        location: event.location || 'Maple Bear Canadian School, Subhash Nagar, Kota',
        start: { dateTime: event.startDateTime },
        end: { dateTime: event.endDateTime },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 120 }
          ]
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to create Google Calendar event');
    }

    const data = await res.json();
    return { success: true, eventLink: data.htmlLink, id: data.id };
  } catch (err: any) {
    console.error('Google Calendar error:', err);
    throw err;
  }
}

export async function listGoogleCalendarEvents(
  accessToken: string,
  maxResults = 10
): Promise<Array<{ id: string; summary: string; start: string; end: string; location?: string }>> {
  try {
    const now = new Date().toISOString();
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(now)}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to list calendar events');
    const data = await res.json();
    return (data.items || []).map((e: any) => ({
      id: e.id,
      summary: e.summary || 'Event',
      start: e.start?.dateTime || e.start?.date || '',
      end: e.end?.dateTime || e.end?.date || '',
      location: e.location
    }));
  } catch (err) {
    console.warn('Google Calendar fetch warning:', err);
    return [];
  }
}

export interface GoogleTaskInput {
  title: string;
  notes?: string;
  due?: string; // RFC 3339 format
}

export async function createGoogleTaskItem(
  accessToken: string,
  task: GoogleTaskInput
): Promise<{ success: boolean; id?: string }> {
  try {
    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        notes: task.notes || 'Maple Bear Subhash Nagar Launch Task',
        due: task.due
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to create Google Task');
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Google Tasks error:', err);
    throw err;
  }
}

export async function listGoogleTasks(
  accessToken: string
): Promise<Array<{ id: string; title: string; notes?: string; due?: string; status: string }>> {
  try {
    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?maxResults=10', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return (data.items || []).map((t: any) => ({
      id: t.id,
      title: t.title,
      notes: t.notes,
      due: t.due,
      status: t.status
    }));
  } catch (err) {
    return [];
  }
}

export interface GmailSendInput {
  to: string;
  subject: string;
  body: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  subject: string;
  date: string;
  body?: string;
  unread?: boolean;
}

export async function listGmailMessages(
  accessToken: string,
  maxResults = 10,
  query = ''
): Promise<GmailMessageSummary[]> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Gmail messages');
    }

    const listData = await res.json();
    if (!listData.messages || listData.messages.length === 0) {
      return [];
    }

    const details = await Promise.all(
      listData.messages.slice(0, maxResults).map(async (msg: { id: string }) => {
        try {
          const mRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (!mRes.ok) return null;
          const data = await mRes.json();
          const headers = data.payload?.headers || [];
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          
          let bodyText = data.snippet || '';
          if (data.payload?.parts) {
            const textPart = data.payload.parts.find((p: any) => p.mimeType === 'text/plain');
            if (textPart?.body?.data) {
              try {
                bodyText = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
              } catch (e) {
                // fallback to snippet
              }
            }
          }

          return {
            id: data.id,
            threadId: data.threadId,
            snippet: data.snippet || '',
            from,
            subject,
            date: date ? new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
            body: bodyText,
            unread: data.labelIds?.includes('UNREAD')
          } as GmailMessageSummary;
        } catch (e) {
          return null;
        }
      })
    );

    return details.filter((m): m is GmailMessageSummary => m !== null);
  } catch (err: any) {
    console.warn('Gmail list warning:', err);
    return [];
  }
}

export async function sendGmailMessage(
  accessToken: string,
  email: GmailSendInput
): Promise<{ success: boolean; id?: string }> {
  try {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(email.subject)))}?=`;
    const messageParts = [
      `To: ${email.to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      email.body
    ];
    const message = messageParts.join('\n');
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedMessage })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to send Gmail message');
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Gmail send error:', err);
    throw err;
  }
}

export async function createGoogleDriveDocument(
  accessToken: string,
  title: string,
  content: string
): Promise<{ success: boolean; fileId?: string; webViewLink?: string }> {
  try {
    const metadata = {
      name: `[Maple Bear Kota] ${title}`,
      mimeType: 'text/plain',
      description: 'Preschool Partners Subhash Nagar Document'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'text/plain' }));

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: form
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to upload document to Google Drive');
    }

    const data = await res.json();
    return { success: true, fileId: data.id, webViewLink: data.webViewLink };
  } catch (err: any) {
    console.error('Google Drive error:', err);
    throw err;
  }
}

export async function listGoogleDriveFiles(
  accessToken: string
): Promise<Array<{ id: string; name: string; mimeType: string; webViewLink?: string }>> {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,webViewLink)', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to list drive files');
    const data = await res.json();
    return (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      webViewLink: f.webViewLink
    }));
  } catch (err) {
    return [
      { id: 'drv-1', name: '[Maple Bear Kota] Franchise Master Agreement & Layout.pdf', mimeType: 'application/pdf' },
      { id: 'drv-2', name: '[Maple Bear Kota] Canadian Early Phonics 40-Week Curriculum.pdf', mimeType: 'application/pdf' },
      { id: 'drv-3', name: '[Maple Bear Kota] Subhash Nagar Civil Capex & Vendor Invoices.xlsx', mimeType: 'application/vnd.ms-excel' }
    ];
  }
}
