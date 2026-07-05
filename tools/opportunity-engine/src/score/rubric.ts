// ── Deterministic scoring rubric ──
// Each dimension scores 1–5 based on scraped data. No AI.

import type { RawKeywordRecord, Scores } from '../types.js';
import { PAIN_LEXICON, WTP_LEXICON, RED_FLAG_KEYWORDS } from '../config.js';

/**
 * Count pain-lexicon hits across all review texts.
 * Case-insensitive, counts each lexicon term occurrence.
 */
function countPainHits(reviews: RawKeywordRecord['playStoreReviews']): number {
  let hits = 0;
  const allText = reviews.map((r) => r.text.toLowerCase()).join(' ');

  for (const term of PAIN_LEXICON) {
    // Use word boundary-ish matching: split on term, count occurrences
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = allText.match(regex);
    if (matches) hits += matches.length;
  }

  return hits;
}

/**
 * Pain (1–5): derived from review text pain-lexicon matching.
 *
 * | Score | Condition |
 * |-------|-----------|
 * | 5     | ≥15 pain-lexicon hits across top-3 app reviews |
 * | 4     | 10–14 hits |
 * | 3     | 5–9 hits |
 * | 2     | 1–4 hits |
 * | 1     | 0 hits |
 */
export function scorePain(record: RawKeywordRecord): number {
  const hits = countPainHits(record.playStoreReviews);
  if (hits >= 15) return 5;
  if (hits >= 10) return 4;
  if (hits >= 5) return 3;
  if (hits >= 1) return 2;
  return 1;
}

/**
 * Count willingness-to-pay lexicon hits across all review texts.
 */
function countWTPHits(reviews: RawKeywordRecord['playStoreReviews']): number {
  let hits = 0;
  const allText = reviews.map((r) => r.text.toLowerCase()).join(' ');

  for (const term of WTP_LEXICON) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = allText.match(regex);
    if (matches) hits += matches.length;
  }

  return hits;
}

/**
 * WTP / Willingness to Pay (1–5): derived from competitor monetisation flags and review sentiment.
 *
 * | Score | Condition |
 * |-------|-----------|
 * | 5     | ≥2 of top-5 apps are paid/sub OR ≥3 WTP review hits |
 * | 4     | 1 paid/sub app + others have IAP OR ≥1 WTP review hit |
 * | 3     | Multiple apps with IAP, none paid/sub |
 * | 2     | Only free+ads competitors, but some IAP exists |
 * | 1     | All free, no monetisation signals |
 */
export function scoreWTP(record: RawKeywordRecord): number {
  const top5 = record.playStoreApps.slice(0, 5);
  
  // Measure review sentiment for WTP
  const wtpReviewHits = countWTPHits(record.playStoreReviews);

  if (top5.length === 0) return wtpReviewHits >= 3 ? 5 : (wtpReviewHits >= 1 ? 4 : 1);

  const paidOrSub = top5.filter(
    (a) => a.monetisationType === 'paid' || a.monetisationType === 'subscription',
  );
  const withIAP = top5.filter((a) => a.hasIAP);

  if (paidOrSub.length >= 2 || wtpReviewHits >= 3) return 5;
  if ((paidOrSub.length >= 1 && withIAP.length >= 1) || wtpReviewHits >= 1) return 4;
  if (withIAP.length >= 2) return 3;
  if (withIAP.length >= 1) return 2;
  return 1;
}

/**
 * Discovery (1–5): derived from competition analysis.
 * Lower competition + lower incumbent quality = higher score.
 *
 * | Score | Condition |
 * |-------|-----------|
 * | 5     | <5 competing apps, avg rating of top 3 < 3.5 |
 * | 4     | 5–10 apps, avg rating < 4.0, total reviews < 50K |
 * | 3     | 10–20 apps, avg rating < 4.2, mixed quality |
 * | 2     | 20+ apps or avg rating ≥ 4.2 with high review counts |
 * | 1     | Major brand incumbents with 100K+ downloads and ≥ 4.5 stars |
 */
export function scoreDiscovery(record: RawKeywordRecord): number {
  const apps = record.playStoreApps;
  const appCount = apps.length;

  if (appCount === 0) return 5; // No competition at all

  const top3 = apps.slice(0, 3);
  const avgRating =
    top3.reduce((sum, a) => sum + (a.rating || 0), 0) / top3.length;
  const totalReviews = top3.reduce((sum, a) => sum + (a.reviewCount || 0), 0);

  // Check for major brand incumbents
  const hasUnbeatableIncumbent = top3.some(
    (a) => a.rating >= 4.5 && a.reviewCount >= 100_000,
  );

  if (hasUnbeatableIncumbent) return 1;
  if (appCount >= 20 || (avgRating >= 4.2 && totalReviews >= 50_000)) return 2;
  if (appCount >= 10 && avgRating < 4.2) return 3;
  if (appCount >= 5 && avgRating < 4.0 && totalReviews < 50_000) return 4;
  if (appCount < 5 && avgRating < 3.5) return 5;

  // Default middle ground
  return 3;
}

/**
 * Build Speed (1–5): derived from keyword red-flag analysis.
 * Checks the keyword itself + app names/descriptions for complexity signals.
 *
 * | Score | Condition |
 * |-------|-----------|
 * | 5     | Offline form/calculator/generator, no red flags |
 * | 4     | Local-first + share/export, no red flags |
 * | 3     | Mild complexity signals (schedule, booking) |
 * | 2     | Moderate red flags (sync, team, cloud) |
 * | 1     | Strong red flags (api, platform, dashboard, auth) |
 */
export function scoreBuildSpeed(record: RawKeywordRecord): number {
  const textToCheck = [
    record.keyword,
    record.normalizedKeyword,
    ...record.playStoreApps.slice(0, 5).map((a) => a.name),
  ]
    .join(' ')
    .toLowerCase();

  // Check strong red flags first
  for (const flag of RED_FLAG_KEYWORDS.strong) {
    if (textToCheck.includes(flag)) return 1;
  }

  // Check moderate red flags
  for (const flag of RED_FLAG_KEYWORDS.moderate) {
    if (textToCheck.includes(flag)) return 2;
  }

  // Check mild complexity signals
  for (const flag of RED_FLAG_KEYWORDS.mild) {
    if (textToCheck.includes(flag)) return 3;
  }

  // Check for positive simple-app signals
  const simpleSignals = [
    'calculator', 'generator', 'converter', 'counter',
    'checklist', 'timer', 'stopwatch', 'log',
  ];
  for (const signal of simpleSignals) {
    if (textToCheck.includes(signal)) return 5;
  }

  // Default: local-first, no red flags detected
  return 4;
}

/** Score a single record on all 4 dimensions */
export function scoreRecord(record: RawKeywordRecord): Scores {
  const pain = scorePain(record);
  const wtp = scoreWTP(record);
  const discovery = scoreDiscovery(record);
  const buildSpeed = scoreBuildSpeed(record);

  return {
    pain,
    wtp,
    discovery,
    buildSpeed,
    subtotal: pain + wtp + discovery + buildSpeed,
  };
}
