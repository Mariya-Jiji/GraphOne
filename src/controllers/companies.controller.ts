/**
 * Companies controller
 *
 * All business logic lives here. Each function is an async Express handler.
 * Controllers:
 *   1. Parse + validate input via Zod schemas
 *   2. Query Supabase
 *   3. Return via res.success() or res.paginate()
 *   4. Propagate errors via next(err) — never call res.json() directly for errors
 *
 * Slug generation: name → lowercase → spaces/specials → hyphens → deduped with
 * a short timestamp suffix if the slug is already taken.
 */

import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { cache } from '../utils/cache';
import { notFound } from '../utils/AppError';
import {
  listCompaniesQuerySchema,
  createCompanyBodySchema,
  parseQuery,
  parseBody,
} from '../schemas/company.schema';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars except hyphens
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphen
    .replace(/-+/g, '-')        // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const db = getDb();
  const { data } = await db
    .from('companies')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle();

  if (!data) return baseSlug; // slug is free

  // Append a short timestamp suffix to guarantee uniqueness
  return `${baseSlug}-${Date.now().toString(36)}`;
}

// ─── GET /companies ──────────────────────────────────────────────────────────

export async function listCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, stage, country, sort, page, limit } = parseQuery(
      listCompaniesQuerySchema,
      req.query,
    );

    const db = getDb();
    let query = db
      .from('companies')
      .select('*', { count: 'exact' });

    // ── Filters ──────────────────────────────────────────────────────────────
    if (category) query = query.ilike('category', `%${category}%`);
    if (stage)    query = query.eq('stage', stage);
    if (country)  query = query.ilike('hq_country', `%${country}%`);

    // ── Sort ─────────────────────────────────────────────────────────────────
    switch (sort) {
      case 'trending':
        query = query.order('growth_score', { ascending: false, nullsFirst: false });
        break;
      case 'funded':
        query = query.order('funding_total', { ascending: false, nullsFirst: false });
        break;
      case 'new':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    // Explicit fallbacks ensure TypeScript narrows to `number`.
    // Zod .default() inference leaks `| undefined` for coerced schemas in strict mode.
    const p: number = page ?? 1;
    const l: number = limit ?? 20;
    const from = (p - 1) * l;
    const to = from + l - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.paginate(data ?? [], { page: p, limit: l, total: count ?? 0 });
  } catch (err) {
    next(err);
  }
}

// ─── GET /companies/trending ─────────────────────────────────────────────────

export async function getTrendingCompanies(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const CACHE_KEY = 'companies:trending';
    const CACHE_TTL = 60; // seconds

    const cached = cache.get(CACHE_KEY);
    if (cached) {
      res.success(cached, { cached: true });
      return;
    }

    const db = getDb();
    
    // 1. Fetch data in parallel
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const dateStr90 = ninetyDaysAgo.toISOString();

    const [companiesRes, roundsRes, newsRes, productsRes] = await Promise.all([
      db.from('companies').select('id, name, slug, category, stage, growth_score, funding_total, logo_url, hq_country, is_unicorn, employee_count, founded_year'),
      db.from('funding_rounds').select('company_id, date').order('date', { ascending: false }),
      db.from('news_articles').select('related_company_ids').gte('published_at', dateStr90),
      db.from('products').select('company_id, upvotes')
    ]);

    if (companiesRes.error) throw companiesRes.error;
    if (roundsRes.error) throw roundsRes.error;
    if (newsRes.error) throw newsRes.error;
    if (productsRes.error) throw productsRes.error;

    // Process data into lookups
    const latestRounds = new Map<string, string>(); // company_id -> date string
    for (const r of roundsRes.data ?? []) {
      if (r.company_id && r.date && !latestRounds.has(r.company_id)) {
        latestRounds.set(r.company_id, r.date);
      }
    }

    const newsCounts = new Map<string, number>();
    for (const article of newsRes.data ?? []) {
      for (const cid of (article.related_company_ids as string[] ?? [])) {
        newsCounts.set(cid, (newsCounts.get(cid) || 0) + 1);
      }
    }

    const productUpvotes = new Map<string, number>();
    for (const prod of productsRes.data ?? []) {
      if (prod.company_id) {
        productUpvotes.set(prod.company_id, (productUpvotes.get(prod.company_id) || 0) + (prod.upvotes || 0));
      }
    }

    const currentYear = new Date().getFullYear();
    const nowMs = Date.now();
    let maxEfficiency = 0;

    // First pass: find max efficiency for normalization
    const companies = companiesRes.data ?? [];
    const efficiencies = new Map<string, number>();
    
    for (const c of companies) {
      let eff = 0;
      if (c.employee_count && c.founded_year && c.founded_year <= currentYear) {
        const age = currentYear - c.founded_year + 1;
        eff = c.employee_count / age;
      }
      efficiencies.set(c.id, eff);
      if (eff > maxEfficiency) {
        maxEfficiency = eff;
      }
    }

    // Second pass: compute trending_score
    const scoredCompanies = companies.map(c => {
      // funding_recency_score
      let fundingScore = 0;
      const latestRoundDate = latestRounds.get(c.id);
      if (latestRoundDate) {
        const roundMs = new Date(latestRoundDate).getTime();
        const days = Math.max(0, (nowMs - roundMs) / (1000 * 60 * 60 * 24));
        fundingScore = 100 * Math.exp(-days / 180);
      }

      // news_activity_score
      const newsCount = newsCounts.get(c.id) || 0;
      const newsScore = Math.min(100, newsCount * 10);

      // product_engagement_score
      const upvotes = productUpvotes.get(c.id) || 0;
      const productScore = Math.min(100, Math.log10(upvotes + 1) * 25);

      // growth_efficiency_score
      let growthScore = 0;
      if (maxEfficiency > 0) {
        growthScore = (efficiencies.get(c.id)! / maxEfficiency) * 100;
      }

      // Weighted score
      let trending_score = (0.35 * fundingScore) + (0.30 * newsScore) + (0.20 * productScore) + (0.15 * growthScore);
      // Round to 1 decimal
      trending_score = Math.round(trending_score * 10) / 10;

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        category: c.category,
        stage: c.stage,
        growth_score: c.growth_score,
        funding_total: c.funding_total,
        logo_url: c.logo_url,
        hq_country: c.hq_country,
        is_unicorn: c.is_unicorn,
        trending_score,
      };
    });

    // Sort and slice top 10
    scoredCompanies.sort((a, b) => b.trending_score - a.trending_score);
    const top10 = scoredCompanies.slice(0, 10);

    cache.set(CACHE_KEY, top10, CACHE_TTL);
    res.success(top10, { cached: false, ttl_seconds: CACHE_TTL });
  } catch (err) {
    next(err);
  }
}

