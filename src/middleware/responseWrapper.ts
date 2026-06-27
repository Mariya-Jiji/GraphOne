/**
 * Response wrapper — augments res with helper methods so every controller
 * returns a consistent { data, meta, error } envelope without boilerplate.
 *
 * Usage in a controller:
 *   res.success(company);
 *   res.paginate(companies, { page: 1, limit: 20, total: 300 });
 *
 * The middleware itself is a no-op pass-through; it just attaches the methods
 * to the response object before passing control to route handlers.
 */

import { Request, Response, NextFunction } from 'express';
import { PaginationMeta } from '../models/types';

// ─── Extend Express Response type ────────────────────────────────────────────

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      /** Send a successful response with optional HTTP status (default 200). */
      success<T>(data: T, meta?: Record<string, unknown>, status?: number): void;
      /** Send a paginated list response with computed pagination metadata. */
      paginate<T>(
        data: T[],
        pagination: { page: number; limit: number; total: number },
        extra?: Record<string, unknown>,
      ): void;
    }
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function responseWrapper(req: Request, res: Response, next: NextFunction): void {
  /**
   * res.success — wraps any value in the standard envelope.
   */
  res.success = function <T>(
    data: T,
    meta: Record<string, unknown> = {},
    status = 200,
  ): void {
    res.status(status).json({
      data,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        ...meta,
      },
      error: null,
    });
  };

  /**
   * res.paginate — wraps a list with computed pagination metadata.
   */
  res.paginate = function <T>(
    data: T[],
    { page, limit, total }: { page: number; limit: number; total: number },
    extra: Record<string, unknown> = {},
  ): void {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    res.status(200).json({
      data,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        pagination,
        ...extra,
      },
      error: null,
    });
  };

  next();
}
