import { Router } from 'express';
import { PaypalController } from '../../controllers/paypal/paypal.controller.js';

const router = Router();


router.post('/create-order', PaypalController.createOrder);

router.get('/capture-order', PaypalController.captureOrder);

router.get('/cancel-order', PaypalController.cancelOrder);

export default router;