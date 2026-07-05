// ── Pipeline configuration — seed categories, lexicons, thresholds ──

/** Seed categories → niche keyword expansions for Play Store search */
export const SEED_CATEGORIES: Record<string, string[]> = {
  'tradies': [
    'tradie invoice', 'tradie job tracker', 'tradie quote app',
    'plumber schedule', 'electrician job management', 'tradie timesheet',
    'trade job estimator', 'builder daily log', 'site diary app',
  ],
  'hair beauty': [
    'salon booking app', 'hairdresser appointment', 'beauty salon manager',
    'salon client tracker', 'hair color formula', 'beauty inventory',
    'salon price list', 'nail tech booking',
  ],
  'hospitality': [
    'restaurant inventory', 'bar stock tracker', 'food cost calculator',
    'tip calculator', 'kitchen prep list', 'menu planner restaurant',
    'cafe order tracker', 'hospitality roster',
  ],
  'fitness': [
    'personal trainer client tracker', 'gym class scheduler', 'fitness client management',
    'workout planner', 'pt session tracker', 'gym membership tracker',
    'fitness class booking', 'exercise log',
  ],
  'pet care': [
    'pet grooming scheduler', 'dog walker tracker', 'pet sitting app',
    'pet vaccination tracker', 'vet visit tracker', 'dog grooming checklist',
    'pet business management', 'kennel booking',
  ],
  'home organization': [
    'home inventory app', 'declutter checklist', 'home maintenance schedule',
    'moving checklist app', 'pantry tracker', 'home cleaning schedule',
    'garage sale tracker', 'home warranty tracker',
  ],
  'retail': [
    'small shop inventory', 'retail price tag maker', 'stock count app',
    'barcode scanner inventory', 'shop cash register', 'retail margin calculator',
    'product label maker', 'wholesale price calculator',
  ],
  'professional services': [
    'client intake form', 'appointment reminder', 'invoice generator',
    'mileage tracker', 'expense receipt scanner', 'meeting notes app',
    'consultant time tracker', 'freelance project tracker',
  ],
};

/**
 * Pain lexicon — words/phrases in app reviews that signal user frustration.
 * Each match in review text contributes to the Pain score.
 */
export const PAIN_LEXICON: string[] = [
  // Tool/process pain
  'spreadsheet', 'excel', 'manual', 'paper', 'whatsapp',
  'tracking', 'pen and paper', 'notebook', 'handwritten',
  'google sheets', 'word doc',
  // Frustration language
  'hate', 'frustrating', 'frustrated', 'annoying', 'annoyed',
  'clunky', 'broken', 'buggy', 'terrible', 'horrible',
  'waste of time', 'waste of money', 'useless', 'awful',
  'crash', 'crashes', 'freezes', 'slow', 'laggy',
  'confusing', 'complicated', 'hard to use', 'unintuitive',
  'expensive', 'overpriced', 'rip off', 'ripoff',
  'missing feature', 'wish it had', 'needs improvement',
  'outdated', 'old', 'ugly', 'dated',
  // Workaround language
  'workaround', 'had to find', 'no alternative', 'only option',
  'nothing else', 'switched from', 'looking for replacement',
];

/**
 * Willingness-to-pay (WTP) lexicon — words/phrases in app reviews that signal
 * users are willing to pay, already paying, or asking for paid features.
 */
export const WTP_LEXICON: string[] = [
  'pay to remove', 'paywall', 'premium', 'subscription',
  'one time fee', 'one-time fee', 'pay once', 'would pay',
  'worth the money', 'pay for', 'is there a way to pay',
  'gladly pay', 'buy the app', 'pro version', 'paid tier'
];

/**
 * Red-flag keywords that suggest an app concept requires backend/auth/complexity.
 * Used for Build Speed scoring and auto-skip.
 */
export const RED_FLAG_KEYWORDS = {
  /** Strong red flags → Build Speed 1 */
  strong: [
    'api', 'integrate', 'integration', 'platform', 'dashboard',
    'auth', 'login', 'signup', 'sign up', 'account',
    'real-time', 'realtime', 'live sync', 'cloud sync',
    'multi-user', 'collaboration', 'team management',
    'payment processing', 'pos system', 'point of sale',
    'ai powered', 'machine learning', 'crm system',
  ],
  /** Mild red flags → Build Speed 2 */
  moderate: [
    'sync', 'team', 'cloud', 'online', 'server',
    'database', 'backup', 'share data', 'multi-device',
    'notification', 'push notification', 'messaging',
  ],
  /** Mild complexity signals → Build Speed 3 */
  mild: [
    'schedule', 'scheduling', 'booking', 'appointment',
    'calendar', 'reminder', 'recurring',
  ],
} as const;

/**
 * Suffixes appended to seed keywords for Google Autocomplete expansion.
 * Each seed keyword is combined with each suffix to query suggestqueries.google.com.
 */
export const AUTOCOMPLETE_SUFFIXES: string[] = [
  'app', 'tracker', 'tool', 'manager', 'template',
  'calculator', 'generator', 'planner', 'scheduler',
  'checklist', 'organizer', 'log', 'free',
];

/** Letters a–z for autocomplete letter-appending strategy */
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// ── Scoring thresholds ──

/** Minimum subtotal /20 to survive scoring. Records below this are dropped. */
export const MIN_SCORE_THRESHOLD = 12;

/** Keep only the top N% of scored records for the ranked shortlist. */
export const TOP_PERCENT = 20;

/** Maximum number of Play Store apps to fetch per keyword search */
export const PLAY_SEARCH_LIMIT = 10;

/** Maximum reviews to fetch per competitor app for pain analysis */
export const REVIEWS_PER_APP = 100;

/** Number of top competitor apps to analyse reviews for */
export const TOP_APPS_FOR_REVIEWS = 3;

// ── Rate limiting ──

/** Delay between Google Autocomplete requests (ms) */
export const AUTOCOMPLETE_DELAY = { min: 1000, max: 3000 };

/** Delay between SERP page loads (ms) */
export const SERP_DELAY = { min: 3000, max: 8000 };

/** Delay between Play Store API calls (ms) */
export const PLAY_DELAY = { min: 500, max: 1500 };
