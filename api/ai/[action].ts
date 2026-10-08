import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

type Json = Record<string, unknown>;

const fallback = (action: string, body: Json) => {
  if (action === 'parent-inquiry') return { response: `Dear ${body.parentName || 'Parent'},\n\nThank you for your interest in Maple Bear Canadian Pre-School, Subhash Nagar, Kota. We would love to host you and ${body.childName || 'your child'} for a campus tour. Please reply to schedule your visit!\n\nWarmly,\nPreschool Partners` };
  if (action === 'mamabear-chat') return { reply: 'MamaBear AI is ready to help with the 60-day launch roadmap. Start with the next owner, due date, and the smallest safe action.', suggestedActions: ['Check site progress', 'Draft parent tour confirmation', 'Review launch tasks'] };
  if (action === 'agentic-clarify') return { insight: `Decision registered: “${body.selectedOption || body.customAnswer || 'update'}”.`, nextSteps: ['Assign one owner', 'Set a dated checkpoint', 'Record the evidence needed for sign-off'], draftMessage: 'Update recorded. Please confirm owner and completion date.' };
  if (action === 'story-cards-synthesis') return {
    story_cards: [
      {
        card_id: "card_001",
        chat_id: "919876543210@s.whatsapp.net",
        contact_name: "Rohan",
        category: "UNANSWERED_PING",
        urgency: "medium",
        headline: "Unanswered check-in on budget sheet",
        context_summary: "Rohan asked for your feedback on the revised budget 3 hours ago.",
        ai_proposal: "I can send Rohan a quick update confirming you're reviewing it and will share final thoughts by 6 PM.\nThis keeps momentum without you having to drop current focus.",
        pre_drafted_action: {
          action_type: "SEND_WHATSAPP_REPLY",
          reply_text: "Hey Rohan, reviewing the revised numbers now. Will share my notes by 6 PM today.",
          action_payload: { target_jid: "919876543210@s.whatsapp.net" }
        },
        suggested_background_theme: "amber"
      },
      {
        card_id: "card_002",
        chat_id: "12036302@g.us",
        contact_name: "Weekend Plans (Sarah)",
        category: "PLANNING",
        urgency: "low",
        headline: "Coordination stall on weekend venue",
        context_summary: "The group is undecided between Saturday lunch and Sunday brunch with no reservation made.",
        ai_proposal: "I can propose Saturday 1:30 PM at your preferred Italian spot and run a quick headcount poll in the chat.\nThis locks in the plan before weekend reservations fill up.",
        pre_drafted_action: {
          action_type: "SEND_WHATSAPP_REPLY",
          reply_text: "Let's lock in Saturday 1:30 PM. I can grab a table—drop a quick thumbs up if you're in.",
          action_payload: { target_jid: "12036302@g.us" }
        },
        suggested_background_theme: "deep-blue"
      }
    ]
  };
  return { summary: `Action plan prepared for “${body.taskTitle || 'Launch task'}”.`, steps: ['Define acceptance criteria', 'Assign the accountable founder', 'Get two vendor quotations', 'Run a child-safety review before sign-off'], checklist: ['Safety evidence attached', 'Budget approved', 'Calendar follow-up created'], draftMessage: 'Hello, please confirm availability, scope, and delivery date for this launch task.', founderTips: 'Schedule outdoor vendor visits early in the morning before Kota temperatures rise.' };
};

const prompts: Record<string, (body: Json) => string> = {
  'task-plan': (b) => `You are MamaBear AI, an operational chief of staff for co-founders launching a safe preschool in Kota, Rajasthan. Produce only JSON with summary, steps (4), checklist (3), draftMessage, and founderTips. Task: ${b.taskTitle}. Role: ${b.role}. Category: ${b.category}. Inputs: ${JSON.stringify(b.userInputs || {})}. Be concrete, safety-first, and concise.`,
  'parent-inquiry': (b) => `Write a warm, professional under-130-word parent inquiry response for a preschool in Kota, Rajasthan. Produce only JSON: {"response":"..."}. Parent: ${b.parentName}; child: ${b.childName}; age: ${b.childAge}; interest: ${b.interestGrade || 'Pre-school'}. Do not make unverifiable claims.`,
  'agentic-clarify': (b) => `You are MamaBear AI. Produce only JSON with insight, nextSteps (3), and draftMessage. A founder answered the question “${b.question}” with “${b.selectedOption || b.customAnswer}”. Give specific, safe launch actions for a preschool in Kota.`,
  'mamabear-chat': (b) => `You are MamaBear AI, a concise preschool-launch chief of staff. Produce only JSON with reply and suggestedActions (3). Focus on safe, lawful, realistic execution; distinguish plans from completed facts. Active founder: ${b.activeFounder}. Message: ${b.message}. Recent history: ${JSON.stringify(b.history || [])}`,
  'story-cards-synthesis': (b) => `You are an intelligent Executive Operations Engine for a personal agent app. Ingest the following live raw WhatsApp message stream and synthesize high-signal, bite-sized Story Cards.
Follow the 6 detection archetypes (GHOSTING & UNREPLIED PINGS, AWAITING EXTERNAL RESPONSE, COMMITMENTS & ACTIONS REQUIRED, PLANNING & COORDINATION, REMINDERS & DEADLINES, CRISIS / URGENCY TRIAGE).
Respond strictly with a JSON object: {"story_cards": [ {"card_id": "...", "chat_id": "...", "contact_name": "...", "category": "...", "urgency": "critical|medium|low", "headline": "...", "context_summary": "...", "ai_proposal": "Line 1\\nLine 2", "pre_drafted_action": {"action_type": "SEND_WHATSAPP_REPLY|CREATE_CALENDAR_EVENT|SET_REMINDER|DISMISS", "reply_text": "...", "action_payload": {}}, "suggested_background_theme": "dark-crimson|deep-blue|emerald|amber|charcoal"} ]}.
Raw Messages: ${JSON.stringify(b.messages || [])}`,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const action = String(req.query.action || '');
  const body = (req.body || {}) as Json;
  const prompt = prompts[action];
  if (!prompt) return res.status(404).json({ error: 'Unknown AI action' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(200).json(fallback(action, body));
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt(body), config: { responseMimeType: 'application/json' } });
    return res.status(200).json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('MamaBear AI request failed', error);
    return res.status(200).json(fallback(action, body));
  }
}
