// ── Retry with exponential backoff ──

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  multiplier?: number;
  /** Add random jitter up to this fraction of the delay (0–1) */
  jitter?: number;
  /** Called on each retry with error and attempt number */
  onRetry?: (error: unknown, attempt: number) => void;
}

const DEFAULTS: Required<Omit<RetryOptions, 'onRetry'>> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  multiplier: 2,
  jitter: 0.3,
};

/**
 * Wrap an async function with exponential backoff retry.
 * Throws the last error if all retries fail.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: RetryOptions,
): Promise<T> {
  const { maxRetries, baseDelayMs, multiplier, jitter } = { ...DEFAULTS, ...opts };

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;

      const delay = baseDelayMs * Math.pow(multiplier, attempt);
      const jitterMs = delay * jitter * Math.random();
      const totalDelay = Math.round(delay + jitterMs);

      opts?.onRetry?.(err, attempt + 1);
      await new Promise((r) => setTimeout(r, totalDelay));
    }
  }
  throw lastError;
}
