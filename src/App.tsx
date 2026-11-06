/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GameHub } from './games/GameHub';
import { TruthOrDare } from './games/TruthOrDare';
import { HowWellDoYouKnowMe } from './games/HowWellDoYouKnowMe';
import { WouldYouRather } from './games/WouldYouRather';
import { NeverHaveIEver } from './games/NeverHaveIEver';
import { SpicyChallenge } from './games/SpicyChallenge';
import { WhoIsMoreLikelyTo } from './games/WhoIsMoreLikelyTo';
import { FinishTheSentence } from './games/FinishTheSentence';
import { ChallengeWheel } from './games/ChallengeWheel';
import { MemoryLane } from './games/MemoryLane';
import { SixtySecondChallenge } from './games/SixtySecondChallenge';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { CustomCardBuilder } from './components/CustomCardBuilder';
import { VipModal } from './components/VipModal';
import { AgeGateModal } from './components/AgeGateModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GameModeId, GameSettings } from './types';
import { storageService, StoredPlayers } from './services/storage';
import { soundService } from './services/audio';
import { TheReferee } from './components/TheReferee';

export default function App() {
  const [currentView, setCurrentView] = useState<'hub' | GameModeId>('hub');
  const [players, setPlayers] = useState<StoredPlayers>(storageService.getPlayers());
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);

  // Modals
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isAgeGateOpen, setIsAgeGateOpen] = useState(false);

  // Sync sound service on start
  useEffect(() => {
    soundService.setMuted(!settings.soundEnabled);
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleToggleSound = () => {
    const updated = !soundEnabled;
    setSoundEnabled(updated);
    soundService.setMuted(!updated);
    if (updated) soundService.playClick();
    const newSettings = { ...settings, soundEnabled: updated };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleSavePlayers = (newPlayers: StoredPlayers, newSettings: GameSettings) => {
    setPlayers(newPlayers);
    setSettings(newSettings);
    storageService.savePlayers(newPlayers);
    storageService.saveSettings(newSettings);
  };

  const handleConfirmAgeGate = () => {
    const newSettings: GameSettings = {
      ...settings,
      adultConfirmed: true,
      intensity: 'spicy',
      activeCategories: {
        ...settings.activeCategories,
        spicy: true,
      },
    };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    setIsAgeGateOpen(false);
  };

  return (
    <div className="after-hours-shell text-[#f7f3fb] flex flex-col justify-between selection:bg-pink-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPlayerSetup={() => setIsPlayerSetupOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onOpenVip={() => setIsVipOpen(true)}
        isAdultConfirmed={settings.adultConfirmed}
        onRequestAgeGate={() => setIsAgeGateOpen(true)}
        activePlayers={players}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {currentView === 'hub' && (
          <GameHub
            players={players}
            settings={settings}
            onSelectGame={(gameId) => setCurrentView(gameId)}
            onOpenPlayerSetup={() => setIsPlayerSetupOpen(true)}
            onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
            onOpenVip={() => setIsVipOpen(true)}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'truth_or_dare' && (
          <TruthOrDare
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'how_well_know_me' && (
          <HowWellDoYouKnowMe
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'would_you_rather' && (
          <WouldYouRather
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'never_have_i_ever' && (
          <NeverHaveIEver
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'spicy_challenge' && (
          <SpicyChallenge
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'who_is_more_likely' && (
          <WhoIsMoreLikelyTo
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'finish_the_sentence' && (
          <FinishTheSentence
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'challenge_wheel' && (
          <ChallengeWheel
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'memory_lane' && (
          <MemoryLane
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}

        {currentView === 'sixty_seconds' && (
          <SixtySecondChallenge
            players={players}
            settings={settings}
            onExit={() => setCurrentView('hub')}
            onRequestAgeGate={() => setIsAgeGateOpen(true)}
          />
        )}
      </main>

      {/* Subtle, Sophisticated Footer */}
      <footer className="w-full border-t border-pink-500/10 py-6 px-4 text-center text-xs text-slate-500 bg-[#09060e]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-400">AFTER HOURS</span>
            <span aria-hidden="true">·</span>
            <span>Two players. No limits. Just good times.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsPlayerSetupOpen(true)}
              className="hover:text-pink-400 transition"
            >
              Players &amp; Stage
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="hover:text-pink-400 transition"
            >
              Custom Decks
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsVipOpen(true)}
              className="hover:text-amber-400 transition"
            >
              After Dark Pass
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Modals & Overlays */}
      <PlayerSetupModal
        isOpen={isPlayerSetupOpen}
        onClose={() => setIsPlayerSetupOpen(false)}
        players={players}
        settings={settings}
        onSave={handleSavePlayers}
        onRequestAgeGate={() => setIsAgeGateOpen(true)}
      />

      <CustomCardBuilder
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onCustomCardAdded={() => {
          // Re-render trigger
        }}
      />

      <VipModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
      />

      <AgeGateModal
        isOpen={isAgeGateOpen}
        onConfirm={handleConfirmAgeGate}
        onCancel={() => setIsAgeGateOpen(false)}
      />

      <TheReferee players={players} adultConfirmed={settings.adultConfirmed} />
    </div>
  );
}
