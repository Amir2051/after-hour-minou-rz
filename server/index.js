import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = Number(process.env.PORT || 8787);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));

const requestWindows = new Map();
app.use('/api/referee', (req, res, next) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const bucket = requestWindows.get(key);
  if (!bucket || now - bucket.startedAt > 60_000) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    return next();
  }
  bucket.count += 1;
  if (bucket.count > 18) return res.status(429).json({ error: 'The Referee needs a short breather. Try again in a minute.' });
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'after-hours-referee', geminiConfigured: Boolean(ai) });
});

app.post('/api/referee/ask', async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment.' });

  const { prompt, scope, activePlayer, partnerName, privateMemories, sharedMemories, adultContent } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 1200) {
    return res.status(400).json({ error: 'Enter a message of up to 1,200 characters.' });
  }
  if (!['player1', 'player2', 'shared'].includes(scope)) {
    return res.status(400).json({ error: 'Choose a valid memory scope.' });
  }
  if (adultContent !== true && /\b(explicit|graphic sex|pornographic)\b/i.test(prompt)) {
    return res.status(403).json({ error: 'Confirm that both players are adults before requesting adult content.' });
  }

  // The client sends only the active player's private vault plus mutually approved shared context.
  // This stateless endpoint never retrieves or persists either player's private memory.
  const safeList = value => Array.isArray(value) ? value.filter(item => typeof item === 'string').slice(0, 30).map(item => item.slice(0, 600)) : [];
  const ownMemory = scope === 'shared' ? [] : safeList(privateMemories);
  const sharedMemory = safeList(sharedMemories);
  const systemInstruction = [
    'You are THE REFEREE, a witty, warm, playful and mischievous couples game-night companion for two consenting adults.',
    'Be concise, natural, clever and emotionally intelligent. Match the couple’s tone: funny, flirty, romantic, deep or spicy when allowed.',
    'Never pressure either person. A pass, boundary or no is final and carries no penalty. Do not encourage coercion or non-consensual activity.',
    'You are not a lie detector. Never claim to know that someone is lying, deceptive, cheating or hiding something. You may say answers do not quite match, may reflect different perspectives, or may need a conversation. Distinguish confirmed inconsistency, possible inconsistency, different perspective, new information and no evidence without assigning intent.',
    'Never infer deception from voice, appearance, body language or confidence. Do not diagnose either partner.',
    'Respect memory boundaries: use only the memory context provided for this request. Do not ask for or reveal the other player’s private memory. Do not imply access to unprovided chats or facts.',
    'If asked for a game card, return one original card with a clear category and a simple optional pass. Do not make adult content explicit or graphic.',
  ].join(' ');

  const context = [
    `Current view: ${scope}. Active player: ${String(activePlayer || 'the couple').slice(0, 80)}. Partner: ${String(partnerName || 'their partner').slice(0, 80)}.`,
    ownMemory.length ? `ACTIVE PLAYER PRIVATE MEMORY (only this player's turn may use it):\n${ownMemory.map(item => '- ' + item).join('\n')}` : '',
    sharedMemory.length ? `MUTUALLY SHARED MEMORY:\n${sharedMemory.map(item => '- ' + item).join('\n')}` : '',
    `User request: ${prompt.trim()}`,
  ].filter(Boolean).join('\n\n');

  try {
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: context }] }],
      config: { systemInstruction, temperature: 0.85, maxOutputTokens: 500 },
    });
    const answer = result.text?.trim();
    if (!answer) return res.status(502).json({ error: 'The Referee returned an empty answer. Try again.' });
    res.json({ answer });
  } catch (error) {
    console.error('Referee request failed:', error?.message || error);
    res.status(502).json({ error: 'The Referee could not reach Gemini. Check the server key and try again.' });
  }
});

const distPath = path.join(projectRoot, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), error => error && next(error));
});

app.listen(port, () => {
  console.log(`AFTER HOURS server listening on ${port}`);
});
