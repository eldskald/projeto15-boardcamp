import { Router } from 'express';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';

const router = Router();
router.use(categoriesRouter);
router.use(gamesRouter);
export default router;
