/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Play, Pause, RotateCcw, Heart, Shield, Check, SkipForward } from 'lucide-react';
import { SPICY_CHALLENGE_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';
import { GameEngine } from '../services/gameEngine';

interface SpicyChallengeProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const SpicyChallenge: React.FC<SpicyChallengeProps> = ({
  players,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = SPICY_CHALLENGE_DECK.filter(c => matchesCategoryFilter(c.category, cat)).length;
    });
    return counts;
  }, []);

  const filteredChallenges = useMemo(() => {
    let list = SPICY_CHALLENGE_DECK;
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      list = list.filter(c => c.intensity !== 'spicy');
    }
    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      list = list.filter(c => matchesCategoryFilter(c.category, selectedCategory));
    }
    return list.length > 0 ? list : SPICY_CHALLENGE_DECK.filter(c => c.intensity !== 'spicy');
  }, [settings.adultConfirmed, settings.intensity, selectedCategory]);

  const currentChallenge = filteredChallenges[cardIndex % filteredChallenges.length];

  const handleShuffle = () => {
    setCardIndex(Math.floor(Math.random() * filteredChallenges.length));
    setIsTimerRunning(false);
  };

  const handleToggleCategory = (cat: string) => {
    setSelectedCategory(prev => {
      const currentList = Array.isArray(prev) ? prev : prev === 'Random Mix' || prev === 'All' ? [] : [prev];
      if (currentList.includes(cat)) {
        const nextList = currentList.filter(c => c !== cat);
        return nextList.length > 0 ? nextList : 'Random Mix';
      } else {
        return [...currentList, cat];
      }
    });
  };

  // Set initial timer if challenge has a duration or seconds
  useEffect(() => {
    const duration = (currentChallenge as any)?.seconds || (currentChallenge as any)?.seconds || 45;
    setTimeLeft(duration);
    setIsTimerRunning(false);
  }, [cardIndex, currentChallenge]);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            soundService.playBuzzer();
            return 0;
          }
          if (prev <= 4) {
            soundService.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const handleNextChallenge = (awarded: number) => {
    if (awarded > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        setScores(prev => ({ ...prev, player1: prev.player1 + awarded }));
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + awarded }));
      }
    }

    setCompletedCount(prev => prev + 1);

    if (completedCount + 1 >= 8) {
      setIsGameOver(true);
      return;
    }

    setCardIndex(prev => (prev + 1) % filteredChallenges.length);
    setTurnIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={turnIndex + 1}
        maxRounds={filteredChallenges.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="The Spicy Challenge"
        onExit={onExit}
        onRestart={() => {
          setCardIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
        }}
      />

      {/* Consent Reminder Badge */}
      <div className="mb-3.5 p-2.5 rounded-xl bg-pink-950/25 border border-pink-500/20 text-[11px] text-pink-300 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>Consensual &amp; Playful · Skip any challenge anytime with zero penalty</span>
        </div>
      </div>

      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onToggleCategory={handleToggleCategory}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
        isAdultConfirmed={settings.adultConfirmed}
        onRequestAgeGate={onRequestAgeGate}
        totalDeckSize={filteredChallenges.length}
        deckCounts={deckCounts}
        onShuffle={handleShuffle}
      />

      {/* Challenge Card */}
      {currentChallenge && (
        <GameCard
          key={`${currentChallenge.id}-${turnIndex}`}
          category={currentChallenge.category}
          cardId={currentChallenge.id}
          intensity={currentChallenge.intensity || 'spicy'}
          title={currentChallenge.title}
          typeLabel={`Level ${currentChallenge.level || 1} · Challenge`}
          content={currentChallenge.title}
          subcontent={currentChallenge.description || (currentChallenge as any).action}
          requireReveal={currentChallenge.intensity === 'spicy'}
          onSkip={() => handleNextChallenge(0)}
          onComplete={() => handleNextChallenge(15)}
          completeLabel="Challenge Completed! (+15 pts)"
          skipLabel="Skip Challenge"
        >
          {/* Optional countdown timer embedded inside card */}
          {timeLeft !== null && (
            <div className="my-2 p-3.5 rounded-2xl bg-black/50 border border-rose-500/30 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Countdown Timer</div>
                <div className="text-2xl font-mono font-bold text-rose-400 tabular-nums">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundService.playClick();
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition active:scale-95"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundService.playClick();
                    setIsTimerRunning(false);
                    setTimeLeft(currentChallenge.seconds || 30);
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </GameCard>
      )}

      <ResultsModal
        isOpen={isGameOver}
        gameMode="spicy_challenge"
        gameTitle="The Spicy Challenge"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={completedCount}
        onRematch={() => {
          setIsGameOver(false);
          setCardIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
