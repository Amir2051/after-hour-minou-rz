/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NeverHaveIEverItem {
  id: string;
  category: string;
  intensity: 'mild' | 'medium' | 'spicy' | 'wild';
  text: string;
}

export const NEVER_HAVE_I_EVER_EXPANDED_DECK: NeverHaveIEverItem[] = [
  // ==========================================
  // 1. FUNNY & HILARIOUS (5 Statements)
  // ==========================================
  {
    id: 'nhie-fh-1',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: "Never have I ever pretended to be asleep just to get out of an errand, chore, or conversation.",
  },
  {
    id: 'nhie-fh-2',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: "Never have I ever blamed a weird mystery noise or smell on the pet (or an open window) when it was definitely me.",
  },
  {
    id: 'nhie-fh-3',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: "Never have I ever secretly stalked my partner's old childhood or college photos on social media for laughs.",
  },
  {
    id: 'nhie-fh-4',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: "Never have I ever practiced an argument in the shower and emerged feeling victorious against an imaginary scenario.",
  },
  {
    id: 'nhie-fh-5',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    text: "Never have I ever secretly eaten the last snack my partner was saving and denied all knowledge of its disappearance.",
  },

  // ==========================================
  // 2. FLIRTY (5 Statements)
  // ==========================================
  {
    id: 'nhie-fl-1',
    category: 'Flirty',
    intensity: 'medium',
    text: "Never have I ever gotten completely flustered and tongue-tied because my partner looked ridiculously attractive.",
  },
  {
    id: 'nhie-fl-2',
    category: 'Flirty',
    intensity: 'medium',
    text: "Never have I ever deliberately chosen an outfit solely because I knew it would make my partner stare.",
  },
  {
    id: 'nhie-fl-3',
    category: 'Flirty',
    intensity: 'medium',
    text: "Never have I ever checked out my partner’s backside while they were walking in front of me and smiled to myself.",
  },
  {
    id: 'nhie-fl-4',
    category: 'Flirty',
    intensity: 'medium',
    text: "Never have I ever sent a flirty text and immediately put my phone face down with my heart pounding.",
  },
  {
    id: 'nhie-fl-5',
    category: 'Flirty',
    intensity: 'medium',
    text: "Never have I ever initiated physical touch in public (holding hands, brushing shoulders) just to mark my territory.",
  },

  // ==========================================
  // 3. ROMANTIC (5 Statements)
  // ==========================================
  {
    id: 'nhie-ro-1',
    category: 'Romantic',
    intensity: 'medium',
    text: "Never have I ever quietly listened to a song on repeat because every single lyric reminded me of our love.",
  },
  {
    id: 'nhie-ro-2',
    category: 'Romantic',
    intensity: 'medium',
    text: "Never have I ever re-read old text messages from our early dating days and smiled like an idiot.",
  },
  {
    id: 'nhie-ro-3',
    category: 'Romantic',
    intensity: 'medium',
    text: "Never have I ever looked at my partner while they were sound asleep and felt an overwhelming wave of gratitude.",
  },
  {
    id: 'nhie-ro-4',
    category: 'Romantic',
    intensity: 'medium',
    text: "Never have I ever kept a ticket stub, napkin, or small souvenir from one of our early dates in a secret spot.",
  },
  {
    id: 'nhie-ro-5',
    category: 'Romantic',
    intensity: 'medium',
    text: "Never have I ever bragged about how amazing my partner is to friends or family when they weren't in the room.",
  },

  // ==========================================
  // 4. DEEP & PERSONAL (5 Statements)
  // ==========================================
  {
    id: 'nhie-dp-1',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: "Never have I ever hidden tears from my partner because I wanted to stay strong for them in a difficult moment.",
  },
  {
    id: 'nhie-dp-2',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: "Never have I ever changed an important life goal or worldview because of my partner's influence on my heart.",
  },
  {
    id: 'nhie-dp-3',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: "Never have I ever felt terrified of how deeply vulnerable loving my partner makes me feel.",
  },
  {
    id: 'nhie-dp-4',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: "Never have I ever made a personal sacrifice for our relationship that I never even brought up or held over them.",
  },
  {
    id: 'nhie-dp-5',
    category: 'Deep & Personal',
    intensity: 'medium',
    text: "Never have I ever prayed, meditated, or deeply wished for my partner's safety and happiness more than my own.",
  },

  // ==========================================
  // 5. WILD CARDS (5 Statements)
  // ==========================================
  {
    id: 'nhie-wc-1',
    category: 'Wild Cards',
    intensity: 'wild',
    text: "Never have I ever gone skinny-dipping in natural water with someone I was crazy about.",
  },
  {
    id: 'nhie-wc-2',
    category: 'Wild Cards',
    intensity: 'wild',
    text: "Never have I ever bought something totally impulsive and wildly expensive without consulting anyone.",
  },
  {
    id: 'nhie-wc-3',
    category: 'Wild Cards',
    intensity: 'wild',
    text: "Never have I ever gotten locked out of a hotel room or apartment wearing almost nothing.",
  },
  {
    id: 'nhie-wc-4',
    category: 'Wild Cards',
    intensity: 'wild',
    text: "Never have I ever sneaked into a VIP section, closed rooftop, or restricted area just for the thrill.",
  },
  {
    id: 'nhie-wc-5',
    category: 'Wild Cards',
    intensity: 'wild',
    text: "Never have I ever taken a spontaneous road trip with zero hotel reservations and slept in the car.",
  },

  // ==========================================
  // 6. SPICY 18+ (DEDICATED 31 UNIQUE STATEMENTS)
  // ==========================================
  {
    id: 'nhie-sp-1',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever thought about making love to my partner while in the middle of a mundane errand or grocery trip.",
  },
  {
    id: 'nhie-sp-2',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever hooked up in an adventurous location where there was a real risk of someone walking in.",
  },
  {
    id: 'nhie-sp-3',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever woken my partner up in the middle of the night specifically because I was craving physical intimacy.",
  },
  {
    id: 'nhie-sp-4',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever tried sexy roleplay or used code names / alternate personas in the bedroom.",
  },
  {
    id: 'nhie-sp-5',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever used food, whipped cream, honey, or chocolate syrup during intimate foreplay.",
  },
  {
    id: 'nhie-sp-6',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever had a steamy dream about my partner and felt a rush of heat the next morning seeing them.",
  },
  {
    id: 'nhie-sp-7',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever worn suggestive lingerie or underwear under normal work clothes just to feel secretly sexy all day.",
  },
  {
    id: 'nhie-sp-8',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever experimented with blindfolds, silk ties, or soft restraint play during lovemaking.",
  },
  {
    id: 'nhie-sp-9',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever made love in front of a full-length mirror and watched our movements.",
  },
  {
    id: 'nhie-sp-10',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever whispered something so filthy into my partner's ear that it made their jaw drop.",
  },
  {
    id: 'nhie-sp-11',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever had a spontaneous encounter in a car parked somewhere scenic or secluded.",
  },
  {
    id: 'nhie-sp-12',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever given or received a sensual massage that started with aching muscles and ended completely naked.",
  },
  {
    id: 'nhie-sp-13',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever had to bite my lip or stifle a moan because roommates, family, or hotel guests were right next door.",
  },
  {
    id: 'nhie-sp-14',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever joined my partner unexpectedly in the shower with purely romantic or seductive intentions.",
  },
  {
    id: 'nhie-sp-15',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever replayed our hottest night together in my mind to help me fall asleep or get through a boring day.",
  },
  {
    id: 'nhie-sp-16',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever slipped a hand under my partner’s shirt or waistband while watching TV on the couch.",
  },
  {
    id: 'nhie-sp-17',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever initiated intimacy on the living room floor, kitchen counter, or dining table instead of the bed.",
  },
  {
    id: 'nhie-sp-18',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever been teased to the absolute edge of climax and told to hold on before being allowed to finish.",
  },
  {
    id: 'nhie-sp-19',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever left a visible love bite or passionate kiss mark on my partner that they had to conceal.",
  },
  {
    id: 'nhie-sp-20',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever used ice cubes or temperature play across my partner's chest, neck, or stomach.",
  },
  {
    id: 'nhie-sp-21',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever felt so overwhelmingly turned on by my partner's voice alone that it sent chills through my core.",
  },
  {
    id: 'nhie-sp-22',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever had multiple rounds of lovemaking in a single 24-hour period that left us sore and smiling.",
  },
  {
    id: 'nhie-sp-23',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever bought adult bedroom accessories or toys secretly to surprise my partner with later.",
  },
  {
    id: 'nhie-sp-24',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever undressed my partner slowly using only my teeth and lips.",
  },
  {
    id: 'nhie-sp-25',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever made love outdoors in a secluded backyard, private pool, or balcony under the open sky.",
  },
  {
    id: 'nhie-sp-26',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever looked at my partner across a crowded restaurant table and touched their leg beneath the tablecloth.",
  },
  {
    id: 'nhie-sp-27',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever spent an entire Sunday afternoon in bed without putting on a single stitch of clothing.",
  },
  {
    id: 'nhie-sp-28',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever taken a steamy photo specifically meant for my partner's eyes only.",
  },
  {
    id: 'nhie-sp-29',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever asked my partner for a specific erotic fantasy and had them fulfill it even better than I imagined.",
  },
  {
    id: 'nhie-sp-30',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever felt an electric jolt of sexual tension just from my partner gently grasping the back of my neck.",
  },
  {
    id: 'nhie-sp-31',
    category: 'Spicy 18+',
    intensity: 'spicy',
    text: "Never have I ever wanted to pause a game right in the middle because I couldn't keep my hands off my partner another second.",
  },
];
