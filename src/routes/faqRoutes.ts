import { Router } from 'express';
import { RequestHandler } from 'express';
import FAQController from '../controllers/FAQController';

const router = Router();

// Cast controller methods to RequestHandler
const create: RequestHandler = FAQController.create.bind(FAQController);
const getAll: RequestHandler = FAQController.getAll.bind(FAQController);
const getOne: RequestHandler = FAQController.getOne.bind(FAQController);
const update: RequestHandler = FAQController.update.bind(FAQController);
const delete_: RequestHandler = FAQController.delete.bind(FAQController);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', delete_);

export default router;
