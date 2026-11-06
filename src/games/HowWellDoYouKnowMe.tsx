/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Eye, Check, X as XIcon, HelpCircle, Trophy } from 'lucide-react';
import { HOW_WELL_KNOW_ME_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { CardArtwork } from '../components/CardArtwork';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';

interface HowWellDoYouKnowMeProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const HowWellDoYouKnowMe: React.FC<HowWellDoYouKnowMeProps> = ({
  players,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<'guesser' | 'target' | 'revealed'>('guesser');
  const [guessedOption, setGuessedOption] = useState<string | null>(null);
  const [actualOption, setActualOption] = useState<string | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [matches, setMatches] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = HOW_WELL_KNOW_ME_DECK.filter(q => matchesCategoryFilter(q.category, cat)).length;
    });
    return counts;
  }, []);

  const filteredDeck = useMemo(() => {
    let list = HOW_WELL_KNOW_ME_DECK;
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      list = list.filter(q => q.intensity !== 'spicy');
    }
    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      list = list.filter(q => matchesCategoryFilter(q.category, selectedCategory));
    }
    return list.length > 0 ? list : HOW_WELL_KNOW_ME_DECK;
  }, [settings.adultConfirmed, settings.intensity, selectedCategory]);

  const targetPlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const guesserPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const currentQ = filteredDeck[questionIndex % filteredDeck.length];

  const handleShuffle = () => {
    setQuestionIndex(Math.floor(Math.random() * filteredDeck.length));
    setGuessedOption(null);
    setActualOption(null);
    setPhase('guesser');
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

  const handleGuessSubmit = (opt: string) => {
    soundService.playClick();
    setGuessedOption(opt);
    setPhase('target');
  };

  const handleActualSubmit = (opt: string) => {
    setActualOption(opt);
    const isCorrect = guessedOption === opt;
    if (isCorrect) {
      soundService.playSuccess();
      setMatches(prev => prev + 1);
      if (settings.scoringEnabled) {
        if (turnIndex % 2 === 0) {
          setScores(prev => ({ ...prev, player2: prev.player2 + 10 }));
        } else {
          setScores(prev => ({ ...prev, player1: prev.player1 + 10 }));
        }
      }
    } else {
      soundService.playClick();
    }
    setPhase('revealed');
  };

  const handleNextQuestion = () => {
    soundService.playClick();
    if (questionIndex + 1 >= HOW_WELL_KNOW_ME_DECK.length) {
      setIsGameOver(true);
      return;
    }
    setQuestionIndex(prev => prev + 1);
    setTurnIndex(prev => prev + 1);
    setGuessedOption(null);
    setActualOption(null);
    setPhase('guesser');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={guesserPlayer}
        partnerPlayer={targetPlayer}
        round={questionIndex + 1}
        maxRounds={filteredDeck.length}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="How Well Do You Know Me?"
        onExit={onExit}
        onRestart={() => {
          setQuestionIndex(0);
          setTurnIndex(0);
          setPhase('guesser');
          setGuessedOption(null);
          setActualOption(null);
          setScores({ player1: 0, player2: 0 });
          setMatches(0);
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

      {/* Main Game Card */}
      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 min-h-[360px] flex flex-col justify-between relative overflow-hidden border border-pink-500/25">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <CardArtwork category={currentQ.category} intensity={currentQ.intensity || 'medium'} className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-pink-500/15">
            <span className="font-semibold text-pink-400 uppercase tracking-wider">
              {currentQ.category}
            </span>
            <span>
              Subject: <strong className="text-white">{targetPlayer}</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-medium text-white my-6 leading-snug">
            {currentQ.question.replace('your partner', targetPlayer)}
          </h2>
        </div>

        {/* Phase 1: Guesser picks their prediction */}
        {phase === 'guesser' && (
          <div>
            <div className="text-xs text-pink-300 font-semibold mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>{guesserPlayer}: What do you think {targetPlayer}'s answer is?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleGuessSubmit(opt)}
                  className="p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-slate-200 hover:bg-pink-950/30 hover:border-pink-500/40 hover:text-white transition active:scale-98"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase 2: Target reveals their real preference */}
        {phase === 'target' && (
          <div className="animate-in fade-in">
            <div className="text-xs text-purple-300 font-semibold mb-3 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Pass phone to {targetPlayer}: What is your REAL answer?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleActualSubmit(opt)}
                  className="p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-slate-200 hover:bg-purple-950/30 hover:border-purple-500/40 hover:text-white transition active:scale-98"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase 3: Reveal and Result */}
        {phase === 'revealed' && (
          <div className="animate-in zoom-in-95 duration-200 text-center py-4 space-y-4">
            {guessedOption === actualOption ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-base font-bold text-white">Direct Match! +10 Points</div>
                <p className="text-xs text-emerald-300/80 mt-1">
                  {guesserPlayer} correctly knew that {targetPlayer}'s choice is "{actualOption}".
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200">
                <div className="w-10 h-10 mx-auto rounded-full bg-rose-600/30 flex items-center justify-center text-rose-400 mb-2">
                  <XIcon className="w-5 h-5" />
                </div>
                <div className="text-base font-bold text-white">Plot Twist!</div>
                <p className="text-xs text-rose-200/90 mt-1">
                  {guesserPlayer} guessed <strong className="text-white">"{guessedOption}"</strong>, but {targetPlayer}'s real pick is <strong className="text-pink-300">"{actualOption}"</strong>!
                </p>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-98 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>

      <ResultsModal
        isOpen={isGameOver}
        gameMode="how_well_know_me"
        gameTitle="How Well Do You Know Me?"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={HOW_WELL_KNOW_ME_DECK.length}
        compatibilityPercentage={Math.round((matches / HOW_WELL_KNOW_ME_DECK.length) * 100)}
        onRematch={() => {
          setIsGameOver(false);
          setQuestionIndex(0);
          setTurnIndex(0);
          setPhase('guesser');
          setGuessedOption(null);
          setActualOption(null);
          setScores({ player1: 0, player2: 0 });
          setMatches(0);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
