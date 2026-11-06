/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Heart, BookmarkPlus, Check, ChevronRight, History } from 'lucide-react';
import { MEMORY_LANE_DECK } from '../data/defaultDecks';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers, storageService } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface MemoryLaneProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
}

export const MemoryLane: React.FC<MemoryLaneProps> = ({
  players,
  settings,
  onExit,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);
  const [savedAnswer, setSavedAnswer] = useState('');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isGameOver, setIsGameOver] = useState(false);

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const currentMemory = MEMORY_LANE_DECK[cardIndex % MEMORY_LANE_DECK.length];

  const handleSaveToJournal = () => {
    if (!savedAnswer.trim()) return;
    soundService.playSuccess();
    storageService.saveMemory({
      id: `memlane-${Date.now()}`,
      prompt: currentMemory.title + ': ' + currentMemory.question,
      answer: savedAnswer.trim(),
      author: activePlayer,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleNext = (awarded: number) => {
    soundService.playFlip();
    if (awarded > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        setScores(prev => ({ ...prev, player1: prev.player1 + awarded }));
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + awarded }));
      }
    }

    if (cardIndex + 1 >= MEMORY_LANE_DECK.length) {
      setIsGameOver(true);
      return;
    }

    setCardIndex(prev => prev + 1);
    setTurnIndex(prev => prev + 1);
    setSavedAnswer('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={cardIndex + 1}
        maxRounds={MEMORY_LANE_DECK.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Memory Lane"
        onExit={onExit}
        onRestart={() => {
          setCardIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setSavedAnswer('');
        }}
      />

      <GameCard
        key={`${currentMemory.id}-${turnIndex}`}
        category={`Era: ${currentMemory.era}`}
        intensity="medium"
        title={currentMemory.title}
        typeLabel="Memory Lane"
        content={currentMemory.question}
        subcontent={currentMemory.followUp ? `Bonus Prompt: ${currentMemory.followUp}` : undefined}
        onSkip={() => handleNext(0)}
        onComplete={() => {
          soundService.playSuccess();
          handleNext(10);
        }}
      >
        {/* Text Journal Input */}
        <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 text-left my-2">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-medium text-pink-300">Save this memory to your Journal:</span>
            {savedNotice && (
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Preserved in Journal!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={savedAnswer}
              onChange={(e) => setSavedAnswer(e.target.value)}
              placeholder="What did you two recall? Type a key line here..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            />
            <button
              type="button"
              onClick={handleSaveToJournal}
              disabled={!savedAnswer.trim()}
              className="py-2 px-3 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1 shrink-0"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </GameCard>

      <ResultsModal
        isOpen={isGameOver}
        gameTitle="Memory Lane"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={MEMORY_LANE_DECK.length}
        onRematch={() => {
          setIsGameOver(false);
          setCardIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setSavedAnswer('');
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
