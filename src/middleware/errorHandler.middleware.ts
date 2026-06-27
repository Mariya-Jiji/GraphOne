/**
 * Centralised error handler — MUST be registered as the last middleware in
 * the Express stack (after all routes).
 *
 * Converts errors into the standard:
 *   { data: null, meta: {}, error: { code: "...", message: "..." } }
 *
 * Error classification:
 *   AppError (isOperational=true)  → use its statusCode + code
 *   Zod ValidationError            → 400 BAD_REQUEST (should be caught in
 *                                     schemas/*, but kept as a safety net)
 *   Unknown / programming errors   → 500 INTERNAL_ERROR (message hidden in prod)
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // ── AppError (expected operational error) ────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      data: null,
      meta: { timestamp: new Date().toISOString(), path: req.originalUrl },
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // ── Unknown / programming error ──────────────────────────────────────────
  const isDev = process.env.NODE_ENV === 'development';

  // Always log full details server-side
  console.error('[errorHandler] Unhandled error:', err);

  res.status(500).json({
    data: null,
    meta: { timestamp: new Date().toISOString(), path: req.originalUrl },
    error: {
      code: 'INTERNAL_ERROR',
      // In production, hide implementation details from callers
      message: isDev
        ? (err instanceof Error ? err.message : String(err))
        : 'An unexpected error occurred. Please try again later.',
    },
  });
}

// ─── 404 handler — mount before errorHandler, after all routes ───────────────

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError('NOT_FOUND', `Route ${req.method} ${req.originalUrl} does not exist`, 404));
}
