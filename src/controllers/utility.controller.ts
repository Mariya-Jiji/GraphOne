import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { cache } from '../utils/cache';
import { searchQuerySchema } from '../schemas/utility.schema';
import { parseQuery as parseCompanyQuery } from '../schemas/company.schema'; // Re-use parseQuery

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q } = parseCompanyQuery(searchQuerySchema, req.query);
    const db = getDb();

    // We do parallel ILIKE queries across entities. No DB full-text search is set up.
    // For large tables, a dedicated index or external tool like Algolia is better,
    // but this suffices for the MVP.
    const [companiesRes, investorsRes, foundersRes, productsRes] = await Promise.all([
      db.from('companies')
        .select('id, name, slug, description, logo_url')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5),
      db.from('investors')
        .select('id, name, slug, bio, logo_url')
        .or(`name.ilike.%${q}%,bio.ilike.%${q}%`)
        .limit(5),
      db.from('founders')
        .select('id, name, slug, title, photo_url')
        .or(`name.ilike.%${q}%`)
        .limit(5),
      db.from('products')
        .select('id, name, description')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5),
    ]);

    if (companiesRes.error) throw companiesRes.error;
    if (investorsRes.error) throw investorsRes.error;
    if (foundersRes.error) throw foundersRes.error;
    if (productsRes.error) throw productsRes.error;

    res.success({
      companies: companiesRes.data ?? [],
      investors: investorsRes.data ?? [],
      founders: foundersRes.data ?? [],
      products: productsRes.data ?? [],
    });
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const CACHE_KEY = 'platform:stats';
    const CACHE_TTL = 300; // 5 minutes

    const cached = cache.get(CACHE_KEY);
    if (cached) {
      res.success(cached, { cached: true });
      return;
    }

    const db = getDb();

    // Total companies & total unicorns & total funding
    const { data: companies, error: cErr, count: cCount } = await db
      .from('companies')
      .select('funding_total, is_unicorn', { count: 'exact' });

    if (cErr) throw cErr;

    const total_companies = cCount ?? 0;
    const total_unicorns = (companies ?? []).filter((c) => c.is_unicorn).length;
    // Calculate total funding via JS since PostgREST JS client lacks SUM()
    const total_funding_raised = (companies ?? []).reduce(
      (sum, c) => sum + (c.funding_total ?? 0),
      0
    );

    // Total investors
    const { error: iErr, count: iCount } = await db
      .from('investors')
      .select('*', { count: 'exact', head: true });

    if (iErr) throw iErr;

    // Most recent funding round date
    const { data: recentRounds, error: rErr } = await db
      .from('funding_rounds')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (rErr) throw rErr;

    const stats = {
      total_companies,
      total_investors: iCount ?? 0,
      total_funding_raised,
      total_unicorns,
      most_recent_funding_round_date: recentRounds && recentRounds.length > 0 ? recentRounds[0].date : null,
    };

    cache.set(CACHE_KEY, stats, CACHE_TTL);
    res.success(stats, { cached: false, ttl_seconds: CACHE_TTL });
  } catch (err) {
    next(err);
  }
}
