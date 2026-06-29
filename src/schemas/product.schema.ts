import { z } from 'zod';

const coerceInt = z.coerce.number().int().nonnegative();

export const listProductsQuerySchema = z.object({
  category: z.string().max(100).optional(),
  sort: z.enum(['popular', 'newest']).default('popular'),
  page: coerceInt.min(1).default(1),
  limit: coerceInt.min(1).max(100).default(20),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
