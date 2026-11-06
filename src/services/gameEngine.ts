/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameCardItem, GameModeId } from '../types';

export interface ActiveGameSessionState {
  gameMode: GameModeId;
  round: number;
  turnIndex: number;
  scores: { player1: number; player2: number };
  seenCardIds: string[];
  currentCardId?: string;
  gameSpecificData?: Record<string, any>;
  lastUpdated: number;
}

const ACTIVE_SESSION_KEY = 'after_hours_active_session';

export class GameEngine {
  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  public static shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Selects next random card from deck without repeating cards seen in current session
   */
  public static getNextCard<T extends { id: string }>(
    deck: T[],
    seenIds: string[]
  ): { card: T; updatedSeenIds: string[]; isDeckReshuffled: boolean } {
    if (deck.length === 0) {
      throw new Error('Deck cannot be empty');
    }

    const unseen = deck.filter(c => !seenIds.includes(c.id));

    if (unseen.length === 0) {
      // All cards have been seen once - reshuffle and reset seen list
      const randomCard = deck[Math.floor(Math.random() * deck.length)];
      return {
        card: randomCard,
        updatedSeenIds: [randomCard.id],
        isDeckReshuffled: true,
      };
    }

    const randomCard = unseen[Math.floor(Math.random() * unseen.length)];
    return {
      card: randomCard,
      updatedSeenIds: [...seenIds, randomCard.id],
      isDeckReshuffled: false,
    };
  }

  /**
   * Calculate couple compatibility percentage based on matching choices & scores
   */
  public static calculateCompatibility(
    matches: number,
    totalQuestions: number,
    baseSeed: number = 82
  ): number {
    if (totalQuestions <= 0) return 85;
    const ratio = matches / totalQuestions;
    const computed = Math.round(baseSeed + ratio * 16);
    return Math.min(100, Math.max(65, computed));
  }

  /**
   * Session persistence methods to survive accidental reloads
   */
  public static saveSession(session: ActiveGameSessionState): void {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
        ...session,
        lastUpdated: Date.now(),
      }));
    } catch {
      // Ignore write errors in private browsing quota limits
    }
  }

  public static getSession(mode?: GameModeId): ActiveGameSessionState | null {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!raw) return null;
      const parsed: ActiveGameSessionState = JSON.parse(raw);
      // Expire session older than 12 hours
      if (Date.now() - parsed.lastUpdated > 12 * 60 * 60 * 1000) {
        this.clearSession();
        return null;
      }
      if (mode && parsed.gameMode !== mode) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  public static clearSession(): void {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // Ignore
    }
  }
}
