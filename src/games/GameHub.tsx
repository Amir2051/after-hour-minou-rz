/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Heart,
  HelpCircle,
  Split,
  MessageCircleQuestion,
  Sparkles,
  Users,
  Timer,
  History,
  Dices,
  Play,
  Bookmark,
  Shield,
  ChevronRight,
  PlusCircle,
  Crown,
  Trash2,
  X
} from 'lucide-react';
import { GameModeId, IntensityLevel, GameSettings } from '../types';
import { StoredPlayers, storageService } from '../services/storage';
import { soundService } from '../services/audio';

interface GameHubProps {
  players: StoredPlayers;
  settings: GameSettings;
  onSelectGame: (gameId: GameModeId) => void;
  onOpenPlayerSetup: () => void;
  onOpenCustomBuilder: () => void;
  onOpenVip: () => void;
  onRequestAgeGate: () => void;
  onOpenMultiplayer: () => void;
  onOpenChess: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({
  players,
  settings,
  onSelectGame,
  onOpenPlayerSetup,
  onOpenCustomBuilder,
  onOpenVip,
  onRequestAgeGate,
  onOpenMultiplayer,
  onOpenChess,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'spicy' | 'romantic' | 'speed' | 'favorites'>('all');
  const [showMemoriesModal, setShowMemoriesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [, setHistoryVersion] = useState(0);

  const customCardsCount = storageService.getCustomCards().length;
  const favoritesCount = storageService.getFavorites().length;
  const savedMemories = storageService.getMemories();
  const gameHistory = storageService.getHistory();

  interface GameMeta {
    id: GameModeId;
    title: string;
    tagline: string;
    category: 'spicy' | 'romantic' | 'speed' | 'classic';
    intensity: IntensityLevel;
    icon: React.ReactNode;
    color: string;
    approxMinutes: number;
    description: string;
    isSpicyOnly?: boolean;
  }

  const games: GameMeta[] = [
    {
      id: 'truth_or_dare',
      title: 'Truth or Dare',
      tagline: 'Classic with a seductive twist',
      category: 'classic',
      intensity: settings.intensity,
      icon: <Dices className="w-5 h-5" />,
      color: 'from-pink-600 to-rose-600',
      approxMinutes: 15,
      description: 'Random selections, custom categories, hilarious truths, and electrifying dares.',
    },
    {
      id: 'how_well_know_me',
      title: 'How Well Do You Know Me?',
      tagline: 'Compatibility test & partner guessing',
      category: 'romantic',
      intensity: 'mild',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'from-purple-600 to-pink-600',
      approxMinutes: 12,
      description: 'One answers secretly, the other guesses. Reveal actual truth and earn synergy points.',
    },
    {
      id: 'would_you_rather',
      title: 'Would You Rather?',
      tagline: 'Intimate & hilarious dilemmas',
      category: 'classic',
      intensity: 'medium',
      icon: <Split className="w-5 h-5" />,
      color: 'from-rose-600 to-amber-600',
      approxMinutes: 10,
      description: 'Both choose in secret, reveal together, and measure your instinctive alignment.',
    },
    {
      id: 'never_have_i_ever',
      title: 'Never Have I Ever',
      tagline: 'Confessions, blush moments & secrets',
      category: 'classic',
      intensity: 'medium',
      icon: <MessageCircleQuestion className="w-5 h-5" />,
      color: 'from-fuchsia-600 to-pink-600',
      approxMinutes: 12,
      description: 'Find out the untold stories, embarrassing habits, and wild moments from their past.',
    },
    {
      id: 'spicy_challenge',
      title: 'The Spicy Challenge',
      tagline: 'Consent-first adult intimacy exploration',
      category: 'spicy',
      intensity: 'spicy',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-red-600 via-rose-600 to-pink-600',
      approxMinutes: 20,
      description: 'Flirty touches, teasing whispers, and sensual activities for consenting adults.',
      isSpicyOnly: true,
    },
    {
      id: 'who_is_more_likely',
      title: 'Who Is More Likely To?',
      tagline: 'Couples dynamic showdown',
      category: 'classic',
      intensity: 'mild',
      icon: <Users className="w-5 h-5" />,
      color: 'from-indigo-600 to-purple-600',
      approxMinutes: 10,
      description: 'Who is more chaotic? Who plans the best surprises? Vote and see if your thoughts match.',
    },
    {
      id: 'challenge_wheel',
      title: 'Couples Challenge Wheel',
      tagline: 'Spin the wheel of romantic destiny',
      category: 'speed',
      intensity: 'medium',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-amber-600 to-rose-600',
      approxMinutes: 15,
      description: 'Truth, Dare, Kiss, Compliment, and Wild Card. Spin with real physics & audio.',
    },
    {
      id: 'finish_the_sentence',
      title: 'Finish the Sentence',
      tagline: 'Heartfelt vulnerability & sweet vows',
      category: 'romantic',
      intensity: 'medium',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-600 to-purple-600',
      approxMinutes: 15,
      description: 'Speak your unspoken thoughts. Save your most precious answers to your shared journal.',
    },
    {
      id: 'memory_lane',
      title: 'Memory Lane',
      tagline: 'Relive your journey and biggest sparks',
      category: 'romantic',
      intensity: 'mild',
      icon: <History className="w-5 h-5" />,
      color: 'from-violet-600 to-pink-600',
      approxMinutes: 15,
      description: 'From your awkward first date to shared milestones and dreams for five years from now.',
    },
    {
      id: 'sixty_seconds',
      title: '60-Second Challenges',
      tagline: 'Fast-paced countdown couple games',
      category: 'speed',
      intensity: 'medium',
      icon: <Timer className="w-5 h-5" />,
      color: 'from-rose-600 to-orange-600',
      approxMinutes: 10,
      description: 'High energy timed challenges, rapid-fire questions, and uninterrupted eye-contact tests.',
    },
  ];

  const filteredGames = games.filter(g => {
    if (selectedFilter === 'spicy') return g.category === 'spicy' || g.intensity === 'spicy';
    if (selectedFilter === 'romantic') return g.category === 'romantic';
    if (selectedFilter === 'speed') return g.category === 'speed';
    return true;
  });

  const handleGameClick = (game: GameMeta) => {
    soundService.playClick();
    if (game.isSpicyOnly && !settings.adultConfirmed) {
      onRequestAgeGate();
      return;
    }
    onSelectGame(game.id);
  };

  const stageLabels: Record<string, string> = {
    dating: 'Dating',
    new_relationship: 'New Flame',
    long_term: 'Long-Term Partners',
    engaged: 'Engaged',
    married: 'Married Life',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-10 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-pink-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Two Players · No Limits · Just Good Times
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight text-glow-pink">
            Turn Up The Heat Together.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Playing as <strong className="text-pink-300">{players.player1}</strong> &amp; <strong className="text-purple-300">{players.player2}</strong> ({stageLabels[settings.relationshipStage] || 'Couple'}). Pass the phone, flirt fearlessly, and explore each other.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleGameClick(games[0])}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Quick Start · Truth or Dare</span>
            </button>

            <button
              onClick={() => { soundService.playClick(); onOpenMultiplayer(); }}
              className="py-3 px-5 rounded-2xl bg-violet-500/15 border border-violet-300/25 text-violet-100 hover:bg-violet-500/25 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Invite a player · Any game
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                onOpenPlayerSetup();
              }}
              className="py-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition"
            >
              Adjust Players &amp; Rules
            </button>

            {savedMemories.length > 0 && (
              <button
                onClick={() => {
                  soundService.playClick();
                  setShowMemoriesModal(true);
                }}
                className="py-3 px-4 rounded-2xl bg-pink-950/30 border border-pink-500/20 text-pink-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4 text-pink-400" />
                <span>Memories Journal ({savedMemories.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            soundService.playClick();
            onOpenCustomBuilder();
          }}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 text-left transition group active:scale-98"
        >
          <div className="flex items-center justify-between text-pink-400 mb-1">
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-[11px] font-mono text-slate-400">{customCardsCount} cards</span>
          </div>
          <div className="text-xs font-semibold text-white">Deck Builder</div>
          <div className="text-[10px] text-slate-400">Add custom cards &amp; dares</div>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            if (!settings.adultConfirmed) {
              onRequestAgeGate();
            } else {
              handleGameClick(games[4]); // Spicy Challenge
            }
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-950/40 to-black/50 border border-pink-500/30 hover:border-pink-500/60 text-left transition group active:scale-98"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-pink-400">{settings.adultConfirmed ? 'Unlocked' : '18+'}</span>
          </div>
          <div className="text-xs font-semibold text-white">Spicy Challenges</div>
          <div className="text-[10px] text-slate-400">Consensual intimate prompts</div>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            onOpenVip();
          }}
          className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 text-left transition group active:scale-98"
        >
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <Crown className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-amber-300">Preview</span>
          </div>
          <div className="text-xs font-semibold text-white">After Dark VIP</div>
          <div className="text-[10px] text-slate-400">Future monetization preview</div>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            handleGameClick(games[6]); // Challenge wheel
          }}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 text-left transition group active:scale-98"
        >
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-purple-300">Interactive</span>
          </div>
          <div className="text-xs font-semibold text-white">Challenge Wheel</div>
          <div className="text-[10px] text-slate-400">Spin for instant surprises</div>
        </button>
        <button
          onClick={() => {
            soundService.playClick();
            setHistoryVersion(value => value + 1);
            setShowHistoryModal(true);
          }}
          className="p-3.5 rounded-2xl bg-white/5 border border-rose-400/20 hover:border-rose-300/50 text-left transition group active:scale-98"
        >
          <div className="flex items-center justify-between text-rose-300 mb-1">
            <History className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-rose-200">{gameHistory.length} saved</span>
          </div>
          <div className="text-xs font-semibold text-white">Game History</div>
          <div className="text-[10px] text-slate-400">Revisit your completed nights</div>
        </button>
      </div>

      {/* Filter Tabs (Functional segmented controls) */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-tight">
            Game Collection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a mode to launch immediate two-player turn-based gameplay.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
          {[
            { id: 'all', label: 'All 11 Games' },
            { id: 'spicy', label: 'Spicy & Bold' },
            { id: 'romantic', label: 'Romantic & Deep' },
            { id: 'speed', label: 'Timed & Wheel' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundService.playClick();
                setSelectedFilter(f.id as any);
              }}
              className={`py-1.5 px-3 rounded-lg font-medium transition-all ${
                selectedFilter === f.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 10 Playable Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className="group rounded-3xl glass-panel p-6 flex flex-col justify-between hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-900/20 transition-all duration-300 relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white shadow-md shadow-pink-900/30 group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  ~{game.approxMinutes} mins · 2 Players
                </div>
              </div>

              <h3 className="text-lg font-bold font-serif text-white group-hover:text-pink-300 transition-colors">
                {game.title}
              </h3>
              <p className="text-xs text-pink-400/90 font-medium mt-0.5">
                {game.tagline}
              </p>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                {game.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-pink-400 capitalize">{game.intensity} Intensity</span>
              <button
                type="button"
                onClick={() => handleGameClick(game)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${game.color} px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-950/30 hover:brightness-110 active:scale-95 transition`}
                aria-label={`Play ${game.title}`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Game</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chess is a separate multiplayer experience, not a GameModeId deck game. */}
      <section className="mt-5 rounded-3xl glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-violet-400/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">♞</div>
          <div>
            <h3 className="text-lg font-bold font-serif text-white">Chess</h3>
            <p className="text-xs text-violet-200 mt-0.5">Classic strategy · Live online match · 2 accounts</p>
            <p className="text-xs text-slate-300 mt-2">Challenge your partner to a full legal chess match with synchronized moves, turn tracking, and move explanations.</p>
          </div>
        </div>
        <button type="button" onClick={() => { soundService.playClick(); onOpenChess(); }} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110">
          <Users className="w-4 h-4" /> Invite &amp; Play Chess <ChevronRight className="w-4 h-4" />
        </button>
      </section>


      {/* Completed Game History */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative my-6">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              aria-label="Close game history"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-rose-300" />
              <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold">Your nights together</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Game History</h2>
            <p className="text-xs text-slate-300 mt-1">Completed sessions saved on this device, newest first.</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">{gameHistory.length} of 100 sessions saved</span>
              {gameHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (!window.confirm('Clear all saved game history from this device?')) return;
                    storageService.clearHistory();
                    setHistoryVersion(value => value + 1);
                  }}
                  className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear history
                </button>
              )}
            </div>
            <div className="mt-4 max-h-[55vh] overflow-y-auto space-y-2 pr-1">
              {gameHistory.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[.04] py-10 text-center">
                  <History className="mx-auto mb-2 h-7 w-7 text-slate-500" />
                  <p className="text-sm font-semibold text-white">No completed games yet</p>
                  <p className="mt-1 text-xs text-slate-400">Finish a game and your scores will appear here.</p>
                </div>
              ) : (
                gameHistory.map((entry, index) => (
                  <div key={entry.timestamp + '-' + index} className="rounded-2xl border border-white/10 bg-white/[.045] p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{entry.gameMode.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase())}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="rounded-full border border-rose-300/20 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold text-rose-200">{entry.roundsPlayed} rounds</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300">{entry.player1Name || players.player1} <strong className="text-rose-300">{entry.player1Score ?? 0}</strong> · {entry.player2Name || players.player2} <strong className="text-purple-300">{entry.player2Score ?? 0}</strong></span>
                      <span className="text-slate-400">{entry.winner === 'Tie' ? 'It’s a tie' : entry.winner ? entry.winner + ' won' : 'Session saved'}</span>
                    </div>
                    {typeof entry.compatibilityScore === 'number' && (
                      <p className="mt-2 text-[10px] font-semibold text-rose-300">Couple synergy: {entry.compatibilityScore}%</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15">Close History</button>
          </div>
        </div>
      )}

      {/* Memories Journal Modal */}
      {showMemoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative my-6">
            <button
              onClick={() => setShowMemoriesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-4 h-4 text-pink-500" />
              <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold">Saved Keepsakes</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Your Relationship Journal</h2>
            <p className="text-xs text-slate-300 mt-1">
              Private memories and heartfelt answers recorded on this device.
            </p>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">{savedMemories.length} entries saved</span>
              {savedMemories.length > 0 && (
                <button
                  onClick={() => {
                    const text = savedMemories.map(m => `[${m.date}] ${m.author}:\nPrompt: "${m.prompt}"\nAnswer: "${m.answer}"\n`).join('\n---\n\n');
                    navigator.clipboard.writeText(text);
                    soundService.playSuccess();
                  }}
                  className="text-pink-400 hover:text-pink-300 text-xs font-semibold underline"
                >
                  Copy All to Clipboard
                </button>
              )}
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-3 pr-1">
              {savedMemories.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No memories saved yet. Play "Finish the Sentence" or "Memory Lane" and save answers!
                </div>
              ) : (
                savedMemories.map(m => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs relative group">
                    <div className="flex items-center justify-between text-[10px] text-pink-400 font-semibold mb-1">
                      <span>Shared by {m.author}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{m.date}</span>
                        <button
                          onClick={() => {
                            soundService.playClick();
                            storageService.deleteMemory(m.id);
                            // force re-read
                            setSelectedFilter(prev => prev);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition"
                          title="Delete memory"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-300 italic mb-1.5">"{m.prompt}"</div>
                    <div className="text-white font-medium text-xs bg-black/40 p-2.5 rounded-xl border border-white/5">
                      "{m.answer}"
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowMemoriesModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
            >
              Close Journal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
