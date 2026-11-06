/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Dices, Shuffle, Check, Layers } from 'lucide-react';
import { GLOBAL_CATEGORIES, GlobalCategory, CATEGORY_ICONS, isCategorySpicy } from '../data/categories';
import { soundService } from '../services/audio';

export interface CategoryFilterBarProps {
  selectedCategory: string | string[];
  onSelectCategory: (category: string) => void;
  onToggleCategory?: (category: string) => void;
  isMultiSelect?: boolean;
  onToggleMultiSelect?: () => void;
  isAdultConfirmed: boolean;
  onRequestAgeGate: () => void;
  deckCounts?: Record<string, number>;
  totalDeckSize?: number;
  onShuffle?: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onToggleCategory,
  isMultiSelect = false,
  onToggleMultiSelect,
  isAdultConfirmed,
  onRequestAgeGate,
  deckCounts,
  totalDeckSize,
  onShuffle,
}) => {
  const isSelected = (cat: string) => {
    if (Array.isArray(selectedCategory)) {
      return selectedCategory.includes(cat);
    }
    return selectedCategory === cat;
  };

  const handleCategoryClick = (cat: string) => {
    soundService.playClick();
    if (isCategorySpicy(cat) && !isAdultConfirmed) {
      onRequestAgeGate();
      return;
    }
    if (isMultiSelect && onToggleCategory) {
      onToggleCategory(cat);
    } else {
      onSelectCategory(cat);
    }
  };

  const isRandomActive = Array.isArray(selectedCategory)
    ? selectedCategory.includes('Random Mix') || selectedCategory.length === 0
    : selectedCategory === 'Random Mix' || selectedCategory === 'All';

  return (
    <div className="mb-5 space-y-2.5">
      {/* Top row: Multi-select switch, Deck count & Shuffle */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          {totalDeckSize !== undefined && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-pink-300 bg-pink-950/30 border border-pink-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              {totalDeckSize} cards in active deck
            </span>
          )}

          {onToggleMultiSelect && (
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onToggleMultiSelect();
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition ${
                isMultiSelect
                  ? 'bg-purple-600/30 border-purple-500/50 text-purple-300 font-semibold'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle combining multiple categories simultaneously"
            >
              <Layers className="w-3 h-3" />
              <span>{isMultiSelect ? 'Mix & Match: ON' : 'Combine Categories'}</span>
            </button>
          )}
        </div>

        {onShuffle && (
          <button
            type="button"
            onClick={() => {
              soundService.playSuccess();
              onShuffle();
            }}
            className="flex items-center gap-1 text-[11px] text-pink-300 hover:text-white transition py-0.5 px-2 rounded-lg hover:bg-white/5"
            title="Reshuffle deck sequence"
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>
        )}
      </div>

      {/* Horizontal Category Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs -mx-1 px-1">
        {/* Random Mix button */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onSelectCategory('Random Mix');
          }}
          className={`py-1.5 px-3 rounded-xl font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            isRandomActive
              ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white font-semibold shadow-md shadow-pink-950/50 ring-1 ring-white/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Random Mix</span>
        </button>

        {/* Global categories */}
        {GLOBAL_CATEGORIES.map((cat: GlobalCategory) => {
          const selected = isSelected(cat);
          const isSpicy = isCategorySpicy(cat);
          const count = deckCounts ? deckCounts[cat] : undefined;

          if (isSpicy && !isAdultConfirmed) {
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className="py-1.5 px-3 rounded-xl border border-pink-500/30 bg-pink-950/30 text-pink-300 hover:bg-pink-900/40 text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all shadow-sm shadow-pink-950/40"
              >
                <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                <span>{cat}</span>
                <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-950/80 px-1.5 py-0.5 rounded border border-pink-500/30">
                  18+
                </span>
              </button>
            );
          }

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`py-1.5 px-3 rounded-xl font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                selected
                  ? isSpicy
                    ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white font-semibold shadow-md shadow-rose-950/60 ring-1 ring-rose-400'
                    : 'bg-white/20 text-white font-semibold ring-1 ring-white/25 shadow-md shadow-black/40'
                  : isSpicy
                  ? 'bg-rose-950/30 border border-rose-500/20 text-rose-300 hover:bg-rose-900/40'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
              {count !== undefined && (
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              )}
              {isMultiSelect && selected && (
                <Check className="w-3 h-3 text-pink-300 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
