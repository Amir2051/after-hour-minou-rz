/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface CardArtworkProps {
  category: string;
  intensity?: 'mild' | 'medium' | 'spicy' | 'wild';
  className?: string;
}

export const CardArtwork: React.FC<CardArtworkProps> = ({ category, intensity, className = '' }) => {
  const normCat = category.toLowerCase();

  // 18+ Spicy Artwork
  if (intensity === 'spicy' || normCat.includes('spicy')) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full opacity-35 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="spicyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff2d78" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#be123c" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e11d48"/>
              <stop offset="60%" stopColor="#ff4387"/>
              <stop offset="100%" stopColor="#fed7aa"/>
            </linearGradient>
          </defs>
          <circle cx="160" cy="80" r="75" fill="url(#spicyGlow)" />
          {/* Seductive Silhouette & Flame Curves */}
          <path d="M160 20 C185 50 205 75 205 105 C205 130 185 145 160 145 C135 145 115 130 115 105 C115 75 135 50 160 20 Z" fill="url(#flameGrad)" opacity="0.85"/>
          <path d="M160 45 C175 68 188 85 188 105 C188 122 175 132 160 132 C145 132 132 122 132 105 C132 85 145 68 160 45 Z" fill="#ffe4e6" opacity="0.95"/>
          {/* Satin ribbon curve */}
          <path d="M70 120 Q160 90 250 125 Q160 140 70 120 Z" fill="#ff2d78" opacity="0.4"/>
          {/* Subtle embers */}
          <circle cx="120" cy="40" r="2" fill="#fff" opacity="0.8"/>
          <circle cx="200" cy="45" r="2.5" fill="#f43f5e" opacity="0.9"/>
          <circle cx="160" cy="15" r="1.5" fill="#ffd1e3" opacity="0.8"/>
        </svg>
      </div>
    );
  }

  // Romantic Artwork: Roses, candlelight, warm glow
  if (normCat.includes('romantic') || normCat.includes('affection') || normCat.includes('vows')) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full opacity-30 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="roseGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="rosePetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185"/>
              <stop offset="100%" stopColor="#9f1239"/>
            </linearGradient>
          </defs>
          <circle cx="160" cy="80" r="75" fill="url(#roseGlow)"/>
          {/* Stylized Rose Blossom Contour */}
          <path d="M160 45 C170 35 185 45 185 60 C185 75 160 95 160 95 C160 95 135 75 135 60 C135 45 150 35 160 45 Z" fill="url(#rosePetal)"/>
          <path d="M160 30 C185 30 205 50 200 75 C195 95 175 110 160 125 C145 110 125 95 120 75 C115 50 135 30 160 30 Z" fill="none" stroke="#f43f5e" strokeWidth="2.5" opacity="0.7"/>
          {/* Floating Rose Petals */}
          <path d="M90 70 C80 60 85 45 100 50 C110 55 105 75 90 70 Z" fill="#e11d48" opacity="0.6"/>
          <path d="M230 65 C240 55 235 40 220 45 C210 50 215 70 230 65 Z" fill="#e11d48" opacity="0.6"/>
          <path d="M160 135 C150 145 140 135 145 125 C150 120 165 125 160 135 Z" fill="#fb7185" opacity="0.7"/>
        </svg>
      </div>
    );
  }

  // Flirty Artwork: Seductive silhouettes & lips motif
  if (normCat.includes('flirty') || normCat.includes('teasing') || normCat.includes('dating')) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full opacity-30 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="flirtyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="lipsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2d78"/>
              <stop offset="50%" stopColor="#f43f5e"/>
              <stop offset="100%" stopColor="#db2777"/>
            </linearGradient>
          </defs>
          <circle cx="160" cy="80" r="70" fill="url(#flirtyGlow)"/>
          {/* Stylized Crimson Lips Silhouette */}
          <path d="M110 80 Q135 60 160 68 Q185 60 210 80 Q185 92 160 86 Q135 92 110 80 Z" fill="url(#lipsGrad)"/>
          <path d="M110 80 Q160 115 210 80 Q185 105 160 102 Q135 105 110 80 Z" fill="url(#lipsGrad)" opacity="0.9"/>
          {/* Subtle spark dots */}
          <circle cx="160" cy="50" r="2.5" fill="#fff" opacity="0.9"/>
          <circle cx="215" cy="65" r="1.5" fill="#f472b6" opacity="0.8"/>
          <circle cx="105" cy="65" r="1.5" fill="#c084fc" opacity="0.8"/>
        </svg>
      </div>
    );
  }

  // Deep & Personal Artwork: Celestial twilight & intertwined geometry
  if (normCat.includes('deep') || normCat.includes('personal') || normCat.includes('memories') || normCat.includes('vulnerability')) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full opacity-30 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="deepGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="moonRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc"/>
              <stop offset="100%" stopColor="#6366f1"/>
            </linearGradient>
          </defs>
          <circle cx="160" cy="80" r="70" fill="url(#deepGlow)"/>
          {/* Crescent Moon & Orbit Rings */}
          <circle cx="160" cy="80" r="50" fill="none" stroke="url(#moonRing)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <path d="M160 40 A40 40 0 0 0 160 120 A30 30 0 0 1 160 40 Z" fill="url(#moonRing)" opacity="0.75"/>
          {/* Constellation Stars */}
          <polygon points="120,55 122,60 127,61 123,64 124,69 120,66 116,69 117,64 113,61 118,60" fill="#fff" opacity="0.8"/>
          <polygon points="200,95 202,100 207,101 203,104 204,109 200,106 196,109 197,104 193,101 198,100" fill="#e0e7ff" opacity="0.8"/>
        </svg>
      </div>
    );
  }

  // Wild Cards Artwork: Electric bursts & playing card suit geometry
  if (normCat.includes('wild') || normCat.includes('daring')) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full opacity-30 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="wildGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="160" cy="80" r="70" fill="url(#wildGlow)"/>
          {/* Spades / Hearts geometric emblem */}
          <path d="M160 30 L175 60 L205 65 L182 85 L188 115 L160 100 L132 115 L138 85 L115 65 L145 60 Z" fill="#f43f5e" opacity="0.6"/>
          {/* Spark Lightning */}
          <path d="M155 35 L165 65 L152 75 L168 115 L158 85 L170 75 Z" fill="#fde047" opacity="0.9"/>
        </svg>
      </div>
    );
  }

  // Default: Easy & Funny / Casual Artwork: Clinking flutes & celebration bubbles
  return (
    <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 320 160" className="w-full h-full opacity-25 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="funGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="160" cy="80" r="65" fill="url(#funGlow)"/>
        {/* Playful Toasting Flutes */}
        <path d="M142 55 L150 90 L152 110 L145 110 L155 110 L152 90 L160 55 Z" fill="none" stroke="#e879f9" strokeWidth="2"/>
        <path d="M178 55 L170 90 L168 110 L165 110 L175 110 L168 90 L160 55 Z" fill="none" stroke="#f472b6" strokeWidth="2"/>
        <circle cx="160" cy="48" r="4" fill="#fbbf24" opacity="0.9"/>
        <circle cx="152" cy="38" r="2.5" fill="#fef08a" opacity="0.8"/>
        <circle cx="168" cy="36" r="2.5" fill="#fef08a" opacity="0.8"/>
      </svg>
    </div>
  );
};

