/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GLOBAL_CATEGORIES = [
  'Funny & Hilarious',
  'Flirty',
  'Romantic',
  'Deep & Personal',
  'Wild Cards',
  'Spicy 18+',
] as const;

export type GlobalCategory = typeof GLOBAL_CATEGORIES[number];

export const CATEGORY_ICONS: Record<GlobalCategory, string> = {
  'Funny & Hilarious': '😂',
  'Flirty': '💋',
  'Romantic': '🌹',
  'Deep & Personal': '✨',
  'Wild Cards': '⚡',
  'Spicy 18+': '🔥',
};

export const CATEGORY_DESCRIPTIONS: Record<GlobalCategory, string> = {
  'Funny & Hilarious': 'Playful banter, funny habits, laugh-out-loud dilemmas & lighthearted fun.',
  'Flirty': 'Eye contact, compliments, electric chemistry & playful teasing.',
  'Romantic': 'Heartfelt memories, vulnerability, emotional bonding & affectionate warmth.',
  'Deep & Personal': 'Core desires, relationship dreams, meaningful reflections & soul connection.',
  'Wild Cards': 'Spontaneous dares, unpredictable choices & thrilling adventurous surprises.',
  'Spicy 18+': 'Consensual adult intimacy, seductive touch, private fantasies & passionate heat.',
};

export function isCategorySpicy(cat: string): boolean {
  const lower = cat.toLowerCase();
  return lower.includes('spicy') || lower.includes('18+') || lower.includes('adult');
}

export function normalizeCategory(cat: string): GlobalCategory {
  const lower = cat.toLowerCase();
  if (lower.includes('spicy') || lower.includes('18+') || lower.includes('adult') || lower.includes('intimacy')) {
    return 'Spicy 18+';
  }
  if (lower.includes('romantic') || lower.includes('love') || lower.includes('vow') || lower.includes('affection')) {
    return 'Romantic';
  }
  if (lower.includes('flirt') || lower.includes('teas') || lower.includes('kiss')) {
    return 'Flirty';
  }
  if (lower.includes('deep') || lower.includes('personal') || lower.includes('vulnerab') || lower.includes('soul') || lower.includes('heart')) {
    return 'Deep & Personal';
  }
  if (lower.includes('wild') || lower.includes('dare') || lower.includes('danger') || lower.includes('bold')) {
    return 'Wild Cards';
  }
  return 'Funny & Hilarious';
}

export function matchesCategoryFilter(itemCategory: string, selected: string | string[]): boolean {
  if (selected === 'All' || selected === 'Random Mix') return true;
  if (Array.isArray(selected)) {
    if (selected.length === 0 || selected.includes('All') || selected.includes('Random Mix')) return true;
    const normalizedItem = normalizeCategory(itemCategory);
    return selected.some(s => s === itemCategory || normalizeCategory(s) === normalizedItem);
  }
  const normalizedItem = normalizeCategory(itemCategory);
  return selected === itemCategory || normalizeCategory(selected) === normalizedItem;
}