// ─── GET /companies/:slug ─────────────────────────────────────────────────────

export async function getCompanyBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    // Step 1: fetch the company by slug
    const { data: company, error: companyError } = await db
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (companyError) throw companyError;
    if (!company) throw notFound(`Company '${slug}'`);

    // Step 2: fetch all relations in parallel using the resolved company.id
    const [foundersResult, productsResult, fundingResult, relationshipsResult] =
      await Promise.all([
        db.from('founders').select('*').eq('company_id', company.id),
        db.from('products').select('*').eq('company_id', company.id),
        db.from('funding_rounds')
          .select('*')
          .eq('company_id', company.id)
          .order('date', { ascending: false }),
        db.from('company_relationships').select('*').eq('company_id', company.id),
      ]);

    if (foundersResult.error) throw foundersResult.error;
    if (productsResult.error) throw productsResult.error;
    if (fundingResult.error) throw fundingResult.error;
    if (relationshipsResult.error) throw relationshipsResult.error;

    const profile = {
      ...company,
      founders: foundersResult.data ?? [],
      products: productsResult.data ?? [],
      funding_rounds: fundingResult.data ?? [],
      relationships: relationshipsResult.data ?? [],
    };

    res.success(profile);
  } catch (err) {
    next(err);
  }
}

// ─── GET /companies/:slug/funding ─────────────────────────────────────────────

