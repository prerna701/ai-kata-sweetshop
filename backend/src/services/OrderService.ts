import { Order, IOrder } from '../models/Order';
import { AppError } from '../utils/AppError';

export class OrderService {
  async createOrder(userId: string, data: Partial<IOrder>): Promise<IOrder> {
    try {
      const order = new Order({
        userId,
        ...data
      });
      return await order.save();
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to create order', 400);
    }
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ userId }).sort({ createdAt: -1 });
    } catch (error: any) {
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      return order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch order', 500);
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrder | null> {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      return order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update order', 500);
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
    try {
      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      if (['shipped', 'delivered'].includes(order.status)) {
        throw new AppError(`Cannot cancel order with status: ${order.status}`, 400);
      }
      order.status = 'cancelled';
      return await order.save();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to cancel order', 500);
    }
  }

  async getAllOrders(page = 1, limit = 10): Promise<{ data: IOrder[], pagination: any }> {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        Order.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Order.countDocuments()
      ]);
      return {
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error: any) {
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  async getOrderStats(): Promise<any> {
    try {
      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      return {
        totalOrders: orders.length,
        totalRevenue,
        avgOrderValue: Math.round(avgOrderValue),
        statusCounts: {
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        }
      };
    } catch (error: any) {
      throw new AppError('Failed to fetch order stats', 500);
    }
  }
}
