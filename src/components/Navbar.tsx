/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Sparkles, User, ShieldAlert } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { soundService } from '../services/audio';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPlayerSetup: () => void;
  onOpenCustomBuilder: () => void;
  onOpenVip: () => void;
  isAdultConfirmed: boolean;
  onRequestAgeGate: () => void;
  activePlayers: { player1: string; player2: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  soundEnabled,
  onToggleSound,
  onOpenPlayerSetup,
  onOpenCustomBuilder,
  onOpenVip,
  isAdultConfirmed,
  onRequestAgeGate,
  activePlayers,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-500/15 bg-[#09060e]/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundService.playClick();
              onNavigate('hub');
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-700 via-pink-600 to-purple-600 flex items-center justify-center shadow-md shadow-pink-900/40 group-hover:scale-105 transition-transform">
              <span className="text-white font-serif font-black text-sm">AH</span>
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-wider text-white uppercase whitespace-nowrap font-serif text-glow-pink">
              AFTER HOURS
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => {
              soundService.playClick();
              onNavigate('hub');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'hub' ? 'text-pink-400 border-b-2 border-pink-500' : 'hover:text-white'
            }`}
          >
            Games Library
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenCustomBuilder();
            }}
            className="whitespace-nowrap shrink-0 hover:text-white transition-colors py-1"
          >
            Custom Cards
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenVip();
            }}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors py-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>After Dark VIP</span>
          </button>

          {!isAdultConfirmed ? (
            <button
              onClick={() => {
                soundService.playClick();
                onRequestAgeGate();
              }}
              className="whitespace-nowrap shrink-0 flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors py-1"
              title="Unlock Spicy 18+ decks"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Unlock 18+</span>
            </button>
          ) : (
            <span className="whitespace-nowrap shrink-0 text-[11px] text-pink-400/90 bg-pink-950/40 border border-pink-500/20 px-2 py-0.5 rounded-full">
              18+ Unlocked
            </span>
          )}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Player Setup Trigger */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenPlayerSetup();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 hover:bg-white/10 hover:text-white transition"
            title="Edit Player Names"
          >
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline max-w-[120px] truncate">
              {activePlayers.player1} & {activePlayers.player2}
            </span>
            <span className="sm:hidden text-xs">Players</span>
          </button>

          {/* In-App PWA Install */}
          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};
