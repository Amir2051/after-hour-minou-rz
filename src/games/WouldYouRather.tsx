/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Eye, Check, Sparkles, Heart } from 'lucide-react';
import { WOULD_YOU_RATHER_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { CardArtwork } from '../components/CardArtwork';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface WouldYouRatherProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const WouldYouRather: React.FC<WouldYouRatherProps> = ({
  players,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [p1Choice, setP1Choice] = useState<'A' | 'B' | null>(null);
  const [p2Choice, setP2Choice] = useState<'A' | 'B' | null>(null);
  const [stage, setStage] = useState<'p1_turn' | 'p2_turn' | 'revealed'>('p1_turn');
  const [matches, setMatches] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = WOULD_YOU_RATHER_DECK.filter(c => matchesCategoryFilter(c.category, cat)).length;
    });
    return counts;
  }, []);

  const deck = useMemo(() => {
    let list = WOULD_YOU_RATHER_DECK;
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      list = list.filter(c => c.intensity !== 'spicy');
    }
    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      list = list.filter(c => matchesCategoryFilter(c.category, selectedCategory));
    }
    return list.length > 0 ? list : WOULD_YOU_RATHER_DECK;
  }, [settings.adultConfirmed, settings.intensity, selectedCategory]);

  const currentCard = deck[cardIndex % deck.length];

  const handleShuffle = () => {
    setCardIndex(Math.floor(Math.random() * deck.length));
    setP1Choice(null);
    setP2Choice(null);
    setStage('p1_turn');
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

  const handleP1Pick = (choice: 'A' | 'B') => {
    soundService.playClick();
    setP1Choice(choice);
    setStage('p2_turn');
  };

  const handleP2Pick = (choice: 'A' | 'B') => {
    setP2Choice(choice);
    const isMatch = p1Choice === choice;
    if (isMatch) {
      soundService.playSuccess();
      setMatches(prev => prev + 1);
      if (settings.scoringEnabled) {
        setScores(prev => ({
          player1: prev.player1 + 10,
          player2: prev.player2 + 10,
        }));
      }
    } else {
      soundService.playClick();
    }
    setStage('revealed');
  };

  const handleNext = () => {
    soundService.playClick();
    if (cardIndex + 1 >= deck.length) {
      setIsGameOver(true);
      return;
    }
    setCardIndex(prev => prev + 1);
    setP1Choice(null);
    setP2Choice(null);
    setStage('p1_turn');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={stage === 'p1_turn' ? players.player1 : stage === 'p2_turn' ? players.player2 : 'Both Players'}
        partnerPlayer={stage === 'p1_turn' ? players.player2 : players.player1}
        round={cardIndex + 1}
        maxRounds={deck.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Would You Rather?"
        onExit={onExit}
        onRestart={() => {
          setCardIndex(0);
          setP1Choice(null);
          setP2Choice(null);
          setStage('p1_turn');
          setMatches(0);
          setScores({ player1: 0, player2: 0 });
        }}
      />

      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onToggleCategory={handleToggleCategory}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
        isAdultConfirmed={settings.adultConfirmed}
        onRequestAgeGate={onRequestAgeGate}
        totalDeckSize={deck.length}
        deckCounts={deckCounts}
        onShuffle={handleShuffle}
      />

      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden border border-pink-500/25">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <CardArtwork category={currentCard.category} intensity={currentCard.intensity} className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-pink-500/15">
            <span className="font-semibold text-pink-400 uppercase tracking-wider">
              {currentCard.category}
            </span>
            <span className="text-slate-300">
              Matches: <strong className="text-pink-400">{matches}</strong>
            </span>
          </div>

          <div className="text-center my-4">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight">
              Would You Rather...
            </h2>
          </div>
        </div>

        {/* Phase 1: Player 1 Picks in Secret */}
        {stage === 'p1_turn' && (
          <div className="space-y-4">
            <div className="text-center text-xs text-pink-300 font-semibold mb-2">
              Pass to <strong className="text-white">{players.player1}</strong> — Make your confidential choice:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleP1Pick('A')}
                className="p-5 rounded-2xl bg-white/5 border border-pink-500/20 text-left hover:bg-pink-950/40 hover:border-pink-500/50 transition active:scale-98"
              >
                <div className="text-xs uppercase font-bold text-pink-400 mb-2">Option A</div>
                <p className="text-sm font-medium text-white leading-relaxed">{currentCard.optionA}</p>
              </button>

              <button
                onClick={() => handleP1Pick('B')}
                className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 text-left hover:bg-purple-950/40 hover:border-purple-500/50 transition active:scale-98"
              >
                <div className="text-xs uppercase font-bold text-purple-400 mb-2">Option B</div>
                <p className="text-sm font-medium text-white leading-relaxed">{currentCard.optionB}</p>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Player 2 Picks in Secret */}
        {stage === 'p2_turn' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center text-xs text-purple-300 font-semibold mb-2">
              Pass to <strong className="text-white">{players.player2}</strong> — Now make your secret choice:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleP2Pick('A')}
                className="p-5 rounded-2xl bg-white/5 border border-pink-500/20 text-left hover:bg-pink-950/40 hover:border-pink-500/50 transition active:scale-98"
              >
                <div className="text-xs uppercase font-bold text-pink-400 mb-2">Option A</div>
                <p className="text-sm font-medium text-white leading-relaxed">{currentCard.optionA}</p>
              </button>

              <button
                onClick={() => handleP2Pick('B')}
                className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 text-left hover:bg-purple-950/40 hover:border-purple-500/50 transition active:scale-98"
              >
                <div className="text-xs uppercase font-bold text-purple-400 mb-2">Option B</div>
                <p className="text-sm font-medium text-white leading-relaxed">{currentCard.optionB}</p>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Simultaneous Reveal & Compatibility Check */}
        {stage === 'revealed' && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-pink-400 font-semibold mb-1">{players.player1} Chose:</div>
                <div className="text-base font-bold text-white mb-1">
                  Option {p1Choice}
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {p1Choice === 'A' ? currentCard.optionA : currentCard.optionB}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-purple-400 font-semibold mb-1">{players.player2} Chose:</div>
                <div className="text-base font-bold text-white mb-1">
                  Option {p2Choice}
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {p2Choice === 'A' ? currentCard.optionA : currentCard.optionB}
                </p>
              </div>
            </div>

            {p1Choice === p2Choice ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Synchronized Desire! Both Chose Option {p1Choice}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  You two share the exact same appetite and vision here.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center">
                <div className="text-xs font-bold text-purple-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Delicious Contrast!</span>
                </div>
                <p className="text-[11px] text-purple-200/80 mt-1">
                  One picked Option A, the other picked Option B. Debate and convince your partner!
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-98 transition"
            >
              Next Would You Rather
            </button>
          </div>
        )}
      </div>

      <ResultsModal
        isOpen={isGameOver}
        gameTitle="Would You Rather?"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={deck.length}
        compatibilityPercentage={Math.round((matches / deck.length) * 100)}
        onRematch={() => {
          setIsGameOver(false);
          setCardIndex(0);
          setP1Choice(null);
          setP2Choice(null);
          setStage('p1_turn');
          setMatches(0);
          setScores({ player1: 0, player2: 0 });
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
