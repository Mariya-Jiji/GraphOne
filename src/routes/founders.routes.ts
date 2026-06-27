import { Router } from 'express';
import { getFounderBySlug } from '../controllers/founders.controller';

const router = Router();

router.get('/:slug', getFounderBySlug);

export default router;
