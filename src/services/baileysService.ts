import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_DIR = path.join(__dirname, '../.baileys_auth');

export interface LiveMessageEvent {
  id: string;
  chatId: string;
  senderName: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

export interface StoryCardPayload {
  card_id: string;
  chat_id: string;
  contact_name: string;
  category: 'UNANSWERED_PING' | 'FOLLOW_UP_NEEDED' | 'TASK_COMMITMENT' | 'PLANNING' | 'REMINDER' | 'URGENT_TRIAGE';
  urgency: 'critical' | 'medium' | 'low';
  headline: string;
  context_summary: string;
  ai_proposal: string;
  pre_drafted_action: {
    action_type: 'SEND_WHATSAPP_REPLY' | 'CREATE_CALENDAR_EVENT' | 'SET_REMINDER' | 'DISMISS';
    reply_text: string | null;
    action_payload: Record<string, any>;
  };
  suggested_background_theme: 'dark-crimson' | 'deep-blue' | 'emerald' | 'amber' | 'charcoal';
}

class BaileysManager {
  private sock: WASocket | null = null;
  private status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected' = 'disconnected';
  private qrCodeDataUrl: string | null = null;
  private connectedPhone: string | null = null;
  private connectedName: string | null = null;
  private rawMessages: LiveMessageEvent[] = [];
  private storyCards: StoryCardPayload[] = [];
  private isSynthesizing = false;

  constructor() {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
  }

  public getStatus() {
    return {
      status: this.status,
      qrCode: this.qrCodeDataUrl,
      phone: this.connectedPhone,
      name: this.connectedName,
      messageCount: this.rawMessages.length,
      cardCount: this.storyCards.length
    };
  }

  public getStoryCards(): StoryCardPayload[] {
    return this.storyCards;
  }

  public getRawMessages(): LiveMessageEvent[] {
    return this.rawMessages.slice(-50);
  }

