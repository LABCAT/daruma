// ── Auto-skip rules from ASO_AGENT_LOOP.md ──
// Applied before scoring. Records matching any rule are marked as skipped
// with a reason, but still included in the scored output for inspection.

import type { RawKeywordRecord } from '../shared/types.js';

interface SkipResult {
  skipped: boolean;
  reason?: string;
}

/**
 * Check if a keyword record should be auto-skipped before scoring.
 * Rules from ASO_AGENT_LOOP.md:
 *
 * 1. No apps rank for the keyword (0 Play Store results)
 * 2. Top 3 are unbeatable free incumbents (major brands, 100K+ downloads, 4.5+ stars)
 * 3. Keyword implies backend/accounts/API dependency
 * 4. Keyword implies platform/suite territory
 * 5. "Good enough" free alternative dominates (single app with 4.5+ stars and 100K+ reviews)
 */
export function checkAutoSkip(record: RawKeywordRecord): SkipResult {
  const apps = record.playStoreApps;

  // 1. No apps rank at all
  if (apps.length === 0) {
    return {
      skipped: true,
      reason: 'No Play Store results — no search demand for this keyword',
    };
  }

  // 2. Unbeatable free incumbents in top 3
  const top3 = apps.slice(0, 3);
  const unbeatableCount = top3.filter(
    (a) => a.free && a.rating >= 4.5 && a.reviewCount >= 100_000,
  ).length;
  if (unbeatableCount >= 2) {
    return {
      skipped: true,
      reason: `${unbeatableCount} of top 3 are unbeatable free incumbents (4.5+ stars, 100K+ reviews)`,
    };
  }

  // 3. Keyword implies backend/accounts/API dependency
  const kwLower = record.normalizedKeyword;
  const backendSignals = [
    'api', 'integration', 'real-time', 'realtime', 'live sync',
    'cloud sync', 'multi-user', 'collaboration',
    'payment processing', 'pos system', 'point of sale',
    'crm system', 'erp',
  ];
  for (const signal of backendSignals) {
    if (kwLower.includes(signal)) {
      return {
        skipped: true,
        reason: `Keyword implies backend/API dependency: "${signal}"`,
      };
    }
  }

  // 4. Platform/suite territory
  const platformSignals = [
    'platform', 'suite', 'all-in-one', 'all in one',
    'complete solution', 'business management system',
    'enterprise',
  ];
  for (const signal of platformSignals) {
    if (kwLower.includes(signal)) {
      return {
        skipped: true,
        reason: `Keyword implies platform/suite territory: "${signal}"`,
      };
    }
  }

  // 5. Single dominant free app
  const dominant = apps.find(
    (a) => a.free && a.rating >= 4.5 && a.reviewCount >= 100_000,
  );
  if (dominant) {
    // Only skip if the dominant app is clearly "good enough" —
    // i.e., it's the top result and there's not much room to differentiate.
    // Check if the top result IS the dominant one
    if (apps[0].appId === dominant.appId) {
      // Only auto-skip if the dominant app has overwhelming market share
      // (100K+ reviews suggests very strong position)
      if (dominant.reviewCount >= 500_000) {
        return {
          skipped: true,
          reason: `Dominant free incumbent: "${dominant.name}" (${dominant.rating}★, ${dominant.reviewCount.toLocaleString()} reviews)`,
        };
      }
    }
  }

  return { skipped: false };
}
