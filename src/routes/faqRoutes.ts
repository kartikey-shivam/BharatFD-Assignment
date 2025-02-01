import FAQController from '../controllers/FAQController';
import { cacheMiddleware, clearCache } from '../middlewares/cache';
import { Router } from 'express';
import { sanitizeContent } from '../middlewares/sanitizationMiddleware';

const router = Router();

// Routes with cache and sanitization middleware
router.get('/', cacheMiddleware, FAQController.getAll);
router.get('/:id', cacheMiddleware, FAQController.getOne);

router.post('/create', 
    sanitizeContent,
    clearCache, 
    FAQController.create
);

router.put('/:id',
    sanitizeContent,
    clearCache,
    FAQController.update
);

router.delete('/:id', clearCache, FAQController.delete);

export default router;