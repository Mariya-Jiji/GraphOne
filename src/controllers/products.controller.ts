import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index';
import { notFound } from '../utils/AppError';
import { listProductsQuerySchema } from '../schemas/product.schema';
import { parseQuery } from '../schemas/company.schema'; // Reusing parseQuery helper

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, sort, page, limit } = parseQuery(
      listProductsQuerySchema,
      req.query,
    );

    const db = getDb();
    
    // We need to fetch products and join with companies to get logo_url
    let query = db
      .from('products')
      .select('*, company:companies(id, name, logo_url)', { count: 'exact' });

    if (category) {
      if (category.toLowerCase() === 'all') {
        // no filter
      } else {
        query = query.ilike('category', `%${category}%`);
      }
    }

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      // default 'popular'
      query = query.order('upvotes', { ascending: false });
    }

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

export async function getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const db = getDb();

    // Since product schema doesn't have slug, we search by id or name?
    // Wait, if it's "Product of the Day", maybe we fetch by ID. The user prompt said:
    // GET /products/:slug (if needed for "Product of the Day" detail)
    // I will query by id instead of slug, or just name for now since it's a mock.
    // Actually, I can just fetch by id.
    const { data, error } = await db
      .from('products')
      .select('*, company:companies(id, name, logo_url)')
      .eq('id', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      // Try name if it's not a UUID
      const { data: dataByName, error: errByName } = await db
        .from('products')
        .select('*, company:companies(id, name, logo_url)')
        .ilike('name', slug)
        .maybeSingle();
        
      if (errByName) throw errByName;
      if (!dataByName) throw notFound(`Product '${slug}'`);
      
      res.success(dataByName);
      return;
    }

    res.success(data);
  } catch (err) {
    next(err);
  }
}
