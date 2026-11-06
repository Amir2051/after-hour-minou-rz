export type RefereeScope = 'player1' | 'player2' | 'shared';

export interface RefereeMemory {
  id: string;
  text: string;
  scope: RefereeScope;
  createdAt: number;
}

export interface RefereeMessage {
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
}

const MEMORY_KEY = 'after_hours_referee_memories_v1';

export const refereeMemoryService = {
  getAll(): RefereeMemory[] {
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      return raw ? JSON.parse(raw) as RefereeMemory[] : [];
    } catch {
      return [];
    }
  },

  save(text: string, scope: RefereeScope): RefereeMemory {
    const memory: RefereeMemory = {
      id: globalThis.crypto?.randomUUID?.() || `memory-${Date.now()}`,
      text: text.trim().slice(0, 600),
      scope,
      createdAt: Date.now(),
    };
    const next = [memory, ...this.getAll()].slice(0, 100);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
    return memory;
  },

  remove(id: string): void {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(this.getAll().filter(item => item.id !== id)));
  },

  clear(): void {
    localStorage.removeItem(MEMORY_KEY);
  },

  forScope(scope: RefereeScope): RefereeMemory[] {
    return this.getAll().filter(item => item.scope === scope);
  },
};
