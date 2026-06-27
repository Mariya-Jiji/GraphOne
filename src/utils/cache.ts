/**
 * In-memory TTL cache
 *
 * A lightweight Map-based cache with per-entry expiry. Used for the
 * /companies/trending endpoint (60 s TTL) without adding an external
 * dependency like node-cache or Redis.
 *
 * Design notes:
 * - Entries are lazily evicted: stale entries are only removed on get().
 * - setInterval sweeps run every minute to prevent unbounded memory growth.
 * - Generic so it works for any cacheable value shape.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // epoch ms
}

class TTLCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>();
  private sweepInterval: ReturnType<typeof setInterval>;

  constructor(sweepIntervalMs = 60_000) {
    // Periodic sweep to evict expired entries
    this.sweepInterval = setInterval(() => this.sweep(), sweepIntervalMs);
    // Allow Node.js to exit even if this timer is active
    if (this.sweepInterval.unref) this.sweepInterval.unref();
  }

  /** Store a value. ttlSeconds defaults to 60. */
  set(key: string, value: T, ttlSeconds = 60): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1_000,
    });
  }

  /** Retrieve a value, or null if missing / expired. */
  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  /** Remove a specific key. */
  delete(key: string): void {
    this.store.delete(key);
  }

  /** Evict all expired entries. */
  private sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }

  /** Flush everything — useful in tests. */
  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton exported for use across the app
export const cache = new TTLCache();
