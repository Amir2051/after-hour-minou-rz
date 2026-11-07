import { Chess } from 'chess.js';
import { GameModeId } from '../types';
import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Check, X, Copy, Users, Clock3, Swords } from 'lucide-react';
import { useAuthUser } from '../auth/AuthContext';
import { getFirestoreDb, serverTimestamp } from './firestore';

const GAME_OPTIONS: { id: 'chess' | GameModeId; label: string }[] = [
  { id: 'chess', label: 'Chess' },
  { id: 'truth_or_dare', label: 'Truth or Dare' },
  { id: 'how_well_know_me', label: 'How Well Do You Know Me?' },
  { id: 'would_you_rather', label: 'Would You Rather?' },
  { id: 'never_have_i_ever', label: 'Never Have I Ever' },
  { id: 'spicy_challenge', label: 'Spicy Challenge' },
  { id: 'who_is_more_likely', label: 'Who Is More Likely To?' },
  { id: 'finish_the_sentence', label: 'Finish the Sentence' },
  { id: 'challenge_wheel', label: 'Challenge Wheel' },
  { id: 'memory_lane', label: 'Memory Lane' },
  { id: 'sixty_seconds', label: '60-Second Challenge' },
];
const gameLabel = (id: string) => GAME_OPTIONS.find(option => option.id === id)?.label || 'game';

type Invite = {
  id: string;
  senderUid: string;
  senderEmail: string;
  senderName?: string;
  recipientEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  gameId?: string;
  gameType: 'chess' | GameModeId;
  createdAt?: any;
};

interface Props {
  onClose: () => void;
  onStartGame: (gameId: string, gameType: 'chess' | GameModeId) => void;
}

