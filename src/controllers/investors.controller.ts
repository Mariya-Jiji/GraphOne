import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { notFound } from '../utils/AppError';
import { listInvestorsQuerySchema } from '../schemas/investor.schema';
import { parseQuery as parseCompanyQuery } from '../schemas/company.schema'; // Re-use parseQuery

export async function listInvestors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, stage_focus, sector, page, limit } = parseCompanyQuery(
      listInvestorsQuerySchema,
      req.query,
    );

    const db = getDb();
    let query = db
      .from('investors')
      .select('*', { count: 'exact' });

    if (type) query = query.eq('type', type);
    if (stage_focus && stage_focus.length > 0) {
      query = query.overlaps('stage_focus', stage_focus);
    }
    if (sector && sector.length > 0) {
      query = query.overlaps('sector_focus', sector);
    }

    query = query.order('portfolio_count', { ascending: false, nullsFirst: false });

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

export async function getInvestorBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    const { data: investor, error: investorError } = await db
      .from('investors')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (investorError) throw investorError;
    if (!investor) throw notFound(`Investor '${slug}'`);

    const { data: rounds, error: roundsError } = await db
      .from('funding_rounds')
      .select('*')
      .or(`lead_investor_id.eq.${investor.id},co_investors.cs.{${investor.id}}`)
      .order('date', { ascending: false });

    if (roundsError) throw roundsError;

    res.success({
      ...investor,
      portfolio_breakdown: rounds ?? [],
    });
  } catch (err) {
    next(err);
  }
}

export async function getInvestorInvestments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const { page, limit } = parseCompanyQuery(listInvestorsQuerySchema, req.query);

    const db = getDb();

    const { data: investor, error: investorError } = await db
      .from('investors')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (investorError) throw investorError;
    if (!investor) throw notFound(`Investor '${slug}'`);

    const p: number = page ?? 1;
    const l: number = limit ?? 20;
    const from = (p - 1) * l;
    const to = from + l - 1;

    const { data: rounds, error: roundsError, count } = await db
      .from('funding_rounds')
      .select('*, companies(id, name, slug, logo_url)', { count: 'exact' })
      .or(`lead_investor_id.eq.${investor.id},co_investors.cs.{${investor.id}}`)
      .order('date', { ascending: false })
      .range(from, to);

    if (roundsError) throw roundsError;

    res.paginate(rounds ?? [], { page: p, limit: l, total: count ?? 0 });
  } catch (err) {
    next(err);
  }
}

export async function getMostActiveInvestors(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const db = getDb();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const dateStr = ninetyDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: rounds, error } = await db
      .from('funding_rounds')
      .select('lead_investor_id, co_investors')
      .gte('date', dateStr);

    if (error) throw error;

    const counts: Record<string, number> = {};

    for (const r of rounds ?? []) {
      if (r.lead_investor_id) {
        counts[r.lead_investor_id] = (counts[r.lead_investor_id] || 0) + 1;
      }
      for (const coId of (r.co_investors as string[] ?? [])) {
        counts[coId] = (counts[coId] || 0) + 1;
      }
    }

    const sortedIds = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0]);

    if (sortedIds.length === 0) {
      res.success([]);
      return;
    }

    const { data: investors, error: invError } = await db
      .from('investors')
      .select('id, name, slug, type, logo_url')
      .in('id', sortedIds);

    if (invError) throw invError;

    const investorMap = Object.fromEntries((investors ?? []).map((i) => [i.id, i]));
    const result = sortedIds.map((id) => ({
      investor: investorMap[id],
      deal_count: counts[id],
    })).filter((i) => i.investor);

    res.success(result);
  } catch (err) {
    next(err);
  }
}

export async function getCoInvestors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    const { data: investor, error: investorError } = await db
      .from('investors')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (investorError) throw investorError;
    if (!investor) throw notFound(`Investor '${slug}'`);

    const { data: rounds, error: roundsError } = await db
      .from('funding_rounds')
      .select('lead_investor_id, co_investors')
      .or(`lead_investor_id.eq.${investor.id},co_investors.cs.{${investor.id}}`);

    if (roundsError) throw roundsError;

    const counts: Record<string, number> = {};

    for (const r of rounds ?? []) {
      const idsInRound = new Set<string>();
      if (r.lead_investor_id && r.lead_investor_id !== investor.id) {
        idsInRound.add(r.lead_investor_id);
      }
      for (const coId of (r.co_investors as string[] ?? [])) {
        if (coId !== investor.id) idsInRound.add(coId);
      }
      for (const id of idsInRound) {
        counts[id] = (counts[id] || 0) + 1;
      }
    }

    const sortedIds = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0]);

    if (sortedIds.length === 0) {
      res.success([]);
      return;
    }

    const { data: investors, error: invError } = await db
      .from('investors')
      .select('id, name, slug, type, logo_url')
      .in('id', sortedIds);

    if (invError) throw invError;

    const investorMap = Object.fromEntries((investors ?? []).map((i) => [i.id, i]));
    const result = sortedIds.map((id) => ({
      investor: investorMap[id],
      co_investment_count: counts[id],
    })).filter((i) => i.investor);

    res.success(result);
  } catch (err) {
    next(err);
  }
}