  public async connect(): Promise<void> {
    if (this.sock && (this.status === 'connected' || this.status === 'connecting')) {
      return;
    }

    this.status = 'connecting';
    this.qrCodeDataUrl = null;

    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr);
            this.status = 'qr_ready';
          } catch (qrErr) {
            console.error('Error generating QR code data URL', qrErr);
          }
        }

        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          this.status = 'disconnected';
          this.qrCodeDataUrl = null;
          this.connectedPhone = null;
          this.connectedName = null;
          this.sock = null;

          if (shouldReconnect) {
            setTimeout(() => this.connect(), 5000);
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          this.qrCodeDataUrl = null;
          this.connectedPhone = this.sock?.user?.id?.split(':')[0] || 'Connected User';
          this.connectedName = this.sock?.user?.name || 'WhatsApp Session';
          console.log('Baileys WhatsApp connected successfully as:', this.connectedPhone);
        }
      });

      this.sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages || m.messages.length === 0) return;

        for (const msg of m.messages) {
          if (!msg.message) continue;

          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            '';

          if (!text.trim()) continue;

          const fromMe = Boolean(msg.key.fromMe);
          const chatId = msg.key.remoteJid || 'unknown';
          const senderName = msg.pushName || chatId.split('@')[0] || 'Contact';
          const timestamp = Number(msg.messageTimestamp || Math.floor(Date.now() / 1000)) * 1000;

          const event: LiveMessageEvent = {
            id: msg.key.id || `msg-${Date.now()}`,
            chatId,
            senderName,
            text,
            fromMe,
            timestamp
          };

          this.rawMessages.push(event);
          if (this.rawMessages.length > 200) {
            this.rawMessages.shift();
          }

          // Trigger stream synthesis into executive Story Cards
          this.synthesizeStreamIntoStoryCard(event);
        }
      });
    } catch (err) {
      console.error('Baileys connection failure:', err);
      this.status = 'disconnected';
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout();
      }
    } catch (e) {
      // ignore
    } finally {
      this.sock = null;
      this.status = 'disconnected';
      this.qrCodeDataUrl = null;
      this.connectedPhone = null;
      this.connectedName = null;
      try {
        if (fs.existsSync(AUTH_DIR)) {
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
        }
      } catch (e) {}
    }
  }

  public async sendReply(chatId: string, text: string): Promise<boolean> {
    if (!this.sock || this.status !== 'connected') {
      console.warn('Cannot send WhatsApp message: Baileys socket is not connected');
      return false;
    }

    try {
      await this.sock.sendMessage(chatId, { text });
      return true;
    } catch (err) {
      console.error('Failed to send WhatsApp message via Baileys:', err);
      return false;
    }
  }

  public dismissCard(cardId: string): void {
    this.storyCards = this.storyCards.filter((c) => c.card_id !== cardId);
  }

  public addStoryCard(card: StoryCardPayload): void {
    this.storyCards.unshift(card);
    if (this.storyCards.length > 30) {
      this.storyCards.pop();
    }
  }

  /**
   * Proactive pattern detection engine across the 6 archetypes:
   * 1. GHOSTING & UNREPLIED PINGS
   * 2. AWAITING EXTERNAL RESPONSE
   * 3. COMMITMENTS & ACTIONS REQUIRED
   * 4. PLANNING & COORDINATION
   * 5. REMINDERS & DEADLINES
   * 6. CRISIS / URGENCY TRIAGE
   */
  private synthesizeStreamIntoStoryCard(event: LiveMessageEvent) {
    const lower = event.text.toLowerCase();

    // 1. GHOSTING / UNREPLIED PING or Inbound Inquiry
    if (!event.fromMe && (lower.includes('?') || lower.includes('when') || lower.includes('did you') || lower.includes('update') || lower.includes('please confirm'))) {
      const card: StoryCardPayload = {
        card_id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        chat_id: event.chatId,
        contact_name: event.senderName,
        category: 'UNANSWERED_PING',
        urgency: lower.includes('urgent') || lower.includes('asap') ? 'critical' : 'medium',
        headline: `Unanswered question from ${event.senderName}`,
        context_summary: `${event.senderName} asked: "${event.text.slice(0, 90)}"`,
        ai_proposal: `I can send an acknowledgement confirming you are on it and will follow up shortly.\nThis protects professional responsiveness while giving you focused time.`,
        pre_drafted_action: {
          action_type: 'SEND_WHATSAPP_REPLY',
          reply_text: `Hi ${event.senderName}, received! Reviewing this right now and will update you shortly.`,
          action_payload: { target_jid: event.chatId }
        },
        suggested_background_theme: lower.includes('urgent') ? 'dark-crimson' : 'amber'
      };
      this.addStoryCard(card);
      return;
    }

    // 2. PLANNING & COORDINATION
    if (lower.includes('meet') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('schedule') || lower.includes('call at') || lower.includes('time works')) {
      const card: StoryCardPayload = {
        card_id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        chat_id: event.chatId,
        contact_name: event.senderName,
        category: 'PLANNING',
        urgency: 'medium',
        headline: `Coordination alignment with ${event.senderName}`,
        context_summary: `Coordination discussion regarding schedule or venue in chat with ${event.senderName}.`,
        ai_proposal: `I can lock in the slot and send a concise calendar confirmation.\nThis prevents scheduling friction before availability fills up.`,
        pre_drafted_action: {
          action_type: 'SEND_WHATSAPP_REPLY',
          reply_text: `Let's lock that in. I've noted the time on my calendar—looking forward to connecting.`,
          action_payload: { target_jid: event.chatId }
        },
        suggested_background_theme: 'deep-blue'
      };
      this.addStoryCard(card);
      return;
    }

    // 3. TASK COMMITMENT / DELIVERABLE
    if (lower.includes('will send') || lower.includes('by tomorrow') || lower.includes('i will') || lower.includes('send invoice') || lower.includes('share the file')) {
      const card: StoryCardPayload = {
        card_id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        chat_id: event.chatId,
        contact_name: event.senderName,
        category: 'TASK_COMMITMENT',
        urgency: 'medium',
        headline: `Deliverable committed in chat`,
        context_summary: `${event.fromMe ? 'You' : event.senderName} noted a commitment: "${event.text.slice(0, 90)}"`,
        ai_proposal: `I can register this checkpoint and prepare the confirmation text.\nEnsures commitments are completed on schedule without mental tracking fatigue.`,
        pre_drafted_action: {
          action_type: 'SET_REMINDER',
          reply_text: `Noted on schedule. I will have this ready as promised.`,
          action_payload: { target_jid: event.chatId }
        },
        suggested_background_theme: 'emerald'
      };
      this.addStoryCard(card);
      return;
    }

    // 4. URGENT TRIAGE
    if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('problem') || lower.includes('delay') || lower.includes('issue')) {
      const card: StoryCardPayload = {
        card_id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        chat_id: event.chatId,
        contact_name: event.senderName,
        category: 'URGENT_TRIAGE',
        urgency: 'critical',
        headline: `Urgent escalation flagged`,
        context_summary: `Urgency signal detected from ${event.senderName}: "${event.text.slice(0, 90)}"`,
        ai_proposal: `I can dispatch an immediate priority acknowledgement.\nDe-escalates tension instantly and clarifies the immediate next step.`,
        pre_drafted_action: {
          action_type: 'SEND_WHATSAPP_REPLY',
          reply_text: `Seeing this right now. Looking into this immediately and will call you in 5 minutes.`,
          action_payload: { target_jid: event.chatId }
        },
        suggested_background_theme: 'dark-crimson'
      };
      this.addStoryCard(card);
      return;
    }
  }
}

export const baileysManager = new BaileysManager();
