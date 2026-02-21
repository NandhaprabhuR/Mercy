import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);

export default router;
