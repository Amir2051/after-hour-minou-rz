/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  X,
  Trophy,
  Calendar,
  Sparkles,
  Heart,
  CheckCircle2,
  Play,
  Share2,
  Zap,
} from 'lucide-react';
import { DailyStreakData, formatLocalDate, daysBetween } from '../services/streak';
import { StoredPlayers } from '../services/storage';
import { soundService } from '../services/audio';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: DailyStreakData;
  players: StoredPlayers;
  onPlayGame: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  streak,
  players,
  onPlayGame,
}) => {
  if (!isOpen) return null;

  // Build the last 7 calendar days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = formatLocalDate(d);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = i === 6;
    const isPlayed = streak.streakHistory.includes(dateStr);

    return {
      dateStr,
      dayName,
      dayNum,
      isToday,
      isPlayed,
    };
  });

  // Motivational message for couples
  const getMotivationalMessage = (days: number, playedToday: boolean) => {
    if (days === 0) {
      return {
        headline: 'Start Your Romantic Habit',
        body: `Even 5 minutes of play connects ${players.player1} & ${players.player2}. Start your Day 1 streak together tonight!`,
        levelName: 'Dormant Ember',
      };
    }
    if (days < 3) {
      return {
        headline: 'The Spark Is Lit',
        body: playedToday
          ? `You two took time for each other today! Keep this sexy momentum alive tomorrow.`
          : `Play a quick round today to keep the flirtation burning and level up your connection.`,
        levelName: 'Warm Spark',
      };
    }
    if (days < 7) {
      return {
        headline: 'On Fire Together',
        body: playedToday
          ? `${days} days in a row! You're making quality time a seductive daily ritual.`
          : `Don't break the magic! Play before midnight to reach a ${days + 1}-day streak.`,
        levelName: 'Passionate Flame',
      };
    }
    if (days < 14) {
      return {
        headline: 'Week of Desire Unlocked',
        body: `A full week of intimacy and laughter! You two are in the top 5% of dedicated couples.`,
        levelName: 'Wildfire Romance',
      };
    }
    return {
      headline: 'Unstoppable Chemistry',
      body: `${days} consecutive days of intimate play. Your bond is legendary and magnetic!`,
      levelName: 'After Hours Royalty',
    };
  };

  const motivation = getMotivationalMessage(streak.currentStreak, streak.playedToday);

  // Milestones
  const milestones = [
    { target: 1, label: 'First Spark', desc: '1 Day of couple play' },
    { target: 3, label: 'Flirty Momentum', desc: '3 Days of passion' },
    { target: 7, label: 'Week of Desire', desc: '7 Unbroken days' },
    { target: 14, label: 'Electric Bond', desc: '14 Days of chemistry' },
    { target: 30, label: 'Couples Royalty', desc: '30 Days of love & games' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow border border-amber-500/30 p-6 sm:p-8 bg-gradient-to-b from-[#1c0f24] via-[#120919] to-[#0a050d] text-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow circles */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-16 w-64 h-64 rounded-full bg-gradient-to-b from-amber-500/20 to-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center relative z-10 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Couple Daily Streak</span>
          </div>

          {/* Central Flame and Counter */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Pulsing glow aura */}
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
                  streak.playedToday
                    ? 'bg-amber-500/35 scale-125 animate-pulse'
                    : streak.currentStreak > 0
                    ? 'bg-rose-500/25 scale-110'
                    : 'bg-slate-700/20'
                }`}
              />

              {/* Outer circular ring */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-2 shadow-inner transition-colors duration-500 relative z-10 ${
                  streak.playedToday
                    ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/20 to-rose-600/20 shadow-amber-500/30'
                    : streak.currentStreak > 0
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-slate-900/60'
                    : 'border-white/15 bg-white/5'
                }`}
              >
                <Flame
                  className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 ${
                    streak.playedToday
                      ? 'text-amber-300 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
                      : streak.currentStreak > 0
                      ? 'text-amber-400 fill-amber-500/40'
                      : 'text-slate-500 fill-slate-700/30'
                  }`}
                />
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight drop-shadow-md">
                  {streak.currentStreak}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-200/80">
                  {streak.currentStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div className="mt-3">
              {streak.playedToday ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Streak Active · Played Today! 🔥</span>
                </div>
              ) : streak.currentStreak > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  <span>Play today to make it {streak.currentStreak + 1} days!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  <span>Start your Day 1 streak now</span>
                </div>
              )}
            </div>
          </div>

          {/* Seductive Praise Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider font-bold text-pink-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-pink-500" />
                {players.player1} &amp; {players.player2}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {motivation.levelName}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-serif">{motivation.headline}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{motivation.body}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Current</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">{streak.currentStreak}</div>
              <div className="text-[10px] text-slate-400">days</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" /> Best
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{streak.longestStreak}</div>
              <div className="text-[10px] text-slate-400">record</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" /> Total
              </div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">
                {streak.streakHistory.length}
              </div>
              <div className="text-[10px] text-slate-400">days played</div>
            </div>
          </div>

          {/* 7-Day History Strip */}
          <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
              <span className="font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                Last 7 Days
              </span>
              <span className="text-[10px] text-slate-400">Resets daily at midnight</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {last7Days.map((day, idx) => (
                <div
                  key={day.dateStr}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                    day.isToday
                      ? 'border-amber-400/60 bg-amber-500/15'
                      : day.isPlayed
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <span className="text-[10px] uppercase text-slate-400 font-mono font-medium">
                    {day.dayName}
                  </span>
                  <span className="text-xs font-bold text-slate-200 my-0.5">
                    {day.dayNum}
                  </span>
                  <div className="mt-1">
                    {day.isPlayed ? (
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/15 flex items-center justify-center text-[9px] text-slate-500">
                        ·
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Badges */}
          <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Couple Milestones
            </div>
            <div className="space-y-2">
              {milestones.map(m => {
                const unlocked = streak.longestStreak >= m.target;
                const isCurrentGoal = !unlocked && streak.currentStreak < m.target;
                return (
                  <div
                    key={m.target}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                      unlocked
                        ? 'bg-amber-500/10 border border-amber-500/30 text-white'
                        : isCurrentGoal
                        ? 'bg-white/5 border border-white/10 text-slate-300'
                        : 'bg-white/5 border border-transparent text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                          unlocked
                            ? 'bg-amber-500 text-black'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {m.target}d
                      </div>
                      <div>
                        <div className="font-semibold text-white">{m.label}</div>
                        <div className="text-[10px] text-slate-400">{m.desc}</div>
                      </div>
                    </div>
                    {unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {Math.max(0, m.target - streak.currentStreak)} to go
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
                onPlayGame();
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-pink-900/40 hover:from-amber-400 hover:to-pink-500 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{streak.playedToday ? 'Play Another Game Round' : 'Play Today & Grow Streak'}</span>
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="py-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
