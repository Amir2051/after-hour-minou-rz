/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEngine } from '../services/gameEngine';
import {
  TRUTH_OR_DARE_DECK,
  HOW_WELL_KNOW_ME_DECK,
  WOULD_YOU_RATHER_DECK,
  NEVER_HAVE_I_EVER_DECK,
  SPICY_CHALLENGE_DECK,
  WHO_IS_MORE_LIKELY_DECK,
  FINISH_THE_SENTENCE_DECK,
  CHALLENGE_WHEEL_SEGMENTS,
  WHEEL_DYNAMIC_CHALLENGES,
  MEMORY_LANE_DECK,
  SIXTY_SECOND_CHALLENGES
} from '../data/defaultDecks';
import { storageService } from '../services/storage';
import { streakService, formatLocalDate, daysBetween } from '../services/streak';

// Mock localStorage for node environment
const storageMock: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => storageMock[key] || null,
  setItem: (key: string, val: string) => { storageMock[key] = val; },
  removeItem: (key: string) => { delete storageMock[key]; },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]); },
  key: (i: number) => Object.keys(storageMock)[i] || null,
  length: 0,
};

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('--- RUNNING AFTER HOURS GAME ENGINE TEST SUITE ---');

// Test 1: Decks Verification
console.log('\n[1] Decks Integrity & Content Count:');
assert(TRUTH_OR_DARE_DECK.length >= 30, `Truth or Dare has ${TRUTH_OR_DARE_DECK.length} cards (expected >= 30)`);
assert(HOW_WELL_KNOW_ME_DECK.length >= 10, `How Well Do You Know Me has ${HOW_WELL_KNOW_ME_DECK.length} cards`);
assert(WOULD_YOU_RATHER_DECK.length >= 10, `Would You Rather has ${WOULD_YOU_RATHER_DECK.length} cards`);
assert(NEVER_HAVE_I_EVER_DECK.length >= 15, `Never Have I Ever has ${NEVER_HAVE_I_EVER_DECK.length} cards`);
assert(SPICY_CHALLENGE_DECK.length >= 10, `Spicy Challenge has ${SPICY_CHALLENGE_DECK.length} cards`);
assert(WHO_IS_MORE_LIKELY_DECK.length >= 12, `Who Is More Likely To has ${WHO_IS_MORE_LIKELY_DECK.length} cards`);
assert(FINISH_THE_SENTENCE_DECK.length >= 10, `Finish the Sentence has ${FINISH_THE_SENTENCE_DECK.length} cards`);
assert(CHALLENGE_WHEEL_SEGMENTS.length >= 6, `Challenge Wheel has ${CHALLENGE_WHEEL_SEGMENTS.length} category segments`);
assert(CHALLENGE_WHEEL_SEGMENTS.every(segment => (WHEEL_DYNAMIC_CHALLENGES[segment.category] || []).length > 0), 'Every wheel segment has matching dynamic challenge prompts');
assert(MEMORY_LANE_DECK.length >= 6, `Memory Lane has ${MEMORY_LANE_DECK.length} prompts`);
assert(SIXTY_SECOND_CHALLENGES.length >= 7, `60-Second Challenges has ${SIXTY_SECOND_CHALLENGES.length} challenges`);

// Test 2: Card Uniqueness in Decks
console.log('\n[2] Card IDs & Uniqueness:');
const todIds = new Set(TRUTH_OR_DARE_DECK.map(c => c.id));
assert(todIds.size === TRUTH_OR_DARE_DECK.length, 'Truth or Dare IDs are unique');
const wyrIds = new Set(WOULD_YOU_RATHER_DECK.map(c => c.id));
assert(wyrIds.size === WOULD_YOU_RATHER_DECK.length, 'Would You Rather IDs are unique');

// Test 3: Non-Repeating Card Selection
console.log('\n[3] GameEngine Non-Repeating Selection Algorithm:');
const sampleDeck = [
  { id: 'c1', text: 'Card 1' },
  { id: 'c2', text: 'Card 2' },
  { id: 'c3', text: 'Card 3' },
  { id: 'c4', text: 'Card 4' },
];

let seen: string[] = [];
const pickedIds = new Set<string>();

for (let i = 0; i < 4; i++) {
  const result = GameEngine.getNextCard(sampleDeck, seen);
  assert(!seen.includes(result.card.id), `Card ${result.card.id} selected without prior repeat in round ${i + 1}`);
  pickedIds.add(result.card.id);
  seen = result.updatedSeenIds;
}

assert(pickedIds.size === 4, 'All 4 cards were selected once without duplication');

// Next pick after all seen should reshuffle
const reshuffled = GameEngine.getNextCard(sampleDeck, seen);
assert(reshuffled.isDeckReshuffled === true, 'Deck resets and marks reshuffled when all cards are exhausted');