export const CardBackArt: React.FC<{ isSpicy?: boolean }> = ({ isSpicy = false }) => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden rounded-3xl">
      {/* Background radial gradient */}
      <div className={`absolute inset-0 ${
        isSpicy
          ? 'bg-gradient-to-br from-[#24040a] via-[#150206] to-[#0a0002]'
          : 'bg-gradient-to-br from-[#1c0a2a] via-[#100518] to-[#07020a]'
      }`} />

      {/* Luxury Guilloche Pattern Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-15 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cardBackPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 20,0 L 40,20 L 20,40 L 0,20 Z" fill="none" stroke={isSpicy ? '#ff2d78' : '#c084fc'} strokeWidth="0.8" />
            <circle cx="20" cy="20" r="5" fill="none" stroke={isSpicy ? '#f43f5e' : '#a855f7'} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardBackPattern)" />
      </svg>

      {/* Perimeter Gold/Crimson Filigree Border */}
      <div className={`absolute inset-3 rounded-2xl border ${
        isSpicy ? 'border-pink-500/35 shadow-[inset_0_0_20px_rgba(255,45,120,0.25)]' : 'border-purple-500/25 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]'
      }`} />

      {/* Central Emblem Monogram */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-transform ${
          isSpicy
            ? 'bg-gradient-to-tr from-rose-950 to-pink-600/30 border border-pink-500/50 shadow-pink-900/50'
            : 'bg-gradient-to-tr from-purple-950 to-pink-700/30 border border-purple-500/40 shadow-purple-900/40'
        }`}>
          <span className="font-serif font-black text-3xl tracking-wider text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">
            AH
          </span>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.25em] font-serif font-bold text-white/90">
            AFTER HOURS
          </div>
          <div className="text-[10px] uppercase tracking-widest text-pink-400/80 mt-1 font-sans">
            {isSpicy ? '🔥 Adult Intimacy Deck' : 'Two Players · No Limits'}
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
          isSpicy
            ? 'border-pink-500/40 bg-pink-950/40 text-pink-300 shadow-md shadow-pink-900/40'
            : 'border-white/10 bg-white/5 text-slate-300'
        }`}>
          <span>Tap to Reveal Card</span>
        </div>
      </div>
    </div>
  );
};
