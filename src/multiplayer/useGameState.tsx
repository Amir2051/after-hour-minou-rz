import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from 'react';
import { useAuthUser } from '../auth/AuthContext';
import { getFirestoreDb, serverTimestamp } from './firestore';

type SharedState = Record<string, unknown>;
type MultiplayerStateContextValue = {
  state: SharedState;
  players: { player1: string; player2: string; player1Uid: string; player2Uid: string } | null;
  ready: boolean;
  isHost: boolean;
  writeState: (key: string, value: unknown) => Promise<void>;
};

const MultiplayerStateContext = createContext<MultiplayerStateContextValue | null>(null);

export const MultiplayerGameProvider: React.FC<{
  sessionId: string;
  children: React.ReactNode;
}> = ({ sessionId, children }) => {
  const user = useAuthUser();
  const db = useMemo(() => sessionId ? getFirestoreDb() : null, [sessionId]);
  const [state, setState] = useState<SharedState>({});
  const [ready, setReady] = useState(false);
  const [hostUid, setHostUid] = useState<string | null>(null);
  const [sessionPlayers, setSessionPlayers] = useState<{ player1: string; player2: string; player1Uid: string; player2Uid: string } | null>(null);

  useEffect(() => {
    setReady(false); setState({}); setHostUid(null); setSessionPlayers(null);
    if (!sessionId || !db) return;
    const ref = db.collection('gameSessions').doc(sessionId);
    return ref.onSnapshot((snapshot: any) => {
      if (!snapshot.exists) return;
      const data = snapshot.data();
      setState(data.state || {});
      setHostUid(data.senderUid || data.player1Uid || null);
      setSessionPlayers({ player1: data.player1Name || 'Player 1', player2: data.player2Name || 'Player 2', player1Uid: data.player1Uid || data.senderUid, player2Uid: data.player2Uid || data.recipientUid });
      setReady(true);
    });
  }, [db, sessionId]);

  const writeState = useCallback(async (key: string, value: unknown) => {
    if (!sessionId || !db) return;
    await db.collection('gameSessions').doc(sessionId).update({
      [`state.${key}`]: value,
      updatedAt: serverTimestamp(),
    });
  }, [db, sessionId]);

  const value = useMemo(() => ({
    state,
    players: sessionPlayers,
    ready,
    isHost: !!user && !!hostUid && user.uid === hostUid,
    writeState,
  }), [state, sessionPlayers, ready, user?.uid, hostUid, writeState]);

  if (!sessionId) return <>{children}</>;
  if (!ready) return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-300">Rejoining your shared game…</div>;
  return <MultiplayerStateContext.Provider value={value}>{children}</MultiplayerStateContext.Provider>;
};

/**
 * Drop-in state hook for the existing game screens. In a multiplayer room,
 * each hook is assigned a stable React id and mirrored to the shared Firestore
 * session. Outside a room it behaves exactly like React.useState.
 */
export function useGameState<T>(initialValue: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void] {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const stateId = useId().replace(/[^a-zA-Z0-9_-]/g, '_');
  const context = useContext(MultiplayerStateContext);

  useEffect(() => {
    if (!context?.ready || !context.isHost || Object.prototype.hasOwnProperty.call(context.state, stateId)) return;
    void context.writeState(stateId, localValue);
  }, [context?.ready, context?.isHost, context?.state, context?.writeState, stateId]);

  if (!context) return [localValue, setLocalValue];

  const hasRemoteValue = Object.prototype.hasOwnProperty.call(context.state, stateId);
  const currentValue = (hasRemoteValue ? context.state[stateId] : localValue) as T;

  const setValue = (nextValue: T | ((previous: T) => T)) => {
    const next = typeof nextValue === 'function'
      ? (nextValue as (previous: T) => T)(currentValue)
      : nextValue;
    setLocalValue(next);
    void context.writeState(stateId, next).catch((error) => {
      console.error('Could not sync multiplayer game state:', error);
    });
  };

  return [currentValue, setValue];
}

export function useMultiplayerHost(): boolean {
  const context = useContext(MultiplayerStateContext);
  return context?.isHost ?? true;
}

export function useMultiplayerPlayers<T extends { player1: string; player2: string }>(fallback: T): T {
  const context = useContext(MultiplayerStateContext);
  return (context?.players as T | null) || fallback;
}

export function useIsMultiplayerPlayer(slot: 0 | 1): boolean {
  const context = useContext(MultiplayerStateContext);
  const user = useAuthUser();
  if (!context) return true;
  const expectedUid = slot === 0 ? context.players?.player1Uid : context.players?.player2Uid;
  return !!user && !!expectedUid && user.uid === expectedUid;
}

export const MultiplayerTurnGuard: React.FC<{ slot: 0 | 1 | 'both'; waitingFor?: string; onExit?: () => void; children: React.ReactNode }> = ({ slot, waitingFor, onExit, children }) => {
  const context = useContext(MultiplayerStateContext);
  const user = useAuthUser();
  if (!context || slot === 'both') return <>{children}</>;
  const expectedUid = slot === 0 ? context.players?.player1Uid : context.players?.player2Uid;
  if (user?.uid && expectedUid && user.uid === expectedUid) return <>{children}</>;
  return <div className="relative"><div className="pointer-events-none select-none opacity-50">{children}</div><div className="absolute inset-0 z-[80] grid place-items-center rounded-3xl bg-black/65 p-6 text-center backdrop-blur-sm"><div className="rounded-2xl border border-violet-300/25 bg-[#171020]/95 px-6 py-5 shadow-2xl"><p className="text-xs font-semibold uppercase tracking-[.25em] text-violet-200">Their turn</p><p className="mt-2 text-lg font-semibold text-white">Waiting for {waitingFor || (slot === 0 ? context.players?.player1 : context.players?.player2) || 'the other player'}</p><p className="mt-1 text-xs text-slate-400">Your screen will update when they finish.</p>{onExit && <button type="button" onClick={onExit} className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">Exit game</button>}</div></div></div>;
};
