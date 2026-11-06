/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameSettings, CustomCard, GameHistoryEntry } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'after_hours_players',
  SETTINGS: 'after_hours_settings',
  CUSTOM_CARDS: 'after_hours_custom_cards',
  FAVORITES: 'after_hours_favorites',
  HISTORY: 'after_hours_history',
  MEMORIES: 'after_hours_memories',
  VIP_STATUS: 'after_hours_vip_status',
};

export interface StoredPlayers {
  player1: string;
  player2: string;
}

export interface StoredMemory {
  id: string;
  prompt: string;
  answer: string;
  author: string;
  date: string;
}

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  adultConfirmed: false,
  scoringEnabled: true,
  hapticFeedback: true,
  relationshipStage: 'dating',
  intensity: 'medium',
  activeCategories: {
    'easy_funny': true,
    'flirty': true,
    'romantic': true,
    'spicy': false, // Unlocked only when adult confirmed
    'deep_personal': true,
    'wild_cards': true,
  },
};

export const defaultPlayers: StoredPlayers = {
  player1: 'Alex',
  player2: 'Jordan',
};

export const storageService = {
  getPlayers(): StoredPlayers {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      return data ? JSON.parse(data) : defaultPlayers;
    } catch {
      return defaultPlayers;
    }
  },

  savePlayers(players: StoredPlayers): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch {
      // Ignored
    }
  },

  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignored
    }
  },

  getCustomCards(): CustomCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomCard(card: CustomCard): void {
    try {
      const existing = this.getCustomCards();
      const updated = [card, ...existing];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  },

  deleteCustomCard(id: string): void {
    try {
      const existing = this.getCustomCards();
      const updated = existing.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  },

  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(cardId: string): boolean {
    try {
      const favs = this.getFavorites();
      const exists = favs.includes(cardId);
      const updated = exists ? favs.filter(id => id !== cardId) : [...favs, cardId];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  },

  getMemories(): StoredMemory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMemory(memory: StoredMemory): void {
    try {
      const existing = this.getMemories();
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify([memory, ...existing]));
    } catch {
      // Ignored
    }
  },

  deleteMemory(id: string): void {
    try {
      const existing = this.getMemories();
      const updated = existing.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  },

  getHistory(): GameHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistory(entry: GameHistoryEntry): void {
    try {
      const history = this.getHistory();
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([entry, ...history.slice(0, 20)]));
    } catch {
      // Ignored
    }
  },

  clearAllData(): void {
    try {
      localStorage.clear();
    } catch {
      // Ignored
    }
  }
};
