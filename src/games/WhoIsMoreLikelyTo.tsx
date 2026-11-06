/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Check, X as XIcon, Users } from 'lucide-react';
import { WHO_IS_MORE_LIKELY_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { CardArtwork } from '../components/CardArtwork';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface WhoIsMoreLikelyToProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const WhoIsMoreLikelyTo: React.FC<WhoIsMoreLikelyToProps> = ({
  players,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [p1Vote, setP1Vote] = useState<string | null>(null);
  const [p2Vote, setP2Vote] = useState<string | null>(null);
  const [phase, setPhase] = useState<'p1' | 'p2' | 'revealed'>('p1');
  const [matches, setMatches] = useState(0);
  const [playedCount, setPlayedCount] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = WHO_IS_MORE_LIKELY_DECK.filter(q => matchesCategoryFilter(q.category, cat)).length;
    });
    return counts;
  }, []);

  const filteredDeck = useMemo(() => {
    let list = WHO_IS_MORE_LIKELY_DECK;
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      list = list.filter(q => q.intensity !== 'spicy');
    }
    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      list = list.filter(q => matchesCategoryFilter(q.category, selectedCategory));
    }
    return list.length > 0 ? list : WHO_IS_MORE_LIKELY_DECK.filter(q => q.intensity !== 'spicy');
  }, [settings.adultConfirmed, settings.intensity, selectedCategory]);

  const currentQ = filteredDeck[questionIndex % filteredDeck.length];

  const handleShuffle = () => {
    setPlayedCount(0);
    setQuestionIndex(Math.floor(Math.random() * filteredDeck.length));
    setP1Vote(null);
    setP2Vote(null);
    setPhase('p1');
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

  const handleP1Choice = (choice: string) => {
    soundService.playClick();
    setP1Vote(choice);
    setPhase('p2');
  };

  const handleP2Choice = (choice: string) => {
    setP2Vote(choice);
    const isMatch = p1Vote === choice;
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
    setPhase('revealed');
  };

  const handleNext = () => {
    soundService.playClick();
    setPlayedCount(prev => prev + 1);
    if (playedCount + 1 >= filteredDeck.length) {
      setIsGameOver(true);
      return;
    }
    setQuestionIndex(prev => prev + 1);
    setP1Vote(null);
    setP2Vote(null);
    setPhase('p1');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={phase === 'p1' ? players.player1 : phase === 'p2' ? players.player2 : 'Reveal'}
        partnerPlayer={phase === 'p1' ? players.player2 : players.player1}
        round={playedCount + 1}
        maxRounds={filteredDeck.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Who Is More Likely To?"
        onExit={onExit}
        onRestart={() => {
          setQuestionIndex(0);
          setP1Vote(null);
          setP2Vote(null);
          setPhase('p1');
          setMatches(0);
          setPlayedCount(0);
          setScores({ player1: 0, player2: 0 });
        }}
      />

      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden border border-pink-500/25">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <CardArtwork category={currentQ.category} intensity="medium" className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-pink-500/15">
            <span className="font-semibold text-pink-400 uppercase tracking-wider">
              {currentQ.category}
            </span>
            <span className="text-slate-300">
              Matches: <strong className="text-pink-400">{matches}</strong>
            </span>
          </div>

          <div className="text-center my-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-white leading-snug">
              "{currentQ.text}"
            </h2>
          </div>
        </div>

        {/* Phase 1: Player 1 Secret Vote */}
        {phase === 'p1' && (
          <div className="space-y-4">
            <div className="text-center text-xs text-pink-300 font-semibold mb-2">
              Pass to <strong className="text-white">{players.player1}</strong> — Who fits this better?
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleP1Choice(players.player1)}
                className="p-5 rounded-2xl bg-white/5 border border-pink-500/20 hover:bg-pink-950/40 text-center transition active:scale-98"
              >
                <div className="text-xs text-pink-400 uppercase font-semibold mb-1">Me</div>
                <div className="text-base font-bold text-white">{players.player1}</div>
              </button>

              <button
                onClick={() => handleP1Choice(players.player2)}
                className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 hover:bg-purple-950/40 text-center transition active:scale-98"
              >
                <div className="text-xs text-purple-400 uppercase font-semibold mb-1">My Partner</div>
                <div className="text-base font-bold text-white">{players.player2}</div>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Player 2 Secret Vote */}
        {phase === 'p2' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center text-xs text-purple-300 font-semibold mb-2">
              Pass to <strong className="text-white">{players.player2}</strong> — Who do you think fits this?
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleP2Choice(players.player1)}
                className="p-5 rounded-2xl bg-white/5 border border-pink-500/20 hover:bg-pink-950/40 text-center transition active:scale-98"
              >
                <div className="text-xs text-pink-400 uppercase font-semibold mb-1">{players.player1}</div>
                <div className="text-base font-bold text-white">{players.player1}</div>
              </button>

              <button
                onClick={() => handleP2Choice(players.player2)}
                className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 hover:bg-purple-950/40 text-center transition active:scale-98"
              >
                <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Me</div>
                <div className="text-base font-bold text-white">{players.player2}</div>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Revealed Votes & Point Allocation */}
        {phase === 'revealed' && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-pink-400 font-semibold mb-1">{players.player1} Voted:</div>
                <div className="text-lg font-bold text-white">{p1Vote}</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-purple-400 font-semibold mb-1">{players.player2} Voted:</div>
                <div className="text-lg font-bold text-white">{p2Vote}</div>
              </div>
            </div>

            {p1Vote === p2Vote ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Unanimous Agreement on {p1Vote}! (+10 pts each)</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  You both see eye-to-eye on who possesses this quality.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center">
                <div className="text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5">
                  <XIcon className="w-4 h-4" />
                  <span>Split Decision!</span>
                </div>
                <p className="text-[11px] text-rose-200/80 mt-1">
                  {players.player1} thought {p1Vote}, while {players.player2} thought {p2Vote}. Defend your verdict!
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-98 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>

      <ResultsModal
        isOpen={isGameOver}
        gameTitle="Who Is More Likely To?"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={playedCount}
        compatibilityPercentage={playedCount ? Math.round((matches / playedCount) * 100) : 0}
        onRematch={() => {
          setIsGameOver(false);
          setQuestionIndex(0);
          setP1Vote(null);
          setP2Vote(null);
          setPhase('p1');
          setMatches(0);
          setPlayedCount(0);
          setScores({ player1: 0, player2: 0 });
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
