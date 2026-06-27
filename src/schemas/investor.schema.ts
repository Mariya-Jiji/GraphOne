import { z } from 'zod';

const coerceInt = z.coerce.number().int().nonnegative();

// Helper to handle both single strings and arrays of strings from Express query parsing
const stringArrayOrString = z.union([
  z.string().transform((val) => [val]),
  z.array(z.string()),
]).optional();

export const listInvestorsQuerySchema = z.object({
  // Filters
  type: z.enum(['VC', 'Angel', 'Corporate', 'Family Office', 'Sovereign']).optional(),
  stage_focus: stringArrayOrString,
  sector: stringArrayOrString,

  // Pagination
  page: coerceInt.min(1).default(1),
  limit: coerceInt.min(1).max(100).default(20),
});

export type ListInvestorsQuery = z.infer<typeof listInvestorsQuerySchema>;
