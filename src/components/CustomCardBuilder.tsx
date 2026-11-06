/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Heart, X, Check } from 'lucide-react';
import { CustomCard, GameModeId, IntensityLevel } from '../types';
import { storageService } from '../services/storage';
import { soundService } from '../services/audio';

interface CustomCardBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomCardAdded: () => void;
}

export const CustomCardBuilder: React.FC<CustomCardBuilderProps> = ({
  isOpen,
  onClose,
  onCustomCardAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'categories'>('create');
  const [cardMode, setCardMode] = useState<GameModeId>('truth_or_dare');
  const [cardType, setCardType] = useState<'truth' | 'dare' | 'question' | 'statement'>('truth');
  const [cardCategory, setCardCategory] = useState('Personal Secrets');
  const [cardIntensity, setCardIntensity] = useState<IntensityLevel>('medium');
  const [cardText, setCardText] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const customCards = storageService.getCustomCards();
  const settings = storageService.getSettings();
  const [categories, setCategories] = useState(settings.activeCategories);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardText.trim()) return;

    soundService.playSuccess();
    const newCard: CustomCard = {
      id: `custom-${Date.now()}`,
      mode: cardMode,
      type: cardType,
      text: cardText.trim(),
      category: cardCategory.trim() || 'Custom',
      intensity: cardIntensity,
      createdAt: Date.now(),
    };

    storageService.saveCustomCard(newCard);
    setCardText('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2000);
    onCustomCardAdded();
  };

  const handleDelete = (id: string) => {
    soundService.playClick();
    storageService.deleteCustomCard(id);
    onCustomCardAdded();
  };

  const handleToggleCategory = (catKey: string) => {
    soundService.playClick();
    const updated = { ...categories, [catKey]: !categories[catKey] };
    setCategories(updated);
    storageService.saveSettings({ ...settings, activeCategories: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl glass-panel-glow p-6 text-slate-100 shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500/40" />
          <span className="text-xs uppercase tracking-widest text-pink-400 font-semibold">Deck Studio</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Custom Deck &amp; Content Builder</h2>

        {/* Segmented Tabs */}
        <div className="flex items-center gap-1 mt-4 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('create');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create New Card
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('manage');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Custom Cards ({customCards.length})
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('categories');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Category Filters
          </button>
        </div>

        {/* Tab 1: Create Card */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Game</label>
                <select
                  value={cardMode}
                  onChange={(e) => setCardMode(e.target.value as GameModeId)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="truth_or_dare">Truth or Dare</option>
                  <option value="how_well_know_me">How Well Do You Know Me?</option>
                  <option value="would_you_rather">Would You Rather?</option>
                  <option value="never_have_i_ever">Never Have I Ever</option>
                  <option value="spicy_challenge">The Spicy Challenge</option>
                  <option value="who_is_more_likely">Who Is More Likely To?</option>
                  <option value="finish_the_sentence">Finish the Sentence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Card Type</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as any)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="truth">Truth</option>
                  <option value="dare">Dare</option>
                  <option value="question">Question</option>
                  <option value="statement">Statement / Prompt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={cardCategory}
                  onChange={(e) => setCardCategory(e.target.value)}
                  placeholder="e.g. Inside Jokes, Sensual"
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Intensity</label>
                <select
                  value={cardIntensity}
                  onChange={(e) => setCardIntensity(e.target.value as IntensityLevel)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="spicy">Spicy 18+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Card Text / Challenge</label>
              <textarea
                value={cardText}
                onChange={(e) => setCardText(e.target.value)}
                placeholder="Write your secret truth, playful dare, or inside joke question..."
                rows={3}
                className="w-full rounded-xl bg-black/50 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={!cardText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-900/40 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {successNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Plus className="w-4 h-4" />}
              <span>{successNotice ? 'Card Saved to Your Deck!' : 'Add to Game Rotation'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Manage Cards */}
        {activeTab === 'manage' && (
          <div className="mt-5 max-h-72 overflow-y-auto space-y-2 pr-1">
            {customCards.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No custom cards added yet. Create your first card above to personalize your game!
              </div>
            ) : (
              customCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-pink-400 font-semibold mb-1">
                      <span className="uppercase">{card.type || 'Card'}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">{card.category}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-purple-300 capitalize">{card.intensity}</span>
                    </div>
                    <p className="text-white text-xs leading-relaxed">{card.text}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition shrink-0"
                    title="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Category Filtering */}
        {activeTab === 'categories' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-slate-400">
              Toggle which categories appear during random game rounds:
            </p>
            {[
              { key: 'easy_funny', label: 'Easy & Funny', desc: 'Lighthearted laughs and quirky truths' },
              { key: 'flirty', label: 'Flirty', desc: 'Teasing compliments and sensual sparks' },
              { key: 'romantic', label: 'Romantic', desc: 'Heartfelt memories and tender vows' },
              { key: 'deep_personal', label: 'Deep & Personal', desc: 'Vulnerability and emotional connection' },
              { key: 'wild_cards', label: 'Wild Cards', desc: 'Spontaneous swaps and unexpected twists' },
              { key: 'spicy', label: 'Spicy 18+', desc: 'Adult intimate dares and unfiltered desires' },
            ].map((cat) => (
              <div
                key={cat.key}
                onClick={() => handleToggleCategory(cat.key)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{cat.label}</div>
                  <div className="text-[11px] text-slate-400">{cat.desc}</div>
                </div>
                <div
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    categories[cat.key] ? 'bg-pink-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      categories[cat.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
