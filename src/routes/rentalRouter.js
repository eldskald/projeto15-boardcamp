import { Router } from 'express';
import { getRentals, addRental, returnRental, deleteRental } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRental.js';

const router = Router();
router.get('/rentals', getRentals);
router.post('/rentals', validateRental, addRental);
router.post('/rentals/:id/return', returnRental);
router.delete('/rentals/:id', deleteRental);
export default router;
