import React, { useMemo, useState } from 'react';
import { getFirebaseIdToken } from '../auth/firebase';
import { BrainCircuit, X, Send, ShieldCheck, LockKeyhole, Sparkles, Trash2, Pause, Play, Heart, MessageCircle, Plus } from 'lucide-react';
import { RefereeMessage, RefereeScope, refereeMemoryService } from '../services/referee';
import { StoredPlayers } from '../services/storage';

interface TheRefereeProps {
  players: StoredPlayers;
  adultConfirmed: boolean;
  gameMode: string;
  onRequestAgeGate: () => void;
}

export const TheReferee: React.FC<TheRefereeProps> = ({ players, adultConfirmed, gameMode, onRequestAgeGate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [scope, setScope] = useState<RefereeScope>('player1');
  const [prompt, setPrompt] = useState('');
  const [memoryDraft, setMemoryDraft] = useState('');
  const [sharedConsent, setSharedConsent] = useState(false);
  const [messages, setMessages] = useState<RefereeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [memoryVersion, setMemoryVersion] = useState(0);

  const memories = useMemo(() => refereeMemoryService.getAll(), [memoryVersion]);
  const visibleMemories = memories.filter(memory =>
    memory.scope === 'shared' || (scope !== 'shared' && memory.scope === scope)
  );
  const scopeLabel = scope === 'player1' ? players.player1 : scope === 'player2' ? players.player2 : 'Both players';

  const askReferee = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || isLoading || !isEnabled) return;
    if (!adultConfirmed && /\b(spicy|adult|intimate|sexual|erotic|nsfw|18\+)\b/i.test(question)) {
      setError('Confirm that both players are 18+ before requesting adult prompts.');
      onRequestAgeGate();
      return;
    }
    setError('');
    setIsLoading(true);
    setMessages(previous => [...previous, { role: 'user', text: question, createdAt: Date.now() }]);
    setPrompt('');

    // A private turn receives only that player's private memories plus mutually shared memories.
    const privateMemories = scope === 'shared'
      ? []
      : memories.filter(memory => memory.scope === scope).map(memory => memory.text);
    const sharedMemories = memories.filter(memory => memory.scope === 'shared').map(memory => memory.text);

    try {
      const idToken = await getFirebaseIdToken();
      const response = await fetch('/api/referee/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          prompt: question,
          gameMode,
          history: messages.slice(-8).map(message => ({ role: message.role, text: message.text })),
          scope,
          activePlayer: scopeLabel,
          partnerName: scope === 'player1' ? players.player2 : players.player1,
          privateMemories,
          sharedMemories,
          adultContent: adultConfirmed,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The Referee could not answer right now.');
      setMessages(previous => [...previous, { role: 'assistant', text: data.answer, createdAt: Date.now() }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMemory = (event: React.FormEvent) => {
    event.preventDefault();
    if (!memoryDraft.trim()) return;
    if (scope === 'shared' && !sharedConsent) {
      setError('Both players must agree before a memory is saved to shared memory.');
      return;
    }
    refereeMemoryService.save(memoryDraft, scope);
    setMemoryDraft('');
    setSharedConsent(false);
    setError('');
    setMemoryVersion(value => value + 1);
  };

  const clearMemories = () => {
    if (!window.confirm('Delete all Referee memories stored on this device? This cannot be undone.')) return;
    refereeMemoryService.clear();
    setMemoryVersion(value => value + 1);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="referee-launcher fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:-translate-y-1"
        aria-label="Open The Referee"
      >
        <BrainCircuit className="h-5 w-5" />
        <span>THE REFEREE</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="referee-title">
          <section className="referee-panel flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-rose-300/15 shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.28em] text-rose-300">Your couples co-pilot</p>
                  <h2 id="referee-title" className="font-serif text-2xl font-semibold text-white">THE REFEREE</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEnabled(value => !value)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white" title={isEnabled ? 'Pause Referee' : 'Resume Referee'}>
                  {isEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white" aria-label="Close Referee">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="flex min-h-0 flex-col border-b border-white/10 md:border-b-0 md:border-r">
                <div className="flex flex-wrap items-center gap-2 px-5 pt-4">
                  {([
                    ['player1', players.player1],
                    ['player2', players.player2],
                    ['shared', 'Shared'],
                  ] as [RefereeScope, string][]).map(([value, label]) => (
                    <button key={value} onClick={() => { if (isLoading) return; setScope(value); setMessages([]); setError(''); }} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${scope === value ? 'border-rose-300/50 bg-rose-500/20 text-rose-100' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}>
                      {label}
                    </button>
                  ))}
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500">{scopeLabel} · {gameMode === 'hub' ? 'Game night' : gameMode.replaceAll('_', ' ')}</span>
                </div>

                <div className="min-h-[210px] flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {messages.length === 0 && (
                    <div className="flex h-full min-h-[190px] flex-col items-center justify-center text-center">
                      <Sparkles className="mb-3 h-8 w-8 text-rose-300" />
                      <p className="font-serif text-xl text-white">A little honesty. A little mischief.</p>
                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">Ask for a date-night idea, a playful follow-up, a fresh game card, or a fair read when your answers differ.</p>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div key={message.createdAt + '-' + index} className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-rose-500/20 text-rose-50' : 'mr-auto border border-white/10 bg-white/[.06] text-slate-100'}`}>
                      {message.role === 'assistant' && <p className="mb-1 text-[9px] font-bold uppercase tracking-[.2em] text-rose-300">The Referee</p>}
                      {message.text}
                    </div>
                  ))}
                  {isLoading && <div className="mr-auto rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-xs text-rose-200">The Referee is thinking…</div>}
                </div>

                {error && <p className="mx-5 mb-2 rounded-xl border border-rose-400/20 bg-rose-950/30 px-3 py-2 text-xs text-rose-200">{error}</p>}
                {!isEnabled && <p className="mx-5 mb-2 text-xs text-amber-200">The Referee is paused. Resume to send messages.</p>}
                <form onSubmit={askReferee} className="flex gap-2 border-t border-white/10 p-4">
                  <input value={prompt} onChange={event => setPrompt(event.target.value)} disabled={!isEnabled || isLoading} placeholder="Ask The Referee anything…" maxLength={1200} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300/50 disabled:opacity-50" />
                  <button disabled={!isEnabled || isLoading || !prompt.trim()} className="rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 px-4 text-white disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button>
                </form>
              </div>

              <aside className="max-h-[34vh] overflow-y-auto bg-black/20 p-4 md:max-h-none">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-200"><ShieldCheck className="h-4 w-4" /> Memory vault</div>
                <p className="mb-3 text-[11px] leading-relaxed text-slate-400">Private memories are sent only during that player’s turn. Shared memories are included for both players only after mutual agreement.</p>
                <form onSubmit={saveMemory} className="space-y-2">
                  <textarea value={memoryDraft} onChange={event => setMemoryDraft(event.target.value)} rows={3} maxLength={600} placeholder={scope === 'shared' ? 'A memory you both agree to share…' : 'A private fact or preference…'} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-rose-300/40" />
                  {scope === 'shared' && (
                    <label className="flex items-start gap-2 text-[10px] leading-relaxed text-amber-200">
                      <input type="checkbox" checked={sharedConsent} onChange={event => setSharedConsent(event.target.checked)} className="mt-0.5 accent-rose-500" />
                      Both players agree this can be used as shared context.
                    </label>
                  )}
                  <button disabled={!memoryDraft.trim() || (scope === 'shared' && !sharedConsent)} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-300/20 bg-rose-500/10 py-2 text-xs font-semibold text-rose-100 disabled:opacity-40"><Plus className="h-3.5 w-3.5" /> Save to {scope === 'shared' ? 'shared' : 'private'} memory</button>
                </form>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available context ({visibleMemories.length})</span>
                    {memories.length > 0 && <button onClick={clearMemories} className="text-slate-500 hover:text-rose-300" title="Delete all Referee memories"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </div>
                  {visibleMemories.map(memory => (
                    <div key={memory.id} className="rounded-xl border border-white/10 bg-white/[.04] p-2.5">
                      <div className="mb-1 flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-rose-300">
                        <span>{memory.scope === 'shared' ? 'Shared' : memory.scope === 'player1' ? players.player1 : players.player2}</span>
                        <button onClick={() => { refereeMemoryService.remove(memory.id); setMemoryVersion(value => value + 1); }} aria-label="Delete memory"><X className="h-3 w-3" /></button>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">{memory.text}</p>
                    </div>
                  ))}
                  {visibleMemories.length === 0 && <p className="text-[11px] text-slate-500">No memory saved for this view yet.</p>}
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[.03] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300"><LockKeyhole className="h-3 w-3" /> Privacy controls</div>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">Memory is stored in this browser on this device. Anyone with access to this browser profile may be able to view it. Nothing is saved to the AI provider as a memory by this app.</p>
                </div>
              </aside>
            </div>
            <footer className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5"><Heart className="h-3 w-3 text-rose-400" /> Consent-first, never a lie detector.</span>
              <span className="hidden sm:inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Gemini powered</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};
