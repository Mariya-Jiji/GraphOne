import { Router } from 'express';
import { search, getStats } from '../controllers/utility.controller';

const router = Router();

router.get('/search', search);
router.get('/stats', getStats);

export default router;
