// ── Seen keywords dedupe — local JSON file ──

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

interface SeenEntry {
  lastSeen: string; // ISO date
  score?: number;
}

type SeenStore = Record<string, SeenEntry>;

const SEEN_FILE = new URL('../../seen_keywords.json', import.meta.url).pathname
  // Fix Windows path: strip leading / from /C:/...
  .replace(/^\/([A-Za-z]:)/, '$1');

const DEDUPE_WINDOW_DAYS = 90;

/** Normalize a keyword for dedupe: lowercase, trim, collapse whitespace */
export function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** Load the seen keywords store from disk */
async function loadStore(): Promise<SeenStore> {
  try {
    const raw = await readFile(SEEN_FILE, 'utf-8');
    return JSON.parse(raw) as SeenStore;
  } catch {
    return {};
  }
}

/** Save the seen keywords store to disk */
async function saveStore(store: SeenStore): Promise<void> {
  const dir = dirname(SEEN_FILE);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(SEEN_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

/** Check if a keyword was seen within the dedupe window */
export async function isRecentlySeen(keyword: string): Promise<boolean> {
  const store = await loadStore();
  const normalized = normalizeKeyword(keyword);
  const entry = store[normalized];
  if (!entry) return false;

  const lastSeen = new Date(entry.lastSeen);
  const daysSince = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince < DEDUPE_WINDOW_DAYS;
}

/** Mark a keyword as seen now. Optionally store its score. */
export async function markSeen(keyword: string, score?: number): Promise<void> {
  const store = await loadStore();
  const normalized = normalizeKeyword(keyword);
  store[normalized] = {
    lastSeen: new Date().toISOString(),
    ...(score !== undefined ? { score } : {}),
  };
  await saveStore(store);
}

/** Batch-mark multiple keywords as seen */
export async function markSeenBatch(
  keywords: Array<{ keyword: string; score?: number }>,
): Promise<void> {
  const store = await loadStore();
  for (const { keyword, score } of keywords) {
    const normalized = normalizeKeyword(keyword);
    store[normalized] = {
      lastSeen: new Date().toISOString(),
      ...(score !== undefined ? { score } : {}),
    };
  }
  await saveStore(store);
}
