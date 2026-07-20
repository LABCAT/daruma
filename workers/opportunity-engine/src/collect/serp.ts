// ── SERP scraping — People Also Ask + Related Searches via Playwright ──

import { log } from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import { SERP_DELAY } from '../config.js';

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
 * Manages a Playwright browser instance for SERP scraping.
 * Reuses one browser across all keywords; sequential to avoid detection.
 */
export class SerpScraper {
  private browser: any = null;
  private page: any = null;

  /** Launch the browser. Call once before scraping. */
  async init(): Promise<void> {
    try {
      const { chromium } = await import('playwright');
      this.browser = await chromium.launch({
        headless: true,
        args: ['--disable-blink-features=AutomationControlled'],
      });
      const context = await this.browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        locale: 'en-US',
        viewport: { width: 1366, height: 768 },
      });
      this.page = await context.newPage();
      log.success('COLLECT', 'Playwright browser launched for SERP scraping');
    } catch (err) {
      log.error('COLLECT', `Playwright init failed — SERP scraping disabled: ${err}`);
      this.browser = null;
      this.page = null;
    }
  }

  /** Close the browser. Call when done scraping. */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /** Check if Playwright is available */
  get isAvailable(): boolean {
    return this.page !== null;
  }

  /**
   * Scrape Google SERP for a keyword.
   * Extracts PAA questions, related searches, and count of app-related results.
   */
  async scrape(keyword: string): Promise<SerpResult> {
    if (!this.page) return EMPTY_RESULT;

    try {
      await randomDelay(SERP_DELAY.min, SERP_DELAY.max);

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword + ' app')}&hl=en&gl=us`;
      await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Wait a bit for dynamic content
      await this.page.waitForTimeout(2000);

      // Check for CAPTCHA / block
      const pageContent: string = await this.page.content();
      if (
        pageContent.includes('unusual traffic') ||
        pageContent.includes('captcha') ||
        pageContent.includes('CAPTCHA')
      ) {
        log.warn('COLLECT', `CAPTCHA detected for "${keyword}" — skipping SERP`);
        return EMPTY_RESULT;
      }

      // Extract People Also Ask questions
      const paaQuestions: string[] = await this.page.evaluate(() => {
        const questions: string[] = [];
        // PAA container — Google uses various selectors, try common ones
        const paaElements = document.querySelectorAll(
          '[data-sgrd] [role="heading"], .related-question-pair [role="heading"], [jsname="Cpkphb"] span',
        );
        paaElements.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 10 && text.length < 200) {
            questions.push(text);
          }
        });
        // Fallback: look for accordion-style questions
        if (questions.length === 0) {
          document
            .querySelectorAll('[data-lk] span, .ifM9O span, div[data-q] span')
            .forEach((el) => {
              const text = el.textContent?.trim();
              if (text && text.endsWith('?') && text.length > 10) {
                questions.push(text);
              }
            });
        }
        return questions;
      });

      // Extract Related Searches
      const relatedSearches: string[] = await this.page.evaluate(() => {
        const related: string[] = [];
        // Related searches appear at page bottom
        const relatedElements = document.querySelectorAll(
          '#brs a, .k8XOCe, [data-se] a, .s75CSd a, .PHmMHe a, .EIaa9b a',
        );
        relatedElements.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 3 && text.length < 100) {
            related.push(text);
          }
        });
        return related;
      });

      // Count app-related results in SERP (Play Store links or app-like results)
      const appCount: number = await this.page.evaluate(() => {
        const links = document.querySelectorAll('a[href*="play.google.com/store/apps"]');
        return links.length;
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
