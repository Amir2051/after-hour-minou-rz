/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Check, SkipForward, Flame } from 'lucide-react';
import { SIXTY_SECOND_CHALLENGES } from '../data/defaultDecks';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface SixtySecondChallengeProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
}

export const SixtySecondChallenge: React.FC<SixtySecondChallengeProps> = ({
  players,
  settings,
  onExit,
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const currentChallenge = SIXTY_SECOND_CHALLENGES[challengeIndex % SIXTY_SECOND_CHALLENGES.length];

  // Reset timer on challenge change
  useEffect(() => {
    setTimeLeft(currentChallenge.seconds);
    setIsRunning(false);
  }, [challengeIndex, currentChallenge]);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            soundService.playBuzzer();
            return 0;
          }
          if (prev <= 5) {
            soundService.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleNextChallenge = (awarded: number) => {
    if (awarded > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        setScores(prev => ({ ...prev, player1: prev.player1 + awarded }));
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + awarded }));
      }
    }

    setCompletedCount(prev => prev + 1);

    if (completedCount + 1 >= SIXTY_SECOND_CHALLENGES.length) {
      setIsGameOver(true);
      return;
    }

    setChallengeIndex(prev => prev + 1);
    setTurnIndex(prev => prev + 1);
  };

  const timerProgress = ((currentChallenge.seconds - timeLeft) / currentChallenge.seconds) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={challengeIndex + 1}
        maxRounds={SIXTY_SECOND_CHALLENGES.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="60-Second Couple Challenges"
        onExit={onExit}
        onRestart={() => {
          setChallengeIndex(0);
          setTurnIndex(0);
          setTimeLeft(60);
          setIsRunning(false);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
        }}
      />

      <GameCard
        key={`${currentChallenge.id}-${challengeIndex}`}
        category="Rapid Fire Challenge"
        intensity="wild"
        typeLabel={`Challenger: ${activePlayer}`}
        cardNumber={challengeIndex + 1}
        totalCards={SIXTY_SECOND_CHALLENGES.length}
        content={currentChallenge.title}
        subcontent={`"${currentChallenge.description}"`}
        onSkip={() => handleNextChallenge(0)}
        onComplete={() => {
          soundService.playSuccess();
          handleNextChallenge(20);
        }}
        completeLabel="Beat the Clock! (+20 pts)"
        skipLabel="Skip Challenge"
      >
        <div className="space-y-4 text-center">
          <div className="text-xs text-slate-300 bg-white/5 py-2 px-3.5 rounded-xl inline-block border border-white/5 backdrop-blur-sm">
            💡 {currentChallenge.instructions}
          </div>

          {/* Big Stopwatch Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden bg-black/60 shadow-inner">
              <div
                className="absolute inset-0 bg-pink-600/25 rounded-full transition-all duration-1000"
                style={{ clipPath: `inset(${100 - timerProgress}% 0 0 0)` }}
              />
              <span className={`text-4xl font-mono font-black tabular-nums relative z-10 ${
                timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'
              }`}>
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest relative z-10">
                {timeLeft === 0 ? "TIME'S UP!" : isRunning ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>

            {/* Timer Controls */}
            <div className="mt-3.5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setIsRunning(!isRunning);
                }}
                className={`py-2 px-5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 text-white shadow-amber-900/40 hover:bg-amber-500'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause Timer' : timeLeft === 0 ? 'Restart Timer' : 'Start 60 Seconds'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setIsRunning(false);
                  setTimeLeft(currentChallenge.seconds);
                }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition"
                title="Reset Timer to 60s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </GameCard>

      <ResultsModal
        isOpen={isGameOver}
        gameTitle="60-Second Couple Challenges"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={SIXTY_SECOND_CHALLENGES.length}
        onRematch={() => {
          setIsGameOver(false);
          setChallengeIndex(0);
          setTurnIndex(0);
          setTimeLeft(60);
          setIsRunning(false);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
