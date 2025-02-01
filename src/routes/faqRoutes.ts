import FAQController from '../controllers/FAQController';
import { cacheMiddleware, clearCache } from '../middlewares/cache';
import { Router } from 'express';

const router = Router();

// Simple and clean route definitions
router.get('/', cacheMiddleware, FAQController.getAll);
router.get('/:id', cacheMiddleware, FAQController.getOne);
router.post('/create', FAQController.create);
router.put('/:id',clearCache,FAQController.update);
router.delete('/:id',clearCache, FAQController.delete);

export default router;