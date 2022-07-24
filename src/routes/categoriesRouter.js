import { Router } from 'express';
import { getCategories, addCategory } from '../controllers/categoriesController.js';
import validateCategory from '../middlewares/validateCategory.js';

const router = Router();
router.get('/categories', getCategories);
router.post('/categories', validateCategory, addCategory);
export default router;
