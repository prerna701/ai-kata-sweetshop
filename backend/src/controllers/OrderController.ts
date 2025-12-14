import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const orderService = new OrderService();

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const { items, total, shippingAddress, paymentMethod, paymentStatus } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new AppError('Items are required', 400);
      }
      if (!total || typeof total !== 'number') {
        throw new AppError('Valid total is required', 400);
      }
      if (!shippingAddress) {
        throw new AppError('Shipping address is required', 400);
      }

      const order = await orderService.createOrder(userId, {
        items,
        total,
        shippingAddress,
        paymentMethod: paymentMethod || 'card',
        paymentStatus: paymentStatus || 'pending',
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create order'
        });
      }
    }
  }

  static async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const orders = await orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch orders'
        });
      }
    }
  }

  static async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const order = await orderService.getOrderById(id, userId);

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch order'
        });
      }
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check admin role
      if (req.user?.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const order = await orderService.updateOrderStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: order
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update order'
        });
      }
    }
  }

  static async cancelOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const order = await orderService.cancelOrder(id, userId);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to cancel order'
        });
      }
    }
  }

  static async getAllOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check admin role
      if (req.user?.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await orderService.getAllOrders(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch orders'
        });
      }
    }
  }

  static async getOrderStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check admin role
      if (req.user?.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const stats = await orderService.getOrderStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch stats'
        });
      }
    }
  }
}
