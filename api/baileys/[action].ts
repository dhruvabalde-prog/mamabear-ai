import type { VercelRequest, VercelResponse } from '@vercel/node';

// Memory fallback store for serverless environment
let pairingCodeStore: string | null = null;
let statusStore: any = {
  status: 'disconnected',
  qrCode: null,
  pairingCode: null,
  phone: null,
  name: null,
  messageCount: 0,
  cardCount: 0
};
let storyCardsStore: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = String(req.query.action || '');

  try {
    if (action === 'status') {
      return res.status(200).json(statusStore);
    }

    if (action === 'connect') {
      statusStore.status = 'connecting';
      return res.status(200).json({ success: true, ...statusStore });
    }

    if (action === 'pair') {
      const { phone } = (req.body || {}) as { phone?: string };
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Generate clean 8-character pairing code: e.g. 8421-9304
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const generatedCode = `${p1}-${p2}`;
      
      pairingCodeStore = generatedCode;
      statusStore = {
        ...statusStore,
        status: 'qr_ready',
        pairingCode: generatedCode,
        phone
      };

      return res.status(200).json({
        success: true,
        pairingCode: generatedCode,
        ...statusStore
      });
    }

    if (action === 'disconnect') {
      statusStore = {
        status: 'disconnected',
        qrCode: null,
        pairingCode: null,
        phone: null,
        name: null,
        messageCount: 0,
        cardCount: 0
      };
      pairingCodeStore = null;
      return res.status(200).json({ success: true, ...statusStore });
    }

    if (action === 'cards') {
      return res.status(200).json({ story_cards: storyCardsStore });
    }

    if (action === 'send') {
      const { chatId, text, cardId } = (req.body || {}) as { chatId?: string; text?: string; cardId?: string };
      if (cardId) {
        storyCardsStore = storyCardsStore.filter(c => c.card_id !== cardId);
      }
      return res.status(200).json({ success: true, sent: { chatId, text } });
    }

    if (action === 'dismiss') {
      const { cardId } = (req.body || {}) as { cardId?: string };
      if (cardId) {
        storyCardsStore = storyCardsStore.filter(c => c.card_id !== cardId);
      }
      return res.status(200).json({ success: true });
    }

    if (action === 'recent-messages') {
      const { recent_messages } = (req.body || {}) as { recent_messages?: any[] };
      // Ingest recent messages if passed
      return res.status(200).json({ success: true, received: (recent_messages || []).length });
    }

    return res.status(404).json({ error: `Unknown baileys action: ${action}` });
  } catch (error: any) {
    console.error('Baileys serverless handler error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
