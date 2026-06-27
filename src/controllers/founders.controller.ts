import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { notFound } from '../utils/AppError';

export async function getFounderBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    // Fetch the founder by slug
    const { data: founder, error: founderError } = await db
      .from('founders')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (founderError) throw founderError;
    if (!founder) throw notFound(`Founder '${slug}'`);

    // Fetch their linked company
    const { data: company, error: companyError } = await db
      .from('companies')
      .select('id, name, slug, logo_url, category, stage')
      .eq('id', founder.company_id)
      .maybeSingle();

    if (companyError) throw companyError;

    res.success({
      ...founder,
      company: company ?? null,
    });
  } catch (err) {
    next(err);
  }
}
