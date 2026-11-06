/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WheelSegmentConfig {
  id: string;
  name: string;
  category: string;
  color: string;
  glowColor: string;
  icon: string;
  intensity: 'mild' | 'medium' | 'spicy' | 'wild';
}

export const EXPANDED_WHEEL_SEGMENTS: WheelSegmentConfig[] = [
  {
    id: 'seg-fh',
    name: 'Funny & Hilarious',
    category: 'Funny & Hilarious',
    color: '#8b5cf6', // Violet
    glowColor: 'rgba(139, 92, 246, 0.4)',
    icon: '😂',
    intensity: 'mild',
  },
  {
    id: 'seg-fl',
    name: 'Flirty Chemistry',
    category: 'Flirty',
    color: '#ec4899', // Pink
    glowColor: 'rgba(236, 72, 153, 0.4)',
    icon: '💋',
    intensity: 'medium',
  },
  {
    id: 'seg-ro',
    name: 'Romantic Bond',
    category: 'Romantic',
    color: '#e11d48', // Rose/Burgundy
    glowColor: 'rgba(225, 29, 72, 0.4)',
    icon: '🌹',
    intensity: 'medium',
  },
  {
    id: 'seg-dp',
    name: 'Deep Connection',
    category: 'Deep & Personal',
    color: '#6366f1', // Indigo/Midnight
    glowColor: 'rgba(99, 102, 241, 0.4)',
    icon: '✨',
    intensity: 'medium',
  },
  {
    id: 'seg-wc',
    name: 'Wild Surprises',
    category: 'Wild Cards',
    color: '#f43f5e', // Crimson/Electric
    glowColor: 'rgba(244, 63, 94, 0.4)',
    icon: '⚡',
    intensity: 'wild',
  },
  {
    id: 'seg-sp',
    name: 'Spicy 18+ Heat',
    category: 'Spicy 18+',
    color: '#be123c', // Deep Crimson Red
    glowColor: 'rgba(255, 45, 120, 0.5)',
    icon: '🔥',
    intensity: 'spicy',
  },
];

export const WHEEL_EXPANDED_CHALLENGES: Record<string, string[]> = {
  // 1. FUNNY & HILARIOUS (6 Challenges)
  'Funny & Hilarious': [
    'Do your best impression of how your partner dances when they think nobody is watching.',
    'Speak only in high-pitched opera vocals for the next two full minutes.',
    'Let your partner style your hair into a comical high-fashion runway look.',
    'Try to make your partner laugh in 30 seconds using zero words or sounds—facial expressions only.',
    'Narrate everything your partner touches for the next minute like an excited game show host.',
    'Do a 30-second dramatic reenactment of our very first argument over something trivial.',
  ],

  // 2. FLIRTY (6 Challenges)
  'Flirty': [
    'Whisper your top three favorite physical features of your partner directly against their ear.',
    'Give your partner a slow, sensual 60-second neck and shoulder rub.',
    'Hold unbroken eye contact while lightly biting your lower lip for 25 seconds.',
    'Trace your fingers gently along your partner’s jawline down to their collarbones.',
    'Deliver a seductive movie-star kiss on the cheek, jaw, and softly on the lips.',
    'Come sit intimately close with your partner on the same chair for the next round.',
  ],

  // 3. ROMANTIC (6 Challenges)
  'Romantic': [
    'Hold both of your partner’s hands and declare three things you cherish about your journey together.',
    'Slow-dance together right where you are for 60 seconds with no background music.',
    'Gently kiss your partner on five distinct spots on their face with tenderness.',
    'Place your hand over your partner’s heart and say what you love most about their soul.',
    'Synchronize your breathing with your partner in a long, comforting chest-to-chest embrace.',
    'Share the exact moment you quietly knew you were in love with them.',
  ],

  // 4. DEEP & PERSONAL (6 Challenges)
  'Deep & Personal': [
    'Confess one personal vulnerability or fear you rarely voice to anyone in the world.',
    'Thank your partner specifically for how they stood beside you during your hardest season.',
    'Describe the kind of future and legacy you dream of building together over the next decade.',
    'Tell your partner one quality about them that inspires you to be a better human being.',
    'Share a childhood memory that shaped who you are today and how it impacts our relationship.',
    'Close your eyes, hold your partner’s hands, and share what peaceful feeling their presence brings.',
  ],

  // 5. WILD CARDS (6 Challenges)
  'Wild Cards': [
    'Swap one piece of clothing with your partner right now and wear it for the next round.',
    'Take an ice cube and run it across your partner’s neck, warming the chill with your breath.',
    'Give your partner a dramatic 45-second runway catwalk across the room.',
    'Blindfold your partner and feed them a mystery sip or treat from the kitchen.',
    'Let your partner pose you in whatever freeze-frame statue pose they want for 30 seconds.',
    'Execute a daring 30-second salsa spin and dip with your partner right now.',
  ],

  // 6. SPICY 18+ (DEDICATED 31 UNIQUE CHALLENGES)
  'Spicy 18+': [
    'Give your partner a slow, breathless 30-second French kiss without using your hands.',
    'Trace your warm lips along your partner’s neck from behind their ear down to their collarbone.',
    'Slide your hands beneath your partner’s shirt and feel the heat of their bare lower back.',
    'Whisper in vivid detail into your partner’s ear what you plan to do to them in bed tonight.',
    'Sit facing your partner on their lap and deliver a lingering kiss against the dip of their throat.',
    'Slowly remove one article of your partner’s clothing with unbroken eye contact.',
    'Gently bite your partner’s lower lip during a warm, teasing kiss, then pull away slowly.',
    'Blindfold your partner and kiss them on three unexpected, intimate sensitive spots.',
    'Run your fingertips up your partner’s inner thigh and pause right above the knee with a kiss.',
    'Hold your partner’s hands gently above their head and kiss down their throat to their chest.',
    'Trace the groove of your partner’s spine with light fingernails down to their waistband.',
    'Guide your partner against the nearest wall and kiss them with urgent, breathless passion.',
    'Unbutton the top two buttons of your shirt while keeping your eyes locked onto your partner’s.',
    'Breathe warmly against your partner’s collarbone without touching skin for 20 electric seconds.',
    'Slide your hands down to your partner’s hips, pull them flush against you, and sway sensually.',
    'Kiss every knuckle of your partner’s hand, then kiss their inner wrist right on their pulse.',
    'Gently tug on your partner’s hair to tilt their head back and kiss their exposed neck.',
    'Give your partner a 60-second sensual shoulder and chest massage using firm, warm palms.',
    'Ask your partner for permission to touch their favorite sensitive spot, and obey their direction.',
    'Hover your lips half a millimeter above your partner’s lips until they beg you to kiss them.',
    'Trace an ice cube along your partner’s collarbone and warm the trail immediately with your mouth.',
    'Place your hands on your partner’s waist and whisper your favorite sensual compliment about their body.',
    'Interlace your fingers with your partner’s and kiss along both sides of their jawline.',
    'Give your partner a prolonged 45-second kiss that alternates between soft teasing and deep passion.',
    'Rest your forehead against your partner’s chest and describe the sensation of their skin.',
    'Place a slow suction kiss on your partner’s neck for 15 seconds without leaving a mark.',
    'Have your partner lean back and place a trail of soft kisses across their stomach to their navel.',
    'Whisper your deepest, most intoxicating private fantasy into your partner’s ear.',
    'Take your partner’s earlobe between your teeth for a gentle, warm nibble and breath.',
    'Pull your partner in close, take their breath away with a passionate dip kiss, and hold them tight.',
    'Deliver the single hottest, most seductive kiss of the entire night right now.',
  ],
};
