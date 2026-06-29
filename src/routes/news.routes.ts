import { Router } from 'express';
import { listNews, getTrendingNews } from '../controllers/news.controller';

const router = Router();

router.get('/trending', getTrendingNews);
router.get('/', listNews);

export default router;
