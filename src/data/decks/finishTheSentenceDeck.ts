/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FinishSentenceItem {
  id: string;
  category: string;
  intensity: 'mild' | 'medium' | 'spicy' | 'wild';
  prompt: string;
}

export const FINISH_THE_SENTENCE_EXPANDED_DECK: FinishSentenceItem[] = [
  // ==========================================
  // 1. FUNNY & HILARIOUS (5 Prompts)
  // ==========================================
  {
    id: 'fts-fh-1',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    prompt: 'Something ridiculously goofy that always makes me smile about you is...',
  },
  {
    id: 'fts-fh-2',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    prompt: 'If we were arrested together, the crime we most likely committed was...',
  },
  {
    id: 'fts-fh-3',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    prompt: 'The funniest misunderstanding or miscommunication we ever had was when...',
  },
  {
    id: 'fts-fh-4',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    prompt: 'One habit of yours that drove me crazy at first but I now find adorable is...',
  },
  {
    id: 'fts-fh-5',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    prompt: 'If our life together were a sitcom, the recurring running joke about us would be...',
  },

  // ==========================================
  // 2. FLIRTY (5 Prompts)
  // ==========================================
  {
    id: 'fts-fl-1',
    category: 'Flirty',
    intensity: 'medium',
    prompt: 'The outfit or look of yours that makes my heart skip a beat every time is...',
  },
  {
    id: 'fts-fl-2',
    category: 'Flirty',
    intensity: 'medium',
    prompt: 'The moment today when I looked at you and thought "damn, I am so lucky" was when...',
  },
  {
    id: 'fts-fl-3',
    category: 'Flirty',
    intensity: 'medium',
    prompt: 'If you kissed me right now, the exact spot I hope you start with is...',
  },
  {
    id: 'fts-fl-4',
    category: 'Flirty',
    intensity: 'medium',
    prompt: 'The subtle gesture you do without even realizing that turns me on immediately is...',
  },
  {
    id: 'fts-fl-5',
    category: 'Flirty',
    intensity: 'medium',
    prompt: 'One flirty compliment I haven’t said out loud to you nearly enough lately is...',
  },

  // ==========================================
  // 3. ROMANTIC (5 Prompts)
  // ==========================================
  {
    id: 'fts-ro-1',
    category: 'Romantic',
    intensity: 'medium',
    prompt: 'The exact moment I realized I was falling completely in love with you was...',
  },
  {
    id: 'fts-ro-2',
    category: 'Romantic',
    intensity: 'medium',
    prompt: 'When I imagine growing old together 30 years from now, the picture in my mind is...',
  },
  {
    id: 'fts-ro-3',
    category: 'Romantic',
    intensity: 'medium',
    prompt: 'One romantic tradition or sweet habit I wish we made time for more often is...',
  },
  {
    id: 'fts-ro-4',
    category: 'Romantic',
    intensity: 'medium',
    prompt: 'The memory of us that warms my soul even on my absolute worst days is...',
  },
  {
    id: 'fts-ro-5',
    category: 'Romantic',
    intensity: 'medium',
    prompt: 'Something tender and affectionate you do that always makes me feel truly cherished is...',
  },

  // ==========================================
  // 4. DEEP & PERSONAL (5 Prompts)
  // ==========================================
  {
    id: 'fts-dp-1',
    category: 'Deep & Personal',
    intensity: 'medium',
    prompt: 'One thing I have been afraid or hesitant to tell you, but want you to know, is...',
  },
  {
    id: 'fts-dp-2',
    category: 'Deep & Personal',
    intensity: 'medium',
    prompt: 'The way you have helped me grow into a stronger, kinder human being is by...',
  },
  {
    id: 'fts-dp-3',
    category: 'Deep & Personal',
    intensity: 'medium',
    prompt: 'When life gets noisy and overwhelming, what your presence does for my spirit is...',
  },
  {
    id: 'fts-dp-4',
    category: 'Deep & Personal',
    intensity: 'medium',
    prompt: 'A dream or secret hope for our future that I carry quietly in my heart is...',
  },
  {
    id: 'fts-dp-5',
    category: 'Deep & Personal',
    intensity: 'medium',
    prompt: 'Something intimate I appreciate most about our emotional connection is...',
  },

  // ==========================================
  // 5. WILD CARDS (5 Prompts)
  // ==========================================
  {
    id: 'fts-wc-1',
    category: 'Wild Cards',
    intensity: 'wild',
    prompt: 'One crazy, spontaneous adventure I would drop everything to embark on with you is...',
  },
  {
    id: 'fts-wc-2',
    category: 'Wild Cards',
    intensity: 'wild',
    prompt: 'If we could disappear to an exotic secret hideaway for 7 days with zero phones, we would go to...',
  },
  {
    id: 'fts-wc-3',
    category: 'Wild Cards',
    intensity: 'wild',
    prompt: 'One daring, bucket-list thrill I want us to conquer together before we die is...',
  },
  {
    id: 'fts-wc-4',
    category: 'Wild Cards',
    intensity: 'wild',
    prompt: 'If we had zero social inhibitions for one single night, the first rule we would break is...',
  },
  {
    id: 'fts-wc-5',
    category: 'Wild Cards',
    intensity: 'wild',
    prompt: 'The wildest unexpected surprise I would love to orchestrate for you is...',
  },

  // ==========================================
  // 6. SPICY 18+ (DEDICATED 31 UNIQUE PROMPTS)
  // ==========================================
  {
    id: 'fts-sp-1',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The very first moment I realized I wanted you sexually was when...',
  },
  {
    id: 'fts-sp-2',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The single most sensitive spot on my body that drives me crazy when you touch it is...',
  },
  {
    id: 'fts-sp-3',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'Something intimate and bold that I secretly fantasize about doing with you is...',
  },
  {
    id: 'fts-sp-4',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'When you whisper in my ear during intimacy, the words that send chills down my spine are...',
  },
  {
    id: 'fts-sp-5',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'One specific night we made love that was so passionate I will never ever forget it was when...',
  },
  {
    id: 'fts-sp-6',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The piece of clothing you wear that makes it nearly impossible for me to keep my hands to myself is...',
  },
  {
    id: 'fts-sp-7',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'What I want you to do to me as soon as we turn off the lights tonight is...',
  },
  {
    id: 'fts-sp-8',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The way your mouth feels against my neck when you kiss me makes me want to...',
  },
  {
    id: 'fts-sp-9',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'One bedroom position or sensual game I have been craving to explore together is...',
  },
  {
    id: 'fts-sp-10',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The sound or breath you make when I touch you right there makes me feel...',
  },
  {
    id: 'fts-sp-11',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'If you took total dominant control in bed tonight, the first thing I want you to command is...',
  },
  {
    id: 'fts-sp-12',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'Something erotic about your body that I find endlessly intoxicating is...',
  },
  {
    id: 'fts-sp-13',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'A place outside our bedroom where I have secretly thought about making love to you is...',
  },
  {
    id: 'fts-sp-14',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The sensual touch of yours that makes my breath catch in my throat instantly is...',
  },
  {
    id: 'fts-sp-15',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'When we are kissing and you gently bite my bottom lip, my immediate reaction is...',
  },
  {
    id: 'fts-sp-16',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'One intimate boundary or new experience I feel safe exploring exclusively with you is...',
  },
  {
    id: 'fts-sp-17',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The way our bodies fit together when we are skin-to-skin feels like...',
  },
  {
    id: 'fts-sp-18',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'If I were blindfolded and at your mercy right now, what I hope you would do first is...',
  },
  {
    id: 'fts-sp-19',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'Something you did in bed recently that surprised me and drove me absolutely wild was...',
  },
  {
    id: 'fts-sp-20',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The steamiest text or whisper you could send me right now to make my heart race would say...',
  },
  {
    id: 'fts-sp-21',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'What I love most about the way you look at me right before we take off our clothes is...',
  },
  {
    id: 'fts-sp-22',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'One secret pleasure of mine during intimacy that I haven’t said out loud is how much I love when you...',
  },
  {
    id: 'fts-sp-23',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The rhythm and tempo that makes me lose all control with you is...',
  },
  {
    id: 'fts-sp-24',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'When you hold my hands pinned or interlaced during lovemaking, it makes me feel...',
  },
  {
    id: 'fts-sp-25',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'One seductive roleplay or fantasy meeting we should try acting out on our next hotel stay is...',
  },
  {
    id: 'fts-sp-26',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The warmest, most comforting sensation after we finish making love is when you...',
  },
  {
    id: 'fts-sp-27',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'If we could spend the next 24 hours in bed together without leaving the room, we would...',
  },
  {
    id: 'fts-sp-28',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'What turns me on more than anything else in the entire world is the realization that you...',
  },
  {
    id: 'fts-sp-29',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'The part of your body I could spend hours kissing without ever getting tired is...',
  },
  {
    id: 'fts-sp-30',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'Something adventurous I promise to do to you before this night is over is...',
  },
  {
    id: 'fts-sp-31',
    category: 'Spicy 18+',
    intensity: 'spicy',
    prompt: 'Looking into your eyes right now, the truth about how badly I desire you is...',
  },
];
