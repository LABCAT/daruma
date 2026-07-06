// ── Play Store data collection — search, reviews, suggest ──

import gplay from 'google-play-scraper';
import type { PlayStoreApp, ReviewSnippet } from '../types.js';
import { withRetry } from '../utils/retry.js';
import { randomDelay } from '../utils/delay.js';
import { log } from '../utils/logger.js';
import {
  PLAY_SEARCH_LIMIT,
  REVIEWS_PER_APP,
  TOP_APPS_FOR_REVIEWS,
  PLAY_DELAY,
} from '../config.js';

/**
 * Infer monetisation type from Play Store app data.
 * The google-play-scraper doesn't directly expose subscription vs IAP,
 * but we can infer from price + free + adSupported flags.
 */
function inferMonetisation(app: {
  free: boolean;
  price: number;
  offersIAP: boolean;
  adSupported: boolean;
}): PlayStoreApp['monetisationType'] {
  if (!app.free && app.price > 0) return 'paid';
  if (app.offersIAP) return 'freemium_iap';
  // Can't distinguish subscription from IAP via scraper — mark as freemium_iap if IAP exists
  return 'free';
}

/** Search Play Store for apps matching a keyword */
export async function searchApps(keyword: string): Promise<PlayStoreApp[]> {
  return withRetry(
    async () => {
      const results = await gplay.search({
        term: keyword,
        num: PLAY_SEARCH_LIMIT,
        lang: 'en',
        country: 'us',
      });

      // Map basic results, ensuring appId is present
      const basicApps = results.map((app: any) => {
        const url = app.url ?? '';
        const id = app.appId || (url.match(/[?&]id=([^&]+)/)?.[1] ?? '');
        return { ...app, appId: id };
      });

      // Fetch full details to get accurate reviewCount and monetisation
      const detailedApps = await Promise.all(
        basicApps.map(async (app: any) => {
          if (!app.appId) return app;
          try {
            await randomDelay(PLAY_DELAY.min, PLAY_DELAY.max);
            return await gplay.app({ appId: app.appId });
          } catch (err: any) {
            const msg = err?.message || String(err);
            if (msg.includes("reading 'length'") || msg.includes("reading 'map'")) {
              log.warn('COLLECT', `Skipping app ${app.appId}: missing critical data in scraper (${msg})`);
              return null;
            }
            log.warn('COLLECT', `Failed to get app details for ${app.appId}: ${err}`);
            return app; // Fall back to basic search result
          }
        })
      );

      const validApps = detailedApps.filter((app: any) => app !== null);

      return validApps.map((app: any) => ({
        name: app.title ?? '',
        appId: app.appId ?? '',
        rating: app.score ?? 0,
        reviewCount: app.reviews ?? app.ratings ?? 0,
        price: app.price ?? 0,
        free: app.free ?? true,
        hasIAP: app.offersIAP ?? false,
        monetisationType: inferMonetisation({
          free: app.free ?? true,
          price: app.price ?? 0,
          offersIAP: app.offersIAP ?? false,
          adSupported: app.adSupported ?? false,
        }),
        developer: app.developer ?? '',
        lastUpdated: app.updated ? String(app.updated) : null,
        installs: app.installs ?? null,
      }));
    },
    {
      onRetry: (err, attempt) =>
        log.warn('COLLECT', `Play search retry ${attempt} for "${keyword}": ${err}`),
    },
  );
}

/** Fetch reviews for a single app — returns review text + score */
export async function getAppReviews(appId: string): Promise<ReviewSnippet[]> {
  return withRetry(
    async () => {
      const result = await gplay.reviews({
        appId,
        lang: 'en',
        country: 'us',
        num: REVIEWS_PER_APP,
        sort: gplay.sort.RELEVANCE,
      });

      // result is { data: Review[] } or Review[] depending on version
      const reviews = Array.isArray(result) ? result : (result as any).data ?? [];

      return reviews.map((r: any) => ({
        appId,
        text: r.text ?? '',
        score: r.score ?? 0,
      }));
    },
    {
      onRetry: (err, attempt) =>
        log.warn('COLLECT', `Play reviews retry ${attempt} for "${appId}": ${err}`),
    },
  );
}

/**
 * Fetch reviews for the top N competitor apps for a keyword.
 * Returns all reviews aggregated — used for pain-lexicon scoring.
 */
export async function getCompetitorReviews(
  apps: PlayStoreApp[],
): Promise<ReviewSnippet[]> {
  const topApps = apps.slice(0, TOP_APPS_FOR_REVIEWS);
  const allReviews: ReviewSnippet[] = [];

  for (const app of topApps) {
    try {
      await randomDelay(PLAY_DELAY.min, PLAY_DELAY.max);
      const reviews = await getAppReviews(app.appId);
      allReviews.push(...reviews);
    } catch (err) {
      log.warn('COLLECT', `Failed to get reviews for ${app.appId}: ${err}`);
    }
  }

  return allReviews;
}

/** Get Play Store keyword suggestions for a term */
export async function suggestKeywords(term: string): Promise<string[]> {
  return withRetry(
    async () => {
      const url = `https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&f.sid=-697906427155521722&bl=boq_playuiserver_20190903.08_p0&hl=en&gl=us&authuser&soc-app=121&soc-platform=1&soc-device=1&_reqid=1065213`;
      const body = `f.req=%5B%5B%5B%22IJ4APc%22%2C%22%5B%5Bnull%2C%5B%5C%22${encodeURIComponent(term)}%5C%22%5D%2C%5B10%5D%2C%5B2%5D%2C4%5D%5D%22%5D%5D%5D`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body,
      });

      if (!res.ok) throw new Error(`Play suggest HTTP ${res.status}`);

      const text = await res.text();
      try {
        const input = JSON.parse(text.substring(5));
        const data = JSON.parse(input[0][2]);

        if (data === null) {
          log.warn('COLLECT', `Play suggest returned null for "${term}". Raw body: ${text}`);
          return [];
        }

        const suggestionsArray = data[0]?.[0];
        if (!Array.isArray(suggestionsArray)) {
          log.warn('COLLECT', `Play suggest unexpected shape for "${term}". Raw body: ${text}`);
          return [];
        }

        return suggestionsArray.map((s: any) => s[0]);
      } catch (parseErr: any) {
        log.warn('COLLECT', `Play suggest parse error for "${term}": ${parseErr.message}. Raw body: ${text}`);
        return [];
      }
    },
    {
      onRetry: (err, attempt) =>
        log.warn('COLLECT', `Play suggest retry ${attempt} for "${term}": ${err}`),
    },
  );
}
