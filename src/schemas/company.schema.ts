/**
 * Zod validation schemas for the Companies route group.
 *
 * Design choices:
 * - Query params are coerced from strings (URL params are always strings).
 * - Money fields (funding_total, valuation) expect USD cents as integers to
 *   avoid floating-point issues.
 * - slug is auto-generated server-side so it's not in the POST body schema.
 */

import { z } from 'zod';

// ─── Shared coercions ─────────────────────────────────────────────────────────

const coerceInt = z.coerce.number().int().nonnegative();
const coerceFloat = z.coerce.number().nonnegative();

// ─── GET /companies — query param schema ─────────────────────────────────────

export const listCompaniesQuerySchema = z.object({
  // Filters
  category: z.string().max(100).optional(),
  stage: z
    .enum(['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'series-d+', 'growth', 'public', 'acquired'])
    .optional(),
  country: z.string().max(100).optional(),

  // Sort — default('new') without .optional() so the inferred type is string, not string|undefined
  sort: z.enum(['trending', 'funded', 'new']).default('new'),

  // Pagination — same pattern: default() without .optional()
  page: coerceInt.min(1).default(1),
  limit: coerceInt.min(1).max(100).default(20),
});

export type ListCompaniesQuery = z.infer<typeof listCompaniesQuerySchema>;

// ─── POST /companies — request body schema ───────────────────────────────────

export const createCompanyBodySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().max(100).optional(),
  funding_total: coerceInt.optional(),
  employee_count: coerceInt.optional(),
  founded_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  hq_city: z.string().max(100).optional(),
  hq_country: z.string().max(100).optional(),
  logo_url: z.string().url().optional(),
  website: z.string().url().optional(),
  stage: z
    .enum(['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'series-d+', 'growth', 'public', 'acquired'])
    .optional(),
  is_unicorn: z.boolean().optional().default(false),
  valuation: coerceInt.optional(),
  growth_score: coerceFloat.max(100).optional(),
  data_confidence_score: coerceFloat.max(1).optional(),
});

export type CreateCompanyBody = z.infer<typeof createCompanyBodySchema>;

// ─── Helper: parse and throw a 400 on failure ─────────────────────────────────

import { badRequest } from '../utils/AppError';

export function parseQuery<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw badRequest(`Validation error — ${messages}`);
  }
  return result.data;
}

export function parseBody<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw badRequest(`Validation error — ${messages}`);
  }
  return result.data;
}