export const MultiplayerLobby: React.FC<Props> = ({ onClose, onStartGame }) => {
  const user = useAuthUser();
  const [email, setEmail] = useState('');
  const [selectedGame, setSelectedGame] = useState<'chess' | GameModeId>('truth_or_dare');
  const [incoming, setIncoming] = useState<Invite[]>([]);
  const [outgoing, setOutgoing] = useState<Invite[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const db = useMemo(() => getFirestoreDb(), []);

  useEffect(() => {
    if (!user?.email) return;
    const stopIncoming = db.collection('gameInvites').where('recipientEmail', '==', user.email.toLowerCase()).onSnapshot((snapshot: any) => {
      setIncoming(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })).filter((item: Invite) => item.status === 'pending'));
    }, (reason: any) => setError(reason.message || 'Could not load incoming invitations.'));
    const stopOutgoing = db.collection('gameInvites').where('senderUid', '==', user.uid).onSnapshot((snapshot: any) => {
      setOutgoing(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })).sort((a: Invite, b: Invite) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (reason: any) => setError(reason.message || 'Could not load sent invitations.'));
    return () => { stopIncoming(); stopOutgoing(); };
  }, [db, user?.email, user?.uid]);

  const sendInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); setNotice('');
    const recipientEmail = email.trim().toLowerCase();
    if (!user?.email || !recipientEmail.includes('@')) return setError('Enter a valid email address for your opponent.');
    if (recipientEmail === user.email.toLowerCase()) return setError('You cannot invite your own account.');
    setWorking(true);
    try {
      await db.collection('gameInvites').add({
        senderUid: user.uid,
        senderEmail: user.email.toLowerCase(),
        senderName: user.displayName || user.email,
        recipientEmail,
        status: 'pending',
        gameType: selectedGame,
        createdAt: serverTimestamp(),
      });
      setEmail('');
      setNotice(`${gameLabel(selectedGame)} invitation sent to ${recipientEmail}. They must sign in to AFTER HOURS with that email and accept before play begins.`);
    } catch (reason: any) {
      setError(reason.message || 'The invitation could not be sent.');
    } finally { setWorking(false); }
  };

  const acceptInvite = async (invite: Invite) => {
    if (!user?.email) return;
    setWorking(true); setError('');
    try {
      const inviteRef = db.collection('gameInvites').doc(invite.id);
      const gameType = invite.gameType;
      const gameRef = db.collection(gameType === 'chess' ? 'chessGames' : 'gameSessions').doc();
      await db.runTransaction(async (transaction: any) => {
        const fresh = await transaction.get(inviteRef);
        const data = fresh.data();
        if (!fresh.exists || data.status !== 'pending' || data.recipientEmail !== user.email!.toLowerCase()) {
          throw new Error('This invitation is no longer available for your account.');
        }
        transaction.update(inviteRef, { status: 'accepted', acceptedUid: user.uid, acceptedAt: serverTimestamp(), gameId: gameRef.id });
        if (gameType === 'chess') transaction.set(gameRef, {
          inviteId: invite.id,
          whiteUid: data.senderUid,
          blackUid: user.uid,
          whiteName: data.senderName || data.senderEmail,
          blackName: user.displayName || user.email,
          fen: new Chess().fen(),
          pgn: '',
          turnUid: data.senderUid,
          status: 'active',
          moveHistory: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        else transaction.set(gameRef, {
          inviteId: invite.id, gameType, senderUid: data.senderUid, recipientUid: user.uid,
          player1Uid: data.senderUid, player2Uid: user.uid,
          player1Name: data.senderName || data.senderEmail, player2Name: user.displayName || user.email,
          status: 'active', state: {}, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      });
      onStartGame(gameRef.id, gameType);
    } catch (reason: any) {
      setError(reason.message || 'Could not accept this invitation.');
    } finally { setWorking(false); }
  };

  const declineInvite = async (invite: Invite) => {
    setWorking(true); setError('');
    try { await db.collection('gameInvites').doc(invite.id).update({ status: 'declined' }); }
    catch (reason: any) { setError(reason.message || 'Could not decline this invitation.'); }
    finally { setWorking(false); }
  };

  const copyInviteEmail = async (invite: Invite) => {
    try {
      const link = `${window.location.origin}/?invite=${invite.id}`;
      await navigator.clipboard.writeText(`Join me for ${gameLabel(invite.gameType)} on AFTER HOURS. Open ${link}, create an account using ${invite.recipientEmail}, then accept my invitation.`);
      setNotice('Invitation details copied. Send them to your opponent.');
    } catch { setNotice('Your invitation is sent. Your opponent can find it in their AFTER HOURS account.'); }
  };

  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
      <section className="glass-panel-glow mx-auto w-full max-w-2xl rounded-3xl p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[.3em] text-violet-200">AFTER HOURS · Multiplayer</p><h2 className="mt-2 font-serif text-3xl text-white">Challenge someone</h2><p className="mt-2 text-sm text-slate-300">Both players need their own account. Your opponent must sign in with the invited email and accept before the shared game opens.</p></div>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10" aria-label="Close invitations"><X size={18}/></button>
        </div>
        <form onSubmit={sendInvite} className="mt-6 rounded-2xl border border-violet-300/20 bg-violet-400/5 p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-violet-100">Choose a game</label>
          <select value={selectedGame} onChange={e=>setSelectedGame(e.target.value as 'chess' | GameModeId)} className="mb-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">{GAME_OPTIONS.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-violet-100">Invite by email</label>
          <div className="flex flex-col gap-2 sm:flex-row"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="opponent@example.com" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-violet-300"/><button disabled={working} className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold text-white hover:bg-violet-400 disabled:opacity-50"><Mail size={16}/> Send game invite</button></div>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{notice}</p>}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><Mail size={16}/> Invitations for you</h3>{incoming.length===0 ? <p className="rounded-xl border border-white/10 p-4 text-xs text-slate-400">No pending invitations. When someone invites your email, it will appear here.</p> : <div className="space-y-3">{incoming.map(invite=><article key={invite.id} className="rounded-xl border border-violet-300/20 bg-black/20 p-3"><p className="text-sm font-semibold text-white">{invite.senderName || invite.senderEmail}</p><p className="mt-1 text-xs text-slate-400">invited you to {gameLabel(invite.gameType)}</p><div className="mt-3 flex gap-2"><button disabled={working} onClick={()=>acceptInvite(invite)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><Check size={14}/> Accept</button><button disabled={working} onClick={()=>declineInvite(invite)} className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300"><X size={14}/> Decline</button></div></article>)}</div>}</div>
          <div><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><Users size={16}/> Your invitations</h3>{outgoing.length===0 ? <p className="rounded-xl border border-white/10 p-4 text-xs text-slate-400">Invitations you send will be listed here.</p> : <div className="space-y-3">{outgoing.map(invite=><article key={invite.id} className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="truncate text-sm font-semibold text-white">{invite.recipientEmail}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400">{invite.status==='accepted'?<><Check size={13} className="text-emerald-300"/> Accepted</>:invite.status==='declined'?'Declined':<><Clock3 size={13}/> Awaiting account & acceptance</>}</p>{invite.status==='accepted' && invite.gameId && <button onClick={()=>onStartGame(invite.gameId!, (invite.gameType || 'truth_or_dare') as 'chess' | GameModeId)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-3 py-2 text-xs font-bold text-white"><Swords size={14}/> Open game</button>}{invite.status==='pending' && <div className="mt-2 flex flex-wrap gap-3"><button onClick={()=>copyInviteEmail(invite)} className="flex items-center gap-1 text-xs text-violet-200"><Copy size={13}/> Copy invite link</button><a href={`mailto:${encodeURIComponent(invite.recipientEmail)}?subject=${encodeURIComponent('Your AFTER HOURS game invitation')}&body=${encodeURIComponent(`Join me for ${gameLabel(invite.gameType)} on AFTER HOURS. Open ${window.location.origin}/?invite=${invite.id}, create an account with this email address, and accept my invitation.`)}`} className="text-xs text-violet-200 underline">Open email draft</a></div>}</article>)}</div>}</div>
        </div>
        <p className="mt-6 text-[11px] leading-5 text-slate-500">Invitations are tied to the invited email address. Signing in with a different account will not reveal or accept the invitation.</p>
      </section>
    </div>
  );
};
