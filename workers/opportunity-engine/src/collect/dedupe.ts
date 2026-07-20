/** Normalize a keyword for dedupe: lowercase, trim, collapse whitespace */
export function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/\s+/g, ' ');
}
