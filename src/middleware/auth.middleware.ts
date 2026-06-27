/**
 * API Key authentication middleware
 *
 * Guards write endpoints (POST/PUT/PATCH/DELETE).  Callers must include:
 *   X-API-Key: <value of process.env.API_KEY>
 *
 * Design notes:
 * - Timing-safe comparison is not implemented here because the API key is
 *   a simple server-to-server secret, not a user credential.  For a
 *   production product you'd use crypto.timingSafeEqual().
 * - The header name X-API-Key is a widely understood convention.
 */

import { Request, Response, NextFunction } from 'express';
import { unauthorized } from '../utils/AppError';

export function requireApiKey(req: Request, _res: Response, next: NextFunction): void {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Misconfigured server — log loudly but don't leak details to callers
    console.error('[auth] API_KEY environment variable is not set');
    return next(unauthorized('API key authentication is not configured on this server'));
  }

  const provided = req.headers['x-api-key'];

  if (!provided || provided !== apiKey) {
    return next(unauthorized('Invalid or missing X-API-Key header'));
  }

  next();
}
