/**
 * Rate limiter middleware
 *
 * Limits each IP to 100 requests per minute using the express-rate-limit
 * package. Exceeding the limit returns a 429 with the standard error envelope.
 *
 * Why express-rate-limit over a hand-rolled solution?
 *   - It handles edge cases around X-Forwarded-For correctly.
 *   - It supports standard Retry-After headers out of the box.
 *   - The in-memory store is sufficient for a single-process API; swap to
 *     RedisStore when scaling horizontally.
 */

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1_000,       // 1 minute
  max: 100,                    // requests per window per IP
  standardHeaders: 'draft-7', // Retry-After + RateLimit headers (RFC 6585 / draft-7)
  legacyHeaders: false,        // Disable deprecated X-RateLimit-* headers

  // Return the same { error: { code, message } } shape as the rest of the API
  handler: (_req, res) => {
    res.status(429).json({
      data: null,
      meta: {},
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests — max 100 per minute per IP. Please slow down.',
      },
    });
  },

  // Skip rate-limiting in test environments
  skip: () => process.env.NODE_ENV === 'test',
});
