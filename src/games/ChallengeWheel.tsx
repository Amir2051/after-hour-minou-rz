/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Play, Sparkles, Check, Heart, Trophy } from 'lucide-react';
import { CHALLENGE_WHEEL_SEGMENTS, WHEEL_DYNAMIC_CHALLENGES } from '../data/defaultDecks';
import { TurnIndicator } from '../components/TurnIndicator';
import { ResultsModal } from '../components/ResultsModal';
import { StoredPlayers } from '../services/storage';
import { GameSettings } from '../types';
import { soundService } from '../services/audio';
import { fireConfetti } from '../components/Confetti';
import { GameEngine } from '../services/gameEngine';

interface ChallengeWheelProps {
  players: StoredPlayers;
  settings: GameSettings;
  onExit: () => void;
}

export const ChallengeWheel: React.FC<ChallengeWheelProps> = ({
  players,
  settings,
  onExit,
}) => {
  const [turnIndex, setTurnIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<typeof CHALLENGE_WHEEL_SEGMENTS[0] | null>(null);
  const [specificAction, setSpecificAction] = useState<string>('');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [spinCount, setSpinCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const activePlayer = turnIndex % 2 === 0 ? players.player1 : players.player2;
  const partnerPlayer = turnIndex % 2 === 0 ? players.player2 : players.player1;

  const segments = CHALLENGE_WHEEL_SEGMENTS;
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = () => {
    if (isSpinning) return;
    soundService.playSpinTick();
    setIsSpinning(true);
    setSelectedSegment(null);
    setSpecificAction('');

    // Pick random segment
    const targetIdx = Math.floor(Math.random() * numSegments);
    const chosen = segments[targetIdx];

    // Pick a dynamic specific challenge from the mini-deck for this segment
    const miniDeck = WHEEL_DYNAMIC_CHALLENGES[chosen.label] || [chosen.description];
    const pickedAction = miniDeck[Math.floor(Math.random() * miniDeck.length)];

    // Extra full spins (5 to 8 rotations) + exact angle to land on target
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Top pointer is at 0/360 degrees
    const targetAngle = 360 - (targetIdx * segmentAngle + segmentAngle / 2);
    const newRotation = rotation + extraSpins + (targetAngle - (rotation % 360));

    setRotation(newRotation);

    let ticks = 0;
    const tickInterval = setInterval(() => {
      soundService.playSpinTick();
      ticks++;
      if (ticks > 16) clearInterval(tickInterval);
    }, 200);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSelectedSegment(chosen);
      setSpecificAction(pickedAction);
      soundService.playSuccess();
      fireConfetti({ count: 40 });
    }, 3800);
  };

  const handleCompleteChallenge = (awarded: number) => {
    soundService.playSuccess();
    if (awarded > 0 && settings.scoringEnabled) {
      if (turnIndex % 2 === 0) {
        setScores(prev => ({ ...prev, player1: prev.player1 + awarded }));
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + awarded }));
      }
    }

    setSpinCount(prev => prev + 1);

    if (spinCount + 1 >= 10) {
      setIsGameOver(true);
      return;
    }

    setSelectedSegment(null);
    setSpecificAction('');
    setTurnIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-center">
      <TurnIndicator
        activePlayer={activePlayer}
        partnerPlayer={partnerPlayer}
        round={spinCount + 1}
        maxRounds={10}
        scores={scores}
        player1Name={players.player1}
        player2Name={players.player2}
        scoringEnabled={settings.scoringEnabled}
        gameTitle="Couples Challenge Wheel"
        onExit={onExit}
        onRestart={() => {
          setTurnIndex(0);
          setSpinCount(0);
          setScores({ player1: 0, player2: 0 });
          setSelectedSegment(null);
        }}
      />

      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 min-h-[480px] flex flex-col items-center justify-between relative overflow-hidden">
        <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-pink-500/15">
          <span className="font-semibold text-pink-400 uppercase tracking-wider">
            Wheel of Seduction
          </span>
          <span className="text-slate-300">
            Spinning: <strong className="text-white">{activePlayer}</strong>
          </span>
        </div>

        {/* Wheel Graphic Container with top pointer */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-pink-500 drop-shadow-[0_4px_10px_rgba(255,45,120,0.8)]" />

          {/* Wheel SVG */}
          <div
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-[0_0_50px_rgba(255,45,120,0.25)] border-4 border-pink-500/40 relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.95, 0.2, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {segments.map((seg, i) => {
                const startAngle = (i * 360) / numSegments;
                const endAngle = ((i + 1) * 360) / numSegments;
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const textAngle = startAngle + segmentAngle / 2;
                const rad = (Math.PI * (textAngle - 90)) / 180;
                const textX = 50 + 33 * Math.cos(rad);
                const textY = 50 + 33 * Math.sin(rad);

                return (
                  <g key={seg.id}>
                    <path d={pathData} fill={seg.color} opacity={0.88} stroke="#09060e" strokeWidth="0.8" />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Central Wheel Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#09060e] border-2 border-pink-400 flex items-center justify-center text-pink-400 shadow-md">
              <Heart className="w-5 h-5 fill-pink-500" />
            </div>
          </div>
        </div>

        {/* Spin trigger or Outcome Modal */}
        {!selectedSegment ? (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-sm shadow-xl shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 disabled:opacity-60 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSpinning ? 'Wheel Is Spinning...' : `Spin Wheel for ${activePlayer}`}</span>
          </button>
        ) : (
          <div className="w-full max-w-md p-5 rounded-2xl bg-black/60 border border-pink-500/40 animate-in zoom-in-95 space-y-3">
            <div className="text-xs uppercase tracking-widest font-bold text-pink-400">
              The Wheel Has Spoken!
            </div>
            <div className="text-2xl font-bold font-serif text-white">
              {selectedSegment.label}
            </div>
            <p className="text-sm sm:text-base text-pink-200 font-medium italic">
              "{specificAction || selectedSegment.description}"
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleCompleteChallenge(0)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5"
              >
                Pass / Next Turn
              </button>
              <button
                onClick={() => handleCompleteChallenge(10)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-md shadow-pink-900/30 hover:opacity-95"
              >
                Completed (+10 pts)
              </button>
            </div>
          </div>
        )}
      </div>

      <ResultsModal
        isOpen={isGameOver}
        gameMode="challenge_wheel"
        gameTitle="Couples Challenge Wheel"
        player1Name={players.player1}
        player2Name={players.player2}
        player1Score={scores.player1}
        player2Score={scores.player2}
        totalCardsPlayed={spinCount}
        onRematch={() => {
          setIsGameOver(false);
          setTurnIndex(0);
          setSpinCount(0);
          setScores({ player1: 0, player2: 0 });
          setSelectedSegment(null);
        }}
        onReturnHome={onExit}
      />
    </div>
  );
};
