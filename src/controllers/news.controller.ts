import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { listNewsQuerySchema } from '../schemas/news.schema';
import { parseQuery } from '../schemas/company.schema'; // Reusing parseQuery helper

export async function listNews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tag, page, limit } = parseQuery(
      listNewsQuerySchema,
      req.query,
    );

    const db = getDb();
    
    let query = db
      .from('news_articles')
      .select('*', { count: 'exact' });

    if (tag) {
      query = query.ilike('tag', `%${tag}%`);
    }

    query = query.order('published_at', { ascending: false, nullsFirst: false });

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

export async function getTrendingNews(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const db = getDb();

    // Since there's no read count, use recency as an approximation for trending
    const { data, error } = await db
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(10);

    if (error) throw error;

    res.success(data ?? []);
  } catch (err) {
    next(err);
  }
}
