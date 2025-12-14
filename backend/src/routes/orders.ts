import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticate } from '../middleware/auth';

const router = Router();

// User routes (protected)
router.post('/', authenticate, OrderController.createOrder);
router.get('/', authenticate, OrderController.getUserOrders);
router.get('/:id', authenticate, OrderController.getOrderById);
router.post('/:id/cancel', authenticate, OrderController.cancelOrder);

// Admin routes (protected)
router.put('/:id/status', authenticate, OrderController.updateOrderStatus);
router.get('/admin/list', authenticate, OrderController.getAllOrders);
router.get('/admin/stats', authenticate, OrderController.getOrderStats);

export default router;
