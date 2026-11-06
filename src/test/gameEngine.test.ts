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
