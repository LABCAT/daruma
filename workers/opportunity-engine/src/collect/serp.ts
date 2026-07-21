// ── SERP scraping — People Also Ask + Related Searches via Fetch/Cheerio ──

import { log } from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import { SERP_DELAY } from '../shared/config.js';
import * as cheerio from 'cheerio';

/** Result from a SERP scrape for a single keyword */
export interface SerpResult {
  paaQuestions: string[];
  relatedSearches: string[];
  appCount: number;
}

const EMPTY_RESULT: SerpResult = {
  paaQuestions: [],
  relatedSearches: [],
  appCount: 0,
};

/**
 * SERP Scraper using lightweight fetch + cheerio.
 * Fully compatible with Cloudflare Workers (no Chromium dependency).
 */
export class SerpScraper {
  /** Init is a no-op for fetch-based scraper, kept for compatibility */
  async init(): Promise<void> {
    log.success('COLLECT', 'SerpScraper initialized (Fetch/Cheerio mode)');
  }

  /** Close is a no-op */
  async close(): Promise<void> {}

  /** Always available */
  get isAvailable(): boolean {
    return true;
  }

  /**
   * Scrape Google SERP for a keyword.
   * Extracts PAA questions, related searches, and count of app-related results.
   */
  async scrape(keyword: string): Promise<SerpResult> {
    try {
      await randomDelay(SERP_DELAY.min, SERP_DELAY.max);

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword + ' app')}&hl=en&gl=us`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        log.warn('COLLECT', `SERP fetch failed for "${keyword}": HTTP ${response.status}`);
        return EMPTY_RESULT;
      }

      const html = await response.text();

      // Check for CAPTCHA / unusual traffic
      if (
        html.includes('unusual traffic') ||
        html.includes('captcha') ||
        html.includes('CAPTCHA')
      ) {
        log.warn('COLLECT', `CAPTCHA detected for "${keyword}" — skipping SERP`);
        return EMPTY_RESULT;
      }

      const $ = cheerio.load(html);
      
      // Extract People Also Ask questions
      const paaQuestions: string[] = [];
      const paaSelectors = [
        '[data-sgrd] [role="heading"]',
        '.related-question-pair [role="heading"]',
        '[jsname="Cpkphb"] span',
        '[data-lk] span',
        '.ifM9O span',
        'div[data-q] span'
      ];
      
      $(paaSelectors.join(', ')).each((_, el) => {
        const text = $(el).text().trim();
        // Google often hides the actual question in span elements, 
        // they usually end with a question mark
        if (text && text.length > 10 && text.length < 200 && text.endsWith('?')) {
          paaQuestions.push(text);
        }
      });

      // Extract Related Searches
      const relatedSearches: string[] = [];
      const relatedSelectors = [
        '#brs a',
        '.k8XOCe',
        '[data-se] a',
        '.s75CSd a',
        '.PHmMHe a',
        '.EIaa9b a',
        '.CSkcDe' // Another common related searches container class
      ];
      
      $(relatedSelectors.join(', ')).each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 3 && text.length < 100) {
          relatedSearches.push(text);
        }
      });

      // Count app-related results (Play Store links)
      let appCount = 0;
      $('a[href*="play.google.com/store/apps"]').each(() => {
        appCount++;
      });

      const result: SerpResult = {
        paaQuestions: [...new Set(paaQuestions)],
        relatedSearches: [...new Set(relatedSearches)],
        appCount,
      };

      log.info(
        'COLLECT',
        `SERP "${keyword}": ${result.paaQuestions.length} PAA, ${result.relatedSearches.length} related, ${result.appCount} app links`,
      );

      return result;
    } catch (err) {
      log.warn('COLLECT', `SERP scrape failed for "${keyword}": ${err}`);
      return EMPTY_RESULT;
    }
  }
}
