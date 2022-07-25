import { Router } from 'express';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customersRouter from './routes/customersRouter.js';

const router = Router();
router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
export default router;
