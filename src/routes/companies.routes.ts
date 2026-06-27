/**
 * Companies router
 *
 * Route registration order matters:
 *   /companies/trending MUST come before /companies/:slug so Express doesn't
 *   treat the literal string "trending" as a slug parameter.
 *
 * Auth: POST /companies requires X-API-Key header (requireApiKey middleware).
 */

import { Router } from 'express';
import { requireApiKey } from '../middleware/auth.middleware';
import {
  listCompanies,
  getTrendingCompanies,
  getCompanyBySlug,
  getCompanyFunding,
  getCompanyProducts,
  getCompanyGraph,
  createCompany,
} from '../controllers/companies.controller';

const router = Router();

// ─── Read routes (no auth) ────────────────────────────────────────────────────

/** GET /companies — list with filters + sort + pagination */
router.get('/', listCompanies);

/**
 * GET /companies/trending
 * IMPORTANT: registered before /:slug to avoid the slug capture swallowing
 * the literal word "trending".
 */
router.get('/trending', getTrendingCompanies);

/** GET /companies/:slug — full profile with all relations */
router.get('/:slug', getCompanyBySlug);

/** GET /companies/:slug/funding — funding rounds + lead investor details */
router.get('/:slug/funding', getCompanyFunding);

/** GET /companies/:slug/products — all products sorted by upvotes */
router.get('/:slug/products', getCompanyProducts);

/** GET /companies/:slug/graph — 1-hop ecosystem graph */
router.get('/:slug/graph', getCompanyGraph);

// ─── Write routes (X-API-Key required) ───────────────────────────────────────

/** POST /companies — create a new company (Zod validated, API key gated) */
router.post('/', requireApiKey, createCompany);

export default router;
