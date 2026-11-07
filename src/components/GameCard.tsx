/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Check, SkipForward, Flame, Eye, RotateCw } from 'lucide-react';
import { soundService } from '../services/audio';
import { CardArtwork, CardBackArt } from './CardArtwork';

interface GameCardProps {
  category: string;
  intensity?: 'mild' | 'medium' | 'spicy' | 'wild';
  title?: string;
  typeLabel?: string;
  cardNumber?: number;
  totalCards?: number;
  content: string;
  subcontent?: string;
  cardId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onComplete: () => void;
  onSkip: () => void;
  completeLabel?: string;
  skipLabel?: string;
  requireReveal?: boolean;
  hideActionButtons?: boolean;
  children?: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  category,
  cardId,
  intensity = 'medium',
  title,
  typeLabel,
  cardNumber,
  totalCards,
  content,
  subcontent,
  isFavorite,
  onToggleFavorite,
  onComplete,
  onSkip,
  completeLabel,
  skipLabel,
  requireReveal = false,
  hideActionButtons = false,
  children,
}) => {
  const [isFlipped, setIsFlipped] = useState(!requireReveal);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Reset flip state when card content changes if reveal is required
  useEffect(() => {
    setIsFlipped(!requireReveal);
    setDragOffset(0);
  }, [content, requireReveal]);

  const handleFlip = () => {
    soundService.playFlip();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([15]); } catch {}
    }
    setIsFlipped(prev => !prev);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isFlipped) return; // Only allow swipe after card is flipped
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || touchStartX.current === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - touchStartX.current;
    // Bound drag offset
    setDragOffset(Math.max(-140, Math.min(140, diff)));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    touchStartX.current = null;

    if (dragOffset > 75) {
      // Swiped Right -> Complete
      soundService.playSuccess();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([20, 30]); } catch {}
      }
      onComplete();
    } else if (dragOffset < -75) {
      // Swiped Left -> Skip
      soundService.playClick();
      onSkip();
    }
    setDragOffset(0);
  };

  // Category palette styling
  const getCategoryTheme = () => {
    const cat = category.toLowerCase();
    if (intensity === 'spicy' || cat.includes('spicy')) {
      return {
        cardBg: 'bg-gradient-to-b from-[#220409] via-[#140206] to-[#0a0003]',
        borderGlow: 'border-rose-500/40 shadow-[0_0_45px_rgba(244,63,94,0.25)]',
        badgeColor: 'text-rose-400 font-bold',
        accentGlow: 'text-rose-400',
        deckName: 'After Dark Intimacy',
      };
    }
    if (cat.includes('romantic') || cat.includes('affection')) {
      return {
        cardBg: 'bg-gradient-to-b from-[#290818] via-[#17040e] to-[#0c0207]',
        borderGlow: 'border-pink-500/35 shadow-[0_0_40px_rgba(255,45,120,0.22)]',
        badgeColor: 'text-pink-300 font-semibold',
        accentGlow: 'text-pink-300',
        deckName: 'Romantic Connection',
      };
    }
    if (cat.includes('flirty') || cat.includes('teasing')) {
      return {
        cardBg: 'bg-gradient-to-b from-[#2a071f] via-[#160310] to-[#0b0108]',
        borderGlow: 'border-pink-500/35 shadow-[0_0_35px_rgba(236,72,153,0.22)]',
        badgeColor: 'text-pink-400 font-semibold',
        accentGlow: 'text-pink-400',
        deckName: 'Flirty Chemistry',
      };
    }
    if (cat.includes('deep') || cat.includes('personal') || cat.includes('vulnerability')) {
      return {
        cardBg: 'bg-gradient-to-b from-[#180d2d] via-[#0d071a] to-[#06030c]',
        borderGlow: 'border-purple-500/35 shadow-[0_0_40px_rgba(168,85,247,0.22)]',
        badgeColor: 'text-purple-300 font-semibold',
        accentGlow: 'text-purple-300',
        deckName: 'Deep & Personal',
      };
    }
    if (cat.includes('wild')) {
      return {
        cardBg: 'bg-gradient-to-b from-[#2e091a] via-[#1a040e] to-[#0d0106]',
        borderGlow: 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.25)]',
        badgeColor: 'text-rose-400 font-bold',
        accentGlow: 'text-rose-400',
        deckName: 'Wild Surprise',
      };
    }
    // Default Easy & Funny
    return {
      cardBg: 'bg-gradient-to-b from-[#1c0c28] via-[#100618] to-[#08020d]',
      borderGlow: 'border-pink-500/25 shadow-[0_0_35px_rgba(217,70,239,0.18)]',
      badgeColor: 'text-emerald-400 font-semibold',
      accentGlow: 'text-pink-300',
      deckName: 'Playful Laughter',
    };
  };

  const theme = getCategoryTheme();
  const isSpicy = intensity === 'spicy' || category.toLowerCase().includes('spicy');
  const cardSticker = isSpicy ? '😈' : category.toLowerCase().includes('romantic') ? '💋' : category.toLowerCase().includes('deep') ? '✨' : category.toLowerCase().includes('wild') ? '🔥' : '😼';

  // Rotation math during swipe
  const dragRotation = dragOffset * 0.08;

  return (
    <div className="w-full max-w-lg mx-auto [perspective:1400px] select-none">
      {/* Swipe Feedback Banners */}
      {isDragging && (
        <div className="flex items-center justify-between text-xs font-semibold px-4 mb-2 transition-opacity">
          <span className={`transition-opacity ${dragOffset < -25 ? 'text-rose-400 opacity-100' : 'opacity-0'}`}>
            👈 Release to Skip
          </span>
          <span className={`transition-opacity ${dragOffset > 25 ? 'text-emerald-400 opacity-100' : 'opacity-0'}`}>
            Release to Complete 👉
          </span>
        </div>
      )}

      {/* 3D Flippable Card Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${dragRotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full cursor-grab active:cursor-grabbing"
      >
        <div
          className="relative w-full min-h-[410px] sm:min-h-[440px] rounded-3xl transition-transform duration-700 [transform-style:preserve-3d]"
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          {/* ==================================================== */}
          {/* BACK FACE (Shown when unrevealed or waiting for tap) */}
          {/* ==================================================== */}
          <div
            onClick={handleFlip}
            className={`absolute inset-0 w-full h-full rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] border ${theme.borderGlow} cursor-pointer transition-transform hover:scale-[1.01]`}
          >
            <CardBackArt isSpicy={isSpicy} />
          </div>

          {/* ==================================================== */}
          {/* FRONT FACE (The Question / Dare / Challenge Details) */}
          {/* ==================================================== */}
          <div
            className={`w-full h-full min-h-[410px] sm:min-h-[440px] rounded-3xl [backface-visibility:hidden] border ${theme.borderGlow} ${theme.cardBg} p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl`}
          >
            {/* Anime-inspired collectible sticker decal */}
            <div className="absolute z-20 top-14 right-4 sm:right-6 rotate-6 pointer-events-none" aria-label={isSpicy ? '18 plus adult themed sticker' : 'Anime-inspired game sticker'}>
              <div className={`relative flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 shadow-xl backdrop-blur-md ${isSpicy ? 'bg-rose-950/90 border-rose-300/60 shadow-rose-950/50' : 'bg-purple-950/80 border-fuchsia-300/40 shadow-purple-950/50'}`}>
                <span className="text-xl leading-none drop-shadow">{cardSticker}</span>
                <span className={`text-[8px] leading-tight font-black tracking-widest ${isSpicy ? 'text-rose-200' : 'text-fuchsia-100'}`}>{isSpicy ? '18+ ONLY' : 'ANIME VIBE'}</span>
                <span className="absolute -top-2 -right-1 text-[10px]">✦</span>
              </div>
            </div>

            {/* Subtle background ambient vector artwork */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <CardArtwork category={category} intensity={intensity} artworkId={cardId} className="w-full h-full" />
            </div>

            {/* Subtle floating ember glow */}
            <div className="absolute top-0 right-1/4 w-36 h-36 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-4 left-1/4 w-36 h-36 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Top Bar Metadata */}
            <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-slate-300 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {typeLabel && (
                  <>
                    <span className="uppercase tracking-widest font-serif font-black text-xs text-pink-400">
                      {typeLabel}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                  </>
                )}
                <span className="font-medium text-white">{category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className={theme.badgeColor}>
                  {isSpicy ? '🔥 Spicy 18+' : intensity === 'medium' ? 'Romantic' : 'Playful'}
                </span>
                {cardNumber && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      #{cardNumber}{totalCards ? `/${totalCards}` : ''}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFlip}
                  className="p-1.5 text-slate-400 hover:text-white transition rounded-lg"
                  title="Flip back to card cover"
                  aria-label="Flip Card"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundService.playClick();
                      onToggleFavorite();
                    }}
                    className="p-1.5 text-slate-400 hover:text-pink-400 active:scale-90 transition rounded-lg"
                    title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                    aria-label="Toggle Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Card Question Centerpiece */}
            <div className="relative z-10 my-auto py-4 text-center">
              {title && (
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-pink-300 font-bold mb-4 font-sans">
                  {title}
                </div>
              )}

              <p className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-white leading-relaxed tracking-tight text-glow-pink">
                "{content}"
              </p>

              {subcontent && (
                <p className="mt-4 text-xs sm:text-sm text-pink-200/90 italic font-sans max-w-sm mx-auto leading-relaxed">
                  {subcontent}
                </p>
              )}

              {/* Custom embedded children slot (stopwatch, text inputs, voting options) */}
              {children && (
                <div className="mt-4 w-full">
                  {children}
                </div>
              )}

              {/* Mobile swipe hint */}
              {!hideActionButtons && (
                <div className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 sm:hidden">
                  Swipe left to skip · Swipe right to complete
                </div>
              )}
            </div>

            {/* Bottom Actions Cluster */}
            {!hideActionButtons && (
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundService.playClick();
                    onSkip();
                  }}
                  className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white active:scale-95 text-xs font-semibold transition"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Next Card</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundService.playSuccess();
                    onComplete();
                  }}
                  className="flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white active:scale-95 text-xs font-bold shadow-lg shadow-pink-900/40 hover:opacity-95 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>{completeLabel || 'Complete (+10 pts)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