export async function getCompanyFunding(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    const { data: company, error: ce } = await db
      .from('companies')
      .select('id, name, slug, funding_total')
      .eq('slug', slug)
      .maybeSingle();

    if (ce) throw ce;
    if (!company) throw notFound(`Company '${slug}'`);

    const { data: rounds, error: re } = await db
      .from('funding_rounds')
      .select(`
        id,
        round_type,
        amount,
        currency,
        date,
        lead_investor_id,
        co_investors
      `)
      .eq('company_id', company.id)
      .order('date', { ascending: false });

    if (re) throw re;

    // Enrich with investor names for the lead investor
    const leadIds = (rounds ?? [])
      .map((r) => r.lead_investor_id)
      .filter(Boolean) as string[];

    let investorMap: Record<string, { name: string; slug: string; logo_url: string | null }> = {};

    if (leadIds.length > 0) {
      const { data: investors } = await db
        .from('investors')
        .select('id, name, slug, logo_url')
        .in('id', leadIds);

      investorMap = Object.fromEntries((investors ?? []).map((i) => [i.id, i]));
    }

    const enrichedRounds = (rounds ?? []).map((r) => ({
      ...r,
      lead_investor: r.lead_investor_id ? (investorMap[r.lead_investor_id] ?? null) : null,
    }));

    res.success({
      company: { id: company.id, name: company.name, slug: company.slug, funding_total: company.funding_total },
      rounds: enrichedRounds,
      total_raised: company.funding_total,
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /companies/:slug/products ───────────────────────────────────────────

export async function getCompanyProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    const { data: company, error: ce } = await db
      .from('companies')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (ce) throw ce;
    if (!company) throw notFound(`Company '${slug}'`);

    const { data: products, error: pe } = await db
      .from('products')
      .select('*')
      .eq('company_id', company.id)
      .order('upvotes', { ascending: false });

    if (pe) throw pe;

    res.success({
      company: { id: company.id, name: company.name, slug: company.slug },
      products: products ?? [],
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /companies/:slug/graph ───────────────────────────────────────────────
// Returns the 1-hop ecosystem: investors, co-investors, competitors, products

export async function getCompanyGraph(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    // Fetch the company
    const { data: company, error: ce } = await db
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (ce) throw ce;
    if (!company) throw notFound(`Company '${slug}'`);

    // Fetch relationships, products, and funding rounds in parallel
    const [relsResult, productsResult, roundsResult] = await Promise.all([
      db.from('company_relationships').select('*').or(`company_id.eq.${company.id},related_company_id.eq.${company.id}`),
      db.from('products').select('*').eq('company_id', company.id),
      db.from('funding_rounds').select('lead_investor_id, co_investors').eq('company_id', company.id),
    ]);

    if (relsResult.error) throw relsResult.error;
    if (productsResult.error) throw productsResult.error;
    if (roundsResult.error) throw roundsResult.error;

    const relationships = relsResult.data ?? [];
    const rounds = roundsResult.data ?? [];

    // ── Collect related company IDs by type ──────────────────────────────────
    const competitorIds: string[] = [];
    const partnerIds: string[] = [];
    const acquisitionIds: string[] = [];

    for (const rel of relationships) {
      const otherId = rel.company_id === company.id ? rel.related_company_id : rel.company_id;
      if (rel.relationship_type === 'competitor') competitorIds.push(otherId);
      else if (rel.relationship_type === 'partner') partnerIds.push(otherId);
      else if (rel.relationship_type === 'acquisition') acquisitionIds.push(otherId);
    }

    const relatedCompanyIds = [...new Set([...competitorIds, ...partnerIds, ...acquisitionIds])];

    // ── Collect investor IDs ─────────────────────────────────────────────────
    const leadInvestorIds = rounds
      .map((r) => r.lead_investor_id)
      .filter(Boolean) as string[];

    const coInvestorIds: string[] = rounds
      .flatMap((r) => (r.co_investors as string[]) ?? []);

    const allInvestorIds = [...new Set([...leadInvestorIds, ...coInvestorIds])];

    // ── Parallel fetch of enrichment data ───────────────────────────────────
    const [relCompaniesResult, investorsResult] = await Promise.all([
      relatedCompanyIds.length > 0
        ? db.from('companies').select('id, name, slug, category, stage, logo_url, hq_country').in('id', relatedCompanyIds)
        : Promise.resolve({ data: [], error: null }),
      allInvestorIds.length > 0
        ? db.from('investors').select('id, name, slug, type, logo_url, location').in('id', allInvestorIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (relCompaniesResult.error) throw relCompaniesResult.error;
    if (investorsResult.error) throw investorsResult.error;

    const companyMap = Object.fromEntries((relCompaniesResult.data ?? []).map((c) => [c.id, c]));
    const investorMap = Object.fromEntries((investorsResult.data ?? []).map((i) => [i.id, i]));

    const graph = {
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        category: company.category,
        stage: company.stage,
        logo_url: company.logo_url,
      },
      investors: leadInvestorIds.map((id) => investorMap[id]).filter(Boolean),
      co_investors: coInvestorIds.map((id) => investorMap[id]).filter(Boolean),
      competitors: competitorIds.map((id) => companyMap[id]).filter(Boolean),
      partners: partnerIds.map((id) => companyMap[id]).filter(Boolean),
      acquired: acquisitionIds.map((id) => companyMap[id]).filter(Boolean),
      products: productsResult.data ?? [],
    };

    res.success(graph);
  } catch (err) {
    next(err);
  }
}

// ─── POST /companies ──────────────────────────────────────────────────────────

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = parseBody(createCompanyBodySchema, req.body);
    const db = getDb();

    const baseSlug = slugify(body.name);
    const slug = await ensureUniqueSlug(baseSlug);

    const { data, error } = await db
      .from('companies')
      .insert({
        ...body,
        slug,
      })
      .select()
      .single();

    if (error) throw error;

    res.success(data, {}, 201);
  } catch (err) {
    next(err);
  }
}
