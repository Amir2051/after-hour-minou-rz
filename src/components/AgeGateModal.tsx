/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, ShieldCheck, X } from 'lucide-react';
import { soundService } from '../services/audio';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-900/60 to-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-4 mx-auto">
          <Flame className="w-6 h-6 text-pink-500" />
        </div>

        <h3 className="text-xl font-bold text-center text-white font-serif tracking-tight">
          Adult Content Confirmation
        </h3>

        <p className="mt-2 text-center text-sm text-slate-300">
          The Spicy and intimate categories contain mature prompts designed specifically for consenting adults.
        </p>

        <div className="mt-4 bg-black/40 rounded-xl p-3 border border-pink-500/20 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-pink-300 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-pink-400" />
            <span>Consent-First Rule</span>
          </div>
          <p>
            Both players must be at least 18 years old. Everything in this game is consensual and optional. Either player can skip any challenge or question at any time with zero penalty.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              soundService.playClick();
              onCancel();
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition"
          >
            Keep It Mild
          </button>
          <button
            onClick={() => {
              soundService.playSuccess();
              onConfirm();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition"
          >
            I am 18+ & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
