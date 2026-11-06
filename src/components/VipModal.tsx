/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Check, Heart, X, Crown, Shield } from 'lucide-react';
import { soundService } from '../services/audio';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl glass-panel-glow p-6 sm:p-8 text-slate-100 shadow-2xl relative my-6 border border-amber-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-xl shadow-amber-900/40 mb-3">
          <Crown className="w-7 h-7 text-amber-300" />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monetization Architecture Preview</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
            AFTER HOURS · VIP After Dark Pass
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Experience the full intimacy suite. The core MVP games are 100% playable free today.
          </p>
        </div>

        {/* Comparison Tier Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Free Tier */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-semibold text-slate-300">Free Starter Deck</div>
            <div className="text-lg font-bold text-white mt-0.5">$0 · Included</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Basic Truth or Dare</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Would You Rather</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Never Have I Ever</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Standard Daily Challenges</span>
              </li>
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-950/40 to-purple-950/40 border border-amber-500/40 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              PREMIUM
            </div>
            <div className="text-xs font-semibold text-amber-400">After Dark VIP</div>
            <div className="text-lg font-bold text-white mt-0.5">Full Pass</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Unrestricted Spicy 18+ Decks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Couples Challenge Wheel &amp; 60s Timers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Custom Deck Creator &amp; Studio</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Anniversary &amp; Travel Theme Packs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Unlimited Pass &amp; Play</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-pink-400 shrink-0" />
          <span>
            Payment gateway architecture ready for Stripe/Google Play integration. All games in this preview release are fully unlocked.
          </span>
        </div>

        <button
          onClick={() => {
            soundService.playSuccess();
            onClose();
          }}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Continue Playing Unlocked</span>
        </button>
      </div>
    </div>
  );
};
