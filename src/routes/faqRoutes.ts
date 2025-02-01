import FAQController from '../controllers/FAQController';
import { cacheMiddleware } from '../middlewares/cache';
import { Router } from 'express';

const router = Router();

router.get('/', cacheMiddleware, FAQController.getAll);
router.get('/:id', cacheMiddleware, FAQController.getOne);
router.post('/create', FAQController.create);
router.put('/:id', FAQController.update);
router.delete('/:id', FAQController.delete);

export default router;