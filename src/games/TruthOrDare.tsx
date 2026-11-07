import React, { useMemo, useEffect } from 'react';
import { useGameState as useState, useMultiplayerPlayers, MultiplayerTurnGuard, useMultiplayerHost } from '../multiplayer/useGameState';
import { Sparkles, Dices, Flame } from 'lucide-react';
import { GameCardItem, GameSettings } from '../types';
import { TRUTH_OR_DARE_DECK } from '../data/defaultDecks';
import { GLOBAL_CATEGORIES, matchesCategoryFilter } from '../data/categories';
import { TurnIndicator } from '../components/TurnIndicator';
import { GameCard } from '../components/GameCard';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ResultsModal } from '../components/ResultsModal';
import { storageService, StoredPlayers } from '../services/storage';
import { soundService } from '../services/audio';
import { GameEngine } from '../services/gameEngine';

interface TruthOrDareProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
  onRequestAgeGate: () => void;
}

export const TruthOrDare: React.FC<TruthOrDareProps> = ({
  players: localPlayers,
  settings,
  onExit,
  onRequestAgeGate,
}) => {
  const players = useMultiplayerPlayers(localPlayers);
  const isMultiplayerHost = useMultiplayerHost();
  // Check for existing active session
  const existingSession = useMemo(() => GameEngine.getSession('truth_or_dare'), []);

  const [turnIndex, setTurnIndex] = useState(existingSession?.turnIndex ?? 0);
  const [round, setRound] = useState(existingSession?.round ?? 1);
  const [scores, setScores] = useState(existingSession?.scores ?? { player1: 0, player2: 0 });
  const [selectedType, setSelectedType] = useState<'truth' | 'dare' | 'random'>('random');
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('Random Mix');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [seenCardIds, setSeenCardIds] = useState<string[]>(existingSession?.seenCardIds ?? []);
  const [completedCount, setCompletedCount] = useState(existingSession?.seenCardIds.length ?? 0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(storageService.getFavorites());

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  // Compute deck counts per category
  const deckCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GLOBAL_CATEGORIES.forEach(cat => {
      counts[cat] = TRUTH_OR_DARE_DECK.filter(c => matchesCategoryFilter(c.category, cat)).length;
    });
    return counts;
  }, []);

  // Combine default deck with any custom cards
  const combinedDeck = useMemo(() => {
    const custom = storageService.getCustomCards()
      .filter(c => c.mode === 'truth_or_dare')
      .map(c => ({
        id: c.id,
        category: c.category || 'Custom',
        type: (c.type === 'dare' ? 'dare' : 'truth') as 'truth' | 'dare',
        intensity: c.intensity,
        text: c.text,
      }));

    let all = [...TRUTH_OR_DARE_DECK, ...custom];

    // Filter out spicy cards if 18+ not confirmed or intensity is mild
    if (!settings.adultConfirmed || settings.intensity === 'mild') {
      all = all.filter(c => c.intensity !== 'spicy');
    }

    if (selectedCategory !== 'Random Mix' && selectedCategory !== 'All') {
      all = all.filter(c => matchesCategoryFilter(c.category, selectedCategory));
    }

    if (selectedType !== 'random') {
      all = all.filter(c => c.type === selectedType);
    }

    return all.length > 0 ? all : TRUTH_OR_DARE_DECK;
  }, [settings.adultConfirmed, settings.intensity, selectedCategory, selectedType]);

  // Current card selected non-repetitively
  const [currentCard, setCurrentCard] = useState<GameCardItem>(() => {
    try {
      const next = GameEngine.getNextCard(combinedDeck, seenCardIds);
      return next.card;
    } catch {
      return combinedDeck[0];
    }
  });

  const handleShuffle = () => {
    const next = GameEngine.getNextCard(combinedDeck, []);
    setCurrentCard(next.card);
    setSeenCardIds([next.card.id]);
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

  // Re-pick card when filter changes
  useEffect(() => {
    if (!isMultiplayerHost) return;
    try {
      const next = GameEngine.getNextCard(combinedDeck, []);
      setCurrentCard(next.card);
      setSeenCardIds([next.card.id]);
    } catch {
      // Ignore
    }
  }, [selectedCategory, selectedType, combinedDeck, isMultiplayerHost]);

  // Auto-save session state
  useEffect(() => {
    if (!isGameOver) {
      GameEngine.saveSession({
        gameMode: 'truth_or_dare',
        round,
        turnIndex,
        scores,
        seenCardIds,
        lastUpdated: Date.now(),
      });
    }
  }, [round, turnIndex, scores, seenCardIds, isGameOver]);

  const handleNextTurn = (awardedScore: number) => {
    const newScores = { ...scores };
    if (awardedScore > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        newScores.player1 += awardedScore;
      } else {
        newScores.player2 += awardedScore;
      }
      setScores(newScores);
    }

    const nextCount = completedCount + 1;
    setCompletedCount(nextCount);

    if (round >= 12 && nextCount >= 12) {
      setIsGameOver(true);
      GameEngine.clearSession();
      return;
    }

    // Pick next non-repeating card
    const nextSelection = GameEngine.getNextCard(combinedDeck, seenCardIds);
    setCurrentCard(nextSelection.card);
    setSeenCardIds(nextSelection.updatedSeenIds);

    const nextTurn = turnIndex + 1;
    setTurnIndex(nextTurn);
    setRound(Math.floor(nextTurn / 2) + 1);
  };

  const handleToggleFavorite = () => {
    if (!currentCard) return;
    const isNowFav = storageService.toggleFavorite(currentCard.id);
    setFavorites(prev => isNowFav ? [...prev, currentCard.id] : prev.filter(id => id !== currentCard.id));
  };

  return (
    <MultiplayerTurnGuard onExit={onExit} slot={isGameOver ? 'both' : (turnIndex % 2) as 0 | 1}>
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={round}
        maxRounds={12}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Truth or Dare"
        onExit={onExit}
        onRestart={() => {
          setTurnIndex(0);
          setRound(1);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
          const next = GameEngine.getNextCard(combinedDeck, []);
          setCurrentCard(next.card);
          setSeenCardIds([next.card.id]);
        }}
      />

      {/* Choice Selector Controls: Truth, Dare, or Random */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            soundService.playClick();
            setSelectedType('truth');
          }}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            selectedType === 'truth'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          Truth Only
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setSelectedType('dare');
          }}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            selectedType === 'dare'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-900/40'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          Dare Only
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setSelectedType('random');
          }}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedType === 'random'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Random Mix</span>
        </button>
      </div>

      {/* Reusable Category Filter Bar with Multi-select, Counts & Age Gate */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onToggleCategory={handleToggleCategory}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
        isAdultConfirmed={settings.adultConfirmed}
        onRequestAgeGate={onRequestAgeGate}
        totalDeckSize={combinedDeck.length}
        deckCounts={deckCounts}
        onShuffle={handleShuffle}
      />

      {/* Main Playable Card */}
      {currentCard && (
        <GameCard
          key={`${currentCard.id}-${turnIndex}`}
          category={currentCard.category}
          intensity={currentCard.intensity}
          typeLabel={currentCard.type?.toUpperCase()}
          content={currentCard.text}
          isFavorite={favorites.includes(currentCard.id)}
          onToggleFavorite={handleToggleFavorite}
          requireReveal={true}
          onSkip={() => handleNextTurn(0)}
          onComplete={() => handleNextTurn(10)}
        />
      )}

      {/* Results Modal */}
      <ResultsModal
        isOpen={isGameOver}
        gameMode="truth_or_dare"
        gameTitle="Truth or Dare"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={completedCount}
        onRematch={() => {
          setIsGameOver(false);
          setTurnIndex(0);
          setRound(1);
          setScores({ player1: 0, player2: 0 });
          setCompletedCount(0);
          const next = GameEngine.getNextCard(combinedDeck, []);
          setCurrentCard(next.card);
          setSeenCardIds([next.card.id]);
        }}
        onReturnHome={onExit}
      />
    </div>
    </MultiplayerTurnGuard>
  );
};
