import { Router } from 'express';
import {
  listInvestors,
  getMostActiveInvestors,
  getInvestorBySlug,
  getInvestorInvestments,
  getCoInvestors,
} from '../controllers/investors.controller';

const router = Router();

// Registration order matters: /most-active before /:slug
router.get('/', listInvestors);
router.get('/most-active', getMostActiveInvestors);
router.get('/:slug', getInvestorBySlug);
router.get('/:slug/investments', getInvestorInvestments);
router.get('/:slug/co-investors', getCoInvestors);

export default router;
