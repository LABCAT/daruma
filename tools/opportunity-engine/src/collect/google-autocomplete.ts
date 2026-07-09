// ── Google Autocomplete — long-tail keyword expansion ──

import { withRetry } from '../utils/retry.js';
import { randomDelay } from '../utils/delay.js';
import { log } from '../utils/logger.js';
import { AUTOCOMPLETE_SUFFIXES, ALPHABET, AUTOCOMPLETE_DELAY } from '../config.js';

const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search';

/**
 * Query Google's autocomplete endpoint for suggestions.
 * Uses client=firefox which returns clean JSON: [query, [suggestions]]
 */
async function fetchSuggestions(query: string): Promise<string[]> {
  return withRetry(
    async () => {
      const url = new URL(SUGGEST_URL);
      url.searchParams.set('client', 'firefox');
      url.searchParams.set('q', query);
      url.searchParams.set('hl', 'en');

      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
          Accept: 'application/json, text/javascript, */*',
        },
      });

      if (!res.ok) {
        throw new Error(`Google suggest HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      // Response format: [query, [suggestion1, suggestion2, ...]]
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1] as string[];
      }
      return [];
    },
    {
      onRetry: (err, attempt) =>
        log.warn('COLLECT', `Google suggest retry ${attempt} for "${query}": ${err}`),
    },
  );
}

/**
 * Expand a seed keyword into long-tail candidates using Google Autocomplete.
 *
 * Strategy:
 * 1. Direct query (seed keyword as-is)
 * 2. Seed + each letter a–z (e.g. "tradie invoice a", "tradie invoice b")
 * 3. Seed + each SMB suffix (e.g. "tradie invoice app", "tradie invoice tracker")
 *
 * Returns deduplicated array of all suggestions.
 */
export async function expandKeywordViaGoogle(seed: string): Promise<string[]> {
  return [];
  const allSuggestions = new Set<string>();

  // 1. Direct query
  try {
    const direct = await fetchSuggestions(seed);
    direct.forEach((s) => allSuggestions.add(s.toLowerCase().trim()));
  } catch (err) {
    log.warn('COLLECT', `Google suggest failed for direct "${seed}": ${err}`);
  }

  // 2. Letter appending (a–z)
  for (const letter of ALPHABET) {
    try {
      await randomDelay(AUTOCOMPLETE_DELAY.min, AUTOCOMPLETE_DELAY.max);
      const results = await fetchSuggestions(`${seed} ${letter}`);
      results.forEach((s) => allSuggestions.add(s.toLowerCase().trim()));
    } catch (err) {
      // Non-fatal — some letters won't return results
      log.warn('COLLECT', `Google suggest skip "${seed} ${letter}": ${err}`);
    }
  }

  // 3. Suffix appending
  for (const suffix of AUTOCOMPLETE_SUFFIXES) {
    try {
      await randomDelay(AUTOCOMPLETE_DELAY.min, AUTOCOMPLETE_DELAY.max);
      const results = await fetchSuggestions(`${seed} ${suffix}`);
      results.forEach((s) => allSuggestions.add(s.toLowerCase().trim()));
    } catch (err) {
      log.warn('COLLECT', `Google suggest skip "${seed} ${suffix}": ${err}`);
    }
  }

  return [];
}
