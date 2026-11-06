/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HowWellQuestion {
  id: string;
  category: string;
  intensity: 'mild' | 'medium' | 'spicy' | 'wild';
  question: string;
  options: string[];
}

export const HOW_WELL_KNOW_ME_EXPANDED_DECK: HowWellQuestion[] = [
  // ==========================================
  // 1. FUNNY & HILARIOUS (5 Questions)
  // ==========================================
  {
    id: 'hw-fh-1',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    question: "What is your partner's most predictable reaction when they are hangry?",
    options: ['Complete silence and staring into space', 'Rapidly declaring they do not care where we eat', 'Getting dramatic over small inconveniences', 'Ordering way too much food on delivery apps'],
  },
  {
    id: 'hw-fh-2',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    question: "Which weird internet rabbit hole can your partner accidentally lose 2 hours exploring?",
    options: ['Zillow mansions they will never buy', 'Bizarre true-crime documentaries', 'Oddly satisfying restoration or cooking videos', 'Celebrity conspiracy theories and Reddit gossip'],
  },
  {
    id: 'hw-fh-3',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    question: "What is your partner's signature guilty pleasure food when nobody is watching?",
    options: ['Late night shredded cheese from the bag', 'A giant bowl of childhood sugary cereal', 'Instant ramen with extra hot sauce', 'Ice cream eaten directly from the pint'],
  },
  {
    id: 'hw-fh-4',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    question: "If your partner were forced to enter a reality TV show, which one would they survive longest in?",
    options: ['Survivor on a deserted island', 'A chaotic dating show for the drama', 'A high-stakes culinary cooking competition', 'The Great British Baking Show'],
  },
  {
    id: 'hw-fh-5',
    category: 'Funny & Hilarious',
    intensity: 'mild',
    question: "What is your partner's worst habit when driving or navigating?",
    options: ['Insisting their shortcut is faster even in traffic', 'Singing aggressively off-key with zero shame', 'Missing turns while telling an animated story', 'Backseat driving with invisible brake foot taps'],
  },

  // ==========================================
  // 2. FLIRTY (5 Questions)
  // ==========================================
  {
    id: 'hw-fl-1',
    category: 'Flirty',
    intensity: 'medium',
    question: "What physical feature of yours does your partner find most irresistible?",
    options: ['Your smile and the way your eyes crinkle', 'Your lips and jawline', 'Your hands and shoulders', 'Your figure and the way you walk'],
  },
  {
    id: 'hw-fl-2',
    category: 'Flirty',
    intensity: 'medium',
    question: "What kind of affection does your partner crave most when greeting you after a long day?",
    options: ['A long, tight embrace without words', 'A warm kiss on the lips and soft hands', 'Playful teasing banter and laughter', 'Cuddling on the couch immediately'],
  },
  {
    id: 'hw-fl-3',
    category: 'Flirty',
    intensity: 'medium',
    question: "How does your partner secretly prefer to be flirted with?",
    options: ['Subtle lingering touches in public places', 'Spicy, teasing text messages during the workday', 'Direct, confident compliments straight to their face', 'Playful eye contact from across a crowded room'],
  },
  {
    id: 'hw-fl-4',
    category: 'Flirty',
    intensity: 'medium',
    question: "What outfit or style of yours makes your partner’s jaw drop the most?",
    options: ['Dressy, elegant date night attire', 'Cozy, slightly oversized relaxed loungewear', 'Fitted athletic gym clothes', 'Something sleek, dark, and seductive'],
  },
  {
    id: 'hw-fl-5',
    category: 'Flirty',
    intensity: 'medium',
    question: "What is your partner’s telltale sign that they are flirting with you?",
    options: ['A mischievous smirk and raised eyebrow', 'Playfully bumping into you or brushing past', 'Lowering their voice and leaning in close', 'Teasing you gently about something silly'],
  },

  // ==========================================
  // 3. ROMANTIC (5 Questions)
  // ==========================================
  {
    id: 'hw-ro-1',
    category: 'Romantic',
    intensity: 'medium',
    question: "What would your partner consider the ultimate dream romantic evening?",
    options: ['A secluded cabin getaway with a fireplace and wine', 'A candlelit rooftop dinner with skyline views', 'Cooking a gourmet dinner together at home with music', 'A spontaneous road trip to a seaside bed-and-breakfast'],
  },
  {
    id: 'hw-ro-2',
    category: 'Romantic',
    intensity: 'medium',
    question: "What is your partner's primary love language in everyday life?",
    options: ['Quality time and undistracted attention', 'Physical touch and affectionate warmth', 'Words of affirmation and sincere praise', 'Acts of service and thoughtful gestures'],
  },
  {
    id: 'hw-ro-3',
    category: 'Romantic',
    intensity: 'medium',
    question: "What romantic memory with you does your partner hold most sacred?",
    options: ['The magical conversation where time stopped on an early date', 'The first trip or vacation you took together', 'A quiet moment when one of you cared for the other while sick or tired', 'The moment you first said "I love you"'],
  },
  {
    id: 'hw-ro-4',
    category: 'Romantic',
    intensity: 'medium',
    question: "What is your partner's favorite way to wake up on lazy Sunday mornings?",
    options: ['Tangled in blankets cuddling for an extra hour', 'Coffee brought to bed with soft music', 'Waking up early to watch the sunrise together', 'A slow, affectionate morning kiss before getting up'],
  },
  {
    id: 'hw-ro-5',
    category: 'Romantic',
    intensity: 'medium',
    question: "What does your partner think is the strongest foundation of your bond?",
    options: ['Unshakable mutual trust and honesty', 'Our ability to laugh through any stress', 'Deep romantic chemistry and attraction', 'Feeling like best friends who conquered life together'],
  },

  // ==========================================
  // 4. DEEP & PERSONAL (5 Questions)
  // ==========================================
  {
    id: 'hw-dp-1',
    category: 'Deep & Personal',
    intensity: 'medium',
    question: "When your partner is feeling genuinely overwhelmed, what do they need most from you?",
    options: ['Space to decompress quietly before talking', 'A reassuring hug without trying to fix anything', 'A listening ear while they vent every detail', 'Practical help taking over daily tasks'],
  },
  {
    id: 'hw-dp-2',
    category: 'Deep & Personal',
    intensity: 'medium',
    question: "What is your partner's biggest long-term personal aspiration right now?",
    options: ['Building financial peace and total independence', 'Mastering a creative passion or career milestone', 'Creating a peaceful sanctuary of a home', 'Traveling to explore world cultures and nature'],
  },
  {
    id: 'hw-dp-3',
    category: 'Deep & Personal',
    intensity: 'medium',
    question: "What past hardship or trial shaped your partner's character the most?",
    options: ['Navigating a difficult family dynamic', 'Overcoming a major career or academic setback', 'Healing from heartbreak and learning their worth', 'Starting over in a new city or unfamiliar environment'],
  },
  {
    id: 'hw-dp-4',
    category: 'Deep & Personal',
    intensity: 'medium',
    question: "What is something your partner is secretly self-conscious about that you love about them?",
    options: ['Their laugh or laugh lines', 'Overthinking small decisions', 'Being too sensitive or empathetic', 'Their quirks when passionate about a niche topic'],
  },
  {
    id: 'hw-dp-5',
    category: 'Deep & Personal',
    intensity: 'medium',
    question: "If your partner could give their 18-year-old self one piece of advice, what would it be?",
    options: ['Do not stress so much about what others think', 'Trust your instincts and take more bold risks', 'Patience—everything will fall into place at the right time', 'Save your heart for the person who truly treasures it'],
  },

  // ==========================================
  // 5. WILD CARDS (5 Questions)
  // ==========================================
  {
    id: 'hw-wc-1',
    category: 'Wild Cards',
    intensity: 'wild',
    question: "If your partner won a 10-million-dollar lottery tomorrow, what is the first reckless purchase they'd make?",
    options: ['A luxury beachfront villa or private compound', 'An exotic sports car or classic vintage vehicle', 'Booking first-class tickets around the world immediately', 'An eccentric passion project or dream business'],
  },
  {
    id: 'hw-wc-2',
    category: 'Wild Cards',
    intensity: 'wild',
    question: "What daring adventure sport would your partner be most likely to attempt?",
    options: ['Skydiving from an airplane over the ocean', 'Scuba diving with sharks in a coral reef', 'Driving a Formula-1 car on a race track', 'Helicopter snowboarding down an untouched peak'],
  },
  {
    id: 'hw-wc-3',
    category: 'Wild Cards',
    intensity: 'wild',
    question: "If you two were in a heist movie, what role would your partner assign to themselves?",
    options: ['The suave mastermind planner calling shots', 'The charming distraction turning heads', 'The tech hacker overriding security', 'The getaway driver drifting through alleys'],
  },
  {
    id: 'hw-wc-4',
    category: 'Wild Cards',
    intensity: 'wild',
    question: "What is the wildest spontaneous idea your partner would actually agree to tonight?",
    options: ['Packing a bag and driving to the coast right now', 'Skinny-dipping under the stars', 'Booking flights for a surprise weekend trip', 'Reinventing our room into an exotic lounge with pillows'],
  },
  {
    id: 'hw-wc-5',
    category: 'Wild Cards',
    intensity: 'wild',
    question: "Which alter-ego personality does your partner take on during high-energy parties?",
    options: ['The charismatic bartender mixing wild drinks', 'The DJ hyping everyone onto the dance floor', 'The deep conversationalist in the corner', 'The competitive board-game champion'],
  },

  // ==========================================
  // 6. SPICY 18+ (DEDICATED 31 UNIQUE QUESTIONS)
  // ==========================================
  {
    id: 'hw-sp-1',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What kind of kiss from you drives your partner absolutely crazy?",
    options: ['A slow, teasing kiss that gently pulls at their lower lip', 'An urgent, breathless kiss against a wall', 'Soft kisses trailing down their jawline and neck', 'A deep, lingering French kiss with hands in their hair'],
  },
  {
    id: 'hw-sp-2',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's favorite setting for intimate passion?",
    options: ['Soft dim candlelight with slow sensual music', 'Completely dark room with heightened tactile senses', 'Afternoon sunlight streaming through the windows', 'Right after a warm shower or bath together'],
  },
  {
    id: 'hw-sp-3',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Which sensual foreplay activity does your partner secretly enjoy most?",
    options: ['A long, thorough massage with warm aromatic oils', 'Playful teasing with gentle biting and whispers', 'Extended eye contact with lingering feather-light touches', 'Slowly undressing each other piece by piece'],
  },
  {
    id: 'hw-sp-4',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's top erotic turn-on when you two are together?",
    options: ['Hearing you moan or whisper what feels good', 'When you take assertive, confident charge', 'Watching how much you desire and admire their body', 'Slow, uninterrupted anticipation building over hours'],
  },
  {
    id: 'hw-sp-5',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Which romantic / spicy scenario would your partner be most eager to try?",
    options: ['A blindfolded sensory session exploring touches', 'Roleplaying meeting as strangers in a luxury hotel bar', 'A weekend getaway spent entirely in bed with room service', 'Exploring soft silk ribbons or light restraint play'],
  },
  {
    id: 'hw-sp-6',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What tempo does your partner crave most during intimacy?",
    options: ['Slow, emotional, and deeply connected', 'Passionate, energetic, and breathless', 'A gradual build from sweet to intensely passionate', 'Unpredictable and changing with the rhythm of the moment'],
  },
  {
    id: 'hw-sp-7',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Where does your partner love being kissed that is not their lips?",
    options: ['The sensitive dip on the side of their neck', 'Along their collarbones and throat', 'The small of their lower back', 'Behind their earlobes and hairline'],
  },
  {
    id: 'hw-sp-8',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "How does your partner prefer to initiate intimacy with you?",
    options: ['Subtle touches that gradually become more suggestive', 'Whispering something explicit in your ear', 'A direct, passionate kiss that leaves no doubts', 'Wearing something seductive and letting you notice'],
  },
  {
    id: 'hw-sp-9',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What erotic sensation does your partner find most tantalizing?",
    options: ['Light fingernails tracing down their back', 'Warm breath against cool skin before contact', 'Firm hands gripping their hips or waist', 'Ice cubes or temperature contrast play'],
  },
  {
    id: 'hw-sp-10',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's secret opinion on making noise during intimacy?",
    options: ['The louder and more vocal the better', 'Soft breathless whispers right against the ear', 'Restrained gasps that show intense sensation', 'Hearing their name called out with desire'],
  },
  {
    id: 'hw-sp-11',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What piece of bedroom attire does your partner find sexiest on you?",
    options: ['Delicate lace or silk lingerie', 'One of their oversized button-up shirts and nothing else', 'Form-fitting dark loungewear', 'Completely bare skin under a silk sheet'],
  },
  {
    id: 'hw-sp-12',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's reaction when you send a flirty, suggestive text in the middle of a workday?",
    options: ['Instantly distracted and counting down hours until home', 'Replies with an even bolder, spicier response', 'Gets flustered and has to look away from their screen', 'Screenshots it to reread when they need a smile'],
  },
  {
    id: 'hw-sp-13',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Where outside the bedroom would your partner most like to sneak an intimate moment?",
    options: ['In a private outdoor hot tub or heated pool under the stars', 'In a quiet corner of a scenic balcony while on vacation', 'In a locked luxury hotel bathroom together', 'On a plush rug in front of a warm fireplace'],
  },
  {
    id: 'hw-sp-14',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's favorite post-intimacy routine?",
    options: ['Falling asleep wrapped tightly in your arms', 'Lying together talking about deep feelings or laughing', 'Grabbing a late-night snack and a cold drink together', 'A warm shower together before drifting off'],
  },
  {
    id: 'hw-sp-15',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Which sense heightens your partner's arousal the fastest?",
    options: ['Scent: your perfume, cologne, or natural skin scent', 'Sound: your voice whispering intimately', 'Touch: electric skin-to-skin warmth', 'Sight: watching your body move with pleasure'],
  },
  {
    id: 'hw-sp-16',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What dynamic does your partner enjoy exploring in intimate moments?",
    options: ['Taking dominant charge and leading the pace', 'Surrendering control and letting you take charge completely', 'Equal back-and-forth playful wrestling for control', 'Deep romantic synchronization where both guide each other'],
  },
  {
    id: 'hw-sp-17',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What unexpected gesture turns your partner on in ordinary moments?",
    options: ['When you pull them in by the waist while cooking', 'When you get fiercely protective or confident', 'When you roll up your sleeves or stretch lazily', 'When you catch their eye from across a dinner table with intent'],
  },
  {
    id: 'hw-sp-18',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's favorite position for deep emotional connection?",
    options: ['Classic missionary with unbroken eye contact and kisses', 'Spooning closely with intertwined hands', 'Sitting facing each other wrapped in an embrace', 'Side-by-side slow, leisurely intimacy'],
  },
  {
    id: 'hw-sp-19',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "How does your partner feel about incorporating romantic music during lovemaking?",
    options: ['Essential: a curated sultry R&B or acoustic playlist', 'Prefers the natural sounds of breathing and whispers', 'Depends on whether the mood is slow or high energy', 'Loves ambient lo-fi beats in the background'],
  },
  {
    id: 'hw-sp-20',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's favorite thing about your body during intimacy?",
    options: ['Your warmth and the way you fit perfectly together', 'The look of pleasure on your face', 'The softness and curves of your skin', 'The strength of your hands holding them close'],
  },
  {
    id: 'hw-sp-21',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What kind of dirty talk or verbal cue appeals most to your partner?",
    options: ['Romantic praise telling them how incredible they feel', 'Suggestive descriptions of what you want to do next', 'Confident commands telling them not to move', 'Erotic questions asking if they like how you touch them'],
  },
  {
    id: 'hw-sp-22',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's secret thought when you walk out of the shower in just a towel?",
    options: ['"How quickly can I get that towel off?"', '"I am the luckiest person in the world."', '"I need to touch them right now."', 'Silently admiring your body without speaking a word'],
  },
  {
    id: 'hw-sp-23',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "If your partner could pick one intimate luxury for your bedroom, what would it be?",
    options: ['Pure Egyptian silk or satin bedsheets', 'Smart ambient mood lighting with crimson hues', 'A massive king-sized bed with plush pillows', 'A private balcony with private stargazing hot tub'],
  },
  {
    id: 'hw-sp-24',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's attitude toward spontaneous quickies versus long sessions?",
    options: ['Loves an electric spontaneous quickie when time is short', 'Strongly prefers long, unhurried, luxurious sessions', 'Loves alternating between both depending on the mood', 'Spontaneous during the day, long and lingering at night'],
  },
  {
    id: 'hw-sp-25',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What part of your partner’s body is their secret weak spot for goosebumps?",
    options: ['The inner thighs right above the knee', 'The base of the skull where hair meets neck', 'The sides of their ribcage and waist', 'Their lower stomach just below the navel'],
  },
  {
    id: 'hw-sp-26',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's favorite type of romantic touch while falling asleep?",
    options: ['Having their back lightly traced until they sleep', 'Hands intertwined resting between your chests', 'Their head resting against your chest hearing your heartbeat', 'Your arm draped protectively over their waist'],
  },
  {
    id: 'hw-sp-27',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "Which of these sensual games would your partner find most thrilling to play?",
    options: ['Strip poker or card game where loser removes an item', 'Dice with body parts and actions', 'Truth or dare where every dare is strictly intimate', 'Sensory guessing game using taste and touch blindfolded'],
  },
  {
    id: 'hw-sp-28',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "How does your partner feel about mirror play or watching during intimacy?",
    options: ['Very hot and adds exciting visual stimulation', 'Prefers closing eyes and getting lost in the sensation', 'Enjoyable occasionally for a special change of pace', 'Loves watching your expressions above all else'],
  },
  {
    id: 'hw-sp-29',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is something intimate your partner thinks you two have mastered together?",
    options: ['Knowing exactly how to read each other’s body language', 'Communicating desires without any awkwardness', 'Keeping the romantic spark intense and unpredictable', 'Balancing sweet emotional intimacy with raw passion'],
  },
  {
    id: 'hw-sp-30',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "What is your partner's ultimate goal for tonight after this game ends?",
    options: ['Tumbling into bed with you for an unforgettable night', 'A long massage that turns into passionate lovemaking', 'Deep intimate conversation with lots of cuddling and touching', 'Surprising you with something spontaneous you did not expect'],
  },
  {
    id: 'hw-sp-31',
    category: 'Spicy 18+',
    intensity: 'spicy',
    question: "How long can your partner endure teasing touch before begging you to kiss them?",
    options: ['Under 30 seconds—the anticipation is unbearable', 'About 2 minutes while savoring the tension', 'They will flip the script and take charge first', 'They love prolonged denial that builds maximum intensity'],
  },
];
