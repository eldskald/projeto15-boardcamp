import { Router } from 'express';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customersRouter from './routes/customersRouter.js';
import rentalRouter from './routes/rentalRouter.js';

const router = Router();
router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalRouter);
export default router;
