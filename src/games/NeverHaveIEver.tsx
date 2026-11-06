/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sparkles, Check, X as XIcon, RotateCcw } from 'lucide-react';
import { NEVER_HAVE_I_EVER_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface NeverHaveIEverProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const NeverHaveIEver: React.FC<NeverHaveIEverProps> = ({
  players,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [p1Response, setP1Response] = useState<'have' | 'never' | null>(null);
  const [p2Response, setP2Response] = useState<'have' | 'never' | null>(null);
  const [p1Sips, setP1Sips] = useState(0);
  const [p2Sips, setP2Sips] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = NEVER_HAVE_I_EVER_DECK.filter(item => matchesCategoryFilter(item.category, cat)).length;
    });
    return counts;
  }, []);

  const filteredDeck = useMemo(() => {
    let list = NEVER_HAVE_I_EVER_DECK;
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      list = list.filter(item => item.intensity !== 'spicy');
    }
    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      list = list.filter(item => matchesCategoryFilter(item.category, selectedCategory));
    }
    return list.length > 0 ? list : NEVER_HAVE_I_EVER_DECK;
  }, [settings.adultConfirmed, settings.intensity, selectedCategory]);

  const currentCard = filteredDeck[cardIndex % filteredDeck.length];

  const handleShuffle = () => {
    setCardIndex(Math.floor(Math.random() * filteredDeck.length));
    setP1Response(null);
    setP2Response(null);
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

  const handleP1Answer = (ans: 'have' | 'never') => {
    soundService.playClick();
    setP1Response(ans);
    if (ans === 'have') setP1Sips(prev => prev + 1);
  };

  const handleP2Answer = (ans: 'have' | 'never') => {
    soundService.playClick();
    setP2Response(ans);
    if (ans === 'have') setP2Sips(prev => prev + 1);
  };

  const handleNext = () => {
    soundService.playFlip();
    if (cardIndex + 1 >= filteredDeck.length) {
      setIsGameOver(true);
      return;
    }
    setCardIndex(prev => prev + 1);
    setP1Response(null);
    setP2Response(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer="Both Players"
        partnerPlayer="Couple"
        round={cardIndex + 1}
        maxRounds={filteredDeck.length}
        scores={{ player1: p1Sips, player2: p2Sips }}
        player1Name={`${players.player1} (Admits)`}
        player2Name={`${players.player2} (Admits)`}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Never Have I Ever"
        onExit={onExit}
        onRestart={() => {
          setCardIndex(0);
          setP1Response(null);
          setP2Response(null);
          setP1Sips(0);
          setP2Sips(0);
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
        totalDeckSize={filteredDeck.length}
        deckCounts={deckCounts}
        onShuffle={handleShuffle}
      />

      <GameCard
        key={`${currentCard?.id}-${cardIndex}`}
        category={currentCard?.category || 'Couple Confessions'}
        intensity={currentCard?.intensity || 'medium'}
        typeLabel="Never Have I Ever"
        cardNumber={cardIndex + 1}
        totalCards={filteredDeck.length}
        content={`"${currentCard?.text}"`}
        subcontent="Both players answer honestly. Whoever has done it takes a sip or admits the confession!"
        onSkip={handleNext}
        onComplete={() => {
          soundService.playSuccess();
          handleNext();
        }}
        completeLabel="Next Statement"
        skipLabel="Skip Card"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Player 1 response */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <div className="text-xs font-semibold text-pink-400 mb-2">{players.player1}:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleP1Answer('have')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  p1Response === 'have'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-900/40 ring-1 ring-pink-400'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>I Have!</span>
              </button>
              <button
                type="button"
                onClick={() => handleP1Answer('never')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  p1Response === 'never'
                    ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <XIcon className="w-3.5 h-3.5" />
                <span>Never</span>
              </button>
            </div>
          </div>

          {/* Player 2 response */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <div className="text-xs font-semibold text-purple-400 mb-2">{players.player2}:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleP2Answer('have')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  p2Response === 'have'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>I Have!</span>
              </button>
              <button
                type="button"
                onClick={() => handleP2Answer('never')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  p2Response === 'never'
                    ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <XIcon className="w-3.5 h-3.5" />
                <span>Never</span>
              </button>
            </div>
          </div>
        </div>
      </GameCard>

      <ResultsModal
        isOpen={isGameOver}
        gameMode="never_have_i_ever"
        gameTitle="Never Have I Ever"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={p1Sips}
        player2Score={p2Sips}
        totalCardsPlayed={filteredDeck.length}
        onRematch={() => {
          setIsGameOver(false);
          setCardIndex(0);
          setP1Response(null);
          setP2Response(null);
          setP1Sips(0);
          setP2Sips(0);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
