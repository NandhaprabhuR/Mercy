import { Router } from 'express';
import { createOrder, getUserOrders, getOrders, updateOrderStatus, addOrderFeedback } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders); // Admin get all
router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.put('/:id/status', updateOrderStatus); // Admin update status
router.put('/:id/feedback', addOrderFeedback); // Consumer submit feedback

export default router;
