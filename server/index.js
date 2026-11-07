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
const firebaseApiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || 'after-hours-3fba0';

// Verify Firebase ID tokens with Google's Identity Toolkit before allowing API access.
// The token is never logged or trusted based on browser-supplied profile fields.
async function requireFirebaseAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Sign in to continue.' });
  if (!firebaseApiKey) return res.status(503).json({ error: 'Firebase backend verification is not configured.' });
  try {
    const verification = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: match[1] }),
    });
    if (!verification.ok) return res.status(401).json({ error: 'Your sign-in session is invalid or expired. Sign in again.' });
    const payload = await verification.json();
    const account = payload.users?.[0];
    if (!account || account.localId === undefined) return res.status(401).json({ error: 'Unable to verify your sign-in session.' });
    // Identity Toolkit has validated the signature; also pin the token to this Firebase project.
    const tokenClaims = JSON.parse(Buffer.from(match[1].split('.')[1] || '', 'base64url').toString('utf8'));
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (tokenClaims.aud !== firebaseProjectId || tokenClaims.iss !== `https://securetoken.google.com/${firebaseProjectId}` || tokenClaims.sub !== account.localId || !Number.isFinite(tokenClaims.exp) || tokenClaims.exp <= nowSeconds || tokenClaims.iat > nowSeconds) {
      return res.status(401).json({ error: 'Your sign-in token does not belong to this AFTER HOURS project.' });
    }
    if (!account.providerUserInfo?.some(provider => provider.providerId === 'google.com')) {
      return res.status(403).json({ error: 'Use Google sign-in for AFTER HOURS.' });
    }
    if (account.email && account.emailVerified !== true) return res.status(403).json({ error: 'Verify your email address before continuing.' });
    req.authUser = { uid: account.localId, email: account.email || null, displayName: account.displayName || null };
    next();
  } catch (error) {
    console.error('Firebase token verification unavailable:', error?.message || 'unknown error');
    return res.status(503).json({ error: 'Sign-in verification is temporarily unavailable. Please try again.' });
  }
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
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
  res.json({ ok: true, service: 'after-hours-referee', geminiConfigured: Boolean(ai), firebaseConfigured: Boolean(firebaseApiKey && firebaseProjectId) });
});

app.post('/api/referee/ask', requireFirebaseAuth, async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment.' });

  const { prompt, scope, activePlayer, partnerName, privateMemories, sharedMemories, adultContent, gameMode, history } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 1200) {
    return res.status(400).json({ error: 'Enter a message of up to 1,200 characters.' });
  }
  if (!['player1', 'player2', 'shared'].includes(scope)) {
    return res.status(400).json({ error: 'Choose a valid memory scope.' });
  }
  if (adultContent !== true && /\b(spicy|adult|intimate|sexual|erotic|nsfw|18\+|explicit|graphic sex|pornographic)\b/i.test(prompt)) {
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

  const safeHistory = Array.isArray(history) ? history.slice(-8).filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.text === 'string').map(item => `${item.role === 'user' ? 'Player' : 'Referee'}: ${item.text.slice(0, 1200)}`) : [];
  const context = [
    `Game mode: ${String(gameMode || 'game night').slice(0, 80)}. Current memory view: ${scope}. Active player: ${String(activePlayer || 'the couple').slice(0, 80)}. Partner: ${String(partnerName || 'their partner').slice(0, 80)}.`,
    ownMemory.length ? `ACTIVE PLAYER PRIVATE MEMORY (only this player's turn may use it):\n${ownMemory.map(item => '- ' + item).join('\n')}` : '',
    sharedMemory.length ? `MUTUALLY SHARED MEMORY:\n${sharedMemory.map(item => '- ' + item).join('\n')}` : '',
    safeHistory.length ? `RECENT CONVERSATION IN THIS SAME PLAYER VIEW:\n${safeHistory.join('\n')}` : '',
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