// Test 4: Compatibility Calculation
console.log('\n[4] Compatibility Scoring Math:');
const score100 = GameEngine.calculateCompatibility(10, 10);
assert(score100 >= 95 && score100 <= 100, `100% matches yields compatibility ${score100}%`);
const scoreHalf = GameEngine.calculateCompatibility(5, 10);
assert(scoreHalf >= 80 && scoreHalf <= 95, `50% matches yields compatibility ${scoreHalf}%`);

// Test 5: Session Persistence
console.log('\n[5] Session State Persistence:');
GameEngine.saveSession({
  gameMode: 'truth_or_dare',
  round: 3,
  turnIndex: 5,
  scores: { player1: 30, player2: 20 },
  seenCardIds: ['c1', 'c2'],
  lastUpdated: Date.now(),
});

const retrieved = GameEngine.getSession('truth_or_dare');
assert(retrieved !== null, 'Session retrieved successfully from storage');
assert(retrieved?.round === 3, 'Stored round matches (3)');
assert(retrieved?.scores.player1 === 30, 'Stored player 1 score matches (30)');

GameEngine.clearSession();
assert(GameEngine.getSession('truth_or_dare') === null, 'Session cleared on demand');

// Test 6: Completed Game History Persistence
console.log('\\n[6] Completed Game History Persistence:');
const historyEntry = {
  gameMode: 'truth_or_dare' as const,
  timestamp: 123456789,
  winner: 'Tie',
  roundsPlayed: 8,
  compatibilityScore: 92,
  player1Name: 'Alex',
  player2Name: 'Jordan',
  player1Score: 40,
  player2Score: 40,
};
storageService.addHistory(historyEntry);
assert(storageService.getHistory().length === 1, 'Completed session is saved to local history');
assert(storageService.getHistory()[0]?.player1Score === 40, 'History preserves both players’ final scores');
storageService.clearHistory();
assert(storageService.getHistory().length === 0, 'Game history can be cleared independently');

// Test 7: Daily Streak Tracking & Rollover Math
console.log('\n[7] Daily Streak Tracking & Rollover Math:');
streakService.resetStreak();
const initialStreak = streakService.getStreak();
assert(initialStreak.currentStreak === 0, 'Initial streak begins at 0');
assert(initialStreak.playedToday === false, 'Initial state has playedToday = false');

// Day 1 play
const day1 = new Date('2026-11-01T14:00:00');
const streakAfterDay1 = streakService.recordGamePlay(day1);
assert(streakAfterDay1.currentStreak === 1, 'First play creates a 1-day streak');
assert(streakAfterDay1.playedToday === true, 'Played today is true on Day 1');
assert(streakAfterDay1.longestStreak === 1, 'Longest streak tracks 1 day');

// Same day replay shouldn't increment streak counter
const streakAfterReplay = streakService.recordGamePlay(day1);
assert(streakAfterReplay.currentStreak === 1, 'Playing again on same day preserves 1-day streak');

// Day 2 (consecutive day)
const day2 = new Date('2026-11-02T18:00:00');
const checkBeforeDay2Play = streakService.getStreak(day2);
assert(checkBeforeDay2Play.currentStreak === 1, 'Streak is still active on Day 2 morning before playing');
assert(checkBeforeDay2Play.playedToday === false, 'Played today is false on Day 2 morning');

const streakAfterDay2 = streakService.recordGamePlay(day2);
assert(streakAfterDay2.currentStreak === 2, 'Playing on consecutive day increments streak to 2');
assert(streakAfterDay2.longestStreak === 2, 'Longest streak updates to 2');
assert(streakAfterDay2.playedToday === true, 'Played today is true after Day 2 play');

// Day 3 (consecutive day)
const day3 = new Date('2026-11-03T20:00:00');
const streakAfterDay3 = streakService.recordGamePlay(day3);
assert(streakAfterDay3.currentStreak === 3, 'Consecutive day 3 play increments streak to 3');
assert(streakAfterDay3.longestStreak === 3, 'Longest streak updates to 3');

// Missed Day 4, checking on Day 5 (broken streak)
const day5 = new Date('2026-11-05T12:00:00');
const checkOnDay5 = streakService.getStreak(day5);
assert(checkOnDay5.currentStreak === 0, 'Streak resets to 0 after missing day 4');
assert(checkOnDay5.longestStreak === 3, 'Longest streak record (3) is retained after reset');

// Playing on Day 5 restarts fresh streak
const streakAfterDay5 = streakService.recordGamePlay(day5);
assert(streakAfterDay5.currentStreak === 1, 'Playing on Day 5 restarts streak at 1');
assert(streakAfterDay5.longestStreak === 3, 'Longest streak record remains preserved at 3');

// daysBetween helper
assert(daysBetween('2026-11-01', '2026-11-02') === 1, 'daysBetween correctly identifies 1 day gap');
assert(daysBetween('2026-11-01', '2026-11-05') === 4, 'daysBetween correctly identifies multi-day gap');


console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
}
