import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }

  // Agentic Task Planner Endpoint
  app.post('/api/ai/task-plan', async (req, res) => {
    try {
      const { taskTitle, role, category, userInputs, kotaContext } = req.body;
      
      if (!ai) {
        return res.json({
          summary: `Action plan finalized for "${taskTitle}" aligned with Maple Bear Canadian curriculum and Kota regional standards.`,
          steps: [
            "Inspect physical specifications at Subhash Nagar campus location.",
            "Verify compliance with Maple Bear franchise technical specifications.",
            "Liaise with vetted Kota vendors in Subhash Nagar / Talwandi for transparent quotes.",
            "Perform safety trial run with co-founders' 3-year-old toddlers before sign-off."
          ],
          checklist: [
            "Verify childproofing & non-toxic certifications",
            "Upload documentation to shared Google Drive",
            "Set follow-up reminder on Google Calendar"
          ],
          draftMessage: `Hello, regarding "${taskTitle}" for Maple Bear Canadian School, Subhash Nagar, Kota: we are executing our launch milestone. Please review the attached specifications and confirm availability/deliverables by Thursday. Thank you, Preschool Partners Team.`,
          founderTips: "Kota's dry summer heat requires UV-safe shaded areas and high-volume ventilation for this setup."
        });
      }

      const prompt = `You are an expert Preschool Operational & Academic Advisor assisting two 32-33 year old female co-founders (both have 3-year-old toddlers) launching Maple Bear Canadian Pre-School in Subhash Nagar, Kota, Rajasthan.
They paid the franchise signing amount today and have 60 days to launch.
Founder roles: Priya (Academics & Care) and Ananya (Business & Operations).

Task Title: "${taskTitle}"
Role Target: ${role}
Category: ${category}
User Inputs/Selections: ${JSON.stringify(userInputs || {})}
Kota Location Context: Subhash Nagar, Kota (high demographic of coaching institute faculty from Allen/Resonance and medical hospital doctors, extreme heat considerations, local Kota stone infrastructure).

Provide a highly concrete, minimal-fluff, actionable plan in JSON format with:
{
  "summary": "1-2 sentence executive punchy summary",
  "steps": ["Actionable step 1", "Actionable step 2", "Actionable step 3", "Actionable step 4"],
  "checklist": ["Clear checkbox item 1", "Clear checkbox item 2", "Clear checkbox item 3"],
  "draftMessage": "Ready-to-send WhatsApp / Email text for vendor or parent or teacher",
  "founderTips": "Specific practical tip considering Kota realities or their 3yo toddlers"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      const data = JSON.parse(text || '{}');
      return res.json(data);
    } catch (err: any) {
      console.error('Task plan generation error:', err);
      return res.json({
        summary: `Action plan initiated for "${req.body.taskTitle || 'Launch Task'}" for Subhash Nagar branch.`,
        steps: [
          "Cross-reference Maple Bear Canadian branch guidelines",
          "Coordinate directly with Subhash Nagar site team",
          "Sync status with co-founder via shared bridge",
          "Test with 3yo toddlers for safety clearance"
        ],
        checklist: [
          "Canadian curriculum standard check",
          "Kota vendor quotation filed",
          "Google Calendar milestone updated"
        ],
        draftMessage: `Maple Bear Subhash Nagar Update: Task "${req.body.taskTitle}" is underway. Delivery scheduled according to 60-day launch roadmap.`,
        founderTips: "Schedule outdoor vendor visits early morning before Kota temperatures climb."
      });
    }
  });

  // Smart Inquiry Responder
  app.post('/api/ai/parent-inquiry', async (req, res) => {
    try {
      const { parentName, childName, childAge, parentBackground, interestGrade } = req.body;
      if (!ai) {
        return res.json({
          response: `Dear ${parentName},\n\nThank you for reaching out to Maple Bear Canadian Pre-School, Subhash Nagar, Kota! We are delighted to welcome ${childName} (Age ${childAge}) for ${interestGrade || 'Pre-School'}. As fellow mothers of 3-year-olds in Kota, we designed our center with global Canadian early childhood immersion, bilingual play, and zero-stress inquiry learning. We invite you for a personalized campus tour this week at Subhash Nagar.\n\nWarm regards,\nPriya & Ananya\nCo-Founders, Maple Bear Subhash Nagar Kota`
        });
      }

      const prompt = `Write a warm, professional, high-trust personalized inquiry response to a parent in Kota, Rajasthan asking about Maple Bear Canadian School in Subhash Nagar.
Parent Name: ${parentName}
Child Name: ${childName}
Child Age: ${childAge}
Parent Background: ${parentBackground || 'Doctor / Coaching Faculty in Kota'}
Target Class: ${interestGrade || 'Nursery'}
Tone: Warm, executive, reassuring (both founders are 32-33 yr old mothers of 3yos themselves). Emphasize Canadian play-based bilingual learning and child safety in Subhash Nagar. Under 130 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ response: response.text });
    } catch (err: any) {
      return res.json({
        response: `Dear ${req.body.parentName || 'Parent'},\n\nThank you for your interest in Maple Bear Canadian Pre-School, Subhash Nagar, Kota. We would love to host you and ${req.body.childName || 'your child'} for a tour of our Canadian learning center. Please reply to schedule your visit!\n\nWarmly,\nPreschool Partners`
      });
    }
  });

  // Agentic Clarification & Proactive Guidance Endpoint
  app.post('/api/ai/agentic-clarify', async (req, res) => {
    try {
      const { question, selectedOption, activeFounder, customAnswer } = req.body;
      const founderName = activeFounder === 'academics' ? 'Priya Sharma (Academics)' : 'Ananya Verma (Business)';
      
      if (!ai) {
        return res.json({
          insight: `Decision registered: "${selectedOption || customAnswer}". Here is your immediate execution roadmap.`,
          nextSteps: [
            "Sync update with co-founder via shared WhatsApp bridge",
            "Update Subhash Nagar master launch timeline",
            "Conduct quick safety review with 3yo toddlers"
          ],
          draftMessage: `Maple Bear Kota Milestone Update: "${selectedOption || customAnswer}" has been approved for Subhash Nagar campus. Ready for execution.`
        });
      }

      const prompt = `You are MamaBear AI 🐻, the agentic Chief of Staff for ${founderName} launching Maple Bear Canadian Pre-School in Subhash Nagar, Kota.
The co-founder just answered a proactive clarifying question:
Question: "${question}"
Answer/Selection: "${selectedOption || customAnswer}"

Provide an immediate, highly concrete tactical response in JSON:
{
  "insight": "1-2 sentence executive punchy feedback with mom-friendly clarity",
  "nextSteps": ["Specific action step 1", "Specific action step 2", "Specific action step 3"],
  "draftMessage": "Ready-to-dispatch WhatsApp or Email update for team/vendor/partner"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Agentic clarify error:', err);
      return res.json({
        insight: "Decision noted and synchronized with 60-day launch roadmap.",
        nextSteps: ["Verify with Subhash Nagar site team", "Update milestone status"],
        draftMessage: `Update: ${req.body.selectedOption || 'Task updated'} for Maple Bear Subhash Nagar.`
      });
    }
  });

  // MamaBear AI Conversational Chief of Staff Endpoint
  app.post('/api/ai/mamabear-chat', async (req, res) => {
    try {
      const { message, history, activeFounder, momMode } = req.body;
      const founderName = activeFounder === 'academics' ? 'Priya (Academics & Care)' : 'Ananya (Business & Operations)';
      
      if (!ai) {
        return res.json({
          reply: `Hi ${founderName.split(' ')[0]}! I'm MamaBear AI 🐻. For Subhash Nagar, Kota, keep outdoor tasks to early morning before temperatures rise, and remember to test all classroom materials with Aarav & Myra (3yo). What should we tackle next?`,
          actionType: 'task',
          suggestedActions: [
            "Draft WhatsApp message to Kota parents",
            "Generate Kota Stone finishing checklist",
            "Review 3yo nap schedule with Aarav & Myra",
            "Create weekend Campus Tour agenda"
          ]
        });
      }

      const systemPrompt = `You are MamaBear AI 🐻, the playful, hyper-efficient, on-brand AI Chief of Staff for two 32-33 year old female co-founders (Priya - Academics & Care, Ananya - Business & Operations) launching Maple Bear Canadian Pre-School in Subhash Nagar, Kota, Rajasthan.
Context:
- They gave the ₹15L franchise signing amount today and have 60 days to launch.
- Both have 3-year-old toddlers (Aarav is Priya's boy, Myra is Ananya's girl).
- Location: Subhash Nagar, Kota (opposite Talwandi, near coaching institutes like Allen/Resonance; parents are doctors and coaching faculties).
- Core Tone: High clarity, minimal fluff, warm, supportive of working mother reality, zero AI slop, tactical, action-oriented.
- Mom Mode is currently: ${momMode ? 'ACTIVE (Keep advice extra concise and toddler-friendly)' : 'STANDARD'}.
- Active user speaking to you: ${founderName}.

Output JSON format:
{
  "reply": "Warm, direct, punchy answer under 120 words with clear bullet points or ready-to-copy WhatsApp/action draft if relevant",
  "suggestedActions": ["Action 1", "Action 2", "Action 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nRecent History: ${JSON.stringify(history || [])}\n\nUser Message: ${message}`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('MamaBear chat error:', err);
      return res.json({
        reply: "MamaBear AI here! 🐻 How can I assist with your 60-day launch roadmap today? Ready to draft parent messages, sync tasks, or balance toddler schedules.",
        suggestedActions: [
          "Check Subhash Nagar site progress",
          "Draft parent tour confirmation",
          "Check Aarav & Myra test ratings"
        ]
      });
    }
  });

  // Supabase Data Endpoint
  app.all('/api/data', async (req, res) => {
    try {
      const { default: handler } = await import('./api/data');
      await handler(req as any, res as any);
    } catch (e: any) {
      console.error('Error handling /api/data:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Baileys WhatsApp & Executive Story Cards Endpoints
  app.get('/api/baileys/status', async (_req, res) => {
    try {
      const { baileysManager } = await import('./src/services/baileysService');
      res.json(baileysManager.getStatus());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/connect', async (_req, res) => {
    try {
      const { baileysManager } = await import('./src/services/baileysService');
      await baileysManager.connect();
      res.json({ success: true, ...baileysManager.getStatus() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/pair', async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      const { baileysManager } = await import('./src/services/baileysService');
      const pairingCode = await baileysManager.requestPairingCode(phone);
      res.json({ success: true, pairingCode, ...baileysManager.getStatus() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/disconnect', async (_req, res) => {
    try {
      const { baileysManager } = await import('./src/services/baileysService');
      await baileysManager.disconnect();
      res.json({ success: true, ...baileysManager.getStatus() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/baileys/cards', async (_req, res) => {
    try {
      const { baileysManager } = await import('./src/services/baileysService');
      res.json({ story_cards: baileysManager.getStoryCards() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/send', async (req, res) => {
    try {
      const { chatId, text, cardId } = req.body;
      const { baileysManager } = await import('./src/services/baileysService');
      const sent = await baileysManager.sendReply(chatId, text);
      if (sent && cardId) {
        baileysManager.dismissCard(cardId);
      }
      res.json({ success: sent });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/dismiss', async (req, res) => {
    try {
      const { cardId } = req.body;
      const { baileysManager } = await import('./src/services/baileysService');
      baileysManager.dismissCard(cardId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/baileys/synthesize-stream', async (req, res) => {
    try {
      const { messages } = req.body;
      const { baileysManager } = await import('./src/services/baileysService');
      if (Array.isArray(messages)) {
        for (const msg of messages) {
          (baileysManager as any).synthesizeStreamIntoStoryCard(msg);
        }
      }
      res.json({ story_cards: baileysManager.getStoryCards() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Preschool Partners server running on http://localhost:${port}`);
  });
}

startServer();
