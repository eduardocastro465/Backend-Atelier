import { Router } from 'express';
import { PaypalController } from '../../controllers/paypal/paypal.controller.js';

const router = Router();

// Route to create a PayPal order
router.post('/create-order', PaypalController.createOrder);
// Route to capture a PayPal order
router.post('/capture-order', PaypalController.captureOrder);
// Route to cancel a PayPal order
router.post('/cancel-order', PaypalController.cancelOrder);

export default router;