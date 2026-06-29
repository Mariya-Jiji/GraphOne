import { z } from 'zod';

const coerceInt = z.coerce.number().int().nonnegative();

export const listNewsQuerySchema = z.object({
  tag: z.string().max(100).optional(),
  page: coerceInt.min(1).default(1),
  limit: coerceInt.min(1).max(100).default(20),
});

export type ListNewsQuery = z.infer<typeof listNewsQuerySchema>;
