/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Users, Sparkles, Trophy, X } from 'lucide-react';
import { GameSettings, RelationshipStage, IntensityLevel } from '../types';
import { StoredPlayers } from '../services/storage';
import { soundService } from '../services/audio';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: StoredPlayers;
  settings: GameSettings;
  onSave: (players: StoredPlayers, settings: GameSettings) => void;
  onRequestAgeGate: () => void;
}

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  isOpen,
  onClose,
  players,
  settings,
  onSave,
  onRequestAgeGate,
}) => {
  const [p1, setP1] = useState(players.player1);
  const [p2, setP2] = useState(players.player2);
  const [stage, setStage] = useState<RelationshipStage>(settings.relationshipStage);
  const [intensity, setIntensity] = useState<IntensityLevel>(settings.intensity);
  const [scoring, setScoring] = useState(settings.scoringEnabled);

  if (!isOpen) return null;

  const handleIntensityChange = (lvl: IntensityLevel) => {
    soundService.playClick();
    if (lvl === 'spicy' && !settings.adultConfirmed) {
      onRequestAgeGate();
      return;
    }
    setIntensity(lvl);
  };

  const handleSave = () => {
    soundService.playSuccess();
    onSave(
      {
        player1: p1.trim() || 'Player 1',
        player2: p2.trim() || 'Player 2',
      },
      {
        ...settings,
        relationshipStage: stage,
        intensity: intensity,
        scoringEnabled: scoring,
      }
    );
    onClose();
  };

  const stages: { id: RelationshipStage; label: string }[] = [
    { id: 'dating', label: 'Dating' },
    { id: 'new_relationship', label: 'New Relationship' },
    { id: 'long_term', label: 'Long-Term' },
    { id: 'engaged', label: 'Engaged' },
    { id: 'married', label: 'Married' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500/30" />
          <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold">Session Settings</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Two Players. Your Rules.</h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize your couple profile and preferences. No account needed.
        </p>

        <div className="mt-5 space-y-4">
          {/* Players Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                Player 1 Name
              </label>
              <input
                type="text"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Player 2 Name
              </label>
              <input
                type="text"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="e.g. Jordan"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/60 transition"
              />
            </div>
          </div>

          {/* Relationship Stage */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Relationship Stage
            </label>
            <div className="flex flex-wrap gap-2">
              {stages.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setStage(st.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    stage === st.id
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/30'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Intensity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleIntensityChange('mild')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  intensity === 'mild'
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-semibold text-emerald-400">Mild</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Playful & Sweet</div>
              </button>

              <button
                type="button"
                onClick={() => handleIntensityChange('medium')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  intensity === 'medium'
                    ? 'border-purple-500/60 bg-purple-950/30 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-semibold text-purple-400">Medium</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Romantic & Flirty</div>
              </button>

              <button
                type="button"
                onClick={() => handleIntensityChange('spicy')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  intensity === 'spicy'
                    ? 'border-pink-500/60 bg-pink-950/40 text-white shadow-sm shadow-pink-500/20'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-semibold text-pink-400">Spicy 18+</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Bold & Sensual</div>
              </button>
            </div>
          </div>

          {/* Scoring Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-medium text-white">Enable Game Scoring</div>
                <div className="text-[11px] text-slate-400">Track points, completed challenges, and compatibility</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setScoring(!scoring);
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                scoring ? 'bg-pink-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  scoring ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition"
          >
            Save & Play
          </button>
        </div>
      </div>
    </div>
  );
};
