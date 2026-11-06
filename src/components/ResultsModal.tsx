/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Heart, RotateCcw, Home, Sparkles, Check } from 'lucide-react';
import { fireHeartConfetti } from './Confetti';
import { soundService } from '../services/audio';

interface ResultsModalProps {
  isOpen: boolean;
  gameTitle: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  totalCardsPlayed: number;
  compatibilityPercentage?: number;
  onRematch: () => void;
  onReturnHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  gameTitle,
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  totalCardsPlayed,
  compatibilityPercentage,
  onRematch,
  onReturnHome,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      soundService.playFanfare();
      fireHeartConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalScore = player1Score + player2Score;
  const compatibility = compatibilityPercentage ?? Math.min(100, Math.max(72, Math.round(85 + (totalScore % 14))));

  const getChemistryTitle = (score: number) => {
    if (score >= 90) return 'Undeniable Chemistry · Soulmate Energy';
    if (score >= 80) return 'Electric Connection · Sparks Are Flying';
    if (score >= 70) return 'Playful Partners · Highly Compatible';
    return 'Deliciously Unpredictable · opposites Attract';
  };

  const handleShare = () => {
    soundService.playClick();
    const text = `🔥 AFTER HOURS Game Results for ${player1Name} & ${player2Name}:\nMode: ${gameTitle}\nCompatibility: ${compatibility}%\nCompleted Challenges: ${totalCardsPlayed}\n"${getChemistryTitle(compatibility)}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative my-6 text-center border border-pink-500/30">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-pink-900/50 mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="text-xs uppercase tracking-widest text-pink-400 font-semibold mb-1">
          Session Complete
        </div>
        <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
          {gameTitle}
        </h2>
        <p className="text-xs text-pink-200/80 mt-1">
          {getChemistryTitle(compatibility)}
        </p>

        {/* Compatibility Meter */}
        <div className="my-6 p-4 rounded-2xl bg-black/40 border border-pink-500/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              Couple Synergy
            </span>
            <span className="text-lg font-extrabold text-pink-400">{compatibility}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all duration-1000"
              style={{ width: `${compatibility}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">Total Cards</div>
              <div className="text-base font-bold text-white">{totalCardsPlayed}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">Total Points</div>
              <div className="text-base font-bold text-pink-300">{totalScore}</div>
            </div>
          </div>
        </div>

        {/* Score comparison */}
        <div className="flex items-center justify-center gap-6 text-sm mb-6">
          <div className="text-center">
            <div className="text-xs text-slate-400">{player1Name}</div>
            <div className="text-xl font-bold text-pink-400">{player1Score} pts</div>
          </div>
          <div className="text-slate-600 font-serif text-lg">&amp;</div>
          <div className="text-center">
            <div className="text-xs text-slate-400">{player2Name}</div>
            <div className="text-xl font-bold text-purple-400">{player2Score} pts</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              soundService.playSuccess();
              onRematch();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again (Rematch)</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl border border-pink-500/30 text-pink-300 hover:bg-pink-950/30 text-xs font-medium transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            <span>{copied ? 'Summary Copied to Clipboard!' : 'Share Results'}</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onReturnHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Games Library</span>
          </button>
        </div>
      </div>
    </div>
  );
};
