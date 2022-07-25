import { Router } from 'express';
import { addCustomer, getCustomerById, getCustomers } from '../controllers/customersController.js';
import validateCustomer from '../middlewares/validateCustomer.js';

const router = Router();
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', validateCustomer, addCustomer);
export default router;
