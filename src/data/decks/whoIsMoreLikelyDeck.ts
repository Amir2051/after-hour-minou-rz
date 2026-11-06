/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WhoIsMoreLikelyItem {
  id: string;
  category: string;
  intensity: 'mild' | 'medium' | 'spicy' | 'wild';
  text: string;
}

export const WHO_IS_MORE_LIKELY_EXPANDED_DECK: WhoIsMoreLikelyItem[] = [
  // ==========================================
  // 1. FUNNY & HILARIOUS (5 Scenarios)
  // ==========================================
  {
    id: 'wml-fh-1',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: 'Who is more likely to lose their phone or keys while holding them in their hand?',
  },
  {
    id: 'wml-fh-2',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: 'Who is more likely to get irrationally angry at flat-pack furniture instructions?',
  },
  {
    id: 'wml-fh-3',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: 'Who is more likely to fall asleep 10 minutes into a movie they begged to watch?',
  },
  {
    id: 'wml-fh-4',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: 'Who is more likely to order $60 worth of food delivery at midnight on a Tuesday?',
  },
  {
    id: 'wml-fh-5',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: 'Who is more likely to accidentally start a minor kitchen smoke alarm incident while cooking?',
  },

  // ==========================================
  // 2. FLIRTY (5 Scenarios)
  // ==========================================
  {
    id: 'wml-fl-1',
    category: 'Flirty',
    intensity: 'medium',
    text: 'Who is more likely to initiate spontaneous flirting in public with a mischievous look?',
  },
  {
    id: 'wml-fl-2',
    category: 'Flirty',
    intensity: 'medium',
    text: 'Who is more likely to steal the other person’s jacket or hoodie and refuse to return it?',
  },
  {
    id: 'wml-fl-3',
    category: 'Flirty',
    intensity: 'medium',
    text: 'Who is more likely to send a spicy, scandalous selfie during the workday?',
  },
  {
    id: 'wml-fl-4',
    category: 'Flirty',
    intensity: 'medium',
    text: 'Who is more likely to get caught visibly checking out the other person in a crowd?',
  },
  {
    id: 'wml-fl-5',
    category: 'Flirty',
    intensity: 'medium',
    text: 'Who is more likely to whisper a teasing comment right before entering a family gathering?',
  },

  // ==========================================
  // 3. ROMANTIC (5 Scenarios)
  // ==========================================
  {
    id: 'wml-ro-1',
    category: 'Romantic',
    intensity: 'medium',
    text: 'Who is more likely to plan an elaborate, candlelit anniversary surprise weeks in advance?',
  },
  {
    id: 'wml-ro-2',
    category: 'Romantic',
    intensity: 'medium',
    text: 'Who is more likely to cry tears of joy during our wedding vows or a milestone celebration?',
  },
  {
    id: 'wml-ro-3',
    category: 'Romantic',
    intensity: 'medium',
    text: 'Who is more likely to save every cinema ticket stub, handwritten note, and cute photo of us?',
  },
  {
    id: 'wml-ro-4',
    category: 'Romantic',
    intensity: 'medium',
    text: 'Who is more likely to pull the other into an impromptu slow dance in the kitchen?',
  },
  {
    id: 'wml-ro-5',
    category: 'Romantic',
    intensity: 'medium',
    text: 'Who is more likely to wake up early on vacation just to bring coffee and watch the sunrise together?',
  },

  // ==========================================
  // 4. DEEP & PERSONAL (5 Scenarios)
  // ==========================================
  {
    id: 'wml-dp-1',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: 'Who is more likely to sense instantly when their partner is emotionally troubled before a word is spoken?',
  },
  {
    id: 'wml-dp-2',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: 'Who is more likely to stay up until 3:00 AM discussing the meaning of life and universe?',
  },
  {
    id: 'wml-dp-3',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: 'Who is more likely to be the rock and anchor when an unexpected family crisis hits?',
  },
  {
    id: 'wml-dp-4',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: 'Who is more likely to initiate a healthy heart-to-heart conversation after a disagreement?',
  },
  {
    id: 'wml-dp-5',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: 'Who is more likely to make an unselfish personal compromise so the other can achieve a dream?',
  },

  // ==========================================
  // 5. WILD CARDS (5 Scenarios)
  // ==========================================
  {
    id: 'wml-wc-1',
    category: 'Wild Cards',
    intensity: 'wild',
    text: 'Who is more likely to suggest booking a flight to another continent with 2 hours notice?',
  },
  {
    id: 'wml-wc-2',
    category: 'Wild Cards',
    intensity: 'wild',
    text: 'Who is more likely to talk their way out of a speeding ticket with pure charismatic charm?',
  },
  {
    id: 'wml-wc-3',
    category: 'Wild Cards',
    intensity: 'wild',
    text: 'Who is more likely to convince the other to go skinny-dipping in chilly water at midnight?',
  },
  {
    id: 'wml-wc-4',
    category: 'Wild Cards',
    intensity: 'wild',
    text: 'Who is more likely to jump onto the stage or dance floor first when the music peaks?',
  },
  {
    id: 'wml-wc-5',
    category: 'Wild Cards',
    intensity: 'wild',
    text: 'Who is more likely to adopt a stray puppy or kitten without asking for permission first?',
  },

  // ==========================================
  // 6. SPICY 18+ (DEDICATED 31 UNIQUE SCENARIOS)
  // ==========================================
  {
    id: 'wml-sp-1',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to initiate physical intimacy in the middle of the afternoon on a weekend?',
  },
  {
    id: 'wml-sp-2',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest making love somewhere adventurous outside the bedroom?',
  },
  {
    id: 'wml-sp-3',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to whisper something explicitly erotic into the other’s ear during a dinner party?',
  },
  {
    id: 'wml-sp-4',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to wake up craving passionate morning intimacy before breakfast?',
  },
  {
    id: 'wml-sp-5',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to buy seductive bedroom lingerie, sleepwear, or accessories as a surprise?',
  },
  {
    id: 'wml-sp-6',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to take total, dominant charge and pin the other person down during lovemaking?',
  },
  {
    id: 'wml-sp-7',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to be more vocal and expressive with moans and whispers during passion?',
  },
  {
    id: 'wml-sp-8',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to want a long, 45-minute sensual full-body oil massage before making love?',
  },
  {
    id: 'wml-sp-9',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to pull the other into the shower unexpectedly for a steamy encounter?',
  },
  {
    id: 'wml-sp-10',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to leave an accidental love bite or kiss mark on the other person’s neck?',
  },
  {
    id: 'wml-sp-11',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest bringing a silk blindfold or soft ribbons into tonight’s play?',
  },
  {
    id: 'wml-sp-12',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to slip their hand beneath the other person’s clothes while watching a movie?',
  },
  {
    id: 'wml-sp-13',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest an erotic roleplay scenario with costumes or alternate identities?',
  },
  {
    id: 'wml-sp-14',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to tease the other person relentlessly until they are begging for touch?',
  },
  {
    id: 'wml-sp-15',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to want to make love in front of a full-length mirror?',
  },
  {
    id: 'wml-sp-16',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest a spontaneous quickie in a locked room before guests arrive?',
  },
  {
    id: 'wml-sp-17',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to walk around the house wearing almost nothing just to elicit a reaction?',
  },
  {
    id: 'wml-sp-18',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to want a second round of passion immediately after finishing the first?',
  },
  {
    id: 'wml-sp-19',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest incorporating melting ice cubes or temperature contrast play?',
  },
  {
    id: 'wml-sp-20',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to bite the other person’s lower lip playfully during a deep kiss?',
  },
  {
    id: 'wml-sp-21',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest making love on the living room rug by the fire instead of the bed?',
  },
  {
    id: 'wml-sp-22',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to send an enticing text describing what they plan to do to the other tonight?',
  },
  {
    id: 'wml-sp-23',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to take their partner by the waist and lift them onto the kitchen counter?',
  },
  {
    id: 'wml-sp-24',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest going to bed early specifically so there is ample time for slow passion?',
  },
  {
    id: 'wml-sp-25',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to remember every detail of your most unforgettable intimate night together?',
  },
  {
    id: 'wml-sp-26',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to initiate touch beneath the dinner table in a dimly lit restaurant?',
  },
  {
    id: 'wml-sp-27',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to put together a sultry bedroom music playlist for tonight’s encounter?',
  },
  {
    id: 'wml-sp-28',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to want to explore a bold new bedroom position they researched?',
  },
  {
    id: 'wml-sp-29',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to surrender completely and love being taken care of in bed?',
  },
  {
    id: 'wml-sp-30',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to give a prolonged, slow neck kiss that turns knees to jelly?',
  },
  {
    id: 'wml-sp-31',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: 'Who is more likely to suggest turning off all lights except for one candle to heighten touch?',
  },
];
