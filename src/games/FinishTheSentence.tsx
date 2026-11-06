/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PenLine, BookmarkPlus, Check, Sparkles, Plus } from 'lucide-react';
import { FINISH_THE_SENTENCE_DECK } from '../data/defaultDecks';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers, storageService } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface FinishTheSentenceProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
}

export const FinishTheSentence: React.FC<FinishTheSentenceProps> = ({
  players,
  settings,
  onExit,
}) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [savedMemoryNotice, setSavedMemoryNotice] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [activeDeck, setActiveDeck] = useState(FINISH_THE_SENTENCE_DECK);

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const currentPrompt = activeDeck[promptIndex % activeDeck.length];

  const handleSaveMemory = () => {
    if (!writtenAnswer.trim()) return;
    soundService.playSuccess();
    storageService.saveMemory({
      id: `mem-${Date.now()}`,
      prompt: currentPrompt.prompt,
      answer: writtenAnswer.trim(),
      author: activePlayer,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSavedMemoryNotice(true);
    setTimeout(() => setSavedMemoryNotice(false), 2500);
  };

  const handleNextTurn = (awarded: number) => {
    if (awarded > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        setScores(prev => ({ ...prev, player1: prev.player1 + awarded }));
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + awarded }));
      }
    }

    setCompletedCount(prev => prev + 1);

    if (completedCount + 1 >= 7) {
      setIsGameOver(true);
      return;
    }

    setPromptIndex(prev => (prev + 1) % activeDeck.length);
    setTurnIndex(prev => prev + 1);
    setWrittenAnswer('');
  };

  const handleAddCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptInput.trim()) return;
    soundService.playSuccess();
    const newEntry = {
      id: `fts-custom-${Date.now()}`,
      category: 'Our Custom Prompts',
      prompt: customPromptInput.trim(),
    };
    setActiveDeck(prev => [newEntry, ...prev]);
    setCustomPromptInput('');
    setShowAddCustom(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={turnIndex + 1}
        maxRounds={7}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Finish the Sentence"
        onExit={onExit}
        onRestart={() => {
          setPromptIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
          setWrittenAnswer('');
        }}
      />

      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs text-pink-300 font-medium">Speaking aloud to <strong className="text-white">{partnerPlayer}</strong></span>
        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="text-pink-300 hover:text-white flex items-center gap-1 transition text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Prompt</span>
        </button>
      </div>

      {showAddCustom && (
        <form onSubmit={handleAddCustomPrompt} className="mb-4 p-3 rounded-2xl bg-black/50 border border-pink-500/30">
          <label className="block text-xs font-medium text-pink-300 mb-1">Create a Custom Sentence Starter:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPromptInput}
              onChange={(e) => setCustomPromptInput(e.target.value)}
              placeholder="e.g. If we could freeze one moment forever, it would be..."
              className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="py-2 px-3 rounded-xl bg-pink-600 text-white text-xs font-semibold hover:bg-pink-500 transition"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <GameCard
        key={`${currentPrompt.id}-${turnIndex}`}
        category={currentPrompt.category}
        intensity="medium"
        typeLabel="Finish The Sentence"
        cardNumber={turnIndex + 1}
        totalCards={7}
        content={`"${currentPrompt.prompt}"`}
        subcontent={`Take your time. Speak aloud to ${partnerPlayer} from the heart, tease, or reminisce.`}
        onSkip={() => {
          soundService.playClick();
          handleNextTurn(0);
        }}
        onComplete={() => {
          soundService.playSuccess();
          handleNextTurn(10);
        }}
        completeLabel="Spoken & Shared (+10 pts)"
        skipLabel="Skip Card"
      >
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <PenLine className="w-3.5 h-3.5 text-pink-400" />
              Optional: Save to Relationship Journal
            </span>
            {savedMemoryNotice && (
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              placeholder="Type the finished sentence here to remember it..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/60"
            />
            <button
              type="button"
              onClick={handleSaveMemory}
              disabled={!writtenAnswer.trim()}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium disabled:opacity-40 transition flex items-center gap-1"
              title="Save into Relationship Memories"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </GameCard>

      <ResultsModal
        isOpen={isGameOver}
        gameTitle="Finish the Sentence"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={completedCount}
        onRematch={() => {
          setIsGameOver(false);
          setPromptIndex(0);
          setTurnIndex(0);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
