// ── Random delay utility ──

/** Returns a promise that resolves after a random duration in [minMs, maxMs]. */
export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.round(minMs + Math.random() * (maxMs - minMs));
  return new Promise((resolve) => setTimeout(resolve, ms));
}
