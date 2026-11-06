/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameModeId =
  | 'truth_or_dare'
  | 'how_well_know_me'
  | 'would_you_rather'
  | 'never_have_i_ever'
  | 'spicy_challenge'
  | 'who_is_more_likely'
  | 'finish_the_sentence'
  | 'challenge_wheel'
  | 'memory_lane'
  | 'sixty_seconds';

export type RelationshipStage =
  | 'dating'
  | 'new_relationship'
  | 'long_term'
  | 'engaged'
  | 'married';

export type IntensityLevel = 'mild' | 'medium' | 'spicy';

export interface PlayerProfile {
  name: string;
  avatarSeed?: string;
  score: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  adultConfirmed: boolean;
  scoringEnabled: boolean;
  hapticFeedback: boolean;
  relationshipStage: RelationshipStage;
  intensity: IntensityLevel;
  activeCategories: Record<string, boolean>;
}

export interface CustomCard {
  id: string;
  mode: GameModeId;
  type?: 'truth' | 'dare' | 'question' | 'statement' | 'prompt';
  text: string;
  category: string;
  intensity: IntensityLevel;
  createdAt: number;
}

export interface GameCardItem {
  id: string;
  text: string;
  subtext?: string;
  type?: 'truth' | 'dare' | 'choice_a' | 'choice_b' | 'statement' | 'prompt';
  optionA?: string;
  optionB?: string;
  category: string;
  intensity: IntensityLevel;
  level?: number;
  timeLimit?: number; // for timed challenges
}

export interface GameHistoryEntry {
  gameMode: GameModeId;
  timestamp: number;
  winner?: string;
  roundsPlayed: number;
  compatibilityScore?: number;
  player1Name?: string;
  player2Name?: string;
  player1Score?: number;
  player2Score?: number;
}
