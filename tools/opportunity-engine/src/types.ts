// ── Types for the Opportunity Engine pipeline ──

/** Raw competitor app from Play Store search */
export interface PlayStoreApp {
  name: string;
  appId: string;
  description: string;
  genre: string;
  rating: number;
  reviewCount: number;
  price: number;
  free: boolean;
  hasIAP: boolean;
  /** Inferred from price + IAP flags */
  monetisationType: 'free' | 'paid' | 'freemium_iap' | 'subscription';
  developer: string;
  lastUpdated: string | null;
  /** Install range string if available, e.g. "1,000,000+" */
  installs: string | null;
  relevanceScore?: number;
}

/** A single review snippet relevant to pain analysis */
export interface ReviewSnippet {
  appId: string;
  text: string;
  score: number; // 1–5 star rating
}

/** Stage 1 output — one record per keyword */
export interface RawKeywordRecord {
  keyword: string;
  normalizedKeyword: string;
  category: string;
  playStoreApps: PlayStoreApp[];
  playStoreReviews: ReviewSnippet[];
  playSuggestKeywords: string[];
  googleAutocompletions: string[];
  serpPaaQuestions: string[];
  serpRelatedSearches: string[];
  serpAppCount: number;
  collectedAt: string;
}

/** Score breakdown */
export interface Scores {
  pain: number;       // 1–5
  wtp: number;        // 1–5
  discovery: number;  // 1–5
  buildSpeed: number; // 1–5
  subtotal: number;   // /20
  relevanceConfidence: number; // 0-1
}

/** Stage 2 output — scored record */
export interface ScoredRecord extends RawKeywordRecord {
  scores: Scores;
  autoSkipped: boolean;
  skipReason?: string;
}

/** Pipeline run metadata */
export interface PipelineRun {
  id: string;
  startedAt: string;
  completedAt: string;
  seedCategories: string[];
  keywordsCollected: number;
  keywordsScored: number;
  keywordsRanked: number;
  keywordsSkipped: number;
}
