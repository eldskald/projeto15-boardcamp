import { Router } from 'express';
import categoriesRouter from './routes/categoriesRouter.js';

const router = Router();
router.use(categoriesRouter);
export default router;
