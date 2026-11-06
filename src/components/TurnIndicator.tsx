/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, RefreshCw, Trophy, Heart } from 'lucide-react';
import { soundService } from '../services/audio';

interface TurnIndicatorProps {
  activePlayer: string;
  partnerPlayer: string;
  round: number;
  maxRounds?: number;
  scores: { player1: number; player2: number };
  player1Name: string;
  player2Name: string;
  scoringEnabled: boolean;
  gameTitle: string;
  onExit: () => void;
  onRestart: () => void;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  activePlayer,
  partnerPlayer,
  round,
  maxRounds,
  scores,
  player1Name,
  player2Name,
  scoringEnabled,
  gameTitle,
  onExit,
  onRestart,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-pink-500/15">
        <button
          onClick={() => {
            soundService.playClick();
            onExit();
          }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game</span>
        </button>

        <h1 className="text-xs uppercase tracking-widest font-semibold text-pink-400/90 truncate max-w-[160px] sm:max-w-xs">
          {gameTitle}
        </h1>

        <button
          onClick={() => {
            soundService.playClick();
            onRestart();
          }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition p-1"
          title="Restart this game"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Active Player Banner */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-pink-900/40 shrink-0">
            {activePlayer.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[11px] text-pink-300/80 font-medium tracking-wide flex items-center gap-1">
              <Heart className="w-3 h-3 fill-pink-400/40 text-pink-400" />
              <span>Current Turn</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-pink-300">{activePlayer}'s Turn</span>
              <span className="text-xs text-slate-400 font-normal">
                (Pass to {partnerPlayer} next)
              </span>
            </div>
          </div>
        </div>

        {/* Round and Scores */}
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Round </span>
            <span className="font-semibold text-white">{round}</span>
            {maxRounds ? <span className="text-slate-400"> / {maxRounds}</span> : null}
          </div>

          {scoringEnabled && (
            <div className="flex items-center gap-2 bg-pink-950/30 border border-pink-500/20 px-3 py-1.5 rounded-xl">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-medium">
                {player1Name}: <strong className="text-pink-400">{scores.player1}</strong>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-white font-medium">
                {player2Name}: <strong className="text-purple-400">{scores.player2}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
