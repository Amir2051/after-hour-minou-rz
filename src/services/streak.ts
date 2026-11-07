/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // ISO 'YYYY-MM-DD' in local timezone
  playedToday: boolean;
  streakHistory: string[]; // List of unique sorted 'YYYY-MM-DD'
  updatedAt: number;
}

const STREAK_STORAGE_KEY = 'after_hours_daily_streak';

/**
 * Format date as local 'YYYY-MM-DD'
 */
export function formatLocalDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Compute difference in calendar days between two 'YYYY-MM-DD' strings (d2 - d1)
 */
export function daysBetween(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

export const streakService = {
  /**
   * Get current streak data, validating against current date
   */
  getStreak(now: Date = new Date()): DailyStreakData {
    const todayStr = formatLocalDate(now);
    const fallback: DailyStreakData = {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
      playedToday: false,
      streakHistory: [],
      updatedAt: Date.now(),
    };

    try {
      const raw = localStorage.getItem(STREAK_STORAGE_KEY);
      if (!raw) {
        // Attempt to bootstrap from existing history if available
        return this.bootstrapFromHistory(todayStr);
      }

      const data: DailyStreakData = JSON.parse(raw);
      if (!data.lastPlayedDate) {
        return fallback;
      }

      const diff = daysBetween(data.lastPlayedDate, todayStr);

      if (diff === 0) {
        // Played today
        return {
          ...data,
          currentStreak: Math.max(1, data.currentStreak),
          playedToday: true,
        };
      } else if (diff === 1) {
        // Played yesterday: streak is alive but couple has not played yet today
        return {
          ...data,
          playedToday: false,
        };
      } else if (diff > 1) {
        // Missed at least one day: streak has lapsed to 0
        return {
          ...data,
          currentStreak: 0,
          playedToday: false,
        };
      } else {
        // Negative diff (clock adjusted backwards): treat as played today
        return {
          ...data,
          playedToday: true,
        };
      }
    } catch {
      return fallback;
    }
  },

  /**
   * Record a game played today, updating consecutive streak counter
   */
  recordGamePlay(date: Date = new Date()): DailyStreakData {
    const todayStr = formatLocalDate(date);
    const current = this.getStreak(date);

    let newCurrentStreak: number;
    let newHistory = [...(current.streakHistory || [])];

    if (current.playedToday && current.lastPlayedDate === todayStr) {
      // Already counted for today
      newCurrentStreak = Math.max(1, current.currentStreak);
    } else if (current.lastPlayedDate) {
      const diff = daysBetween(current.lastPlayedDate, todayStr);
      if (diff === 1) {
        // Consecutive day
        newCurrentStreak = current.currentStreak + 1;
      } else {
        // First play or broken streak
        newCurrentStreak = 1;
      }
    } else {
      // Very first game played
      newCurrentStreak = 1;
    }

    if (!newHistory.includes(todayStr)) {
      newHistory.push(todayStr);
      newHistory.sort();
      // Keep last 90 days of history
      if (newHistory.length > 90) {
        newHistory = newHistory.slice(newHistory.length - 90);
      }
    }

    const newLongest = Math.max(current.longestStreak || 0, newCurrentStreak);

    const updatedData: DailyStreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongest,
      lastPlayedDate: todayStr,
      playedToday: true,
      streakHistory: newHistory,
      updatedAt: Date.now(),
    };

    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updatedData));
      // Notify listeners in same window
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('after_hours_streak_updated', { detail: updatedData }));
      }
    } catch {
      // Ignore storage quota
    }

    return updatedData;
  },

  /**
   * Helper to seed streak from past game history records if streak storage is empty
   */
  bootstrapFromHistory(todayStr: string): DailyStreakData {
    try {
      const historyRaw = localStorage.getItem('after_hours_history');
      if (!historyRaw) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
          playedToday: false,
          streakHistory: [],
          updatedAt: Date.now(),
        };
      }

      const history: Array<{ timestamp: number }> = JSON.parse(historyRaw);
      if (!Array.isArray(history) || history.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
          playedToday: false,
          streakHistory: [],
          updatedAt: Date.now(),
        };
      }

      // Extract unique dates from history
      const dateSet = new Set<string>();
      history.forEach(item => {
        if (item.timestamp) {
          dateSet.add(formatLocalDate(new Date(item.timestamp)));
        }
      });

      const dates = Array.from(dateSet).sort();
      if (dates.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
          playedToday: false,
          streakHistory: [],
          updatedAt: Date.now(),
        };
      }

      // Check the latest date
      const latestDate = dates[dates.length - 1];
      const diffToToday = daysBetween(latestDate, todayStr);

      if (diffToToday > 1) {
        // History ended before yesterday
        return {
          currentStreak: 0,
          longestStreak: Math.min(dates.length, 3),
          lastPlayedDate: latestDate,
          playedToday: false,
          streakHistory: dates,
          updatedAt: Date.now(),
        };
      }

      // Count consecutive days backward from latestDate
      let streak = 1;
      for (let i = dates.length - 2; i >= 0; i--) {
        const step = daysBetween(dates[i], dates[i + 1]);
        if (step === 1) {
          streak++;
        } else {
          break;
        }
      }

      const playedToday = diffToToday === 0;
      const streakData: DailyStreakData = {
        currentStreak: streak,
        longestStreak: Math.max(streak, dates.length),
        lastPlayedDate: latestDate,
        playedToday,
        streakHistory: dates,
        updatedAt: Date.now(),
      };

      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
      return streakData;
    } catch {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDate: null,
        playedToday: false,
        streakHistory: [],
        updatedAt: Date.now(),
      };
    }
  },

  /**
   * Reset streak (for debug or testing)
   */
  resetStreak(): void {
    try {
      localStorage.removeItem(STREAK_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('after_hours_streak_updated', {
          detail: {
            currentStreak: 0,
            longestStreak: 0,
            lastPlayedDate: null,
            playedToday: false,
            streakHistory: [],
            updatedAt: Date.now(),
          }
        }));
      }
    } catch {
      // Ignore
    }
  }
};
